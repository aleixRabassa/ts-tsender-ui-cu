'use client'

import HomeContent from "@/components/HomeContent";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount();
  return (
    <div>
        {isConnected ? (
          <div>
            <HomeContent />
          </div>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            Please connect your wallet...
          </div>
        )}
    </div>
  );
}
