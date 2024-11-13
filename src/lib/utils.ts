import moment from "moment";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitial(name: string): string | undefined {
  // Trim whitespace and check if the name is empty
  const trimmedName = name.trim();
  if (trimmedName.length === 0) {
    return ""; // Return an empty string for empty input
  }

  // Split the name into parts
  const nameParts = trimmedName.split(" ");

  // Return the initial of the first part (first name)
  return nameParts[0]?.charAt(0).toUpperCase();
}

export function extractHashtags(input: string): string[] {
  // Regular expression to match hashtags
  const hashtagPattern = /#\w+/g;

  // Use the regex to find all hashtags in the input string
  const matches = input.match(hashtagPattern);

  // Return the matches or an empty array if no hashtags were found
  return matches ? matches : [];
}

export function removeHashtags(input: string): string {
  // Regular expression to match hashtags
  const hashtagPattern = /#\w+/g;

  // Replace hashtags with an empty string
  const result = input.replace(hashtagPattern, "");

  // Return the modified string
  return result.trim(); // Trim to remove any leading or trailing whitespace
}

export function timeAgo(dateInput: string) {
  const dateTimeAgo = moment(new Date(dateInput)).fromNow();
  return dateTimeAgo;
}
