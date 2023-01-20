// import Head from "next/head";
// import styles from "../styles/Home.module.css";
// import React, { useState, useEffect, useRef } from "react";
// import { BigNumber, providers, utils } from "ethers";
// import Web3Modal from "web3modal";
// import { addLiquidity, calculateCD } from "../utils/addLiquidity";
// import {
//   getEtherBalance,
//   getCDTokensBalance,
//   getLPTokensBalance,
//   getReserveOfCDTokens,
// } from "../utils/getAmounts";
// import {
//   removeLiquidity,
//   getTokensAfterRemove,
// } from "../utils/removeLiquidity";
// import { getAmountOfTokensReceivedFromSwap, swapTokens } from "../utils/swap";

// const Home: React.FC = () => {
//   //loading -> true when transaction is minting
//   //loading -> false when transaction has minted
//   const [loading, setLoading] = useState<boolean>(false);
//   /* Two tabs are used in this dapp which are liquidity and swap tab
// if it is true, user is on liquidityTab. if false then user is on swap tab */
//   const [liquidityTab, setLiquidityTab] = useState<boolean>(true);
//   //The variable is in the zero number in th form of BigNumber
//   const zero: BigNumber = BigNumber.from(0);
//   //ethBalance-> Keeps track for ETH held by the user's account.
//   const [ethBalance, setEtherBalance] = useState<BigNumber>(zero);
//   //ReservedCD keeps track of the Crypto Dev of the reserved balance in the exchange contract.

//   const [reservedCD, setReservedCD] = useState<BigNumber | any>(zero);
//   //keeps track of the ether balance in the contract.
//   const [etherBalanceContract, setEtherBalanceContract] = useState<BigNumber | any>(zero);

//   //cdBalance is the amount of crypto devtoken held by the user's account.
//   const [cdBalance, setCDBalance] = useState<BigNumber>(zero);
//   //lpBalance:- Amount of LP token help by the user's account.
//   const [lpBalance, setLPBalance] = useState<BigNumber>(zero);

//   //Amount of ether wants to send to the liquidity
//   const [addEther, setAddEther] = useState<BigNumber>(zero);
//   //CD tokens that user can add at given ether.
//   const [addCDTokens, setAddCDTokens] = useState<BigNumber>(zero);

//   const [removeEther, setRemoveEther] = useState<BigNumber>(zero);

//   //removeCD is the amount of cryptoDev token that would be sent back to the user based on certain number of 'LP' token.
//   const [removeCD, setRemoveCD] = useState<BigNumber>(zero);
//   //Amount of LP token that user wants remove from the liquidity.
//   const [removeLPToken, setRemoveLPToken] = useState<string>("0");
//   //Amount that the user wants to swap.
//   const [swapAmount, setSwapAmount] = useState<string>("");

//   const [tokenToBeReceivedAfterSwap, setTokenToBeReceivedAfterSwap] = useState<BigNumber | any>(zero);

//   const [ethSelected, setEthSelected] = useState<boolean | BigNumber>(zero);

//   const web3ModalRef = useRef<any>();

//   const [walletConnected, setWalletConnected] = useState<boolean>(false);

//   //getAmounts:- retrieve amounts for ethBalance, lpBalance etc..
//   const getAmounts = async () => {
//     try {
//       const provider = await getProviderORSigner(false);
//       const signer = await getProviderORSigner(true);
//       const address: string = await signer.getAddress();
//       const _ethBalance = await getEtherBalance(provider, address, false);
//       const _cdBalance = await getCDTokensBalance(provider, address);
//       const _lpBalance = await getLPTokensBalance(provider, address);
//       const _reservedCD = await getReserveOfCDTokens(provider);

//       //get the ether reserved in the contract.
//       const _ethBalanceContract = await getEtherBalance(provider, null, true);
//       setEtherBalance(_ethBalance);
//       setCDBalance(_cdBalance);
//       setLPBalance(_lpBalance);
//       setReservedCD(_reservedCD);
//       setEtherBalanceContract(_ethBalanceContract);
//     } catch (error) {
//       console.log(error, "Error from getAmounts");
//     }
//   };

//   //**Swap functions**//

