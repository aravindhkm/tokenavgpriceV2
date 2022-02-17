// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.4.1 (utils/structs/EnumerableSet.sol)

pragma solidity ^0.8.0;
import "hardhat/console.sol";

library Storage {
    bytes32 constant DIAMOND_STORAGE_POSITION = keccak256("diamond.standard.diamond.storage");

    struct StoreSet {
        uint128 _currPrice;
        uint64 _timestamp;
    }

    struct PriceSet {
        StoreSet[] _inner;
    }

    struct AssetPrice {
        mapping(bytes32 => PriceSet) _price;
    }

    function diamondStorage() internal pure returns (AssetPrice storage ds) {
        bytes32 position = DIAMOND_STORAGE_POSITION;
        assembly {
            ds.slot := position
        }
    }

    function update(bytes32 store,uint128 price, uint64 timestamp) internal returns (bool) {
        AssetPrice storage set = diamondStorage();
        set._price[store]._inner.push(StoreSet(price,timestamp));
        return true;
    }

    function length(bytes32 store) internal view returns (uint256) {
        AssetPrice storage set = diamondStorage();
        return set._price[store]._inner.length;
    }

    function values(bytes32 store) internal view returns (StoreSet[] memory) {
        AssetPrice storage set = diamondStorage();
        return (set._price[store]._inner);
    }

    function currentPrice(bytes32 store) internal view returns (uint128) {        
        AssetPrice storage set = diamondStorage();

        console.log("Current Length", set._price[store]._inner.length);
        return (set._price[store]._inner[set._price[store]._inner.length - 1]._currPrice);
    }

    function currentPriceWithTime(bytes32 store) internal view returns (StoreSet memory) {
        AssetPrice storage set = diamondStorage();
        return (set._price[store]._inner[set._price[store]._inner.length - 1]);
    }

    function filter(bytes32 startstore,bytes32 endstore,uint256 startTime,uint256 endTime) internal view returns (uint256 average) {
        AssetPrice storage set = diamondStorage();
        uint256 abut1 = set._price[startstore]._inner.length;
        uint256 abut2 = set._price[endstore]._inner.length;
        uint256 totalDate;
        for(uint256 i; i<abut1; i++) {
            if(set._price[startstore]._inner[i]._timestamp >= startTime){
                average = average + set._price[startstore]._inner[i]._currPrice;
                totalDate++;
            }
        }

        for(uint256 j; j<abut2; j++) {
            if(set._price[endstore]._inner[j]._timestamp <= endTime){
                average = average + set._price[endstore]._inner[j]._currPrice;
                totalDate++;
            }
        }

        return (average / totalDate);
    }
}