import { 
    ConnectionProvider, WalletProvider, useWallet 
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { Connection, PublicKey } from "@solana/web3.js";
import { useEffect, useMemo, useState } from "react";
import TokenLaunchPad from './components/sol/CreateToken';

function WalletBalance() {
    const { publicKey } = useWallet();
    const [balance, setBalance] = useState(null);

    useEffect(() => {
        async function fetchBalance() {
            if (!publicKey) return;

            try {
                const endpoint = "https://lb.drpc.org/ogrpc?network=solana&dkey=AisX40s7gEdYtN7PBkMXTGwMmF_BCtMR8LeNjk6iId46"; 
                const connection = new Connection(endpoint, "confirmed");

                const balLamports = await connection.getBalance(new PublicKey(publicKey));
                setBalance(balLamports / 1e9); 
            } catch (error) {
                console.error("Error fetching balance:", error);
            }
        }

        fetchBalance();
    }, [publicKey]);

    return (
        <p>
            {publicKey
                ? `Balance: ${balance !== null ? `${balance} SOL` : "Fetching..."}`
                : "No Wallet Connected"}
        </p>
    );
}

function Solana() {
    const [token,setToken] = useState(null);
    
    const network = WalletAdapterNetwork.Mainnet;

    const endpoint = useMemo(() => "https://lb.drpc.org/ogrpc?network=solana&dkey=AisX40s7gEdYtN7PBkMXTGwMmF_BCtMR8LeNjk6iId46", []);

    return (
        <>
            <h1>This is Solana</h1>
            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={[]} autoConnect>
                    <WalletModalProvider>
                        <WalletMultiButton />
                        <WalletDisconnectButton />
                        <WalletBalance /> 
                    <TokenLaunchPad onTokenCreate={(tokenMint) => {
                        setToken(tokenMint);
                    }} />
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
            <h1>End of Solana</h1>
        </>
    );
}

export default Solana;
