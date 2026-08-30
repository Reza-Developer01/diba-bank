import React, { useEffect, useState } from "react";
import { Plus, User, X } from "lucide-react";

export function RoleModal({ open, roles, categories = [], onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [parentId, setParentId] = useState("");

  useEffect(() => {
    if (!open) return;

    setName("");
    setParentId("");
    setError("");
    setSaving(false);
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();

    const normalizedName = name.trim();

    if (!normalizedName) {
      setError("نام نقش را وارد کنید.");
      return;
    }

    if (!parentId) {
      setError("دسته والد را انتخاب کنید.");
      return;
    }

    const duplicate = roles.some(
      (role) => role.name.trim().toLowerCase() === normalizedName.toLowerCase(),
    );

    if (duplicate) {
      setError("این نقش قبلاً ثبت شده است.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await onSubmit(normalizedName, Number(parentId));
      setName("");
    } catch (submitError) {
      setError(submitError?.message || "ثبت نقش با خطا مواجه شد.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#211c16]/35 p-3 backdrop-blur-[2px] sm:p-5">
      <div className="w-full max-w-120 overflow-hidden rounded-2xl border border-[#e8e1d7] bg-white shadow-[0_24px_80px_rgba(43,33,22,0.18)]">
        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b border-[#eeeae4] px-5 sm:h-16 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#f5ecdd] text-[#9a702b]">
              <User className="size-4.25" />
            </div>

            <h2 className="text-[14px] font-extrabold text-[#3f3932]">
              افزودن نقش
            </h2>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 py-5 sm:px-6 sm:py-6">
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
              placeholder="مثلاً ناظر پروژه"
              className="field-input"
            />
          </label>

          <label className="mt-4 block">
            <span className="mb-2 block text-[11px] font-semibold text-[#4d463e]">
              دسته والد <b className="text-[#d65d55]">*</b>
            </span>

            <select
              value={parentId}
              onChange={(event) => {
                setParentId(event.target.value);

                if (error) {
                  setError("");
                }
              }}
              className="field-input"
            >
              <option value="">انتخاب دسته</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          {error && (
            <p className="mt-2 text-[10px] font-medium text-[#c35a52]">
              {error}
            </p>
          )}

          {/* Existing roles */}
          <div className="mt-5 rounded-xl border border-[#eee8de] bg-[#fcfaf7] p-4">
            <div className="mb-3 text-[10px] font-bold text-[#756d63]">
              نقش‌های موجود
            </div>

            <div className="flex flex-wrap gap-2">
              {roles.map((role) => (
                <span
                  key={role.id}
                  className="rounded-md border border-[#eadfcd] bg-white px-2.5 py-1.5 text-[10px] text-[#776c5d]"
                >
                  {role.name}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-2 border-t border-[#eeeae4] pt-5">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-lg border border-[#e6e1d9] bg-white px-5 text-xs font-medium text-[#756e65] hover:bg-[#faf8f5]"
            >
              انصراف
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex h-10 items-center gap-2 rounded-lg bg-[#b48634] px-5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#a4772b] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <Plus className="size-4" />
              )}

              {saving ? "در حال ثبت..." : "افزودن نقش"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
