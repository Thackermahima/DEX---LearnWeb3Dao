import { Fascinate_Inline } from "@next/font/google";
import { Contract } from "ethers";
import {
    TOKEN_CONTRACT_ABI,
    TOKEN_CONTRACT_ADDRESS,
    EXCHANGE_CONTRACT_ABI,
    EXCHANGE_CONTRACT_ADDRESS
} from "../Constants/Index";
//getEtherBalance:- retrieves the ether balance of the user from the contract.
export const getEtherBalance = async(provider : any, address: any, contract : boolean = false) => {
 try {
    /* If cotract boolean is set  to true, retrieve the balance of the 
      exchange contract or retrieve the balance of the user's address*/
      if(contract){
        const balance = await provider.getBalance(EXCHANGE_CONTRACT_ADDRESS);
        return balance;
      } else {
        const balance = await provider.getBalance(address);
        return balance;
      }
 } catch (error) {
    console.log(error,"error from getEtherBalance");
    return 0;
 }
}

/* getCDTokensBalance :- retrieves cryptoDev tokens in the accounts
of the provided address
*/
export const getCDTokensBalance = async (provider : any, address : any) => {
    try {
        const tokenContract = new Contract(
            TOKEN_CONTRACT_ADDRESS,
            TOKEN_CONTRACT_ABI,
            provider
        );
        const balanceOfCryptoDevTokens = await tokenContract.balanceOf(address);
        return balanceOfCryptoDevTokens;
    } catch (error) {
        console.log(error,"error from getCDTokensBalance");
        
    }
}

/* getLPTokensBalance :- retrieves LP tokens in the accounts
of the provided address
*/
export const getLPTokensBalance = async(provider : any, address : any) => {
try {
    const exchangeContract = new Contract(
        EXCHANGE_CONTRACT_ADDRESS,
        EXCHANGE_CONTRACT_ABI,
        provider
    );
    const balanceOfLPTokens = await exchangeContract.balanceOf(address);
    return balanceOfLPTokens;

} catch (error) {
    console.log(error, "error from the getLPTokensBalance");
    
}
}

export const getReserveOfCDTokens =async (provider:any) => {
    try {
        const exchangeContract = new Contract(
            EXCHANGE_CONTRACT_ADDRESS,
            EXCHANGE_CONTRACT_ABI,
            provider
        );
    const reserve = await exchangeContract.getReserve();
    return reserve;
    } catch (error) {
        console.log(error, "error from the getReserveOfCDTokens");
        
    }
}