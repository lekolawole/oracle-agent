import { OracleResponse } from "@/interfaces/oracle-response";
import config from "@/environments/environment"
import { Message } from "@/components/chat/ai-pond";

export const OracleChatService = {
  /**
   * Primary chat endpoint
   * @param message The user's message
   * @param history Optional array of previous messages for context
   */
  async chat(message: string, history: Message[] = []): Promise<OracleResponse> {
    try {
      const response = await fetch(`${config?.apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // You can add an 'X-App-Version' or 'Authorization' token here later
        },
        body: JSON.stringify({ message, history }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        return { error: errorData.error, text: null }
        // throw new Error(errorData.error || 'The Oracle is silent.');
      }

      const data = await response.json();
      return { text: data.text };
    } catch (error: any) {

      return { 
        text: null, 
        error: error.message || error.error
      };
    }
  },
}