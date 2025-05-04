// src/services/apiService.js

const API_BASE_URL = "http://localhost:5000"; // כתובת השרת שלך

export async function sendData(data) {
  const response = await fetch(`${API_BASE_URL}/api/data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  return result;
}
