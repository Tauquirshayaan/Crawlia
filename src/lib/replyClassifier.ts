/**
 * @deprecated Use `classifyReplyIntent` from "@/lib/llm" directly.
 *
 * This file is kept as a re-export shim so existing imports don't break
 * while the codebase migrates to the consolidated llm.ts module.
 */
export { classifyReplyIntent, type ReplyIntent, type ReplyClassification } from './llm';
