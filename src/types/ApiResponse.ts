import { Message } from "@/model/User.model";
export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptionMessage?: boolean;
  messages?: Array<Message>;
  messageCount?: number;
}
