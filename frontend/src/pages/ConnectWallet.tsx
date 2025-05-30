import { useConnect, useAddress } from "@thirdweb-dev/react";
import { MetaMaskWallet } from "@thirdweb-dev/wallets";
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ConnectWallet() {
  const address = useAddress();
  const { connect } = useConnect();
  const { connectWallet } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (address) {
      connectWallet(address);
      navigate('/dashboard');
    }
  }, [address, connectWallet, navigate]);

  const handleConnect = async () => {
    try {
      await connect(MetaMaskWallet());
    } catch (error) {
      console.error("Connection failed:", error);
      alert("Wallet connection failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-semibold">Connect Your Wallet</h1>
      {address ? (
        <p className="text-green-600">Connected: {address}</p>
      ) : (
        <button
          onClick={handleConnect}
          className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          Connect MetaMask
        </button>
      )}
    </div>
  );
}
