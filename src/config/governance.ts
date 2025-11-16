// P2PSwap Governance: Simple governance built into P2PSwap contract
// Updated to latest P2PSwap deployment on Sepolia
export const GOVERNANCE_SERVICE_ADDRESS =
  '0x7178a03fc9674ecbc62e278de1b04b69745995af' as const

export const GOVERNANCE_SERVICE_ABI = [
  {
    type: 'function',
    name: 'createGovernanceProposal',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'description', type: 'string' },
      { name: 'start', type: 'uint256' },
      { name: 'end', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'voteOnGovernanceProposal',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'proposalId', type: 'uint256' },
      { name: 'voteYes', type: 'bool' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'finalizeGovernanceProposal',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'proposalId', type: 'uint256' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'proposalCount',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'proposals',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'uint256' }],
    outputs: [
      { name: 'creator', type: 'address' },
      { name: 'description', type: 'string' },
      { name: 'startTime', type: 'uint256' },
      { name: 'endTime', type: 'uint256' },
      { name: 'finalized', type: 'bool' },
      { name: 'yesVotes', type: 'uint256' },
      { name: 'noVotes', type: 'uint256' },
    ],
  },
  {
    type: 'function',
    name: 'hasVoted',
    stateMutability: 'view',
    inputs: [
      { name: '', type: 'address' },
      { name: '', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const
