import { initialCategories } from "../data/categories";

const wait = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms));

let categories = [...initialCategories];

export async function getCategories() {
  await wait();

  return [...categories];
}

export async function createCategory(name) {
  await wait();

  const normalizedName = name.trim();

  if (!normalizedName) {
    throw new Error("نام دسته الزامی است.");
  }

  const exists = categories.some(
    (category) =>
      category.label.trim().toLowerCase() === normalizedName.toLowerCase(),
  );

  if (exists) {
    throw new Error("این دسته قبلاً ثبت شده است.");
  }

  const newCategory = {
    id: `category-${Date.now()}`,
    label: normalizedName,
    count: 0,
  };

  categories = [...categories, newCategory];

  return { ...newCategory };
}
