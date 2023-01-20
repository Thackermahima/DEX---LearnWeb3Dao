//SPDX-License-Identifier:MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Exchange is ERC20{
    address public cryptodevaddress;

constructor(address _cryptoDevToken) ERC20("CryptoDev LP Token","CDLP"){
    require(_cryptoDevToken != address(0),"Token address passed is a null address");
    cryptodevaddress = _cryptoDevToken;
 } 
 //GetReserve :- Returns a amount of cryptoDev token held by the contract

 function getReserve() public view returns(uint){
  return ERC20(cryptodevaddress).balanceOf(address(this));
 }

 function addLiquidity(uint _amount)public payable returns(uint){
 uint liquidity;
 uint ethBalance = address(this).balance;
 uint cryptoDevTokenReserve = getReserve();
 ERC20 cryptoDevTokens = ERC20(cryptodevaddress);

 /*If the reserve is empty intake all the supplied for
 "Ether" and "CryptoDev" value because there is no ratio*/
if(cryptoDevTokenReserve == 0){
    //Transfer the 'cryptoDevToken' from user's account to the contract. 
    cryptoDevTokens.transferFrom(msg.sender,address(this),_amount);
    //Take the current ethBalance mint the ethBalance amount to LP token.abi
    //liquidity provded is equal to ethBalance because this is the first time user 
    liquidity = ethBalance;
    _mint(msg.sender, liquidity);
} else {
  /* If the reserve is not empty, intake any user supplied value for
    `Ether` and determine according to the ratio how many `Crypto Dev` tokens
     need to be supplied to prevent any large price impacts because of the additional
     liquidity */
     uint ethReserve = ethBalance - msg.value;
     // Ratio here is -> (cryptoDevTokenAmount user can add/cryptoDevTokenReserve in the contract) = (Eth Sent by the user/Eth Reserve in the contract);
        // So doing some maths, (cryptoDevTokenAmount user can add) = (Eth Sent by the user * cryptoDevTokenReserve /Eth Reserve);
        // Ratio here is -> (cryptoDevTokenAmount user can add/cryptoDevTokenReserve in the contract) = (Eth Sent by the user/Eth Reserve in the contract);
        // So doing some maths, (cryptoDevTokenAmount user can add) = (Eth Sent by the user * cryptoDevTokenReserve /Eth Reserve);
        uint CryptoDevTokenAmount = (msg.value * cryptoDevTokenReserve) / (ethReserve);
        require(_amount >= CryptoDevTokenAmount,"Amount sent is less than the minimum tokens required");
   cryptoDevTokens.transferFrom(msg.sender, address(this), CryptoDevTokenAmount);
   liquidity = (totalSupply() * msg.value)/ ethReserve;
   _mint(msg.sender, liquidity);
}
return liquidity;
 }

 function removeLiquidity(uint _amount)public returns(uint, uint){
  require(_amount > 0,"_amount should be greater than zero");
  uint ethReserve = address(this).balance;
  uint _totalSupply = totalSupply();
  uint ethAmount = ( ethReserve * _amount) / _totalSupply;
  uint cryptoDevTokenAmount = (getReserve() * _amount)/_totalSupply;
  
   // Burn the sent LP tokens from the user's wallet because they are already sent to
  // remove liquidity
  _burn(msg.sender, _amount);
  payable(msg.sender).transfer(ethAmount);
  ERC20(cryptodevaddress).transfer(msg.sender, cryptoDevTokenAmount);
  return(ethAmount, cryptoDevTokenAmount);
 }

 function getAmountOfTokens(uint256 inputAmount, uint256 inputReserve, uint256 outputReserve) public pure returns(uint256){
 require(inputReserve > 0 && outputReserve > 0,"Invalid reservese");
 
 uint inputAmountWithFee = inputAmount * 99;

 // So the final formula is Δy = (y * Δx) / (x + Δx)
 uint256 numerator = inputAmountWithFee * outputReserve;
 uint256 denominator = ( inputReserve * 100) + inputAmountWithFee;
 return numerator/denominator;

 }

 function ethToCryptoDevToken(uint _mintTokens) public payable{
  uint256 tokenReserve = getReserve();
    //Call the getAmountOfTokens function to get the crypto dev tokens
   //address(this).balance already contains the msg.value so 
   //we need to subtract it from address(this).balance - msg.value

   uint256 tokensBought = getAmountOfTokens(msg.value, address(this).balance - msg.value, tokenReserve);

   require(tokensBought >= _mintTokens, "insufficient output amount");
  ERC20(cryptodevaddress).transfer(msg.sender, tokensBought);

 }

 function cryptoDevTokenToEth(uint _tokensSold, uint _mintETH)public{
  uint256 tokenReserve = getReserve();
  uint ethBought = getAmountOfTokens(_tokensSold, tokenReserve, address(this).balance);
  require(ethBought >= _mintETH, "insufficient output amount");
  ERC20(cryptodevaddress).transferFrom(
    msg.sender,
    address(this),
    _tokensSold
  );
  payable(msg.sender).transfer(ethBought);
 }
}
