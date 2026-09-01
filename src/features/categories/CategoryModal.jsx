import React, { useEffect, useState } from "react";
import { Check, FolderPlus, Pencil, Plus, Trash2, X } from "lucide-react";

export function CategoryModal({
  open,
  categories,
  onClose,
  onSubmit,
  onEdit,
  onDelete,
}) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (!open) return;

    setName("");
    setError("");
    setSaving(false);
    setEditingId(null);
  }, [open]);

  if (!open) return null;

  const rootCategories = categories.filter(
    (category) => category.parent === null,
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    const normalizedName = name.trim();

    if (!normalizedName) {
      setError("نام دسته را وارد کنید.");
      return;
    }

    const duplicate = rootCategories.some(
      (category) =>
        category.id !== editingId &&
        category.name?.trim().toLowerCase() === normalizedName.toLowerCase(),
    );

    if (duplicate) {
      setError("این دسته قبلاً ثبت شده است.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      if (editingId) {
        await onEdit(editingId, normalizedName);
      } else {
        await onSubmit(normalizedName);
      }

      setName("");
      setEditingId(null);
    } catch (submitError) {
      setError(
        submitError?.message ||
          (editingId
            ? "ویرایش دسته با خطا مواجه شد."
            : "ثبت دسته با خطا مواجه شد."),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setName(category.name);
    setError("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName("");
    setError("");
  };

  const handleDelete = async (category) => {
    const hasChildren = categories.some((item) => item.parent === category.id);

    if (hasChildren) {
      alert(
        "این دسته دارای نقش است و تا زمانی که نقش‌های مربوط به آن حذف نشوند، امکان حذف دسته وجود ندارد.",
      );
      return;
    }

    const ok = window.confirm(`آیا از حذف «${category.name}» مطمئن هستید؟`);

    if (!ok) return;

    try {
      await onDelete(category.id);

      if (editingId === category.id) {
        handleCancelEdit();
      }
    } catch (error) {
      console.error("DELETE CATEGORY ERROR:", error);

      alert(error?.message || "حذف دسته با خطا مواجه شد.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#211c16]/35 p-3 backdrop-blur-[2px] sm:p-5">
      <div className="flex max-h-[92vh] w-full max-w-120 flex-col overflow-hidden rounded-2xl border border-[#e8e1d7] bg-white shadow-[0_24px_80px_rgba(43,33,22,0.18)]">
        {/* HEADER */}

        <div className="flex h-14 shrink-0 items-center justify-between border-b border-[#eeeae4] px-5 sm:h-16 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#f5ecdd] text-[#9a702b]">
              <FolderPlus className="size-4.25" />
            </div>

            <div>
              <h2 className="text-[14px] font-extrabold text-[#3f3932]">
                افزودن نقش
              </h2>

              <p className="mt-0.5 text-[9px] text-[#9b948a]">
                مدیریت نقش های مخاطبین
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg text-[#8e877f] hover:bg-[#f5f2ed]"
            aria-label="بستن"
          >
            <X className="size-4.5" />
          </button>
        </div>

        {/* CONTENT */}

        <div className="overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-[#eee8de] bg-[#fcfaf7] p-4"
          >
            <div className="mb-3">
              <span className="text-[11px] font-semibold text-[#4d463e]">
                {editingId ? "ویرایش نقش" : "افزودن نقش"}
              </span>
            </div>

            <label className="block">
              <span className="mb-2 block text-[11px] font-semibold text-[#4d463e]">
                نام نقش <b className="text-[#d65d55]">*</b>
              </span>

              <input
                autoFocus
                value={name}
                onChange={(event) => {
                  setName(event.target.value);

                  if (error) {
                    setError("");
                  }
                }}
                placeholder="مثلاً پیمانکاران"
                className="field-input"
              />
            </label>

            {error && (
              <p className="mt-2 text-[10px] font-medium text-[#c35a52]">
                {error}
              </p>
            )}

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={saving}
                  className="h-10 rounded-lg border border-[#e6e1d9] bg-white px-5 text-[11px] font-medium text-[#756e65] hover:bg-[#faf8f5] disabled:opacity-60"
                >
                  انصراف
                </button>
              )}

              <button
                type="submit"
                disabled={saving}
                className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#b48634] px-5 text-[11px] font-semibold text-white shadow-sm transition hover:bg-[#a4772b] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : editingId ? (
                  <Check className="size-4" />
                ) : (
                  <Plus className="size-4" />
                )}

                {saving
                  ? "در حال ذخیره..."
                  : editingId
                    ? "ذخیره تغییرات"
                    : "افزودن نقش"}
              </button>
            </div>
          </form>

          {/* EXISTING CATEGORIES */}

          <div className="mt-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-[10px] font-bold text-[#756d63]">
                نقش های موجود
              </div>

              <span className="rounded-full bg-[#eee8dd] px-2 py-0.5 text-[9px] font-semibold text-[#8b7757]">
                {rootCategories.length} مورد
              </span>
            </div>

            <div className="overflow-hidden rounded-xl border border-[#e9e5df] max-h-62.5 space-y-2 overflow-y-auto pl-1">
              {rootCategories.length === 0 ? (
                <div className="py-10 text-center text-[10px] text-[#9d968e]">
                  هنوز دسته‌ای ثبت نشده است.
                </div>
              ) : (
                <div className="divide-y divide-[#f1eee9]">
                  {rootCategories.map((category, index) => {
                    const hasChildren = categories.some(
                      (item) => item.parent === category.id,
                    );

                    return (
                      <div
                        key={category.id}
                        className="flex items-center gap-3 px-3 py-3 transition hover:bg-[#fdfcf9] sm:px-4"
                      >
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#f4eee4] text-[10px] font-bold text-[#8d6a30]">
                          {index + 1}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[11px] font-semibold text-[#413b34]">
                            {category.name}
                          </div>

                          {hasChildren && (
                            <div className="mt-0.5 text-[8px] text-[#aaa198]">
                              دارای نقش
                            </div>
                          )}
                        </div>

                        <div className="flex shrink-0 items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleEdit(category)}
                            className="flex size-8 items-center justify-center rounded-lg text-[#918980] transition hover:bg-[#f4f0e9] hover:text-[#6e5124]"
                            title="ویرایش"
                          >
                            <Pencil className="size-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(category)}
                            className="flex size-8 items-center justify-center rounded-lg text-[#a19a91] transition hover:bg-[#fbefed] hover:text-[#b45a52]"
                            title={
                              hasChildren ? "این دسته دارای نقش است" : "حذف"
                            }
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
