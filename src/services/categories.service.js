const API_URL = import.meta.env.VITE_API_URL;

export async function getCategories() {
  const response = await fetch(`${API_URL}/categories/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  console.log(data);

  if (!response.ok) {
    throw new Error("دریافت دسته‌ها با خطا مواجه شد.");
  }

  return data.results;
}

export async function createCategory(name) {
  const normalizedName = name.trim();

  if (!normalizedName) {
    throw new Error("نام دسته الزامی است.");
  }

  const response = await fetch(`${API_URL}/categories/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: normalizedName,
    }),
  });

  if (!response.ok) {
    let message = "ثبت دسته با خطا مواجه شد.";

    try {
      const data = await response.json();

      if (data?.detail) {
        message = data.detail;
      } else if (data?.name?.[0]) {
        message = data.name[0];
      }
    } catch {
      // اگر response قابل parse نبود
    }

    throw new Error(message);
  }

  return response.json();
}
