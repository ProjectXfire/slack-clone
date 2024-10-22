import type { Message } from "../models";
import { format } from "date-fns";

export function messsagesByDate(data: Message[]) {
  const groupedMessages = data.reduce(
    (groups, message) => {
      const date = new Date(message._creationTime);
      const dateKey = format(date, "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].unshift(message);
      return groups;
    },
    {} as Record<string, Message[]>
  );
  /*const reversedKeys = Object.keys(groupedMessages).reverse();
  const groupedMessagesReversed: Record<string, Message[]> = {};
  for (const key of reversedKeys) {
    groupedMessagesReversed[key] = groupedMessages[key];
  }*/
  return groupedMessages;
}