//   const _swapTokens = async () => {
//     try {
//       //Convert the amount entered by the user to a BIGNUMBER using parseEther function.
//       const swapAmountWei = utils.parseEther(swapAmount);
//       //check if the user have entened zero.
//       //We are using eq method in BigNumber class.
//       if (!swapAmountWei.eq(zero)) {
//         const signer = await getProviderORSigner(true);
//         setLoading(true);
//         await swapTokens(
//           signer,
//           swapAmountWei,
//           tokenToBeReceivedAfterSwap,
//           ethSelected
//         );
//         setLoading(false);

//         //get all the updated amount after the swap.
//         await getAmounts();
//         setSwapAmount("");
//       }
//     } catch (error) {
//       console.log(error, "Error from _swapTokens");
//       setLoading(false);
//       setSwapAmount("");
//     }
//   };
//   //_getAmountOfTokensReceivedFromSwap :-> Returns number of ETH/Crypto dev tokens that
//   //can be receive when users swap the "SwapAmountOfWei" amount of crypto dev tokens.

//   const _getAmountOfTokensReceivedFromSwap = async (_swapAmount: String) => {
//     try {
//       //convert amount to a BigNumber.
//       console.log(_swapAmount, "swapamount");
//       const _swapAmountWEI = utils.parseEther(_swapAmount.toString());
//       if (!_swapAmountWEI.eq(zero)) {
//         const provider = await getProviderORSigner();
//         //get the amount of ether in the contract.
//         const _ethBalance = await getEtherBalance(provider, null, true);
//         const amountOfToken = await getAmountOfTokensReceivedFromSwap(
//           _swapAmountWEI,
//           provider,
//           ethSelected,
//           _ethBalance,
//           reservedCD
//         );
//         setTokenToBeReceivedAfterSwap(amountOfToken);
//       } else {
//         setTokenToBeReceivedAfterSwap(zero);
//       }
//     } catch (error) {
//       console.log(error, "error from getamountOfTokensRceivedFromSwap");
//     }
//   };
//   const _addLiquidity = async () => {
//     try {
//       //const addEtherWei = utils.parseEther(addEther.toString());

//       //Check if the values are zero.

//       if (!addCDTokens.eq(zero) && !addEther.eq(zero)) {
//         const signer = await getProviderORSigner(true);
//         setLoading(true);
//         //Call the addLiquidity function from the utils folder.
//         await addLiquidity(signer, addCDTokens, addEther);
//         setLoading(false);

//         //ReInitialized the CD Tokens.
//         setAddCDTokens(zero);
//         await getAmounts();
//       } else {
//         setAddCDTokens(zero);
//       }
//     } catch (error) {
//       console.log(error, "Error from _addLiquidity");
//       setLoading(false);
//       setAddCDTokens(zero);
//     }
//   };

//   const _removeLiquidity = async () => {
//     try {
//       const signer = await getProviderORSigner(true);
//       //Convert LP Tokens entered by the user to a BigNumber.

//       const removeLPTokensWei = utils.parseEther(removeLPToken);
//       setLoading(true);
//       await removeLiquidity(signer, removeLPTokensWei);
//       setLoading(false);
//       await getAmounts();
//       setRemoveCD(zero);
//       setRemoveEther(zero);
//     } catch (error) {
//       console.log(error, "Error from _removeLiquidity");
//       setLoading(false);
//       setRemoveCD(zero);
//       setRemoveEther(zero);
//     }
//   };

//   //_getTokensAfterRemove :- Calculates the amount of ethers and CD tokens.
//   //that would be returned back to the user after he removes `removeTokenWei`;
//   //amount of LP tokens from the contract.
//   const _getTokensAfterRemove = async (_removeLPTokens: string) => {
//     const provider = await getProviderORSigner();

//     //convert the LP tokens entered by the user to a BigNumber.
//     const removeLPTokenWei = utils.parseEther(_removeLPTokens);

//     //get Eth reserves within the exchange contract.
//     const _ethBalance = await getEtherBalance(provider, null, true);

//     //get the crypto dev reserves within the exchange conract.
//     const cryptoDevTokenReserve = await getReserveOfCDTokens(provider);
//     //call the getTokensAfterRemove function from the utils folder.

