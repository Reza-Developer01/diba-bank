import React, { useEffect, useState } from "react";
import {
  Check,
  Globe2,
  MapPin,
  Phone,
  Plus,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { sources } from "../../data/contacts";
import { Select } from "../../components/ui";

const emptyForm = {
  name: "",
  role: "پیمانکار",
  categoryId: "carpenter",
  category: "پیمانکار",
  phones: [
    { id: 1, type: "fixed", number: "" },
    { id: 2, type: "mobile", number: "" },
  ],
  website: "",
  city: "",
  address: "",
  source: "معرفی توسط دوست",
  behavior: "warm",
  description: "",
};

export function ContactModal({
  open,
  contact,
  onClose,
  onSubmit,
  onDelete,
  roles = [],
  categories = [],
  howMetOptions,
}) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (contact) {
      const categoryDetails = contact.categories_detail ?? [];

      const parentCategory = categoryDetails.find(
        (item) => item.parent === null,
      );

      const childCategory = categoryDetails.find(
        (item) => item.parent !== null,
      );

      const howMet = howMetOptions.find(
        (item) => item.name === contact.how_met_name,
      );

      setForm({
        ...emptyForm,

        name: contact.fullname ?? "",

        categoryId: parentCategory ? String(parentCategory.id) : "",

        category: parentCategory?.name ?? "",

        role: childCategory ? String(childCategory.id) : "",

        website: contact.website ?? "",

        address: contact.address ?? "",

        how_met: howMet ? String(howMet.id) : "",

        behavior: contact.behavior ?? "warm",

        description: contact.description ?? "",

        name_city: contact.name_city ?? "",

        phones:
          contact.phones?.length > 0
            ? contact.phones.map((phone) => ({
                id: phone.id,
                type: phone.category,
                number: phone.phone,
              }))
            : emptyForm.phones,
      });
    } else {
      setForm(emptyForm);
    }
  }, [open, contact, howMetOptions]);

  if (!open) return null;

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const updatePhone = (id, key, value) => {
    setForm((prev) => ({
      ...prev,
      phones: prev.phones.map((phone) =>
        phone.id === id ? { ...phone, [key]: value } : phone,
      ),
    }));
  };

  const addPhone = () => {
    setForm((prev) => ({
      ...prev,
      phones: [...prev.phones, { id: Date.now(), type: "mobile", number: "" }],
    }));
  };

  const removePhone = (id) => {
    setForm((prev) => ({
      ...prev,
      phones: prev.phones.filter((phone) => phone.id !== id),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) return;

    if (!form.categoryId) {
      console.log("CATEGORY IS NOT SELECTED");
      return;
    }

    setSaving(true);

    try {
      await onSubmit({
        ...form,
        category:
          categories.find((item) => String(item.id) === String(form.categoryId))
            ?.name || form.category,
        phones: form.phones.filter((phone) => phone.number.trim()),
      });
    } finally {
      setSaving(false);
    }
  };

  const categoryOptions = categories
    .filter((item) => item.parent === null)
    .map((item) => ({
      value: item.id,
      label: item.name,
    }));

  const roleOptions = roles.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#211c16]/35 p-2 sm:p-5 backdrop-blur-[2px]">
      <div className="flex max-h-[96vh] w-full max-w-172.5 flex-col overflow-hidden rounded-2xl sm:max-h-[92vh] border border-[#e8e1d7] bg-white shadow-[0_24px_80px_rgba(43,33,22,0.18)]">
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-[#eeeae4] px-4 sm:h-16 sm:px-6">
          <h2 className="text-[15px] font-extrabold text-[#3f3932]">
            {contact ? "ویرایش مخاطب" : "افزودن مخاطب"}
          </h2>
          <button
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg text-[#8e877f] hover:bg-[#f5f2ed]"
          >
            <X className="size-4.5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto px-4 py-4 sm:px-6 sm:py-5"
        >
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="نام و نام خانوادگی" required>
              <div className="relative">
                <UserRound className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#a29a90]" />

                <input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="مثلاً سارا محمدی"
                  className="field-input pr-10"
                  style={{ paddingRight: "32px" }}
                />
              </div>
            </Field>

            <Field label="نقش" required>
              <Select
                value={form.role ?? ""}
                onChange={(value) => update("role", value)}
                options={roleOptions}
                placeholder="انتخاب نقش"
              />
            </Field>

            <Field label="دسته‌بندی" required>
              <Select
                value={form.categoryId ?? ""}
                onChange={(value) => update("categoryId", value)}
                options={categoryOptions}
                placeholder="انتخاب دسته"
              />
            </Field>
          </section>

          <section className="mt-6">
            <SectionTitle>شماره‌های تماس</SectionTitle>
            <div className="space-y-2.5">
              {form.phones.map((phone) => (
                <div key={phone.id} className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => removePhone(phone.id)}
                    disabled={form.phones.length <= 1}
                    className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#ece6de] text-[#a19a91] disabled:cursor-not-allowed disabled:opacity-35 hover:bg-[#faf7f2] hover:text-[#b05b52]"
                  >
                    <Trash2 className="size-4" />
                  </button>
                  <Select
                    value={phone.type}
                    onChange={(value) => updatePhone(phone.id, "type", value)}
                    options={[
                      { value: "fixed", label: "تلفن ثابت" },
                      { value: "mobile", label: "موبایل" },
                    ]}
                    className="w-32.5 shrink-0"
                  />
                  <div className="relative flex-1">
                    <Phone className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#a29a90]" />
                    <input
                      value={phone.number}
                      onChange={(e) =>
                        updatePhone(phone.id, "number", e.target.value)
                      }
                      placeholder="021-12345678"
                      className="field-input pr-10"
                      dir="ltr"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addPhone}
              className="mt-3 flex h-9 items-center gap-2 rounded-lg border border-[#cdb47f] px-3 text-[11px] font-semibold text-[#8c6729] hover:bg-[#fbf7ef]"
            >
              <Plus className="size-4" />
              افزودن شماره تماس
            </button>
          </section>

          <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="سایت اینترنتی">
              <div className="relative">
                <Globe2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#a29a90]" />
                <input
                  value={form.website}
                  onChange={(e) => update("website", e.target.value)}
                  placeholder="https://example.com"
                  className="field-input pr-10"
                  dir="ltr"
                />
              </div>
            </Field>

            <Field label="شهر" required>
              <div className="relative">
                <MapPin className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#a29a90]" />
                <input
                  value={form.name_city ?? ""}
                  onChange={(e) => update("name_city", e.target.value)}
                  placeholder="تهران"
                  className="field-input pr-10"
                  style={{ paddingRight: "32px" }}
                />
              </div>
            </Field>

            <Field label="آدرس" className="sm:col-span-2">
              <div className="relative">
                <MapPin className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#a29a90]" />
                <input
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  placeholder="تهران، خیابان ولیعصر، بالاتر از میدان ونک، پلاک ۱۲۳"
                  className="field-input pr-10"
                  style={{ paddingRight: "32px" }}
                />
              </div>
            </Field>
          </section>

          <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="نحوه آشنایی">
              <Select
                value={form.how_met ?? ""}
                onChange={(value) => update("how_met", value)}
                options={howMetOptions.map((item) => ({
                  value: String(item.id),
                  label: item.name,
                }))}
                placeholder="نحوه آشنایی"
              />
            </Field>

            <Field label="رفتار قراردادی مخاطب" required>
              <div className="flex h-10 items-center gap-5 rounded-lg border border-[#e6e1d9] bg-white px-3">
                {[
                  ["hot", "داغ"],
                  ["warm", "گرم"],
                  ["cold", "سرد"],
                ].map(([value, label]) => (
                  <label
                    key={value}
                    className="flex cursor-pointer items-center gap-2 text-xs text-[#625b53]"
                  >
                    <input
                      type="checkbox"
                      checked={form.behavior === value}
                      onChange={() => update("behavior", value)}
                      className="size-3.5 accent-[#7350cf]"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </Field>

            <Field label="توضیحات" className="sm:col-span-2">
              <div className="relative">
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    update("description", e.target.value.slice(0, 500))
                  }
                  placeholder="توضیحات مربوط به این مخاطب را وارد کنید..."
                  className="min-h-25 w-full resize-none rounded-lg border border-[#e6e1d9] bg-white p-3 text-xs text-[#4f4942] outline-none placeholder:text-[#aaa39b] focus:border-[#b98a39] focus:ring-2 focus:ring-[#b98a39]/10"
                />
                <span className="absolute bottom-2 left-2 text-[9px] text-[#aaa39b]">
                  {form.description.length}/500
                </span>
              </div>
            </Field>
          </section>

          <div className="mt-6 flex items-center justify-between border-t border-[#eeeae4] pt-5">
            <div>
              {onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  className="flex h-10 items-center gap-2 rounded-lg px-3 text-xs text-[#b45a52] hover:bg-[#fbefed]"
                >
                  <Trash2 className="size-4" />
                  حذف مخاطب
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="h-10 rounded-lg border border-[#e6e1d9] bg-white px-5 text-xs font-medium text-[#756e65] hover:bg-[#faf8f5]"
              >
                انصراف
              </button>
              <button
                disabled={saving}
                type="submit"
                className="flex h-10 items-center gap-2 rounded-lg bg-[#6840d4] px-5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#5934be] disabled:opacity-60"
              >
                <Check className="size-4" />
                {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, required, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-[11px] font-semibold text-[#4d463e]">
        {label} {required && <b className="text-[#d65d55]">*</b>}
      </span>
      {children}
    </label>
  );
}

function SectionTitle({ children }) {
  return (
    <h3 className="mb-3 text-[11px] font-bold text-[#514a42]">{children}</h3>
  );
}
