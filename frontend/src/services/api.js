import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  signup: (data) => api.post("/api/auth/signup", data).then((r) => r.data),
  login: (data) => api.post("/api/auth/login", data).then((r) => r.data),
  googleLoginUrl: () => `${API_URL}/api/auth/google/login`,
};

export const roomAPI = {
  create: (data) => api.post("/api/rooms", data).then((r) => r.data),
  list: () => api.get("/api/rooms").then((r) => r.data),
  get: (roomId) => api.get(`/api/rooms/${roomId}`).then((r) => r.data),
  join: (roomId, data) =>
    api.post(`/api/rooms/${roomId}/join`, data).then((r) => r.data),
  leave: (roomId) => api.post(`/api/rooms/${roomId}/leave`).then((r) => r.data),
  end: (roomId) => api.post(`/api/rooms/${roomId}/end`).then((r) => r.data),
};

export const participantAPI = {
  list: (roomId) =>
    api.get(`/api/participants/room/${roomId}`).then((r) => r.data),
  stats: (roomId) =>
    api.get(`/api/participants/room/${roomId}/stats`).then((r) => r.data),
  mute: (roomId, userId) =>
    api
      .post(`/api/participants/room/${roomId}/mute/${userId}`)
      .then((r) => r.data),
  remove: (roomId, userId) =>
    api
      .post(`/api/participants/room/${roomId}/remove/${userId}`)
      .then((r) => r.data),
};

export const aiAPI = {
  chat: (data) => api.post("/api/ai/chat", data).then((r) => r.data),
  summarize: (data) => api.post("/api/ai/summarize", data).then((r) => r.data),
};

export const recordingAPI = {
  start: (roomId) =>
    api.post(`/api/recordings/${roomId}/start`).then((r) => r.data),
  stop: (egressId) =>
    api.post(`/api/recordings/${egressId}/stop`).then((r) => r.data),
  list: (roomId) =>
    api.get(`/api/recordings/room/${roomId}`).then((r) => r.data),
};

export const fileAPI = {
  list: (roomId) => api.get(`/api/files/room/${roomId}`).then((r) => r.data),
  delete: (fileId) => api.delete(`/api/files/${fileId}`).then((r) => r.data),
};

export default api;
