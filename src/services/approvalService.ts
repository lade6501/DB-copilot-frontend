import api from "../api/apiClient";

import type { ApprovalInfo } from "../types";

export async function getApproval(approvalId: string): Promise<ApprovalInfo> {
  const { data } = await api.get(`/approvals/my/${approvalId}`);

  return data;
}
