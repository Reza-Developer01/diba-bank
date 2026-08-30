import { initialRoles } from "../data/roles";

const wait = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms));

let roles = [...initialRoles];

export async function getRoles() {
  await wait();

  return [...roles];
}

export async function createRole(name) {
  await wait();

  const normalizedName = name.trim();

  if (!normalizedName) {
    throw new Error("نام نقش الزامی است.");
  }

  const exists = roles.some(
    (role) => role.trim().toLowerCase() === normalizedName.toLowerCase(),
  );

  if (exists) {
    throw new Error("این نقش قبلاً ثبت شده است.");
  }

  roles = [...roles, normalizedName];

  return normalizedName;
}
