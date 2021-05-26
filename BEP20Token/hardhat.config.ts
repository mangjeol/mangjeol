
/**
* @type import('hardhat/config').HardhatUserConfig
*/

require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

module.exports = {
   solidity: "0.8.1",
   defaultNetwork: "hardhat",
   networks: {
      hardhat: {},
      testnet: {
        url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
        // url:"https://eth-ropsten.alchemyapi.io/v2/UNqKKTucH364VLDmP-mUBljJPtaGtVxP",
        chainId: 97,
        // chainId: 3,
        gasPrice: 10000000000,
        // Ethereum
        // accounts: ["f96223988049709f0e4afedfee9823600eb469ddf5c70fea342b7"],
        // BSC
        accounts: ["fd7a2683775efb6390d1e79f5c294c08acabe76ed45bf57dfb850f4"],
    }
},
    etherscan: {
        // Your API key for Etherscan
        // Obtain one at https://etherscan.io/
        // Ethereum
        // apiKey:  "STFEWTWCYQSANZ1S3ER9CYEJ5IC99"
        // BSC
        apiKey:  "MQ4JGXXPMD8GSFRZ72U1C7U43W8AQI"

      }
  
}


