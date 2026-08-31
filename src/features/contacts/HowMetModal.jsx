import React, { useEffect, useState } from "react";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";

import {
  getHowMet,
  createHowMet,
  updateHowMet,
  deleteHowMet,
} from "../../services/howMet.service";

export function HowMetModal({ open, onClose, onHowMetChange }) {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    loadHowMet();
  }, [open]);

  const loadHowMet = async () => {
    setLoading(true);

    try {
      const data = await getHowMet();
      setItems(data);
    } catch (error) {
      console.error("GET HOW MET ERROR:", error);
      alert(error.message || "دریافت نحوه آشنایی‌ها با خطا مواجه شد.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const value = name.trim();

    if (!value) {
      alert("لطفاً نحوه آشنایی را وارد کنید.");
      return;
    }

    setSaving(true);

    try {
      if (editingId) {
        await updateHowMet(editingId, value);

        window.location.reload();
        return;
      }

      await createHowMet(value);

      await loadHowMet();

      resetForm();
    } catch (error) {
      console.error("HOW MET SAVE ERROR:", error);
      alert(error.message || "ذخیره نحوه آشنایی با خطا مواجه شد.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setName(item.name);
  };

  const handleDelete = async (id) => {
    const item = items.find((item) => item.id === id);

    const ok = window.confirm(
      `آیا از حذف «${item?.name || "این مورد"}» مطمئن هستید؟`,
    );

    if (!ok) return;

    try {
      await deleteHowMet(id);

      setItems((current) => current.filter((item) => item.id !== id));

      if (editingId === id) {
        resetForm();
      }
    } catch (error) {
      console.error("DELETE HOW MET ERROR:", error);
      alert(error.message || "حذف نحوه آشنایی با خطا مواجه شد.");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#211c16]/35 p-2 backdrop-blur-[2px] sm:p-5">
      <div className="flex max-h-[92vh] w-full max-w-145 flex-col overflow-hidden rounded-2xl border border-[#e8e1d7] bg-white shadow-[0_24px_80px_rgba(43,33,22,0.18)]">
        {/* HEADER */}

        <div className="flex h-14 shrink-0 items-center justify-between border-b border-[#eeeae4] px-4 sm:h-16 sm:px-6">
          <div>
            <h2 className="text-[15px] font-extrabold text-[#3f3932]">
              نحوه آشنایی
            </h2>

            <p className="mt-1 text-[10px] text-[#9b948a]">
              مدیریت روش‌های آشنایی با مخاطبین
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="flex size-8 items-center justify-center rounded-lg text-[#8e877f] hover:bg-[#f5f2ed]"
          >
            <X className="size-4.5" />
          </button>
        </div>

        {/* CONTENT */}

        <div className="overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-[#eee9e2] bg-[#fcfbf9] p-3 sm:p-4"
          >
            <div className="mb-2">
              <span className="text-[11px] font-semibold text-[#4d463e]">
                {editingId ? "ویرایش نحوه آشنایی" : "افزودن نحوه آشنایی"}
              </span>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="مثلاً معرفی دوستان"
                className="field-input min-w-0 flex-1"
                autoFocus
              />

              <button
                type="submit"
                disabled={saving}
                className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#6840d4] px-4 text-[11px] font-semibold text-white shadow-sm transition hover:bg-[#5934be] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {editingId ? (
                  <Check className="size-4" />
                ) : (
                  <Plus className="size-4" />
                )}

                {saving ? "در حال ذخیره..." : editingId ? "ذخیره" : "افزودن"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="h-10 rounded-lg border border-[#e6e1d9] bg-white px-4 text-[11px] text-[#756e65] hover:bg-[#faf8f5]"
                >
                  انصراف
                </button>
              )}
            </div>
          </form>

          {/* LIST */}

          <div className="mt-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[11px] font-bold text-[#514a42]">
                لیست نحوه‌های آشنایی
              </h3>

              <span className="rounded-full bg-[#eee8dd] px-2 py-0.5 text-[9px] font-semibold text-[#8b7757]">
                {items.length} مورد
              </span>
            </div>

            <div className="overflow-hidden rounded-xl border border-[#e9e5df]">
              {loading ? (
                <div className="py-12 text-center text-[11px] text-[#9d968e]">
                  در حال دریافت اطلاعات...
                </div>
              ) : items.length === 0 ? (
                <div className="py-12 text-center text-[11px] text-[#9d968e]">
                  هنوز نحوه آشنایی‌ای ثبت نشده است.
                </div>
              ) : (
                <div className="divide-y divide-[#f1eee9]">
                  {items.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 px-3 py-3 transition hover:bg-[#fdfcf9] sm:px-4"
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#f4eee4] text-[10px] font-bold text-[#8d6a30]">
                        {index + 1}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[11px] font-semibold text-[#413b34]">
                          {item.name}
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          className="flex size-8 items-center justify-center rounded-lg text-[#918980] transition hover:bg-[#f4f0e9] hover:text-[#6e5124]"
                          title="ویرایش"
                        >
                          <Pencil className="size-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="flex size-8 items-center justify-center rounded-lg text-[#a19a91] transition hover:bg-[#fbefed] hover:text-[#b45a52]"
                          title="حذف"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER */}

        {/* <div className="flex shrink-0 justify-end border-t border-[#eeeae4] px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="h-10 rounded-lg border border-[#e6e1d9] bg-white px-5 text-xs font-medium text-[#756e65] hover:bg-[#faf8f5]"
          >
            بستن
          </button>
        </div> */}
      </div>
    </div>
  );
}
