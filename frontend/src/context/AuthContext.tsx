import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

interface User {
  name: string;
  uid: string;
  email: string | null;
  displayName: string | null;
  isAdmin: boolean;
  emailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<FirebaseUser>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
}

interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    request: (request: { method: string; params?: any[] }) => Promise<any>;
    on: (event: string, callback: any) => void;
    removeAllListeners: (event: string) => void;
  };
}



const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Ensure Firebase is initialized by checking if auth is available
  if (!auth) {
    console.error("Firebase auth is not initialized!");
    // Render a fallback or error state instead of continuing with bad auth
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8 max-w-md">
          <h1 className="text-2xl font-bold text-red-700 mb-4">Firebase Initialization Error</h1>
          <p className="text-gray-700">
            There was a problem initializing Firebase. Please check your environment variables 
            and make sure Firebase is properly configured.
          </p>
        </div>
      </div>
    );
  }

  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is an admin by looking up in Firestore
  const checkUserRole = async (firebaseUser: FirebaseUser): Promise<User> => {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          name: userData.displayName || firebaseUser.displayName || '',
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          isAdmin: userData.isAdmin === true,
          emailVerified: firebaseUser.emailVerified
        };
      }
      
      return {
        name: firebaseUser.displayName || '',
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        isAdmin: false,
        emailVerified: firebaseUser.emailVerified
      };
    } catch (error) {
      console.error("Error checking user role:", error);
      return {
        name: firebaseUser.displayName || '',
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        isAdmin: false,
        emailVerified: firebaseUser.emailVerified
      };
    }
  };

  useEffect(() => {
    // Set initial loading state
    setLoading(true);
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setFirebaseUser(firebaseUser);
          const userData = await checkUserRole(firebaseUser);
          setUser(userData);
        } else {
          setFirebaseUser(null);
          setUser(null);
        }
      } catch (error) {
        console.error("Auth state change error:", error);
        setFirebaseUser(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []); // Empty dependency array means this runs once on mount

  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      // Create the user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;
      
      // Update the user's profile with their name
      await updateProfile(newUser, {
        displayName: name
      });

      // Create user document in Firestore
      await setDoc(doc(db, 'users', newUser.uid), {
        displayName: name,
        email: email,
        isAdmin: false,
        createdAt: new Date().toISOString()
      });

      // Send email verification
      await sendEmailVerification(newUser);
      
      // Don't return anything to match the Promise<void> type
    } catch (error) {
      console.error("Error during registration:", error);
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<FirebaseUser> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  };

  const sendVerificationEmail = async () => {
    if (firebaseUser && !firebaseUser.emailVerified) {
      await sendEmailVerification(firebaseUser);
    } else {
      throw new Error("No user is logged in or email is already verified");
    }
  };

  const value = {
    user,
    firebaseUser,
    loading,
    login,
    register,
    logout,
    sendVerificationEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};