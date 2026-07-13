import { useEffect } from "react";

import { getApproval } from "../services/approvalService";

import type { ApprovalInfo } from "../types";

interface Props {
  approvalId?: string;

  enabled: boolean;

  onCompleted: (approval: ApprovalInfo) => void;
}

const POLLING_INTERVAL = 5000;

export function useApprovalPolling({
  approvalId,
  enabled,
  onCompleted,
}: Props) {
  useEffect(() => {
    if (!enabled || !approvalId) {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const approval = await getApproval(approvalId);

        if (
          approval.status === "EXECUTED" ||
          approval.status === "FAILED" ||
          approval.status === "REJECTED"
        ) {
          clearInterval(interval);

          onCompleted(approval);
        }
      } catch (err) {
        console.error("Approval polling failed", err);
      }
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [approvalId, enabled, onCompleted]);
}
