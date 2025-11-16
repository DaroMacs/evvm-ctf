'use client'

import { useState, FormEvent } from 'react'
import { useGovernanceService } from '../../hooks/useGovernanceService'

export interface CreateProposalFormProps {
  onCreated?: () => void
}

export function CreateProposalForm(props: CreateProposalFormProps) {
  const { createProposal, isLoading } = useGovernanceService()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [start, setStart] = useState<string>('')
  const [end, setEnd] = useState<string>('')

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    try {
      const startDate = new Date(start)
      const endDate = new Date(end)
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        alert('Invalid dates. Please choose valid start/end times.')
        return
      }
      const tx = await createProposal({
        title,
        description,
        start: startDate,
        end: endDate,
      })
      alert(`Proposal submitted\nTx: ${tx}`)
      setTitle('')
      setDescription('')
      setStart('')
      setEnd('')
      props.onCreated?.()
    } catch (err: any) {
      alert(`Error creating proposal\n${err?.message ?? String(err)}`)
    }
  }

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="grid gap-2">
        <label htmlFor="title" className="text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          id="title"
          className="w-full rounded-xl border border-gray-200 bg-gray-50/60 px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-200"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Enter a concise title"
        />
      </div>
      <div className="grid gap-2">
        <label
          htmlFor="description"
          className="text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          className="min-h-[140px] w-full rounded-xl border border-gray-200 bg-gray-50/60 px-3.5 py-3 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-200"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="Describe the proposal details, rationale, and expected outcome"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <label htmlFor="start" className="text-sm font-medium text-gray-700">
            Start time
          </label>
          <input
            id="start"
            type="datetime-local"
            className="w-full rounded-xl border border-gray-200 bg-gray-50/60 px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-200"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="end" className="text-sm font-medium text-gray-700">
            End time
          </label>
          <input
            id="end"
            type="datetime-local"
            className="w-full rounded-xl border border-gray-200 bg-gray-50/60 px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-200"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            required
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-xl bg-black px-5 py-2 text-sm font-medium text-white transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
      >
        {isLoading ? 'Submitting...' : 'Create Proposal'}
      </button>
    </form>
  )
}
