/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { CatPizza, CatPizzaInterface } from "../CatPizza";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Burn",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "DEAD",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "_feesRates",
    outputs: [
      {
        internalType: "uint16",
        name: "buyFee",
        type: "uint16",
      },
      {
        internalType: "uint16",
        name: "sellFee",
        type: "uint16",
      },
      {
        internalType: "uint16",
        name: "transferFee",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenAmount",
        type: "uint256",
      },
    ],
    name: "autoLiquidity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "automatedMarketMakerPairs",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "dexRouter",
    outputs: [
      {
        internalType: "contract IUniswapV2Router02",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "enableTrading",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "bool",
        name: "val",
        type: "bool",
      },
    ],
    name: "excludeFromFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "isExcludedFromFee",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lpPair",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "marketingAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "setMarketingAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "setMaxTransactionAmount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "setMaxWalletAmount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "setSwapThreshold",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "buyFee",
        type: "uint16",
      },
      {
        internalType: "uint16",
        name: "sellFee",
        type: "uint16",
      },
      {
        internalType: "uint16",
        name: "transferFee",
        type: "uint16",
      },
    ],
    name: "setTaxes",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "swapThreshold",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "swapTokenAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b50604080518082018252600881526743617450697a7a6160c01b6020808301918252835180850190945260048452630436174560e41b9084015281519192916200005e91600391620005bc565b50805162000074906004906020840190620005bc565b50505062000094336a52b7d2dcc80cd2e4000000620003ab60201b60201c565b69d3c21bcecceda1000000600c819055600f819055600580546001600160a01b031990811633908117909255600980548216736644ebde0f26c8f74ad18697cce8a5ac4e608cb41781556040805160608101825261012c80825260208083019190915260009183018290526014805465ffffffffffff191663012c012c1790556008805486167378867bbeef44f2326bf8ddd1941a4439382ef2a717815595825260118152828220805460ff199081166001908117909255308452848420805482168317905594546001600160a01b039081168452848420805487168317905596549096168252908290208054909316909417909155600a93909355611b58600d55610bb8600e5560138054909116739ac64cc6e4415144c455bd8e4837fea55603e5c3908117909155825163c45a015560e01b815292519092839263c45a0155926004838101938290030181865afa158015620001f6573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906200021c919062000662565b6001600160a01b031663c9c6539630601360009054906101000a90046001600160a01b03166001600160a01b031663ad5c46486040518163ffffffff1660e01b8152600401602060405180830381865afa1580156200027f573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620002a5919062000662565b6040516001600160e01b031960e085901b1681526001600160a01b039283166004820152911660248201526044016020604051808303816000875af1158015620002f3573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019062000319919062000662565b600780546001600160a01b0319166001600160a01b039290921691821790556000908152601260205260409020805460ff1916600117905562000360338260001962000494565b6200036f308260001962000494565b6008546200038a906001600160a01b03168260001962000494565b50600680546001600160a01b03191661dead179055612710600b55620006f7565b6001600160a01b038216620004075760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f20616464726573730060448201526064015b60405180910390fd5b80600260008282546200041b919062000694565b90915550506001600160a01b038216600090815260208190526040812080548392906200044a90849062000694565b90915550506040518181526001600160a01b038316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a35050565b6001600160a01b038316620004f85760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b6064820152608401620003fe565b6001600160a01b0382166200055b5760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b6064820152608401620003fe565b6001600160a01b0383811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b828054620005ca90620006bb565b90600052602060002090601f016020900481019282620005ee576000855562000639565b82601f106200060957805160ff191683800117855562000639565b8280016001018555821562000639579182015b82811115620006395782518255916020019190600101906200061c565b50620006479291506200064b565b5090565b5b808211156200064757600081556001016200064c565b6000602082840312156200067557600080fd5b81516001600160a01b03811681146200068d57600080fd5b9392505050565b60008219821115620006b657634e487b7160e01b600052601160045260246000fd5b500190565b600181811c90821680620006d057607f821691505b602082108103620006f157634e487b7160e01b600052602260045260246000fd5b50919050565b611f5e80620007076000396000f3fe6080604052600436106101a75760003560e01c806370a08231116100e2578063a5ece94111610085578063a5ece94114610510578063a9059cbb14610530578063b62496f514610550578063c6aca36b14610580578063dd62ed3e146105a0578063df8408fe146105c0578063f2fde38b146105e0578063f36f79e01461060057600080fd5b806370a0823114610428578063893d20e8146104485780638a8c523c146104665780638da5cb5b1461047b578063906e9dd01461049b57806395d89b41146104bb5780639d0014b1146104d0578063a457c2d7146104f057600080fd5b806323b872dd1161014a57806323b872dd1461031357806327a14fc214610333578063313ce5671461035357806332cde6641461036f578063395093511461038f57806342966c68146103af578063452ed4f1146103cf5780635342acb4146103ef57600080fd5b806303fd2a45146101b35780630445b667146101f057806306fdde03146102145780630758d92414610236578063095ea7b31461025657806318160ddd146102865780631c06a7e11461029b5780631e293c10146102f157600080fd5b366101ae57005b600080fd5b3480156101bf57600080fd5b506006546101d3906001600160a01b031681565b6040516001600160a01b0390911681526020015b60405180910390f35b3480156101fc57600080fd5b50610206600a5481565b6040519081526020016101e7565b34801561022057600080fd5b50610229610620565b6040516101e79190611b5e565b34801561024257600080fd5b506013546101d3906001600160a01b031681565b34801561026257600080fd5b50610276610271366004611bcb565b6106b2565b60405190151581526020016101e7565b34801561029257600080fd5b50600254610206565b3480156102a757600080fd5b506014546102cc9061ffff808216916201000081048216916401000000009091041683565b6040805161ffff948516815292841660208401529216918101919091526060016101e7565b3480156102fd57600080fd5b5061031161030c366004611bf7565b6106ca565b005b34801561031f57600080fd5b5061027661032e366004611c10565b610702565b34801561033f57600080fd5b5061031161034e366004611bf7565b610726565b34801561035f57600080fd5b50604051601281526020016101e7565b34801561037b57600080fd5b5061031161038a366004611c68565b610755565b34801561039b57600080fd5b506102766103aa366004611bcb565b6107be565b3480156103bb57600080fd5b506103116103ca366004611bf7565b6107e0565b3480156103db57600080fd5b506007546101d3906001600160a01b031681565b3480156103fb57600080fd5b5061027661040a366004611cab565b6001600160a01b031660009081526011602052604090205460ff1690565b34801561043457600080fd5b50610206610443366004611cab565b610892565b34801561045457600080fd5b506005546001600160a01b03166101d3565b34801561047257600080fd5b506103116108ad565b34801561048757600080fd5b506005546101d3906001600160a01b031681565b3480156104a757600080fd5b506103116104b6366004611cab565b610940565b3480156104c757600080fd5b5061022961098c565b3480156104dc57600080fd5b506103116104eb366004611bf7565b61099b565b3480156104fc57600080fd5b5061027661050b366004611bcb565b6109ca565b34801561051c57600080fd5b506009546101d3906001600160a01b031681565b34801561053c57600080fd5b5061027661054b366004611bcb565b610a45565b34801561055c57600080fd5b5061027661056b366004611cab565b60126020526000908152604090205460ff1681565b34801561058c57600080fd5b5061031161059b366004611bf7565b610a53565b3480156105ac57600080fd5b506102066105bb366004611ccf565b610a8a565b3480156105cc57600080fd5b506103116105db366004611d16565b610ab5565b3480156105ec57600080fd5b506103116105fb366004611cab565b610b0a565b34801561060c57600080fd5b506008546101d3906001600160a01b031681565b60606003805461062f90611d44565b80601f016020809104026020016040519081016040528092919081815260200182805461065b90611d44565b80156106a85780601f1061067d576101008083540402835291602001916106a8565b820191906000526020600020905b81548152906001019060200180831161068b57829003601f168201915b5050505050905090565b6000336106c0818585610b56565b5060019392505050565b6005546001600160a01b031633146106fd5760405162461bcd60e51b81526004016106f490611d7e565b60405180910390fd5b600f55565b600033610710858285610c7a565b61071b858585610cee565b506001949350505050565b6005546001600160a01b031633146107505760405162461bcd60e51b81526004016106f490611d7e565b600c55565b6005546001600160a01b0316331461077f5760405162461bcd60e51b81526004016106f490611d7e565b6014805461ffff94851663ffffffff199091161762010000938516939093029290921765ffff0000000019166401000000009190931602919091179055565b6000336106c08185856107d18383610a8a565b6107db9190611dc9565b610b56565b6107e933610892565b8111156108505760405162461bcd60e51b815260206004820152602f60248201527f4275726e20616d6f756e742073686f756c64206265206c657373207468616e2060448201526e6163636f756e742062616c616e636560881b60648201526084016106f4565b61085a3382610d91565b60405181815233907fcc16f5dbb4873280815c1ee09dbd06736cffcc184412cf7a71a0fdb75d397ca59060200160405180910390a250565b6001600160a01b031660009081526020819052604090205490565b6005546001600160a01b031633146108d75760405162461bcd60e51b81526004016106f490611d7e565b601054610100900460ff161561092f5760405162461bcd60e51b815260206004820152601e60248201527f54726164696e67456e61626c656420616c72656164792061637469766564000060448201526064016106f4565b6010805461ff001916610100179055565b6005546001600160a01b0316331461096a5760405162461bcd60e51b81526004016106f490611d7e565b600980546001600160a01b0319166001600160a01b0392909216919091179055565b60606004805461062f90611d44565b6005546001600160a01b031633146109c55760405162461bcd60e51b81526004016106f490611d7e565b600a55565b600033816109d88286610a8a565b905083811015610a385760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b60648201526084016106f4565b61071b8286868403610b56565b6000336106c0818585610cee565b6000610a60600283611de1565b905047610a6c82610edf565b6000610a788247611e03565b9050610a848382611042565b50505050565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b6005546001600160a01b03163314610adf5760405162461bcd60e51b81526004016106f490611d7e565b6001600160a01b03919091166000908152601160205260409020805460ff1916911515919091179055565b6005546001600160a01b03163314610b345760405162461bcd60e51b81526004016106f490611d7e565b600580546001600160a01b0319166001600160a01b0392909216919091179055565b6001600160a01b038316610bb85760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b60648201526084016106f4565b6001600160a01b038216610c195760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b60648201526084016106f4565b6001600160a01b0383811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b6000610c868484610a8a565b90506000198114610a845781811015610ce15760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e636500000060448201526064016106f4565b610a848484848403610b56565b610cf9838383611125565b60105460ff1615610d1457610d0f838383611499565b505050565b610d1e8383611667565b15610d2b57610d2b611717565b6001600160a01b03831660009081526011602052604090205460019060ff1680610d6d57506001600160a01b03831660009081526011602052604090205460ff165b15610d76575060005b80610d8657610a84848484611499565b610a8484848461177f565b6001600160a01b038216610df15760405162461bcd60e51b815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f206164647265736044820152607360f81b60648201526084016106f4565b6001600160a01b03821660009081526020819052604090205481811015610e655760405162461bcd60e51b815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e604482015261636560f01b60648201526084016106f4565b6001600160a01b0383166000908152602081905260408120838303905560028054849290610e94908490611e03565b90915550506040518281526000906001600160a01b038516907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a3505050565b6040805160028082526060820183526000926020830190803683370190505090503081600081518110610f1457610f14611e1a565b6001600160a01b03928316602091820292909201810191909152601354604080516315ab88c960e31b81529051919093169263ad5c46489260048083019391928290030181865afa158015610f6d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f919190611e30565b81600181518110610fa457610fa4611e1a565b6001600160a01b039283166020918202929092010152601354610fca9130911684610b56565b6013546001600160a01b031663791ac9478360008430610fec426103e8611dc9565b6040518663ffffffff1660e01b815260040161100c959493929190611e4d565b600060405180830381600087803b15801561102657600080fd5b505af115801561103a573d6000803e3d6000fd5b505050505050565b60135461105c9030906001600160a01b0316600019610b56565b6013546005546001600160a01b039182169163f305d7199184913091879160009182911661108c42612710611dc9565b60405160e089901b6001600160e01b03191681526001600160a01b039687166004820152602481019590955260448501939093526064840191909152909216608482015260a481019190915260c40160606040518083038185885af11580156110f9573d6000803e3d6000fd5b50505050506040513d601f19601f8201168201806040525081019061111e9190611ebe565b5050505050565b6001600160a01b0383166111915760405162461bcd60e51b815260206004820152602d60248201527f45524332303a207472616e736665722066726f6d20746865205a45524f5f414460448201526c4452455353206164647265737360981b60648201526084016106f4565b6001600160a01b0382166111fb5760405162461bcd60e51b815260206004820152602b60248201527f45524332303a207472616e7366657220746f20746865205a45524f5f4144445260448201526a455353206164647265737360a81b60648201526084016106f4565b600081116112655760405162461bcd60e51b815260206004820152603160248201527f5472616e7366657220616d6f756e74206d7573742062652067726561746572206044820152707468616e205a45524f5f4144445245535360781b60648201526084016106f4565b6005546001600160a01b0384811691161480159061129157506005546001600160a01b03838116911614155b80156112a557506001600160a01b03821615155b80156112bc57506001600160a01b03821661dead14155b80156112cb575060105460ff16155b15610d0f57601054610100900460ff1661131c5760405162461bcd60e51b815260206004820152601260248201527154726164696e67206e6f742061637469766560701b60448201526064016106f4565b6001600160a01b03831660009081526012602052604090205460ff161561140757600f548111156113ad5760405162461bcd60e51b815260206004820152603560248201527f427579207472616e7366657220616d6f756e742065786365656473207468652060448201527436b0bc2a3930b739b0b1ba34b7b720b6b7bab73a1760591b60648201526084016106f4565b600c546113b983610892565b6113c39083611dc9565b1115610d0f5760405162461bcd60e51b815260206004820152601360248201527213585e081dd85b1b195d08195e18d959591959606a1b60448201526064016106f4565b6001600160a01b03821660009081526012602052604090205460ff16156113ad57600f54811115610d0f5760405162461bcd60e51b815260206004820152603660248201527f53656c6c207472616e7366657220616d6f756e742065786365656473207468656044820152751036b0bc2a3930b739b0b1ba34b7b720b6b7bab73a1760511b60648201526084016106f4565b6001600160a01b0383166114fd5760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b60648201526084016106f4565b6001600160a01b03821661155f5760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b60648201526084016106f4565b6001600160a01b038316600090815260208190526040902054818110156115d75760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b60648201526084016106f4565b6001600160a01b0380851660009081526020819052604080822085850390559185168152908120805484929061160e908490611dc9565b92505081905550826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8460405161165a91815260200190565b60405180910390a3610a84565b60008061167330610892565b9050600a54811015801561168a575060105460ff16155b80156116a457506007546001600160a01b03858116911614155b80156116c557506007546000906116c3906001600160a01b0316610892565b115b80156116ea57506001600160a01b03831660009081526011602052604090205460ff16155b801561170f57506001600160a01b03841660009081526011602052604090205460ff16155b949350505050565b6010805460ff19166001179055600061172f30610892565b9050611754600b54600d54836117459190611eec565b61174f9190611de1565b611808565b611772600b54600e54836117689190611eec565b61059b9190611de1565b506010805460ff19169055565b6001600160a01b03831660009081526011602052604081205482919060019060ff16806117c457506001600160a01b03851660009081526011602052604090205460ff165b156117cd575060005b80156117fd576117de868686611aa4565b915081156117fd576117f08285611e03565b92506117fd863084611499565b61103a868685611499565b6040805160038082526080820190925260009160208201606080368337019050509050308160008151811061183f5761183f611e1a565b6001600160a01b03928316602091820292909201810191909152601354604080516315ab88c960e31b81529051919093169263ad5c46489260048083019391928290030181865afa158015611898573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906118bc9190611e30565b816001815181106118cf576118cf611e1a565b6001600160a01b03928316602091820292909201015260085482519116908290600290811061190057611900611e1a565b6001600160a01b03928316602091820292909201015260085460135460405163095ea7b360e01b81529083166004820152600019602482015291169063095ea7b3906044016020604051808303816000875af1158015611964573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906119889190611f0b565b50601360009054906101000a90046001600160a01b03166001600160a01b031663ad5c46486040518163ffffffff1660e01b8152600401602060405180830381865afa1580156119dc573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611a009190611e30565b60135460405163095ea7b360e01b81526001600160a01b039182166004820152600019602482015291169063095ea7b3906044016020604051808303816000875af1158015611a53573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611a779190611f0b565b506013546009546001600160a01b0391821691635c11d795918591600091869116610fec426103e8611dc9565b6001600160a01b0383166000908152601260205260408120548190819060ff1615611ae157601454611ada9061ffff1683611dc9565b9150611b35565b6001600160a01b03851660009081526012602052604090205460ff1615611b1957601454611ada9062010000900461ffff1683611dc9565b601454611b3290640100000000900461ffff1683611dc9565b91505b8115611b5557600b54611b488386611eec565b611b529190611de1565b90505b95945050505050565b600060208083528351808285015260005b81811015611b8b57858101830151858201604001528201611b6f565b81811115611b9d576000604083870101525b50601f01601f1916929092016040019392505050565b6001600160a01b0381168114611bc857600080fd5b50565b60008060408385031215611bde57600080fd5b8235611be981611bb3565b946020939093013593505050565b600060208284031215611c0957600080fd5b5035919050565b600080600060608486031215611c2557600080fd5b8335611c3081611bb3565b92506020840135611c4081611bb3565b929592945050506040919091013590565b803561ffff81168114611c6357600080fd5b919050565b600080600060608486031215611c7d57600080fd5b611c8684611c51565b9250611c9460208501611c51565b9150611ca260408501611c51565b90509250925092565b600060208284031215611cbd57600080fd5b8135611cc881611bb3565b9392505050565b60008060408385031215611ce257600080fd5b8235611ced81611bb3565b91506020830135611cfd81611bb3565b809150509250929050565b8015158114611bc857600080fd5b60008060408385031215611d2957600080fd5b8235611d3481611bb3565b91506020830135611cfd81611d08565b600181811c90821680611d5857607f821691505b602082108103611d7857634e487b7160e01b600052602260045260246000fd5b50919050565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b634e487b7160e01b600052601160045260246000fd5b60008219821115611ddc57611ddc611db3565b500190565b600082611dfe57634e487b7160e01b600052601260045260246000fd5b500490565b600082821015611e1557611e15611db3565b500390565b634e487b7160e01b600052603260045260246000fd5b600060208284031215611e4257600080fd5b8151611cc881611bb3565b600060a082018783526020878185015260a0604085015281875180845260c086019150828901935060005b81811015611e9d5784516001600160a01b031683529383019391830191600101611e78565b50506001600160a01b03969096166060850152505050608001529392505050565b600080600060608486031215611ed357600080fd5b8351925060208401519150604084015190509250925092565b6000816000190483118215151615611f0657611f06611db3565b500290565b600060208284031215611f1d57600080fd5b8151611cc881611d0856fea2646970667358221220feeaff6b8aac1ab9f00f3514261a5fca2787a5206b33e2c11662d2d7825d77b264736f6c634300080d0033";

export class CatPizza__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<CatPizza> {
    return super.deploy(overrides || {}) as Promise<CatPizza>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): CatPizza {
    return super.attach(address) as CatPizza;
  }
  connect(signer: Signer): CatPizza__factory {
    return super.connect(signer) as CatPizza__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): CatPizzaInterface {
    return new utils.Interface(_abi) as CatPizzaInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): CatPizza {
    return new Contract(address, _abi, signerOrProvider) as CatPizza;
  }
}
