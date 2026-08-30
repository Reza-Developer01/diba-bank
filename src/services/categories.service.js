const API_URL = import.meta.env.VITE_API_URL;

export async function getCategories() {
  const response = await fetch(`${API_URL}/categories/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error("پاسخ سرور معتبر نیست.");
  }

  if (!response.ok) {
    throw new Error(data?.detail || "دریافت دسته‌ها با خطا مواجه شد.");
  }

  return data.results || [];
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

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error("پاسخ سرور معتبر نیست.");
  }

  if (!response.ok) {
    let message = "ثبت دسته با خطا مواجه شد.";

    if (data?.detail) {
      message = data.detail;
    } else if (data?.name?.[0]) {
      message = data.name[0];
    }

    throw new Error(message);
  }

  return data;
}

export async function createRole(name, parentId) {
  const normalizedName = name.trim();

  if (!normalizedName) {
    throw new Error("نام نقش الزامی است.");
  }

  if (!parentId) {
    throw new Error("دسته والد نقش را انتخاب کنید.");
  }

  const response = await fetch(`${API_URL}/categories/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: normalizedName,
      parent: parentId,
    }),
  });

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error("پاسخ سرور معتبر نیست.");
  }

  if (!response.ok) {
    let message = "ثبت نقش با خطا مواجه شد.";

    if (data?.detail) {
      message = data.detail;
    } else if (data?.name?.[0]) {
      message = data.name[0];
    } else if (data?.parent?.[0]) {
      message = data.parent[0];
    }

    throw new Error(message);
  }

  return data;
}
