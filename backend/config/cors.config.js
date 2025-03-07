export const corsOptions = {
  origin: ["https://disability-frontend.onrender.com"],
  methods: ["GET", "PUT", "POST", "DELETE", "PATCH"],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false, // Ensure the preflight response is sent
};
