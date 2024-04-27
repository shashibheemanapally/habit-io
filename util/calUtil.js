export function todayDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  const dateString = `${year}${month}${day}`;
  return dateString;
}

export function formatDateToUserFriendly(yyyyMMdd) {
  // Parse the YYYYMMDD string into a Date object
  const year = yyyyMMdd.substring(0, 4);
  const month = yyyyMMdd.substring(4, 6) - 1; // Months are zero-based in JavaScript
  const day = yyyyMMdd.substring(6, 8);
  const date = new Date(year, month, day);

  // Define arrays for month names and day names
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Format the date as "DD Month, Day"
  const formattedDate =
    date.getDate() + " " + months[date.getMonth()] + ", " + days[date.getDay()];

  return formattedDate;
}

export function subtractNDays(yyyyMMdd, n) {
  // Parse the YYYYMMDD string into a Date object
  const year = yyyyMMdd.substring(0, 4);
  const month = yyyyMMdd.substring(4, 6) - 1; // Months are zero-based in JavaScript
  const day = yyyyMMdd.substring(6, 8);
  const date = new Date(year, month, day);

  // Subtract n days
  date.setDate(date.getDate() - n);

  // Format the new date as "YYYYMMDD" again
  const formattedDate =
    date.getFullYear() +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    ("0" + date.getDate()).slice(-2);

  return formattedDate;
}

export function isValidForWeekDays(
  givenDate,
  startDate,
  weekFrequency,
  weekDays
) {
  return true;
}

export default function isValidForFixedDays(
  givenDate,
  startDate,
  dayFrequency
) {
  return true;
}
