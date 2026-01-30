import axios from "axios";

const api = axios.create({
  baseURL: "https://backend-cooksetu-905060930493.us-central1.run.app/api",
});

export default api;
