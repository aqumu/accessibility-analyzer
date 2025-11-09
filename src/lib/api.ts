"use client";

import axios from "axios";
import { supabase } from "./supabaseClient.ts";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 5000,
  withCredentials: true,
});

// Add a request interceptor to automatically attach Supabase JWT
api.interceptors.request.use(async (config) => {
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;

  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

export default api;
