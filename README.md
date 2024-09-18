# CSL Javascript Examples Repo

This repository contains example implementations of Cardano specific logic, using the Javascript libraries of [Cardano Serialization Lib](https://github.com/Emurgo/cardano-serialization-lib).

CSL Version: `12.0.0-alpha.29`

## Examples

### [CIP-1852 Key Derivation](./examples/CIP-1852/cip-1852-keys.js)

In this example, we show [CIP-1852 HD derivation](https://github.com/cardano-foundation/CIPs/tree/master/CIP-1852) of all keys.
Further, we show how these keys can be used to create addresses and DRep IDs.

### [CIP-0008 Message Signing](./examples/CIP-0008/cip-0008-signing.js)

WIP

### [CIP-105 Conway Era Keys](./examples/CIP-105/cip-105-test-vectors.js)

In this example we make extensive test vectors for [CIP-105](https://github.com/cardano-foundation/CIPs/tree/master/CIP-0105).

## To run examples

Clone the repository.

```sh
git clone https://github.com/Ryun1/csl-examples.git
```

Navigate to directory.

```sh
cd csl-examples
```

Run a example.

```sh
node examples/cip-1852-keys.js
```