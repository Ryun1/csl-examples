# CSL Javascript Examples Repo

This repository contains example implementations of Cardano specific logic, using the Javascript libraries of [Cardano Serialization Lib](https://github.com/Emurgo/cardano-serialization-lib).

CSL Version: `12.0.0-alpha.29`

## Examples

### [CIP-1852 Key Derivation](./examples/cip-1852-keys.js)

In this example, we show [CIP-1852 HD derivation](https://github.com/cardano-foundation/CIPs/tree/master/CIP-1852) of all keys.
Further, we show how these keys can be used to create addresses and DRep IDs.

### [CIP-08 Message Signing](./examples/cip-0008-signing.js)


### [CIP-105 Conway Era Keys](./examples/cip-0105-conway-keys.js)


## To run examples

Clone the repository.

```shell
git clone
```

Navigate to directory.

```shell
cd csl-js-examples
```

Run a example.

```shell
node examples/cip-1852-keys.js
```