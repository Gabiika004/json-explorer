// Típus: Visszatérési objektum a frontend számára
export type ChatSummary = {
  id: string;
  date: string;
  agentEmails: string[];
  content: {
    sender: string;
    text: string;
  }[];
};
