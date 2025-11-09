"use client";

import axios from "axios";
import { supabase } from "./supabaseClient.ts";

const api = axios.create({
  baseURL: "https://hq3jpig5r6b6.share.zrok.io/api",
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

  // Add Zrok bypass header
  if (config.headers) {
    config.headers["skip_zrok_interstitial"] = "1";
  }

  return config;
});

export default api;
