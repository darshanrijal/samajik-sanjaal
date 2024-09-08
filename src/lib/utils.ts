import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns a human-readable relative time string based on the provided date.
 *
 * @param {Date} date - The date object to be compared with the current time.
 * @returns {string} - A relative time string such as "5 minutes ago", "2 weeks ago", "November 1", or "2006".
 *
 * @example
 * const pastDate = new Date('2023-11-01T12:00:00Z');
 * console.log(getRelativeTime(pastDate)); // Outputs something like "November 1"
 */
export function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 10) {
    return "Just now";
  }

  if (diffInSeconds < 60) {
    return `${Math.floor(diffInSeconds)} second${diffInSeconds === 1 ? "" : "s"} ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks === 1 ? "" : "s"} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths === 1 ? "" : "s"} ago`;
  }

  const year = date.getFullYear();
  const currentYear = now.getFullYear();
  if (year === currentYear) {
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  }

  return year.toString();
}