//     const { _removeEther, _removeCD }: any = await getTokensAfterRemove(
//       provider,
//       removeLPTokenWei,
//       _ethBalance,
//       cryptoDevTokenReserve
//     );
//     setRemoveEther(_removeEther);
//     setRemoveCD(_removeCD);
//   };

//   const connectWallet = async () => {
//     try {
//       await getProviderORSigner();
//       setWalletConnected(true);
//     } catch (error) {
//       console.log(error, "error  from connectWallet");
//     }
//   };

//   const getProviderORSigner = async (needSigner = false) => {
//     const provider = await web3ModalRef.current.connect();
//     const web3Provider = new providers.Web3Provider(provider);

//     const { chainId } = await web3Provider.getNetwork();
//     if (chainId !== 5) {
//       window.alert("Change the netwok to goerli");
//       throw new Error("change the network");
//     }
//     if (needSigner) {
//       const signer = web3Provider.getSigner();
//       return signer;
//     }
//     return web3Provider;
//   };

//   useEffect(() => {
//     if (!walletConnected) {
//       web3ModalRef.current = new Web3Modal({
//         network: "goerli",
//         providerOptions: {},
//         disableInjectedProvider: false,
//       });
//       connectWallet();
//       getAmounts();
//     }
//   }, [walletConnected]);

//   const renderButton = async () => {
    
//     if (loading) {
//       return(
//       <button className={styles.button}>Loading</button>
//    )
//   }
//     if (liquidityTab) {
//       return (
//         <div>
//           <div className={styles.description}>
//             You have :
//             <br />
//             {/*Converts the Bignumber to a String using formatEther function from the ether.js*/}
//             {utils.formatEther(cdBalance)} Cryto Dev Token
//             <br />
//             {utils.formatEther(ethBalance)} Ether
//             <br />
//             {utils.formatEther(lpBalance)} Crypto Dev LP Tokens.
//           </div>
//           <div>
//             {utils.parseEther(reservedCD.toString()).eq(zero) ? (
//               <div>
//                 <input
//                   type="number"
//                   placeholder="Amount of Ether"
//                   onChange={(e) =>
//                     setAddEther(utils.parseEther(e.target.value.toString()))
//                   }
//                 />
//                 <input
//                   type="number"
//                   placeholder="Amount of CryptoDev tokens"
//                   onChange={(e) =>
//                     setAddCDTokens(
//                       BigNumber.from(utils.parseEther(e.target.value || "0"))
//                     )
//                   }
//                   className={styles.input}
//                 />
//                 <button className={styles.button1} onClick={_addLiquidity}>
//                   Add
//                 </button>
//               </div>
//             ) : (
//               <div>
//                 <input
//                   type="number"
//                   placeholder="Amout of Ether"
//                   onChange={async (e) => {
//                     setAddEther(utils.parseEther(e.target.value.toString()));

//                     //Calculate the number of CD tokens that can be added given `e.target.value` amount of Eth
//                     const _addCDTokens = await calculateCD(
//                       e.target.value || "0",
//                       etherBalanceContract,
//                       reservedCD
//                     );
//                     setAddCDTokens(_addCDTokens);
//                   }}
//                   className={styles.input}
//                 ></input>
//                 <div className={styles.inputDiv}>
//                   {`You will need ${utils.formatEther(addCDTokens)}Crypto Dev Tokens `}
//                 </div>
//                 <button className={styles.button1} onClick={_addLiquidity}>
//                   Add
//                 </button>
//               </div>
//             )}
//             {/* Remove liquidity*/}

