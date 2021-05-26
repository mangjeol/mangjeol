async function main() {

    const [deployer] = await ethers.getSigners();
  
    console.log(
      "Deploying contracts with the account:",
      deployer.address
    );
    
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const Token = await ethers.getContractFactory("BEP20Presale");
    const token = await Token.deploy("0x74e8daab3bf5b048d1fBB9b7F5C927c45C14B5cd","0xb95146B119Db9e66E102859D11f0919B5dA660EF");
  
    console.log("Token address:", token.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });