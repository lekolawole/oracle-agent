/**
 * Oracle API Client
 * Centralized networking for the Oracle environment.
 */

import { OracleChatService } from "@/services/chat-service";
import { OracleResponse } from "./oracle-response";
import { Message } from "@/components/chat/ai-pond";

export const oracleApi = {
  async chat(message: string, history: Message[] = []): Promise<OracleResponse> {
  
    return OracleChatService.chat(message, history);
  }
};