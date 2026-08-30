const API_URL = import.meta.env.VITE_API_URL;
// const API_URL = "http://127.0.0.1:8000/api";

export async function getHowMet() {
  const response = await fetch(`${API_URL}/how-mets/`);

  if (!response.ok) {
    throw new Error("دریافت نحوه آشنایی با خطا مواجه شد.");
  }

  const data = await response.json();

  return data.results ?? [];
}
