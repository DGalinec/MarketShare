pragma solidity ^0.4.24;
//pragma solidity ^0.5.0;

import "../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol";
import "../node_modules/zeppelin-solidity/contracts/math/SafeMath.sol";
//import "github.com/OpenZeppelin/zeppelin-solidity/contracts/ownership/Ownable.sol";
//import "github.com/OpenZeppelin/zeppelin-solidity/contracts/math/SafeMath.sol";

/**
 * @title Seller
 * @dev The Seller contract manages creation, information and deletion of the
 * seller addresses.
 */
contract Seller is Ownable {
    
    using SafeMath for uint256;
    
    mapping(address => bool) private areSellers;
    uint256 private nbSellers;

    constructor() public { }
    
    /**
     * @dev add a new seller
     */
    function addSeller(address _address) public onlyOwner {
        require(!areSellers[_address]);
        areSellers[_address] = true;
        nbSellers = nbSellers.add(1);
    }
    
    /**
     * @dev delete an existing seller
     */
    function deleteSeller(address _address) public onlyOwner {
        require(areSellers[_address]);
        areSellers[_address] = false;
        nbSellers = nbSellers.sub(1);
    }
    
    /**
     * @return if a given address corresponds to a listed seller
     */
    function isSeller(address _address) public view returns(bool) {
        return areSellers[_address];
    }
    
    /**
     * @return the total number number of currently listed sellers
     */
    function getNbSellers() public view returns(uint256) {
        return nbSellers;
    }
    
    /**
     * @dev throws if called by any account not listed as a seller
     */
    modifier isAllowed() {
        require(areSellers[msg.sender]);
        _;
    }
}