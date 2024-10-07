import { Buffer } from 'buffer';
import {
    PrivateKey,
    Credential,
    EnterpriseAddress,
} from "@emurgo/cardano-serialization-lib-nodejs";
import {
    HeaderMap,
    Label,
    AlgorithmId,
    CBORValue,
    ProtectedHeaderMap,
    COSESign1Builder,
    COSEKey,
    KeyType,
    BigNum,
    Int,
    Headers,
} from "@emurgo/cardano-message-signing-nodejs"

// Constants
// Constants
const privateKeyHex = '105d2ef2192150655a926bca9cccf5e2f6e496efa9580508192e1f4a790e6f53de06529129511d1cacb0664bcf04853fdc0055a47cc6d2c6d205127020760652';
const networkTag = 0;
const messageToSign = 'cc4ab8ead604ddb498ed4b2916af7b454c65ac783b5d836fddf388e72a40eccb'

// ########### Keys ###########

// Create private and public keys
const privateKey = PrivateKey.from_hex(privateKeyHex);
const publicKey = privateKey.to_public();

// Create enterprise address
const credential = Credential.from_keyhash(publicKey.hash());
const address = (EnterpriseAddress.new(networkTag, credential)).to_address();

// ########### Witnesses ###########

// Do a normal ED25519 signature, for comparison
const ed25519Signature = privateKey.sign(Buffer.from(messageToSign, 'hex'));

// CIP-0008 Message signing

const protectedHeaders = HeaderMap.new();
  protectedHeaders.set_algorithm_id(
    Label.from_algorithm_id(AlgorithmId.EdDSA)
);

protectedHeaders.set_header(
    Label.new_text('address'),
    CBORValue.new_bytes(Buffer.from(address.to_hex(), 'hex'))
);

const protectedSerialized =
    ProtectedHeaderMap.new(protectedHeaders);
const unprotectedHeaders = HeaderMap.new();
const headers = Headers.new(
    protectedSerialized,
    unprotectedHeaders
);
const builder = COSESign1Builder.new(
    headers,
    Buffer.from(messageToSign, 'hex'),
    false
);

const toSign = builder.make_data_to_sign().to_bytes();
const signedSigStruc = privateKey.sign(toSign).to_bytes();
const coseSign1 = builder.build(signedSigStruc);

const key = COSEKey.new(
    Label.from_key_type(KeyType.OKP)
);

key.set_algorithm_id(
    Label.from_algorithm_id(AlgorithmId.EdDSA)
);

key.set_header(
    Label.new_int(
      Int.new_negative(BigNum.from_str('1'))
    ),
    CBORValue.new_int(
      Int.new_i32(6)
    )
); 
key.set_header(
    Label.new_int(
      Int.new_negative(BigNum.from_str('2'))
    ),
    CBORValue.new_bytes(publicKey.as_bytes())
);

const coseSig = Buffer.from(coseSign1.to_bytes()).toString('hex')

// ########### Logs ###########

console.log('\n=== CIP-0008 Message Signing ===');

console.log('\n> Constants');
console.log("Using private key (hex):", privateKeyHex);
console.log('Message to sign:', messageToSign);

console.log('\n> Keys / addresses');
console.log("Public key (hex):", publicKey.to_hex());
console.log('Network tag:', networkTag);
console.log('Enterprise address (hex):', address.to_hex());

console.log('\nSignatures')
console.log('Ed25519:', ed25519Signature.to_hex());
console.log('CIP-0005:', coseSig);
