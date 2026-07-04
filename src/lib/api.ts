export const BACKEND_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";
export const API_BASE_URL = BACKEND_BASE_URL;
export const BACKEND_MISSING_MESSAGE = 'The backend API host appears to be missing or unreachable. Ensure VITE_API_URL is set to your backend host and the app is pointing to the same backend host.';
