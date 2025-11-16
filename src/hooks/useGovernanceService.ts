/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useCallback, useState } from "react";
import { useAccount, useReadContract, useWriteContract, usePublicClient, useChainId, useSwitchChain } from "wagmi";
import { GOVERNANCE_SERVICE_ADDRESS, GOVERNANCE_SERVICE_ABI } from "../config/governance";

export interface ProposalOnChain {
	creator: `0x${string}`;
	description: string;
	startTime: bigint;
	endTime: bigint;
	finalized: boolean;
	yesVotes: bigint;
	noVotes: bigint;
}

export interface ProposalUI extends ProposalOnChain {
	id: number;
	status: "upcoming" | "active" | "ended" | "finalized";
}

interface CreateProposalParams {
	title: string;
	description: string;
	start: Date;
	end: Date;
}

function toUnixSeconds(date: Date): bigint {
	return BigInt(Math.floor(date.getTime() / 1000));
}

export function useGovernanceService() {
	const { address } = useAccount();
	const { writeContractAsync } = useWriteContract();
	const publicClient = usePublicClient();
	const currentChainId = useChainId();
	const { switchChainAsync } = useSwitchChain();

	const [isLoading, setIsLoading] = useState(false);

	const { data: proposalCount } = useReadContract({
		address: GOVERNANCE_SERVICE_ADDRESS,
		abi: GOVERNANCE_SERVICE_ABI,
		functionName: "proposalCount",
		args: [],
		query: { refetchInterval: 10_000 }
	});

	const getProposals = useCallback(async (): Promise<ProposalUI[]> => {
		const count = Number(proposalCount ?? 0n);
		if (count === 0) return [];

		if (!publicClient) return [];
		const reads: Promise<ProposalOnChain>[] = Array.from({ length: count }, async (_v, i) => {
			const id = i + 1;
			const data = await publicClient.readContract({
				address: GOVERNANCE_SERVICE_ADDRESS,
				abi: GOVERNANCE_SERVICE_ABI,
				functionName: "proposals",
				args: [BigInt(id)]
			});
			return data as ProposalOnChain;
		});

		const resolved = await Promise.all(reads);
		const now = BigInt(Math.floor(Date.now() / 1000));
		return resolved.map((p, idx) => {
			const id = idx + 1;
			let status: ProposalUI["status"] = "upcoming";
			if (p.finalized) status = "finalized";
			else if (now < p.startTime) status = "upcoming";
			else if (now <= p.endTime) status = "active";
			else status = "ended";
			return { ...p, id, status };
		});
	}, [proposalCount, publicClient]);

	const createProposal = useCallback(
		async (params: CreateProposalParams) => {
			if (!address) throw new Error("Wallet not connected");
			setIsLoading(true);
			try {
				if (currentChainId !== 11155111) {
					await switchChainAsync({ chainId: 11155111 });
				}

				const description = `${params.title}\n${params.description}`;
				const start = toUnixSeconds(params.start);
				const end = toUnixSeconds(params.end);

				const hash = await writeContractAsync({
					address: GOVERNANCE_SERVICE_ADDRESS,
					abi: GOVERNANCE_SERVICE_ABI,
					functionName: "createGovernanceProposal",
					args: [description, start, end],
					chainId: 11155111
				});
				return hash;
			} finally {
				setIsLoading(false);
			}
		},
		[address, writeContractAsync, currentChainId, switchChainAsync]
	);

	const vote = useCallback(
		async (proposalId: number, voteYes: boolean) => {
			if (!address) throw new Error("Wallet not connected");
			setIsLoading(true);
			try {
				if (currentChainId !== 11155111) {
					await switchChainAsync({ chainId: 11155111 });
				}

				const hash = await writeContractAsync({
					address: GOVERNANCE_SERVICE_ADDRESS,
					abi: GOVERNANCE_SERVICE_ABI,
					functionName: "voteOnGovernanceProposal",
					args: [BigInt(proposalId), voteYes],
					chainId: 11155111
				});
			 return hash;
			} finally {
				setIsLoading(false);
			}
		},
		[address, writeContractAsync, currentChainId, switchChainAsync]
	);

	const finalize = useCallback(
		async (proposalId: number) => {
			setIsLoading(true);
			try {
				const hash = await writeContractAsync({
					address: GOVERNANCE_SERVICE_ADDRESS,
					abi: GOVERNANCE_SERVICE_ABI,
					functionName: "finalizeGovernanceProposal",
					args: [BigInt(proposalId)]
				});
				return hash;
			} finally {
				setIsLoading(false);
			}
		},
		[writeContractAsync]
	);

	return {
		address,
		isLoading,
		createProposal,
		vote,
		finalize,
		getProposals
	};
}
