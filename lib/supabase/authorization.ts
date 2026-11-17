import "server-only";

const allowedPanelEmails = (process.env.PANEL_ALLOWED_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export function isAllowedPanelEmail(email: unknown): email is string {
  return (
    typeof email === "string" &&
    allowedPanelEmails.includes(email.trim().toLowerCase())
  );
}
