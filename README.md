# Reentrancy Guard for High-Stakes Attackers

## Introduction

This project is a modification of the original Aspect sample designed to prevent reentrancy attacks, as demonstrated in the attack on Curve.fi in July 2023. The modification aims to enhance security by implementing logic to detect whether an attacker successfully stole $100,000 during a reentrant attack.

For more information on the original Aspect sample and its role in preventing reentrancy attacks, please refer to [Reentrancy Guard By Aspect](https://docs.artela.network/develop/guides/reentrancy-guard).

## Modifications

We have introduced logic to determine if an attacker has successfully stolen $100,000 during a reentrant attack. The updated project includes changes in both the attack and protection mechanisms.

## Testing

To test the modified project:

1. Follow the instructions in the [Prerequisites](https://docs.artela.network/develop/guides/reentrancy-guard#pre-requisites) section of the original README to set up the environment.

2. Deploy the modified contracts:

   ```bash
   # Deploy Curve Contract
   npm run contract:deploy -- --abi ./build/contract/CurveContract.abi --bytecode ./build/contract/CurveContract.bin --skfile ./curve_accounts.txt

   # Deploy Modified Attack Contract
   npm run contract:deploy -- --abi ./build/contract/ModifiedAttack.abi --bytecode ./build/contract/ModifiedAttack.bin --args {curveAddress} --skfile ./attack_accounts.txt
   ```

3. Run the attack:

   ```bash
   npm run contract:send -- --contract {attackAddress} --abi ./build/contract/ModifiedAttack.abi --skfile ./attack_accounts.txt --method attack --gas 200000
   ```

   Check the transaction output to determine if the protection mechanism successfully prevented the theft of $100,000.

## Conclusion

This modified project aims to provide an additional layer of security by detecting and preventing potential financial losses during reentrancy attacks. Developers can use this enhancement to reinforce the protection offered by Aspect Programming in decentralized finance applications.
