import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { MINT_SIZE, TOKEN_PROGRAM_ID, createInitializeMint2Instruction, getMinimumBalanceForRentExemptMint } from "@solana/spl-token"
import React from "react";

export default function TokenLaunchpad({onTokenCreate}){
    const {connection} = useConnection();
    const wallet = useWallet();

    async function createToken(){
      const mintKeypair = Keypair.generate();
      const lamports = await getMinimumBalanceForRentExemptMint(connection);

      const transaction = new Transaction().add(
        SystemProgram.createAccount({
            fromPubkey: wallet.publicKey,       // Wallet paying for the transaction
            newAccountPubkey: mintKeypair.publicKey,  // New mint account being created
            space: MINT_SIZE,                   // Size of the mint account (from SPL Token library)
            lamports,                            // Amount of SOL to make it rent-exempt
            programId: TOKEN_PROGRAM_ID,        // SPL Token program ID
        }),

        createInitializeMint2Instruction(
            mintKeypair.publicKey,  // The public key of the mint account
            9,                      // The number of decimal places (precision) of the token
            wallet.publicKey,       // The authority that can mint new tokens
            wallet.publicKey,       // The freeze authority (can freeze token transfers)
            TOKEN_PROGRAM_ID        // The SPL Token program ID
        )
    );

    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    transaction.partialSign(mintKeypair);

    await wallet.sendTransaction(transaction, connection);
    console.log(`Token mint created at ${mintKeypair.publicKey.toBase58()}`);
    onTokenCreate(mintKeypair.publicKey)

    }
    return(
        <div>
        <input placeholder="name"></input><br></br>
        <button onClick={createToken}>Create</button>
        </div>
    )
}