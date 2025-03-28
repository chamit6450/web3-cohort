import { WagmiProvider, createConfig, useConnect, http, useAccount, useDisconnect, useBalance, useSendTransaction } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { mainnet } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getBalance } from 'viem/actions';
import Solana from './Solana';
  import { useState } from 'react';

const config = createConfig({
  chains: [mainnet], 
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(), 
  }
});

const queryClient = new QueryClient();

function App() {
  
  return (
    <>  
    {/* <button onClick={setCrypto(false)}>SOL</button> */}
    <Solana />
    
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <WalletConnector /> <br></br>
        <Address/> <br></br>
        <SendTransaction/>
      </QueryClientProvider>
    </WagmiProvider>
   
    </>
  );
}

function Address(){
  const {address} = useAccount();
  const {balance} = useBalance( {address} );
  const {disconnect} = useDisconnect();
  return <>
   {address}
   <br></br>
   {balance ? `{balance?.data?.formatted}` : 'N/A'}
   <button onClick={()=> disconnect()}>disconnect</button>
  </>
}

function SendTransaction(){
  const { data:hash, sendTransaction} = useSendTransaction();

  
  function sendTxn(){
    const to = document.getElementById("to").value;
    const value = document.getElementById("value").value;
  }
    return (
    <>
      <input id='to' placeholder='to' required/>
      <input id='value' placeholder='0.01 ETH' required/>
      <button onClick={sendTxn}>Send</button>
      {hash && <div>Transaction Hash: {hash}</div>}
    </>
    )
  
}


function WalletConnector() {
  const { connectors, connect } = useConnect();

  if (!connectors || connectors.length === 0) {
    return <p>No wallet connectors available</p>; 
  }

  return connectors.map((connector) => (
    <button key={connector.id} onClick={() => connect({ connector })}>
      {connector.name}
    </button>
  ));
}

export default App;
