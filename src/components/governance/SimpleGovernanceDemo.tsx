'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { modal } from '@/context'
import { useGovernanceService } from '@/hooks/useGovernanceService'

interface QuickTimes {
  start: Date
  end: Date
}

function getQuickTimes(): QuickTimes {
  const now = new Date()
  const start = new Date(now.getTime() + 10 * 1000) // +10s
  const end = new Date(now.getTime() + 15 * 60 * 1000) // +15m
  return { start, end }
}

export function SimpleGovernanceDemo() {
  const { address, isConnected } = useAccount()
  const { createProposal, vote, isLoading } = useGovernanceService()
  const [title, setTitle] = useState('Quick demo proposal')
  const [description, setDescription] = useState(
    'This is a minimal demo that routes fee via P2P Swap under the hood.'
  )
  const [proposalId, setProposalId] = useState<string>('')

  async function onQuickCreate() {
    if (!isConnected || !address) {
      modal.open()
      return
    }
    try {
      const { start, end } = getQuickTimes()
      const hash = await createProposal({ title, description, start, end })
      alert(`Submitted. Tx: ${hash}`)
    } catch (err: any) {
      alert(err?.message ?? String(err))
    }
  }

  async function onVote(voteYes: boolean) {
    if (!isConnected || !address) {
      modal.open()
      return
    }
    const idNum = Number(proposalId)
    if (!idNum || idNum <= 0) {
      alert('Enter a valid proposal id')
      return
    }
    try {
      const hash = await vote(idNum, voteYes)
      alert(`Vote sent. Tx: ${hash}`)
    } catch (err: any) {
      alert(err?.message ?? String(err))
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-xs text-gray-600">
        Connected: {isConnected ? address : 'No'} (fees route through P2P Swap
        automatically)
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-gray-700">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-gray-50/60 px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-200"
          placeholder="Title"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[100px] w-full rounded-xl border border-gray-200 bg-gray-50/60 px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-200"
          placeholder="Describe the proposal"
        />
      </div>

      <button
        onClick={onQuickCreate}
        disabled={isLoading}
        className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-xl bg-black px-5 py-2 text-sm font-medium text-white transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 disabled:pointer-events-none disabled:opacity-50"
      >
        {isLoading ? 'Submitting...' : 'Create Quick Proposal (+10m)'}
      </button>

      <div className="h-px bg-gray-200" />

      <div className="grid gap-2 sm:grid-cols-[160px_1fr] sm:items-center">
        <label className="text-sm font-medium text-gray-700">Proposal Id</label>
        <input
          value={proposalId}
          onChange={(e) => setProposalId(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-gray-50/60 px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-200"
          placeholder="e.g. 1"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onVote(true)}
          disabled={isLoading}
          className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 disabled:pointer-events-none disabled:opacity-50"
        >
          Vote Yes
        </button>
        <button
          onClick={() => onVote(false)}
          disabled={isLoading}
          className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 disabled:pointer-events-none disabled:opacity-50"
        >
          Vote No
        </button>
      </div>
    </div>
  )
}