//             <div style={{ marginTop: "50px" }}>
//               <h4>Remove liquidity</h4>
//               <input
//                 type="number"
//                 placeholder="Amount of LP tokens"
//                 onChange={async (e) => {
//                   setRemoveLPToken(e.target.value || "0");
//                   await _getTokensAfterRemove(e.target.value || "0");
//                 }}
//                 className={styles.input}
//               />
//               <div className={styles.inputDiv}>
//                 {`You will get ${utils.formatEther(removeCD)} Crypto
//             Dev Tokens and ${utils.formatEther(removeEther)} Eth`}
//               </div>
//               <button className={styles.button1} onClick={_removeLiquidity}>
//                 Remove
//               </button>
//             </div>
//           </div>
//         </div>
//       );
//     } else {
//       return (
//         <div>
//           <input
//             type="number"
//             placeholder="Amount"
//             onChange={async (e) => {
//               setSwapAmount(e.target.value || "0");
//               await _getAmountOfTokensReceivedFromSwap(e.target.value || "0");
//             }}
//             className={styles.input}
//             value={swapAmount}
//           />
//           <select
//             className={styles.select}
//             name="dropdown"
//             id="dropdown"
//             onChange={async (e) => {
//               setEthSelected(!ethSelected);
//               await _getAmountOfTokensReceivedFromSwap("0");
//               setSwapAmount("");
//             }}
//           >
//             <option value="eth">Ethereum</option>
//             <option value="cryptoDevToken">Crypto Dev Tokens</option>
//           </select>
//           <br />
//           <div className={styles.inputDiv}>
//             {ethSelected
//               ? `You will get ${
//                   tokenToBeReceivedAfterSwap / 1000000000000000000
//                 } Crypto Dev Tokens`
//               : `You will get ${utils.formatEther(
//                   tokenToBeReceivedAfterSwap
//                 )} Eth`}
//           </div>
//           <button className={styles.button1} onClick={_swapTokens}>
//             Swap
//           </button>
//         </div>
//       );
//     }
//   };

//   return (

    
//     <div>
//       <Head>
      
//         <title>Crypto Devs</title>
//         <meta name="description" content="Whitelist-Dapp" />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>
//       <div className={styles.main}>
//         <div>
//              <div>

//           <h1 className={styles.title}>Welcome to Crypto Devs Exchange!</h1>
//           <h4>Exchange have total {reservedCD.toString() / 1000000000000000000} reserve of CD Tokens</h4>
// <h4>Exchange have total {etherBalanceContract.toString() / 1000000000000000000} reserve ETH</h4>
// </div>

//           <div className={styles.description}>
//             Exchange Ethereum &#60;&#62; Crypto Dev Tokens
//           </div>
//           <div>
//             <>
//               <button
//                 className={styles.button}
//                 onClick={() => {
//                   setLiquidityTab(true);
//                 }}
//               >
//                 Liquidity
//               </button>
//               <button
//                 className={styles.button}
//                 onClick={() => {
//                   setLiquidityTab(false);
//                 }}
//               >
//                 Swap
//               </button>
//              {!walletConnected &&  <button onClick={connectWallet} className={styles.button}>
//           Connect your wallet
//         </button>}
//               </>
//               </div>
//           </div>

//           {/* <div>
//                 <img className={styles.image} src="./cryptodev.svg" />
//               </div> */}
//       </div>
//         <footer className={styles.footer}>
//           Made with &#10084; by Crypto Devs
//         </footer>
//     </div>
//   );
// };
// export default Home;


