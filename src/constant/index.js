let URL;

if (import.meta.env.VITE_API_URL) {
  // Prefer the value from the .env file (see .env.example)
  URL = import.meta.env.VITE_API_URL;
} else if (import.meta.env.MODE === "production") {
  // Fallback: production URL
  URL = "https://eldt-project-bcea9fba4bba.herokuapp.com";
} else {
  // Fallback: localhost URL for development
  URL = "http://localhost:5000";
}

export { URL };
// export const URL = "http://localhost:5000";
export const STATUS = {
  COMPLETED: "COMPLETED",
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  BACKLOG: "BACKLOG",
  TESTING: "TESTING",
};
