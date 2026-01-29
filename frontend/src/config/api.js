import axios from "axios";

export const API_BASE_URL = "http://127.0.0.1:8080";

export const FEATURES = {
  ENABLE_OTP: false,
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
