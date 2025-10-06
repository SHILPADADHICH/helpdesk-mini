"use client";

import axios from "axios";
import { useState } from "react";

export default function DirectAPITest() {
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string>("");

  const testDirectAPI = async () => {
    try {
      console.log("Testing direct axios call...");

      const response = await axios.post(
        "http://localhost:8000/api/auth/login",
        {
          email: "admin@mail.com",
          password: "admin123",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Direct API Response:", response);
      setResult(response.data as Record<string, unknown>);
      setError("");
    } catch (err: unknown) {
      console.error("Direct API Error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      setResult(null);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Direct API Test</h1>

      <button
        onClick={testDirectAPI}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        Test Direct Axios Call
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
