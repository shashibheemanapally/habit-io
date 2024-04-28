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
  const startingSunday = getPreviousSunday(startDate);
  const weeknumber = Math.floor(
    getNumberOfDaysBetween(startingSunday, givenDate) / 7
  );
  const currentWeekEligible = weeknumber % weekFrequency === 0;
  const daysArray = weekDays.split(",");
  const currentDayEligible = daysArray.includes(
    getDayNumberOfWeek(givenDate).toString()
  );
  return currentWeekEligible && currentDayEligible;
}

function getPreviousSunday(dateString) {
  // Parse the input date string into a Date object
  const date = new Date(
    dateString.substring(0, 4),
    parseInt(dateString.substring(4, 6)) - 1, // Months are 0-indexed in JavaScript
    dateString.substring(6, 8)
  );

  // Calculate the day of the week (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
  const dayOfWeek = date.getDay();

  // Calculate the number of days to subtract to get to the previous Sunday
  const daysToSubtract = (dayOfWeek + 7 - 0) % 7; // Adding 7 and taking modulo ensures positive result

  // Subtract the days to get the date of the previous Sunday
  const previousSunday = new Date(
    date.getTime() - daysToSubtract * 24 * 60 * 60 * 1000
  ); // Convert days to milliseconds

  // Get the year, month, and day of the previous Sunday
  const year = previousSunday.getFullYear();
  const month = String(previousSunday.getMonth() + 1).padStart(2, "0"); // Add leading zero if needed
  const day = String(previousSunday.getDate()).padStart(2, "0"); // Add leading zero if needed

  // Construct the date string in the format YYYYMMDD
  const previousSundayString = `${year}${month}${day}`;

  return previousSundayString;
}

export function isValidForFixedDays(givenDate, startDate, dayFrequency) {
  return getNumberOfDaysBetween(startDate, givenDate) % dayFrequency === 0;
}

function getNumberOfDaysBetween(startDateStr, endDateStr) {
  // Convert strings to Date objects
  const startDate = new Date(
    parseInt(startDateStr.substring(0, 4)), // Year
    parseInt(startDateStr.substring(4, 6)) - 1, // Month (zero-based index)
    parseInt(startDateStr.substring(6, 8)) // Day
  );

  const endDate = new Date(
    parseInt(endDateStr.substring(0, 4)), // Year
    parseInt(endDateStr.substring(4, 6)) - 1, // Month (zero-based index)
    parseInt(endDateStr.substring(6, 8)) // Day
  );

  // Calculate the difference in milliseconds
  const differenceMs = endDate - startDate;

  // Convert milliseconds to days
  const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));

  return differenceDays;
}

function getDayNumberOfWeek(dateString) {
  // Parse the input date string into a Date object
  const date = new Date(
    dateString.substring(0, 4),
    parseInt(dateString.substring(4, 6)) - 1, // Months are 0-indexed in JavaScript
    dateString.substring(6, 8)
  );

  // Get the day of the week (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
  const dayOfWeek = date.getDay();

  return dayOfWeek;
}
