
import {
    allocate,
    entryPoint,
    execute,
    IPreContractCallJP,
    PreContractCallInput, ethereum, CallTreeQuery, sys, EthCallTree,
} from "@artela/aspect-libs";
import {Protobuf} from "as-proto/assembly/Protobuf";

/**
 * Please describe what functionality this aspect needs to implement.
 *
 * About the concept of Aspect @see [join-point](https://docs.artela.network/develop/core-concepts/join-point)
 * How to develop an Aspect  @see [Aspect Structure](https://docs.artela.network/develop/reference/aspect-lib/aspect-structure)
 */
class Aspect implements IPreContractCallJP {
    preContractCall(input: PreContractCallInput): void {
        // Get the method of currently called contract.
        const currentCallMethod = ethereum.parseMethodSig(input.call!.data);

        // Define functions that are not allowed to be reentered.
        const noReentrantMethods: Array<string> = [
            ethereum.computeMethodSig('add_liquidity()'),
            ethereum.computeMethodSig('remove_liquidity()')
        ];

        // Verify if the current method is within the scope of functions that are not susceptible to reentrancy.
        if (noReentrantMethods.includes(currentCallMethod)) {
            const callTreeQuery = new CallTreeQuery(-1);

            const queryCallTree = sys.hostApi.trace.queryCallTree(callTreeQuery);
            const ethCallTree = Protobuf.decode<EthCallTree>(queryCallTree, EthCallTree.decode);
            var size = ethCallTree.calls.size;
            var arrayKeys = ethCallTree.calls.keys();

            for (let i = 0; i < size; i++) {
                var key = arrayKeys[i];
                var parentCall = ethCallTree.calls.get(key);
                const parentCallMethod = ethereum.parseMethodSig(parentCall.data);
                if (noReentrantMethods.includes(parentCallMethod)) {
                    // If yes, revert the transaction.
                    sys.revert(`illegal transaction: method reentered from ${currentCallMethod} to ${parentCallMethod}`);
                }
            } 
        }
        if (currentCallMethod === ethereum.computeMethodSig('attack()')) {
            const value = parseInt(input.call!.value.toString());
            if (value > 1000000) {
                sys.revert("illegal transaction: incorrect value sent with the attack");
            }
        }
    }

    /**
     * isOwner is the governance account implemented by the Aspect, when any of the governance operation
     * (including upgrade, config, destroy) is made, isOwner method will be invoked to check
     * against the initiator's account to make sure it has the permission.
     *
     * @param sender address of the transaction
     * @return true if check success, false if check fail
     */
    isOwner(sender: Uint8Array): bool {
        return true;
    }

}

// 2.register aspect Instance
const aspect = new Aspect()
entryPoint.setAspect(aspect)

// 3.must export it
export {execute, allocate}
