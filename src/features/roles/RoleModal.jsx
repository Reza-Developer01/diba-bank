import React, { useEffect, useState } from "react";
import { Check, Pencil, Plus, Trash2, User, X } from "lucide-react";

export function RoleModal({
  open,
  roles,
  categories = [],
  onClose,
  onSubmit,
  onUpdate,
  onDelete,
}) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [parentId, setParentId] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (!open) return;

    setName("");
    setParentId("");
    setError("");
    setSaving(false);
    setEditingId(null);
    setDeletingId(null);
  }, [open]);

  if (!open) return null;

  const resetForm = () => {
    setName("");
    setParentId("");
    setError("");
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const normalizedName = name.trim();

    if (!normalizedName) {
      setError("نام دسته را وارد کنید.");
      return;
    }

    if (!parentId) {
      setError("دسته والد را انتخاب کنید.");
      return;
    }

    const duplicate = roles.some(
      (role) =>
        role.id !== editingId &&
        role.name.trim().toLowerCase() === normalizedName.toLowerCase(),
    );

    if (duplicate) {
      setError("این نقش قبلاً ثبت شده است.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      if (editingId) {
        await onUpdate(editingId, normalizedName, Number(parentId));
      } else {
        await onSubmit(normalizedName, Number(parentId));
      }

      resetForm();
    } catch (submitError) {
      setError(submitError?.message || "ذخیره نقش با خطا مواجه شد.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (role) => {
    setEditingId(role.id);
    setName(role.name);
    setParentId(String(role.parent));
    setError("");
  };

  const handleDelete = async (role) => {
    const ok = window.confirm(`آیا از حذف نقش «${role.name}» مطمئن هستید؟`);

    if (!ok) return;

    try {
      setDeletingId(role.id);
      setError("");

      await onDelete(role.id);

      if (editingId === role.id) {
        resetForm();
      }
    } catch (deleteError) {
      setError(deleteError?.message || "حذف نقش با خطا مواجه شد.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#211c16]/35 p-3 backdrop-blur-[2px] sm:p-5">
      <div className="w-full max-w-120 overflow-hidden rounded-2xl border border-[#e8e1d7] bg-white shadow-[0_24px_80px_rgba(43,33,22,0.18)]">
        {/* HEADER */}

        <div className="flex h-14 items-center justify-between border-b border-[#eeeae4] px-5 sm:h-16 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#f5ecdd] text-[#9a702b]">
              <User className="size-4.25" />
            </div>

            <h2 className="text-[14px] font-extrabold text-[#3f3932]">
              مدیریت دسته
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg text-[#8e877f] hover:bg-[#f5f2ed]"
          >
            <X className="size-4.5" />
          </button>
        </div>

        {/* FORM */}

        <form onSubmit={handleSubmit} className="px-5 py-5 sm:px-6 sm:py-6">
          <label className="mb-4 block">
            <span className="mb-2 block text-[11px] font-semibold text-[#4d463e]">
              انتخاب نقش <b className="text-[#d65d55]">*</b>
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
              <option value="">ابتدا نقش رو انتخاب کنید</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-[11px] font-semibold text-[#4d463e]">
              نام دسته <b className="text-[#d65d55]">*</b>
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

          {error && (
            <p className="mt-2 text-[10px] font-medium text-[#c35a52]">
              {error}
            </p>
          )}

          {/* EXISTING ROLES */}

          <div className="mt-5 rounded-xl border border-[#eee8de] bg-[#fcfaf7] p-4">
            <div className="mb-3 text-[10px] font-bold text-[#756d63]">
              دسته های موجود
            </div>

            <div className="max-h-62.5 space-y-2 overflow-y-auto pl-1">
              {roles.length === 0 ? (
                <div className="py-4 text-center text-[10px] text-[#9d968e]">
                  هنوز دسته ای ثبت نشده است.
                </div>
              ) : (
                roles.map((role) => (
                  <div
                    key={role.id}
                    className="flex items-center gap-2 rounded-lg border border-[#eadfcd] bg-white px-2.5 py-2"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[10px] font-semibold text-[#776c5d]">
                        {role.name}
                      </div>

                      <div className="mt-0.5 text-[9px] text-[#aaa198]">
                        {categories.find(
                          (category) =>
                            String(category.id) === String(role.parent),
                        )?.name || "—"}
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleEdit(role)}
                        disabled={deletingId === role.id}
                        className="flex size-7 items-center justify-center rounded-md text-[#918980] transition hover:bg-[#f4f0e9] hover:text-[#6e5124] disabled:opacity-40"
                        title="ویرایش"
                      >
                        <Pencil className="size-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(role)}
                        disabled={deletingId === role.id}
                        className="flex size-7 items-center justify-center rounded-md text-[#a19a91] transition hover:bg-[#fbefed] hover:text-[#b45a52] disabled:cursor-not-allowed disabled:opacity-40"
                        title="حذف"
                      >
                        {deletingId === role.id ? (
                          <span className="size-3.5 animate-spin rounded-full border-2 border-[#d6cfc5] border-t-[#b45a52]" />
                        ) : (
                          <Trash2 className="size-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ACTIONS */}

          <div className="mt-6 flex items-center justify-end gap-2 border-t border-[#eeeae4] pt-5">
            <button
              type="button"
              onClick={editingId ? resetForm : onClose}
              className="h-10 rounded-lg border border-[#e6e1d9] bg-white px-5 text-xs font-medium text-[#756e65] hover:bg-[#faf8f5]"
            >
              {editingId ? "انصراف" : "بستن"}
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex h-10 items-center gap-2 rounded-lg bg-[#b48634] px-5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#a4772b] disabled:cursor-not-allowed disabled:opacity-60"
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
                  : "افزودن دسته"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
