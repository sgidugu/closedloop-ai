import type { AgentVersionDetail } from "@repo/api/src/types/agent";
import { withAnyAuth } from "@/lib/auth/with-any-auth";
import {
  badRequestResponse,
  errorResponse,
  notFoundResponse,
  successResponse,
} from "@/lib/route-utils";
import { agentsService } from "../../../service";

const DIGITS_ONLY = /^\d+$/;
// Need to see how to merge this code into Lookai studio 
export const GET = withAnyAuth<
  AgentVersionDetail,
  "/agents/[idOrSlug]/versions/[version]"
>(async ({ user }, _request, params) => {
  try {
    const { idOrSlug, version: versionStr } = await params;
    if (!DIGITS_ONLY.test(versionStr)) {
      return badRequestResponse("Version must be a positive integer");
      /* this is a temporary fix to avoid the error when the version is not a number. We should handle this better in the future. */
    }
    const version = Number(versionStr);
    if (version < 1) {
      return badRequestResponse("Version must be a positive integer");
    }

    const versionDetail = await agentsService.findVersion(
      idOrSlug,
      user.organizationId,
      version
    );

    if (!versionDetail) {
      return notFoundResponse("Agent version");
    }

    return successResponse(versionDetail);
  } catch (error) {
    return errorResponse("Failed to fetch agent version", error);
  }
});
