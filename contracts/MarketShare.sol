pragma solidity ^0.4.24;

import "./Seller.sol";

/**
 * @title MarketShare
 * @dev The MarketShare contract manages creatin, information and deletion of sales
 * records.
 */
contract MarketShare is Seller {
    
    using SafeMath for uint256;

    mapping(address => uint256) private sales;
    uint256 private totalSales;
    uint256 private nbSales;

    constructor() public {
    }
    
    /**
     * @dev records a sale from a seller
     */
    function recordSales(int256 _value) public isAllowed {
        
        /**
         * @dev we do not allow negative sales value to be entered
         */
        require(_value >= 0);
        _addSales(uint256(_value));
    }
    
    function _addSales(uint256 _value) internal {
        
        /**
         * @dev if a sales value already exists for a given address we delete it by 
         * substracting it from totalSales and decreasing the nbSales counter 
         */
        if (sales[msg.sender] != 0) {
            totalSales = totalSales.sub(sales[msg.sender]);
            nbSales = nbSales.sub(1);
        }
        
        sales[msg.sender] = _value;
        
        /**
         * @dev we record a new sales only if the _value entered is greater than zero
         */
        if (_value > 0) {
           totalSales = totalSales.add(_value);
           nbSales = nbSales.add(1); 
        }
    }
    
    /**
     * @return the number of sales records coming from different seller addresses
     */
    function getNbSales() public view returns(uint256) {
        return nbSales;
    }
    
    /**
     * @return the total amount of sales records currently being recorded
     */
    function getTotalSales() public view returns(uint256) {
        return totalSales;
    }
    
    /**
     * @return the sales record currently associated to a particular seller address
     */
    function getSales(address _address) public view returns(uint256) {
        return sales[_address];
    }
}