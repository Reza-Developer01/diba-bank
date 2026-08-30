const API_URL = import.meta.env.VITE_API_URL;
// const API_URL = "http://127.0.0.1:8000/api";

export async function getContacts() {
  const response = await fetch(`${API_URL}/contacts/`);

  if (!response.ok) {
    throw new Error("دریافت مخاطبین با خطا مواجه شد.");
  }

  const data = await response.json();
  console.log(data);

  return data.results ?? [];
}

export async function createContact(data) {
  const payload = {
    fullname: data.name,
    email: data.email ?? "",
    address: data.address ?? "",
    categories: data.categoryId ? [Number(data.categoryId)] : [],
    how_met: data.how_met ? Number(data.how_met) : null,
    description: data.description ?? "",
    behavior: data.behavior,
    phones: (data.phones ?? [])
      .filter((phone) => phone.number?.trim())
      .map((phone) => ({
        id: phone.id,
        category: phone.type,
        phone: phone.number,
      })),
  };

  console.log("CREATE CONTACT PAYLOAD:", payload);

  const response = await fetch(`${API_URL}/contacts/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    console.error("CREATE CONTACT ERROR:", result);

    throw new Error(
      result?.detail || result?.message || "ایجاد مخاطب با خطا مواجه شد.",
    );
  }

  return result;
}

export async function updateContact(id, data) {
  const payload = {
    fullname: data.name,
    email: data.email ?? "",
    address: data.address ?? "",

    categories: data.categoryId ? [Number(data.categoryId)] : [],

    how_met: data.how_met ? Number(data.how_met) : null,

    description: data.description ?? "",
    behavior: data.behavior,

    phones: (data.phones ?? [])
      .filter((phone) => phone.number?.trim())
      .map((phone) => ({
        id: phone.id,
        category: phone.type,
        phone: phone.number,
      })),
  };

  const response = await fetch(`${API_URL}/contacts/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    console.error("UPDATE CONTACT ERROR:", result);

    throw new Error(
      result?.detail || result?.message || "ویرایش مخاطب با خطا مواجه شد.",
    );
  }

  return result;
}

export async function deleteContact(id) {
  const response = await fetch(`${API_URL}/contacts/${id}/`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);

    throw new Error(
      result?.detail || result?.message || "حذف مخاطب با خطا مواجه شد.",
    );
  }
}
