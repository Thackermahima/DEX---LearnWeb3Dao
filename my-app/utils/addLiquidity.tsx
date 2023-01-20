import { Contract, utils} from "ethers";
import { 
    TOKEN_CONTRACT_ABI,
    TOKEN_CONTRACT_ADDRESS,
    EXCHANGE_CONTRACT_ABI,
    EXCHANGE_CONTRACT_ADDRESS
} from "../Constants/Index";
/*  addLiquidity: It helps us to add liquidity to the token*/
export const addLiquidity = async( signer : any, addCDAmountWei : any, addEtherAmountWei : any) => {
try {
    const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        signer
           );
   
        const exchangeContract = new Contract(
           EXCHANGE_CONTRACT_ADDRESS,
           EXCHANGE_CONTRACT_ABI,
           signer
        );
        let tx = await tokenContract.approve(
           EXCHANGE_CONTRACT_ADDRESS,
           addCDAmountWei.toString()
        );
        await tx.wait();
        //After the contract has the approval, add the ether and cd tokens in the liquidity.
        tx = await exchangeContract.addLiquidity(addCDAmountWei,{
           value : addEtherAmountWei,
        });
        await tx.wait();
} catch (error) {
    console.log(error, "");
    
}
}

/* calculateCD:- calculates the CD tokens that need to be added to the liquidity
given _addEtherAmountWei amount of ether. */

export const calculateCD =async (_addEther = "0",etherBalanceContract : any,  cdTokenReserve : any) => {
    //_addEther is a string so need to convert it to the BigNumber, which is achieved by parseEther.
    const _addEtherAmountWei = utils.parseEther(_addEther);
    const cryptoDevTokenAmount = _addEtherAmountWei
    .mul(cdTokenReserve)
    .div(etherBalanceContract);
    return cryptoDevTokenAmount;
}
