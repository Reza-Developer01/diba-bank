const API_URL = import.meta.env.VITE_API_URL;
// const API_URL = "http://127.0.0.1:8000/api";

export async function getHowMet() {
  const response = await fetch(`${API_URL}/how-mets/`);

  if (!response.ok) {
    throw new Error("دریافت نحوه آشنایی‌ها با خطا مواجه شد.");
  }

  const data = await response.json();

  return data.results ?? data;
}

export async function createHowMet(name) {
  const response = await fetch(`${API_URL}/how-mets/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
    }),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.detail ||
        result?.message ||
        "افزودن نحوه آشنایی با خطا مواجه شد.",
    );
  }

  return result;
}

export async function updateHowMet(id, name) {
  const response = await fetch(`${API_URL}/how-mets/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
    }),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.detail ||
        result?.message ||
        "ویرایش نحوه آشنایی با خطا مواجه شد.",
    );
  }

  return result;
}

export async function deleteHowMet(id) {
  const response = await fetch(`${API_URL}/how-mets/${id}/`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);

    throw new Error(
      result?.detail || result?.message || "حذف نحوه آشنایی با خطا مواجه شد.",
    );
  }
}
