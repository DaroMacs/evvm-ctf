// GovernanceService contract configuration: address and ABI
// Paste your deployed GovernanceService address below.
export const GOVERNANCE_SERVICE_ADDRESS = "0x0000000000000000000000000000000000000000";

export const GOVERNANCE_SERVICE_ABI = [
  {
    "type": "function",
    "name": "createProposal",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "user", "type": "address" },
      { "name": "descriptionHash", "type": "bytes32" },
      { "name": "nonce", "type": "uint256" },
      { "name": "start", "type": "uint256" },
      { "name": "end", "type": "uint256" },
      { "name": "priorityFee", "type": "uint256" },
      { "name": "priorityFlag", "type": "bool" },
      { "name": "signature", "type": "bytes" }
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "vote",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "user", "type": "address" },
      { "name": "proposalId", "type": "uint256" },
      { "name": "voteYes", "type": "bool" },
      { "name": "nonce", "type": "uint256" },
      { "name": "priorityFee", "type": "uint256" },
      { "name": "priorityFlag", "type": "bool" },
      { "name": "signature", "type": "bytes" }
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "finalizeProposal",
    "stateMutability": "nonpayable",
    "inputs": [
      { "name": "proposalId", "type": "uint256" }
    ],
    "outputs": []
  },
  {
    "type": "function",
    "name": "proposalCount",
    "stateMutability": "view",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256" }]
  },
  {
    "type": "function",
    "name": "proposals",
    "stateMutability": "view",
    "inputs": [{ "name": "", "type": "uint256" }],
    "outputs": [
      { "name": "creator", "type": "address" },
      { "name": "descriptionHash", "type": "bytes32" },
      { "name": "startTime", "type": "uint256" },
      { "name": "endTime", "type": "uint256" },
      { "name": "finalized", "type": "bool" },
      { "name": "yesVotes", "type": "uint256" },
      { "name": "noVotes", "type": "uint256" }
    ]
  },
  {
    "type": "function",
    "name": "hasVoted",
    "stateMutability": "view",
    "inputs": [
      { "name": "", "type": "address" },
      { "name": "", "type": "uint256" }
    ],
    "outputs": [{ "name": "", "type": "bool" }]
  }
 ] as const;
