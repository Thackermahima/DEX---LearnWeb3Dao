require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({path: ".env"});

const REACT_APP_HTTP_URL = process.env.REACT_APP_HTTP_URL;
const REACT_APP_PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks : {
    goerli : {
      url : REACT_APP_HTTP_URL,
      accounts  : [ REACT_APP_PRIVATE_KEY]
    }
  }
};
