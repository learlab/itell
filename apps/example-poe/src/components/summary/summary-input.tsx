"use client";

import { TextArea } from "@/components/client-components";
import { makeInputKey } from "@/lib/utils";
import { useEffect, useState } from "react";
import { cn, numOfWords } from "@itell/core/utils";
import { isProduction } from "@/lib/constants";
import { toast } from "sonner";
import { useQA } from "../context/qa-context";
import { isPageAfter } from "@/lib/location";

type Props = {
	pageSlug: string;
	isPageUnlocked: boolean;
	textAreaClassName?: string;
};

export const SummaryInput = ({
	pageSlug,
	isPageUnlocked,
	textAreaClassName,
}: Props) => {
	const [input, setInput] = useState("");
	const { chunks, currentChunk } = useQA();

	const canEdit = isPageUnlocked
		? true
		: chunks && currentChunk >= chunks.length - 1;

	useEffect(() => {
		setInput(localStorage.getItem(makeInputKey(pageSlug)) || "");
	}, []);

	return (
		<>
			<p className="text-sm font-light">Number of words: {numOfWords(input)}</p>
			<TextArea
				name="input"
				placeholder={"Write your summary here"}
				value={input}
				onValueChange={(val) => setInput(val)}
				rows={10}
				disabled={!canEdit}
				disabledText="Please finish the entire page first"
				className={cn(
					"resize-none rounded-md shadow-md p-4 w-full ",
					textAreaClassName,
				)}
				onPaste={(e) => {
					if (isProduction) {
						e.preventDefault();
						toast.warning("Copy & Paste is not allowed");
					}
				}}
			/>
		</>
	);
};
