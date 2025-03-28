import { getAssociatedTokenAddressSync, createAssociatedTokenAccountInstruction, TOKEN_PROGRAM_ID, createMintToInstruction } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import React, { useState } from "react";

export default function MintToken({onDone,mintAddress}){
    const {connection} = useConnection();
    const wallet = useWallet();    

   async function createMint(){
    const associatedToken = getAssociatedTokenAddressSync( //get ATA
        mintAddress,
        wallet.publicKey,
        false,
        TOKEN_PROGRAM_ID
    );

    const transaction = new Transaction().add(
        createAssociatedTokenAccountInstruction(  //if ATA not made, create one
            wallet.publicKey,    // Payer (funds the account creation)
            associatedToken,     // The associated token account to be created
            wallet.publicKey,    // Owner of the token account
            mintAddress,         // The token mint address
            TOKEN_PROGRAM_ID     // SPL Token Program
        ),
    );
    await wallet.sendTransaction(transaction, connection);
    
    const amountInput = document.getElementById("amount").value;
    const amount = parseFloat(amountInput);

    const mintTransaction = new Transaction().add(
        createMintToInstruction(
            mintAddress,       // The address of the mint (token contract)
            associatedToken,   // The associated token account (where the tokens will be deposited)
            wallet.publicKey,  // The mint authority (who has permission to mint new tokens)
            amount*1000000000,        // Amount of tokens to mint (in smallest units, e.g., 1 token with 9 decimals = 1,000,000,000)
            [],                // Signers (additional signers if needed, empty here)
            TOKEN_PROGRAM_ID   // The program ID of the SPL Token program
        )
    );
   await wallet.sendTransaction(mintTransaction,connection);
   alert(mintAddress.toBase58());
   onDone();    
    }
    return(
        <>
        <input id="amount" placeholder="Enter amount"/>
        <button onClick={createMint}>Mint token</button>
        </>
    )
}