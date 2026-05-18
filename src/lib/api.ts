export const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "") || "http://localhost:3000";
export const API_BASE_URL = BACKEND_BASE_URL;
export const BACKEND_MISSING_MESSAGE = `The backend API host appears to be missing or unreachable. Start the server at ${BACKEND_BASE_URL} and make sure the app is pointing to the same backend host.`;
