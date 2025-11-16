"use client";

import { useGovernanceService } from "../../hooks/useGovernanceService";
import { useState } from "react";

export interface VoteButtonsProps {
	proposalId: number;
	onVoted?: () => void;
}

export function VoteButtons(props: VoteButtonsProps) {
	const { vote } = useGovernanceService();
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	async function onVote(voteYes: boolean) {
		setIsSubmitting(true);
		try {
			const tx = await vote(props.proposalId, voteYes);
			alert(`${voteYes ? "Voted YES" : "Voted NO"}\nTx: ${tx}`);
			props.onVoted?.();
		} catch (err: any) {
			alert(`Vote failed\n${err?.message ?? String(err)}`);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<div className="flex gap-2">
			<button className="h-9 px-4 rounded-md bg-green-600 text-white disabled:opacity-50" disabled={isSubmitting} onClick={() => onVote(true)}>Yes</button>
			<button className="h-9 px-4 rounded-md bg-gray-200 text-gray-900 disabled:opacity-50" disabled={isSubmitting} onClick={() => onVote(false)}>No</button>
		</div>
	);
}
