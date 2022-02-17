// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.4.1 (utils/structs/EnumerableSet.sol)

pragma solidity ^0.8.0;


library Storage {

    struct StoreSet {
        uint128 _price;
        uint64 _timestamp;
    }

    struct PriceSet {
        StoreSet[] _inner;
    }

    function update(PriceSet storage set, uint128 price, uint64 timestamp) internal returns (bool) {
        set._inner.push(StoreSet(price,timestamp));
        return true;
    }

    function length(PriceSet storage set) internal view returns (uint256) {
        return set._inner.length;
    }

    function values(PriceSet storage set) internal view returns (StoreSet[] memory) {
        return (set._inner);
    }

    function currentPrice(PriceSet storage set) internal view returns (uint128) {
        return (set._inner[set._inner.length - 1]._price);
    }

    function currentPriceWithTime(PriceSet storage set) internal view returns (StoreSet memory) {
        return (set._inner[set._inner.length - 1]);
    }

    function filter(PriceSet storage startSet,PriceSet storage endSet,uint256 startTime,uint256 endTime) internal view returns (uint256 average) {
        uint256 abut1 = startSet._inner.length;
        uint256 abut2 = endSet._inner.length;
        uint256 totalDate;
        for(uint256 i; i<abut1; i++) {
            if(startSet._inner[i]._timestamp >= startTime){
                average = average + startSet._inner[i]._price;
                totalDate++;
            }
        }

        for(uint256 j; j<abut2; j++) {
            if(endSet._inner[j]._timestamp <= endTime){
                average = average + endSet._inner[j]._price;
                totalDate++;
            }
        }

        return (average / totalDate);
    }

}