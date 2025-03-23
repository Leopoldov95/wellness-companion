// converts any date to YYYY-MM-DD format
export function formatDate(inputDate: string | Date): string {
  // Convert input to a Date object
  const date = new Date(inputDate);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format");
  }

  // Extract year, month, and day
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  // Return formatted date
  return `${year}-${month}-${day}`;
}

// Converts date to MM/DD
export function formatDateShort(inputDate: string | Date): string {
  const date = new Date(inputDate);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format");
  }

  return date.toLocaleString("en-US", { month: "short", day: "numeric" });
}

// converts date to YYYY-MM string for easy comparison
export function dateToYearMonth(date: Date): string {
  return date.toISOString().slice(0, 7);
}

// converts date to MMM/DD/YYY
export function dateToReadible(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}
