"use client";

import { useEffect, useState } from "react";
import { useGovernanceService, ProposalUI } from "../../hooks/useGovernanceService";
import { ProposalCard } from "./ProposalCard";

export interface ProposalListProps {
	reloadKey?: number;
}

export function ProposalList(_props: ProposalListProps) {
	const { getProposals } = useGovernanceService();
	const [proposals, setProposals] = useState<ProposalUI[]>([]);

	async function load() {
		const list = await getProposals();
		setProposals(list);
	}

	useEffect(() => {
		load();
		// brief poll while on page
		const id = setInterval(load, 15000);
		return () => clearInterval(id);
	}, []);

	return (
		<div className="grid gap-4">
			{proposals.length === 0 ? (
				<p className="text-sm text-muted-foreground">No proposals yet.</p>
			) : (
				proposals.map(p => (
					<ProposalCard key={p.id} proposal={p} onChanged={load} />
				))
			)}
		</div>
	);
}
