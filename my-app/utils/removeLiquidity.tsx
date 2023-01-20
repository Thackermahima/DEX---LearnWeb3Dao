import { Contract, providers, utils, BigNumber } from "ethers";
import {
    EXCHANGE_CONTRACT_ABI,
    EXCHANGE_CONTRACT_ADDRESS
} from "../Constants/Index";

/* removeLiquidity: removes the LP tokens from liquity and 
the calculated amount of ether and CD tokens*/
export const removeLiquidity = async(signer : any, removeLPTokensWei : any) => {
 const exchangeContract = new Contract(
    EXCHANGE_CONTRACT_ADDRESS,
    EXCHANGE_CONTRACT_ABI,
    signer
 );
 const tx = await exchangeContract.removeLiquidity(removeLPTokensWei);
 await tx.wait();

};

export const getTokensAfterRemove =async ( provider : any, removeLPTokensWei  : any, _ethBalance  : any, cryptoDevTokenReserve  : any) => {
    try {
        const exchangeContract = new Contract(
            EXCHANGE_CONTRACT_ADDRESS,
            EXCHANGE_CONTRACT_ABI,
            provider
        );

        const _totaSupply = await exchangeContract.totalSupply();
        const _removeEther : any | undefined = _ethBalance.mul(removeLPTokensWei).div(_totaSupply);
        const _removeCD : any | undefined = cryptoDevTokenReserve
        .mul(removeLPTokensWei)
        .div(_totaSupply);
        return { 
            _removeEther,
            _removeCD,
        };
        

    } catch (error) {
        console.log(error, "error from getTokensAfterRemove");
        
    }
}