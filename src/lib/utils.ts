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
