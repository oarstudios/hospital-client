import axios from "../../app/axiosinstance";

export const DEFAULT_BOOKING_SHEET_URL =
  "https://script.google.com/macros/s/AKfycbwvMAutv6LdpzjigmueH0mBXUXNBn0YYh7zhQgLl4BoJ6fldYbuFH_SSBqB4-5U44aw/exec";

/** Fetch the admin-configured booking sheet link from /others. */
export async function getBookingSheetUrl() {
  try {
    const res = await axios.get("/others");
    const payload = res?.data?.data ?? res?.data ?? {};
    const link = (payload.sheetLink || "").trim();
    return link || DEFAULT_BOOKING_SHEET_URL;
  } catch {
    return DEFAULT_BOOKING_SHEET_URL;
  }
}

/**
 * POST appointment payload to the configured Google Sheet / Apps Script URL.
 * @param {object} payload
 * @param {{ noCors?: boolean }} options - use noCors for contexts that cannot read the response (e.g. chatbot)
 */
export async function postToBookingSheet(payload, { noCors = false } = {}) {
  const sheetUrl = await getBookingSheetUrl();

  const response = await fetch(sheetUrl, {
    method: "POST",
    ...(noCors ? { mode: "no-cors" } : {}),
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });

  if (noCors) return { status: "success" };

  try {
    return await response.json();
  } catch {
    return response.ok ? { status: "success" } : { status: "error" };
  }
}
