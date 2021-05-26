pragma solidity 0.8.1;

import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/utils/Context.sol";

import "./IBEP20.sol";
import "./ReentrancyGuard.sol";


contract BEP20Presale is Context, Ownable, ReentrancyGuard {

    IBEP20 private _token;
    address private _wallet;
    mapping(uint256 => uint256) _weiRaised;
    uint256 private _referralAmount;

    // phase detail
    uint256 private _phase;
    uint256 private _cap;
    uint256 private _rate;
    uint256 private _phaseSupplyLeft;
    uint256 private _phaseSupplyTotal;
    uint256 private _phaseStartTimestamp; //epoch in seconds
    uint256 private _phaseEndTimestamp; //epoch in seconds

    constructor(address token, address wallet) {
        _token = IBEP20(token);
        _wallet = wallet;
    }

    /******************************************************
     * INFO REGARDING THE CURRENT SALE PHASE
     ******************************************************/
    function rate() public view returns (uint256) {
        return _rate;
    }

    function cap() public view returns (uint256) {
        return _cap;
    }

    function phaseSupplyLeft() public view returns (uint256) {
        return _phaseSupplyLeft;
    }

    function phaseSupplyTotal() public view returns (uint256) {
        return _phaseSupplyTotal;
    }  

    function phaseStartTimestamp() public view returns (uint256) {
        return _phaseStartTimestamp;
    }

    function phaseEndTimestamp() public view returns (uint256) {
        return _phaseEndTimestamp;
    } 

    function phaseIsActive() public view returns (bool){
        return (block.timestamp > _phaseStartTimestamp &&
                block.timestamp < _phaseEndTimestamp);
    }

    function currentPhase() public view returns (uint256){
        return _phase;
    }

    function weiRaised(uint256 phase) public view returns (uint256){
        return _weiRaised[phase];
    }

    function presaleWallet() public view returns (address){
        return _wallet;
    }

    function token() public view returns (IBEP20){
        return _token;
    }

    function referralAmount() public view returns (uint256){
        return _referralAmount;
    }

    fallback () external payable{
        purchaseToken(_msgSender(), _msgSender());
    }
    /**
     * Purchase token. Provided amount is the total amount of token (without digits).
     * This function has a non-reentrancy guard, so it shouldn't be called by
     * another `nonReentrant` function.
     */

    function purchaseToken(address beneficiary, address referral) public payable nonReentrant {
        require(_msgSender() != address(0), "BEP20Presale: AddressZero cannot purchase.");
        require(phaseIsActive(), "BEP20Presale: Current phase is not active.");
        require( msg.value >= 0.1 ether, "BEP20Presale: Minimum amount required to purchase tokens is 0.1 BNB");

        uint256 tokenValue = msg.value * _rate;
        require(tokenValue <= _phaseSupplyLeft, "BEP20Presale: Amount exceeds remaining supply of the current phase.");

       

        _token.transfer(beneficiary, tokenValue);
        if(beneficiary != referral){
            _token.transfer(referral, _referralAmount);
        }
        _weiRaised[_phase] = _weiRaised[_phase] + msg.value;
        _phaseSupplyLeft = _phaseSupplyLeft - tokenValue;

        address payable walletPayable = payable(_wallet);
        walletPayable.transfer(msg.value);

     
    }


    /**********************************************************
     * OWNER SECTION
     **********************************************************/

    function withdrawToken(uint256 amount) public onlyOwner {
        _token.transfer(owner(), amount);
    }

    function setReferralAmount(uint256 referralAmount) public onlyOwner {
        _referralAmount = referralAmount;
    }

    function setCurrentPhase(uint256 cap, uint rate, uint256 timestampStart, uint256 timestampEnd) public onlyOwner {
        require(cap * rate <= _token.balanceOf(address(this)), "BEP20Presale: Supply value exceeds the token balance");
        require(timestampStart >= block.timestamp, "BEP20Presale: opening time is before current time");
        require(timestampEnd > timestampStart, "BEP20Presale: opening time is not before closing time");
        _cap = cap;
        _rate = rate;
        _phaseSupplyTotal = cap * rate;
        _phaseSupplyLeft = cap * rate;
        _phaseStartTimestamp = timestampStart;
        _phaseEndTimestamp = timestampEnd;
        _phase += 1;
    }
 
}