import Head from "next/head";
import styles from "../styles/Home.module.css";
import React, { useState, useEffect, useRef } from "react";
import { BigNumber, providers, utils } from "ethers";
import Web3Modal from "web3modal";
import { addLiquidity, calculateCD } from "../utils/addLiquidity";
import {
  getEtherBalance,
  getCDTokensBalance,
  getLPTokensBalance,
  getReserveOfCDTokens,
} from "../utils/getAmounts";
import {
  removeLiquidity,
  getTokensAfterRemove,
} from "../utils/removeLiquidity";
import { getAmountOfTokensReceivedFromSwap, swapTokens } from "../utils/swap";
const Home: React.FC = () => {
  //loading -> true when transaction is minting
  //loading -> false when transaction has minted
  const [loading, setLoading] = useState<boolean>(false);
  /* Two tabs are used in this dapp which are liquidity and swap tab
if it is true, user is on liquidityTab. if false then user is on swap tab */
  const [liquidityTab, setLiquidityTab] = useState<boolean>(true);
  //The variable is in the zero number in th form of BigNumber
  const zero: BigNumber = BigNumber.from(0);
  //ethBalance-> Keeps track for ETH held by the user's account.
  const [ethBalance, setEtherBalance] = useState<BigNumber>(zero);
  //ReservedCD keeps track of the Crypto Dev of the reserved balance in the exchange contract.
  const [reservedCD, setReservedCD] = useState<BigNumber | any>(zero);
  //keeps track of the ether balance in the contract.
  const [etherBalanceContract, setEtherBalanceContract] = useState<
    BigNumber | any
  >(zero);
  //cdBalance is the amount of crypto devtoken held by the user's account.
  const [cdBalance, setCDBalance] = useState<BigNumber>(zero);
  //lpBalance:- Amount of LP token help by the user's account.
  const [lpBalance, setLPBalance] = useState<BigNumber>(zero);
  //Amount of ether wants to send to the liquidity
  const [addEther, setAddEther] = useState<BigNumber>(zero);
  //CD tokens that user can add at given ether.
  const [addCDTokens, setAddCDTokens] = useState<BigNumber>(zero);
  const [removeEther, setRemoveEther] = useState<BigNumber>(zero);
  //removeCD is the amount of cryptoDev token that would be sent back to the user based on certain number of 'LP' token.
  const [removeCD, setRemoveCD] = useState<BigNumber>(zero);
  //Amount of LP token that user wants remove from the liquidity.
  const [removeLPToken, setRemoveLPToken] = useState<string>("0");
  //Amount that the user wants to swap.
  const [swapAmount, setSwapAmount] = useState<string>("");
  const [tokenToBeReceivedAfterSwap, setTokenToBeReceivedAfterSwap] = useState<
    BigNumber | any
  >(zero);
  const [ethSelected, setEthSelected] = useState<boolean | BigNumber>(zero);
  const web3ModalRef = useRef<any>();
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  //getAmounts:- retrieve amounts for ethBalance, lpBalance etc..
  const getAmounts = async () => {
    try {
      const provider = await getProviderORSigner(false);
      const signer = await getProviderORSigner(true);
      const address: string = await signer.getAddress();
      const _ethBalance = await getEtherBalance(provider, address, false);
      const _cdBalance = await getCDTokensBalance(provider, address);
      const _lpBalance = await getLPTokensBalance(provider, address);
      const _reservedCD = await getReserveOfCDTokens(provider);
      //get the ether reserved in the contract.
      const _ethBalanceContract = await getEtherBalance(provider, null, true);
      setEtherBalance(_ethBalance);
      setCDBalance(_cdBalance);
      setLPBalance(_lpBalance);
      setReservedCD(_reservedCD);
      setEtherBalanceContract(_ethBalanceContract);
    } catch (error) {
      console.log(error, "Error from getAmounts");
    }
  };
  //**Swap functions**//
  const _swapTokens = async () => {
    try {
      //Convert the amount entered by the user to a BIGNUMBER using parseEther function.
      const swapAmountWei = utils.parseEther(swapAmount);
      //check if the user have entened zero.
      //We are using eq method in BigNumber class.
      if (!swapAmountWei.eq(zero)) {
        const signer = await getProviderORSigner(true);
        setLoading(true);
        await swapTokens(
          signer,
          swapAmountWei,
          tokenToBeReceivedAfterSwap,
          ethSelected
        );
        setLoading(false);
        //get all the updated amount after the swap.
        await getAmounts();
        setSwapAmount("");
      }
    } catch (error) {
      console.log(error, "Error from _swapTokens");
      setLoading(false);
      setSwapAmount("");
    }
  };
  //_getAmountOfTokensReceivedFromSwap :-> Returns number of ETH/Crypto dev tokens that
  //can be receive when users swap the "SwapAmountOfWei" amount of crypto dev tokens.
  const _getAmountOfTokensReceivedFromSwap = async (_swapAmount: String) => {
    try {
      //convert amount to a BigNumber.
      console.log(_swapAmount, "swapamount");
      const _swapAmountWEI = utils.parseEther(_swapAmount.toString());
      if (!_swapAmountWEI.eq(zero)) {
        const provider = await getProviderORSigner();
        //get the amount of ether in the contract.
        const _ethBalance = await getEtherBalance(provider, null, true);
        const amountOfToken = await getAmountOfTokensReceivedFromSwap(
          _swapAmountWEI,
          provider,
          ethSelected,
          _ethBalance,
          reservedCD
        );
        setTokenToBeReceivedAfterSwap(amountOfToken);
      } else {
        setTokenToBeReceivedAfterSwap(zero);
      }
    } catch (error) {
      console.log(error, "error from getamountOfTokensRceivedFromSwap");
    }
  };
  const _addLiquidity = async () => {
    try {
      //const addEtherWei = utils.parseEther(addEther.toString());
      //Check if the values are zero.
      if (!addCDTokens.eq(zero) && !addEther.eq(zero)) {
        const signer = await getProviderORSigner(true);
        setLoading(true);
        //Call the addLiquidity function from the utils folder.
        await addLiquidity(signer, addCDTokens, addEther);
        setLoading(false);
        //ReInitialized the CD Tokens.
        setAddCDTokens(zero);
        await getAmounts();
      } else {
        setAddCDTokens(zero);
      }
    } catch (error) {
      console.log(error, "Error from _addLiquidity");
      setLoading(false);
      setAddCDTokens(zero);
    }
  };
  const _removeLiquidity = async () => {
    try {
      const signer = await getProviderORSigner(true);
      //Convert LP Tokens entered by the user to a BigNumber.
      const removeLPTokensWei = utils.parseEther(removeLPToken);
      setLoading(true);
      await removeLiquidity(signer, removeLPTokensWei);
      setLoading(false);
      await getAmounts();
      setRemoveCD(zero);
      setRemoveEther(zero);
    } catch (error) {
      console.log(error, "Error from _removeLiquidity");
      setLoading(false);
      setRemoveCD(zero);
      setRemoveEther(zero);
    }
  };
  //_getTokensAfterRemove :- Calculates the amount of ethers and CD tokens.
  //that would be returned back to the user after he removes `removeTokenWei`;
  //amount of LP tokens from the contract.
  const _getTokensAfterRemove = async (_removeLPTokens: string) => {
    const provider = await getProviderORSigner();
    //convert the LP tokens entered by the user to a BigNumber.
    const removeLPTokenWei = utils.parseEther(_removeLPTokens);
    //get Eth reserves within the exchange contract.
    const _ethBalance = await getEtherBalance(provider, null, true);
    //get the crypto dev reserves within the exchange conract.
    const cryptoDevTokenReserve = await getReserveOfCDTokens(provider);
    //call the getTokensAfterRemove function from the utils folder.
    const { _removeEther, _removeCD }: any = await getTokensAfterRemove(
      provider,
      removeLPTokenWei,
      _ethBalance,
      cryptoDevTokenReserve
    );
    setRemoveEther(_removeEther);
    setRemoveCD(_removeCD);
  };
  const connectWallet = async () => {
    try {
      await getProviderORSigner();
      setWalletConnected(true);
    } catch (error) {
      console.log(error, "error  from connectWallet");
    }
  };
  const getProviderORSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      window.alert("Change the netwok to goerli");
      throw new Error("change the network");
    }
    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };
  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
      getAmounts();
    }
  }, [walletConnected]);
  return (
    <div>
      <Head>
        <title>Crypto Devs</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <div>
            <h1 className={styles.title}>Welcome to Crypto Devs Exchange!</h1>
            <h4>
              Exchange have total {reservedCD.toString() / 1000000000000000000}{" "}
              reserve of CD Tokens
            </h4>
            <h4>
              Exchange have total{" "}
              {etherBalanceContract.toString() / 1000000000000000000} reserve
              ETH
            </h4>
          </div>
          <div className={styles.description}>
            Exchange Ethereum &#60;&#62; Crypto Dev Tokens
          </div>
          <div>
            <>
              <button
                className={styles.button}
                onClick={() => {
                  setLiquidityTab(true);
                }}
              >
                Liquidity
              </button>
              <button
                className={styles.button}
                onClick={() => {
                  setLiquidityTab(false);
                }}
              >
                Swap
              </button>
              {!walletConnected && (
                <button onClick={connectWallet} className={styles.button}>
                  Connect your wallet
                </button>
              )}
              {loading && <button className={styles.button}>Loading</button>}
              {liquidityTab ? (
                <div>
                  <div className={styles.description}>
                    You have :
                    <br />
                    {/*Converts the Bignumber to a String using formatEther function from the ether.js*/}
                    {utils.formatEther(cdBalance)} Cryto Dev Token
                    <br />
                    {utils.formatEther(ethBalance)} Ether
                    <br />
                    {utils.formatEther(lpBalance)} Crypto Dev LP Tokens.
                  </div>
                  <div>
                    {utils.parseEther(reservedCD.toString()).eq(zero) ? (
                      <div>
                        <input
                          type="number"
                          placeholder="Amount of Ether"
                          onChange={(e) =>
                            setAddEther(
                              utils.parseEther(e.target.value.toString())
                            )
                          }
                        />
                        <input
                          type="number"
                          placeholder="Amount of CryptoDev tokens"
                          onChange={(e) =>
                            setAddCDTokens(
                              BigNumber.from(
                                utils.parseEther(e.target.value || "0")
                              )
                            )
                          }
                          className={styles.input}
                        />
                        <button
                          className={styles.button1}
                          onClick={_addLiquidity}
                        >
                          Add
                        </button>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="number"
                          placeholder="Amout of Ether"
                          onChange={async (e) => {
                            setAddEther(
                              utils.parseEther(e.target.value.toString())
                            );
                            //Calculate the number of CD tokens that can be added given `e.target.value` amount of Eth
                            const _addCDTokens = await calculateCD(
                              e.target.value || "0",
                              etherBalanceContract,
                              reservedCD
                            );
                            setAddCDTokens(_addCDTokens);
                          }}
                          className={styles.input}
                        ></input>
                        <div className={styles.inputDiv}>
                          {`You will need ${utils.formatEther(
                            addCDTokens
                          )}Crypto Dev Tokens `}
                        </div>
                        <button
                          className={styles.button1}
                          onClick={_addLiquidity}
                        >
                          Add
                        </button>
                      </div>
                    )}
                    {/* Remove liquidity*/}
                    <div style={{ marginTop: "50px" }}>
                      <h4>Remove liquidity</h4>
                      <input
                        type="number"
                        placeholder="Amount of LP tokens"
                        onChange={async (e) => {
                          setRemoveLPToken(e.target.value || "0");
                          await _getTokensAfterRemove(e.target.value || "0");
                        }}
                        className={styles.input}
                      />
                      <div className={styles.inputDiv}>
                        {`You will get ${utils.formatEther(removeCD)} Crypto
            Dev Tokens and ${utils.formatEther(removeEther)} Eth`}
                      </div>
                      <button
                        className={styles.button1}
                        onClick={_removeLiquidity}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <input
                    type="number"
                    placeholder="Amount"
                    onChange={async (e) => {
                      setSwapAmount(e.target.value || "0");
                      await _getAmountOfTokensReceivedFromSwap(
                        e.target.value || "0"
                      );
                    }}
                    className={styles.input}
                    value={swapAmount}
                  />
                  <select
                    className={styles.select}
                    name="dropdown"
                    id="dropdown"
                    onChange={async (e) => {
                      setEthSelected(!ethSelected);
                      await _getAmountOfTokensReceivedFromSwap("0");
                      setSwapAmount("");
                    }}
                  >
                    <option value="eth">Ethereum</option>
                    <option value="cryptoDevToken">Crypto Dev Tokens</option>
                  </select>
                  <br />
                  <div className={styles.inputDiv}>
                    {ethSelected
                      ? `You will get ${
                          tokenToBeReceivedAfterSwap / 1000000000000000000
                        } Crypto Dev Tokens`
                      : `You will get ${utils.formatEther(
                          tokenToBeReceivedAfterSwap
                        )} Eth`}
                  </div>
                  <button className={styles.button1} onClick={_swapTokens}>
                    Swap
                  </button>
                </div>
              )}
            </>
          </div>
        </div>
        {/* <div>
                <img className={styles.image} src="./cryptodev.svg" />
              </div> */}
      </div>
      <footer className={styles.footer}>
        Made with &#10084; by Crypto Devs
      </footer>
    </div>
  );
};
export default Home;
