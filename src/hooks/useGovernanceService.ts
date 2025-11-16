/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useCallback, useMemo, useState } from "react";
import { useAccount, useReadContract, useWalletClient, useWriteContract, usePublicClient } from "wagmi";
import { GOVERNANCE_SERVICE_ADDRESS, GOVERNANCE_SERVICE_ABI } from "../config/governance";
import { Hex, keccak256, toHex, toBytes } from "viem";

export interface ProposalOnChain {
	creator: `0x${string}`;
	descriptionHash: Hex;
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
	priorityFeeWei?: bigint;
	priorityFlag?: boolean;
}

interface VoteParams {
	proposalId: number;
	voteYes: boolean;
	priorityFeeWei?: bigint;
	priorityFlag?: boolean;
}

function computeDescriptionHash(input: string): Hex {
	// pseudo-IPFS: keccak256(UTF-8 bytes of description)
	return keccak256(toBytes(input));
}

function toUnixSeconds(date: Date): bigint {
	return BigInt(Math.floor(date.getTime() / 1000));
}

function buildCreateMessage(user: string, nonce: bigint, descriptionHash: Hex, start: bigint, end: bigint): string {
	return `GovernanceService:Proposal(${user},${nonce.toString()},${descriptionHash},${start.toString()},${end.toString()})`;
}

function buildVoteMessage(user: string, nonce: bigint, proposalId: number, voteYes: boolean): string {
	return `GovernanceService:Vote(${user},${nonce.toString()},${proposalId},${voteYes})`;
}

export function useGovernanceService() {
	const { address } = useAccount();
	const { data: walletClient } = useWalletClient();
	const { writeContractAsync } = useWriteContract();
	const publicClient = usePublicClient();

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
		// read using public client in a loop
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
			if (!address || !walletClient) throw new Error("Wallet not connected");
			setIsLoading(true);
			try {
				const descriptionHash = computeDescriptionHash(`${params.title}\n${params.description}`);
				const start = toUnixSeconds(params.start);
				const end = toUnixSeconds(params.end);
				const nonce = BigInt(Date.now()); // EVVM nonce
				const priorityFee = params.priorityFeeWei ?? 0n;
				const priorityFlag = params.priorityFlag ?? false;

				const message = buildCreateMessage(address, nonce, descriptionHash, start, end);
				const signature = await walletClient.signMessage({
					account: address,
					message: { raw: toHex(message) }
				});

				const hash = await writeContractAsync({
					address: GOVERNANCE_SERVICE_ADDRESS,
					abi: GOVERNANCE_SERVICE_ABI,
					functionName: "createProposal",
					args: [address, descriptionHash, nonce, start, end, priorityFee, priorityFlag, signature as Hex]
				});
				return hash;
			} finally {
				setIsLoading(false);
			}
		},
		[address, walletClient, writeContractAsync]
	);

	const vote = useCallback(
		async (proposalId: number, voteYes: boolean, priorityFeeWei?: bigint, priorityFlag?: boolean) => {
			if (!address || !walletClient) throw new Error("Wallet not connected");
			setIsLoading(true);
			try {
				const nonce = BigInt(Date.now());
				const priorityFee = priorityFeeWei ?? 0n;
				const priority = priorityFlag ?? false;

				const message = buildVoteMessage(address, nonce, proposalId, voteYes);
				const signature = await walletClient.signMessage({
					account: address,
					message: { raw: toHex(message) }
				});

				const hash = await writeContractAsync({
					address: GOVERNANCE_SERVICE_ADDRESS,
					abi: GOVERNANCE_SERVICE_ABI,
					functionName: "vote",
					args: [address, BigInt(proposalId), voteYes, nonce, priorityFee, priority, signature as Hex]
				});
			 return hash;
			} finally {
				setIsLoading(false);
			}
		},
		[address, walletClient, writeContractAsync]
	);

	const finalize = useCallback(
		async (proposalId: number) => {
			setIsLoading(true);
			try {
				const hash = await writeContractAsync({
					address: GOVERNANCE_SERVICE_ADDRESS,
					abi: GOVERNANCE_SERVICE_ABI,
					functionName: "finalizeProposal",
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
