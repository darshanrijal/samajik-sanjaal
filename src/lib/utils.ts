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

/**
 * Formats a number into a compact string representation.
 *
 * The function uses the `Intl.NumberFormat` API to format the number according to
 * the "en-US" locale with compact notation and a maximum of one fraction digit.
 * For example, 1234 might be formatted as "1.2K" and 56789 as "56.8K".
 *
 * @param {number} number - The number to be formatted.
 * @returns {string} The formatted number as a string.
 *
 * @example

 * // returns "1.2K"
 * formatNumber(1234);
 *
 * @example
 * // returns "56.8K"
 * formatNumber(56789);
 */
export function formatNumber(number: number): string {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(number);
}

/**
 * Formats a given date into a human-readable string with the full month, day, and year.
 *
 * The date will be returned in the format "Month Day, Year" (e.g., "November 2, 2024").
 * The input can be either a string (ISO 8601 date format) or a `Date` object.
 *
 * @param {string | Date} createdAt - The date when the profile was created. Can be a string or a `Date` object.
 * @returns {string} - A formatted date string in the form "Month Day, Year".
 *
 * @example
 * // Example usage with ISO string:
 * const result1 = getFormattedDate('2019-06-15T12:00:00Z');
 * console.log(result1); // "June 15, 2019"
 *
 * @example
 * // Example usage with Date object:
 * const result2 = getFormattedDate(new Date('2023-05-01T09:00:00Z'));
 * console.log(result2); // "May 1, 2023"
 */
export function getFormattedDate(createdAt: string | Date): string {
  const createdDate = new Date(createdAt);

  // Format date as "November 2, 2024"
  const formattedDate = createdDate.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return formattedDate;
}

/**
 * Converts a string into a URL-friendly "slug" format.
 *
 * The function performs the following transformations:
 * 1. Converts the input string to lowercase.
 * 2. Replaces all spaces with hyphens.
 * 3. Removes all characters that are not lowercase letters, numbers, or hyphens.
 *
 * @param {string} input - The input string to be transformed into a slug.
 * @returns {string}  The slugified version of the input string.
 *
 * @example
 * // returns 'john-doe'
 * slugUsername('John Doe!');
 *
 * @example
 * // returns 'hello-world-123'
 * slugUsername('Hello World 123!');
 */
export function slugUsername(input: string) {
  return input
    .toLocaleLowerCase()
    .replace(/ /g, "-")
    .replace(/[^a-z0-9-]/g, "");
}
