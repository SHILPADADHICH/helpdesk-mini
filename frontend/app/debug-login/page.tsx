"use client";

import { useState } from "react";
import { authApi } from "@/lib/api";

export default function DebugLogin() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>("");

  const testLogin = async () => {
    try {
      console.log("Testing login API...");
      const response = await authApi.login({
        email: "admin@mail.com",
        password: "admin123",
      });
      console.log("API Response:", response);
      setResult(response);
      setError("");
    } catch (err: any) {
      console.error("API Error:", err);
      setError(err.message || "Unknown error");
      setResult(null);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Debug Login Test</h1>

      <button
        onClick={testLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Test Login API
      </button>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <strong>Success:</strong>
          <pre className="mt-2 text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
