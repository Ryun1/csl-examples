# CSL Javascript Examples Repo

This repository contains example implementations of Cardano specific logic, using the Javascript libraries of [Cardano Serialization Library (CSL)](https://github.com/Emurgo/cardano-serialization-lib).

CSL Version: [`12.1.0`](https://www.npmjs.com/package/@emurgo/cardano-serialization-lib-nodejs/v/12.1.0)

## Examples

### [CIP-1852 Key Derivation - Example](./examples/CIP-1852/cip-1852-keys.js)

In this example, we show [CIP-1852 HD derivation](https://github.com/cardano-foundation/CIPs/tree/master/CIP-1852) of all keys.
Further, we show how these keys can be used to create addresses and DRep IDs.

### [CIP-0008 Message Signing - Example](./examples/CIP-0008/cip-8-signing.js)

In this example, we show an implementation of [CIP-0008 Message Signing](https://github.com/cardano-foundation/CIPs/tree/master/CIP-0008).

### [CIP-105 Conway Era Keys - Test Vectors](./examples/CIP-0105/cip-105-test-vectors.js)

In this example we make extensive test vectors for [CIP-105 | Conway era key chains](https://github.com/cardano-foundation/CIPs/tree/master/CIP-0105).

## To run examples

Clone the repository.

```shell
git clone https://github.com/Ryun1/csl-examples.git
```

Navigate to directory.

```shell
cd csl-examples
```

Install modules.

```shell
npm install
```

Run a example.

```shell
node examples/CIP-1852/cip-1852-keys.js
```