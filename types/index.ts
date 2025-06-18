// Típus: Visszatérési objektum a frontend számára
export interface ChatSummary {
  id: string;
  date: string;
  agentEmails: string[];
  customerEmail?: string;
  customerName?: string;
  timestamp?: string;
  content: {
    sender: string;
    text: string;
  }[];
}
