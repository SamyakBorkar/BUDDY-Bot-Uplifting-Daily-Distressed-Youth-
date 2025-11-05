import API from "./api";

// Register -> returns created user object
export const registerUser = async (payload) => {
  const res = await API.post("/users/register", payload);
  return res.data;
};

// Login -> returns user or token+user
export const loginUser = async (payload) => {
  const res = await API.post("/users/login", payload);
  return res.data;
};

// Log mood -> body: { userId, mood }
export const logMood = async (payload) => {
   const res = await API.post(`/users/${payload.userId}/mood`, { mood: payload.mood });
  // backend returns array or user object — handle both
  return res.data;
};

// Get mood logs by userId
export const getMoodLogs = async (userId) => {
   const res = await API.get(`/users/${userId}/mood`);
  return res.data;
};

// Placeholder for SOS (backend needs route /users/sos)
export const sendSOS = async (payload) => {
  const res = await API.post("/users/sos", payload);
  return res.data;
};
