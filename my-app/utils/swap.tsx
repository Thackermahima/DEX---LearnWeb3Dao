import { Anybody } from "@next/font/google";
import { Contract } from "ethers";
import { 
    EXCHANGE_CONTRACT_ADDRESS,
    EXCHANGE_CONTRACT_ABI,
    TOKEN_CONTRACT_ADDRESS,
    TOKEN_CONTRACT_ABI
} from "../Constants/Index";

export const getAmountOfTokensReceivedFromSwap = async( _swapAmountwei : any, provider : any, ethSelected : any, ethBalance : any, reservedCd : any) =>{

    const exchangeContract = new Contract(
      EXCHANGE_CONTRACT_ADDRESS,
      EXCHANGE_CONTRACT_ABI,
      provider
    );
   
    let amountOfTokens;
    if(ethSelected){
     amountOfTokens = await exchangeContract.getAmountOfTokens(
         _swapAmountwei,
         ethBalance,
         reservedCd
     )
    } else {
        amountOfTokens = await exchangeContract.getAmountOfTokens(
            _swapAmountwei,
            reservedCd,
            ethBalance
        )
    } 
    return amountOfTokens;

}

export const swapTokens =async (    signer : any,
swapAmountwei : any,   tokenToBeReceivedAfterSwap : any, ethSelected : any  ) => {

const exchangeContract = new Contract(
    EXCHANGE_CONTRACT_ADDRESS,
    EXCHANGE_CONTRACT_ABI,
    signer
);
const tokenContract = new Contract(
    TOKEN_CONTRACT_ADDRESS,
    TOKEN_CONTRACT_ABI,
    signer
);
let tx;
if(ethSelected){
    tx = await exchangeContract.ethToCryptoDevToken(
        tokenToBeReceivedAfterSwap,
        {
            value : swapAmountwei
        }
    )
} else {
    tx = await tokenContract.approve(
        EXCHANGE_CONTRACT_ADDRESS,
        swapAmountwei.toString()
    );
    await tx.wait();

     tx = await exchangeContract.cryptoDevTokenToEth(
        swapAmountwei,
        tokenToBeReceivedAfterSwap
     );

}
await tx.wait();
}