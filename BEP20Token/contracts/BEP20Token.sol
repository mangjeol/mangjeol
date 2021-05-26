pragma solidity 0.8.1;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";

contract BEP20Token is ERC20, Ownable {

    constructor( uint256 maxSupply) ERC20("BEP20 Token", "$BEP") {
        _mint(owner(), maxSupply);
    }

    function getOwner() public view returns (address){
        return owner();
    }

}