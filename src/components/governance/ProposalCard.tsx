'use client'

import {
  useGovernanceService,
  ProposalUI,
} from '../../hooks/useGovernanceService'
import { VoteButtons } from './VoteButtons'
import { useState } from 'react'

export interface ProposalCardProps {
  proposal: ProposalUI
  onChanged?: () => void
}

function formatTs(ts: bigint) {
  const n = Number(ts) * 1000
  return new Date(n).toLocaleString()
}

export function ProposalCard({ proposal, onChanged }: ProposalCardProps) {
  const { finalize } = useGovernanceService()
  const [isFinalizing, setIsFinalizing] = useState(false)

  async function onFinalize() {
    setIsFinalizing(true)
    try {
      const tx = await finalize(proposal.id)
      alert(`Finalized\nTx: ${tx}`)
      onChanged?.()
    } catch (err: any) {
      alert(`Finalize failed\n${err?.message ?? String(err)}`)
    } finally {
      setIsFinalizing(false)
    }
  }

  return (
    <div className="w-full rounded-lg border p-4">
      <div className="mb-3">
        <h3 className="text-lg font-semibold">Proposal #{proposal.id}</h3>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Creator</span>
          <span className="font-mono">{proposal.creator}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Status</span>
          <span className="uppercase">{proposal.status}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Start</span>
          <span>{formatTs(proposal.startTime)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">End</span>
          <span>{formatTs(proposal.endTime)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Yes</span>
          <span>{proposal.yesVotes.toString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">No</span>
          <span>{proposal.noVotes.toString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Desc Hash</span>
          <span className="font-mono truncate max-w-[220px]">
            {proposal.description}
          </span>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <VoteButtons proposalId={proposal.id} onVoted={onChanged} />
        <button
          className="h-9 px-4 rounded-md border disabled:opacity-50"
          disabled={
            proposal.finalized || proposal.status !== 'ended' || isFinalizing
          }
          onClick={onFinalize}
        >
          {isFinalizing ? 'Finalizing...' : 'Finalize'}
        </button>
      </div>
    </div>
  )
}
