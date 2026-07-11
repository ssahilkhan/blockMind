import { transactionApi } from "@/services/transaction";
import { walletApi } from "@/services/wallet";
import { tokenApi } from "@/services/token";
import { eventsApi } from "@/services/events";
import type { AIContext, ContextPayload } from "../types";

export async function gatherContextPayloads(context: AIContext): Promise<ContextPayload[]> {
  const payloads: ContextPayload[] = [];

  if (context.transactionHash) {
    try {
      const trackResult = await transactionApi.track(context.transactionHash);
      payloads.push({
        label: "Transaction Status",
        data: JSON.stringify(trackResult, null, 2),
      });
    } catch {
      payloads.push({
        label: "Transaction",
        data: `Transaction ${context.transactionHash} could not be fetched.`,
      });
    }

    try {
      const events = await eventsApi.getReceiptEvents(context.transactionHash);
      payloads.push({
        label: "Transaction Events",
        data: JSON.stringify(events, null, 2),
      });
    } catch {
      // Events fetch failure is non-critical
    }
  }

  if (context.contractAddress) {
    try {
      const events = await eventsApi.searchEvents({ contract: context.contractAddress });
      payloads.push({
        label: "Contract Events",
        data: JSON.stringify(events, null, 2),
      });
    } catch {
      payloads.push({
        label: "Contract",
        data: `Contract at ${context.contractAddress} events could not be fetched.`,
      });
    }
  }

  if (context.walletAddress) {
    try {
      const details = await walletApi.getDetails(context.walletAddress);
      payloads.push({
        label: "Wallet Details",
        data: JSON.stringify(details, null, 2),
      });
    } catch {
      payloads.push({
        label: "Wallet",
        data: `Details for ${context.walletAddress} could not be fetched.`,
      });
    }
  }

  if (context.tokenAddress) {
    try {
      const metadata = await tokenApi.getMetadata(context.tokenAddress);
      payloads.push({
        label: "Token Metadata",
        data: JSON.stringify(metadata, null, 2),
      });
    } catch {
      payloads.push({
        label: "Token",
        data: `Token at ${context.tokenAddress} metadata could not be fetched.`,
      });
    }

    try {
      const standard = await tokenApi.detectStandard(context.tokenAddress);
      payloads.push({
        label: "Token Standard",
        data: JSON.stringify(standard, null, 2),
      });
    } catch {
      // Standard detection failure is non-critical
    }
  }

  if (context.type === "event" && context.blockNumber) {
    try {
      const blockEvents = await eventsApi.getBlockEvents(context.blockNumber);
      payloads.push({
        label: "Block Events",
        data: JSON.stringify(blockEvents, null, 2),
      });
    } catch {
      payloads.push({
        label: "Events",
        data: `Events for block ${context.blockNumber} could not be fetched.`,
      });
    }
  }

  if (payloads.length === 0) {
    payloads.push({
      label: "Context",
      data: "No blockchain data available for the current context.",
    });
  }

  return payloads;
}
