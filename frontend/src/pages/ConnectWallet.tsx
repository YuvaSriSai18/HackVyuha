import React, { useState } from 'react';
import { useConnect, metamaskWallet } from "@thirdweb-dev/react";
import { Wallet } from 'lucide-react';

interface ConnectWalletProps {
  className?: string;
}

const ConnectWallet: React.FC<ConnectWalletProps> = ({ className }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const connect = useConnect();

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      // Connect to MetaMask wallet
      await connect(metamaskWallet());
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      alert("Could not connect to wallet. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <button 
      onClick={handleConnect}
      disabled={isConnecting}
      className={className || "btn bg-white text-primary-800 hover:bg-gray-100 flex items-center"}
    >
      <Wallet size={16} className="mr-2" />
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </button>
  );
};

export default ConnectWallet;