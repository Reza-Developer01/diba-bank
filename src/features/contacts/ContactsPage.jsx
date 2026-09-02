import * as XLSX from "xlsx";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  FileSpreadsheet,
  Globe2,
  MapPin,
  Phone,
  Plus,
  SlidersHorizontal,
  Upload,
  UserRound,
} from "lucide-react";

import {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
} from "../../services/contacts.service";

import { Badge, SearchInput, Select } from "../../components/ui";
import { ContactModal } from "./ContactModal";
import { sources } from "../../data/contacts";
// import { getHowMet } from "../../services/howMet.service";

const DEFAULT_PAGE_SIZE = 8;

const behaviorMap = {
  hot: { label: "داغ", tone: "red" },
  warm: { label: "گرم", tone: "gold" },
  cold: { label: "سرد", tone: "blue" },
};

function normalize(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
}

export default function ContactsPage({
  onCategoryChange,
  activeCategory,
  createTrigger,
  roles = [],
  categories = [],
  howMetOptions,
  onContactsChange,
  refreshKey,
}) {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [category, setCategory] = useState("");
  const [behavior, setBehavior] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  // const [howMetOptions, setHowMetOptions] = useState([]);

  const fileInputRef = useRef(null);
  const [importRows, setImportRows] = useState([]);
  const [importOpen, setImportOpen] = useState(false);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    getContacts().then((data) => {
      setContacts(data);
      onContactsChange?.(data);
    });
  }, [onContactsChange, refreshKey]);

  useEffect(() => {
    getContacts().then((data) => {
      setContacts(data);
      onContactsChange?.(data);
    });
  }, [onContactsChange]);

  useEffect(() => {
    setPage(1);
  }, [search, role, category, behavior, sort, activeCategory]);

  useEffect(() => {
    if (createTrigger > 0) {
      openCreate();
    }
  }, [createTrigger]);

  // useEffect(() => {
  //   getHowMet()
  //     .then(setHowMetOptions)
  //     .catch((error) => {
  //       console.error("GET HOW MET ERROR:", error);
  //     });
  // }, []);

  const filtered = useMemo(() => {
    const query = normalize(search);

    return contacts
      .filter((contact) => {
        const matchesActiveCategory =
          !activeCategory ||
          activeCategory === "all" ||
          String(contact.category) === String(activeCategory);

        const matchesCategoryFilter =
          !category || String(contact.category) === String(category);

        const matchesBehavior =
          !behavior || String(contact.behavior) === String(behavior);

        const matchesRole = !role || String(contact.role) === String(role);

        const categoryNames = [contact.category_name, contact.role_name]
          .filter(Boolean)
          .join(" ");

        const phoneNumbers = (contact.phones ?? [])
          .map((phone) => phone.phone)
          .join(" ");

        const haystack = [
          contact.fullname,
          contact.website,
          categoryNames,
          contact.how_met_name,
          contact.address,
          contact.description,
          contact.behavior_display,
          phoneNumbers,
        ]
          .map(normalize)
          .join(" ");

        return (
          matchesActiveCategory &&
          matchesCategoryFilter &&
          matchesRole &&
          matchesBehavior &&
          (!query || haystack.includes(query))
        );
      })
      .sort((a, b) => {
        if (sort === "name") {
          return `${a.fullname}`.localeCompare(`${b.fullname}`, "fa");
        }

        if (sort === "oldest") {
          return a.id - b.id;
        }

        return b.id - a.id;
      });
  }, [contacts, search, role, category, behavior, sort, activeCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const currentPage = Math.min(page, totalPages);

  const pageItems = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const topCategories = useMemo(
    () => categories.filter((item) => item.parent === null),
    [categories],
  );

  const reverseBehaviorMap = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(behaviorMap).map(([key, value]) => [value.label, key]),
      ),
    [],
  );

  const findIdByName = (list, name) => {
    if (!name) return "";
    const match = list.find((item) => item.name === String(name).trim());
    return match ? match.id : "";
  };

  const findHowMetIdByName = (name) => {
    if (!name) return "";
    const list = howMetOptions?.length ? howMetOptions : sources;
    const match = list.find((item) => item.name === String(name).trim());
    return match ? match.id : "";
  };

  const parsePhonesCell = (cell) => {
    if (!cell) return [];

    return String(cell)
      .split("،")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        // فرمت هر بخش تو خروجی: "09123456789 همراه"
        const match = part.match(/^(.*?)(?:\s+(ثابت|همراه))?$/);
        const phone = match?.[1]?.trim() || part;
        const typeLabel = match?.[2];

        const phoneCategory =
          typeLabel === "ثابت"
            ? "fixed"
            : typeLabel === "همراه"
              ? "mobile"
              : "mobile";

        return { phone, category: phoneCategory };
      });
  };

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (contact) => {
    setEditing(contact);
    setModalOpen(true);
  };

  const handleSubmit = async (data) => {
    try {
      if (editing) {
        await updateContact(editing.id, data);

        const updatedContacts = await getContacts();

        setContacts(updatedContacts);
        onContactsChange?.(updatedContacts);
      } else {
        await createContact(data);

        const updatedContacts = await getContacts();

        setContacts(updatedContacts);
        onContactsChange?.(updatedContacts);
      }

      setModalOpen(false);
      setEditing(null);
    } catch (error) {
      console.error("CONTACT SUBMIT ERROR:", error);
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("آیا از حذف این مخاطب مطمئن هستید؟");

    if (!ok) return;

    try {
      await deleteContact(id);

      setContacts((items) => {
        const updatedContacts = items.filter((item) => item.id !== id);

        onContactsChange?.(updatedContacts);

        return updatedContacts;
      });

      setModalOpen(false);
      setEditing(null);
    } catch (error) {
      console.error("DELETE CONTACT ERROR:", error);
    }
  };

  const handleExportExcel = () => {
    if (contacts.length === 0) {
      alert("مخاطبی برای خروجی گرفتن وجود ندارد.");
      return;
    }

    const excelData = contacts.map((contact) => ({
      شناسه: contact.id,
      "نام و نام خانوادگی": contact.fullname || "",
      دسته‌بندی: contact.category_name || "",
      نقش: contact.role_name || "",
      "شماره تماس": (contact.phones ?? [])
        .map((phone) => phone.phone)
        .join("، "),
      "نوع شماره": (contact.phones ?? [])
        .map((phone) =>
          phone.category === "fixed"
            ? "ثابت"
            : phone.category === "mobile"
              ? "همراه"
              : phone.category || "",
        )
        .join("، "),
      "آدرس اینترنتی": contact.website || "",
      شهر: contact.name_city || "",
      آدرس: contact.address || "",
      "نحوه آشنایی": contact.how_met_name || "",
      رفتار: contact.behavior_display || "",
      توضیحات: contact.description || "",
      "تاریخ ایجاد": contact.created_at || "",
      "تاریخ بروزرسانی": contact.updated_at || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "مخاطبین");

    XLSX.writeFile(workbook, "contacts.xlsx");
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      const parsed = rows.map((row, index) => {
        const fullname = String(row["نام و نام خانوادگی"] || "").trim();
        const categoryName = row["دسته‌بندی"];
        const roleName = row["نقش"];
        const howMetName = row["نحوه آشنایی"];
        const behaviorLabel = row["رفتار"];

        return {
          _rowId: `${index}-${Date.now()}`,
          fullname,
          category: findIdByName(topCategories, categoryName),
          category_name: categoryName || "",
          role: findIdByName(roles, roleName),
          role_name: roleName || "",
          phones: parsePhonesCell(row["شماره تماس"]),
          website: String(row["آدرس اینترنتی"] || "").trim(),
          name_city: String(row["شهر"] || "").trim(),
          address: String(row["آدرس"] || "").trim(),
          how_met_name: findHowMetIdByName(howMetName),
          how_met_display: howMetName || "",
          behavior: reverseBehaviorMap[behaviorLabel] || "",
          behavior_display: behaviorLabel || "",
          description: String(row["توضیحات"] || "").trim(),
          _valid: Boolean(fullname),
        };
      });

      setImportRows(parsed);
      setImportOpen(true);
    } catch (error) {
      console.error("EXCEL IMPORT PARSE ERROR:", error);
      alert("خواندن فایل اکسل با خطا مواجه شد. فرمت فایل را بررسی کنید.");
    } finally {
      event.target.value = "";
    }
  };

  const handleRemoveImportRow = (rowId) => {
    setImportRows((rows) => rows.filter((row) => row._rowId !== rowId));
  };

  const handleConfirmImport = async () => {
    const validRows = importRows.filter((row) => row._valid);

    if (validRows.length === 0) {
      alert("هیچ رکورد معتبری برای ذخیره وجود ندارد.");
      return;
    }

    setImporting(true);

    const results = await Promise.allSettled(
      validRows.map((row) =>
        createContact({
          fullname: row.fullname,
          category: row.category || null,
          role: row.role || null,
          phones: row.phones,
          website: row.website,
          name_city: row.name_city,
          address: row.address,
          how_met_name: row.how_met_name || null,
          behavior: row.behavior || null,
          description: row.description,
        }),
      ),
    );

    const succeeded = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.length - succeeded;

    const updatedContacts = await getContacts();
    setContacts(updatedContacts);
    onContactsChange?.(updatedContacts);

    setImporting(false);
    setImportOpen(false);
    setImportRows([]);

    alert(
      `${succeeded} مخاطب با موفقیت ذخیره شد.${failed ? ` ${failed} مورد با خطا مواجه شد.` : ""}`,
    );
  };

  return (
    <main className="min-w-0 flex-1 bg-[#f8f7f4]">
      <div className="px-4 py-5 sm:px-7 sm:py-6">
        {/* HEADER */}

        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[19px] font-extrabold text-[#3e3831]">
                همه مخاطبین
              </h1>

              <span className="rounded-full bg-[#eee8dd] px-2 py-0.5 text-[10px] font-semibold text-[#8b7757]">
                {filtered.length}
              </span>
            </div>

            <p className="mt-1 text-[11px] text-[#9b948a]">
              مدیریت و پیگیری ارتباط با مخاطبین و گروه بندی
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={handleFileChange}
            />

            <button
              type="button"
              onClick={handleImportClick}
              className="flex h-9 items-center gap-2 rounded-lg border border-[#e4dfd7] bg-white px-3 text-xs font-medium text-[#716a62] transition hover:bg-[#faf8f4] hover:text-[#8b682f]"
            >
              <Upload className="size-4" />
              ایمپورت اکسل
            </button>

            <button
              type="button"
              onClick={handleExportExcel}
              className="flex h-9 items-center gap-2 rounded-lg border border-[#e4dfd7] bg-white px-3 text-xs font-medium text-[#716a62] transition hover:bg-[#faf8f4] hover:text-[#8b682f]"
            >
              <FileSpreadsheet className="size-4" />
              خروجی اکسل
            </button>
          </div>
        </div>

        {/* FILTERS */}

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <SearchInput value={search} onChange={setSearch} />

          <Select
            value={sort}
            onChange={setSort}
            options={[
              {
                value: "newest",
                label: "جدیدترین",
              },
              {
                value: "oldest",
                label: "قدیمی‌ترین",
              },
              {
                value: "name",
                label: "بر اساس نام",
              },
            ]}
            placeholder="مرتب‌سازی"
            className="w-33.75"
          />

          <Select
            value={category}
            onChange={setCategory}
            options={categories
              .filter((item) => item.parent === null)
              .map((item) => ({
                value: String(item.id),
                label: item.name,
              }))}
            placeholder="همه نقش ها"
            className="w-auto"
          />

          <Select
            value={role}
            onChange={setRole}
            options={roles.map((item) => ({
              value: String(item.id),
              label: item.name,
            }))}
            placeholder="همه دسته ها"
            className="w-auto"
          />

          <Select
            value={behavior}
            onChange={setBehavior}
            options={[
              {
                value: "hot",
                label: "داغ",
              },
              {
                value: "warm",
                label: "گرم",
              },
              {
                value: "cold",
                label: "سرد",
              },
            ]}
            placeholder="همه وضعیت‌ها"
            className="w-auto"
          />

          <button
            className="flex h-10 items-center gap-2 rounded-lg border border-[#e4dfd7] bg-white px-3 text-xs text-[#716a62] hover:bg-[#fbfaf8]"
            onClick={() => {
              setSearch("");
              setRole("");
              setCategory("");
              setBehavior("");
            }}
          >
            <SlidersHorizontal className="size-4" />
            بازنشانی
          </button>
        </div>

        {/* TABLE */}

        <div className="overflow-hidden rounded-xl border border-[#e9e5df] bg-white shadow-[0_2px_12px_rgba(55,43,27,0.025)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-270 border-collapse">
              <thead>
                <tr className="border-b border-[#eeeae4] bg-[#fcfbf9] text-[10px] font-semibold text-[#777066]">
                  <th className="px-4 py-4 text-right">نام و نام خانوادگی</th>
                  <th className="px-3 py-4 text-right">دسته‌بندی</th>
                  <th className="px-3 py-4 text-right">شماره تماس</th>
                  <th className="px-3 py-4 text-right">آدرس اینترنتی</th>
                  <th className="px-3 py-4 text-right">آدرس</th>
                  <th className="px-3 py-4 text-right">نحوه آشنایی</th>
                  <th className="px-3 py-4 text-right">توضیحات</th>
                  <th className="px-3 py-4 text-right">رفتار</th>
                  <th className="w-12 px-2 py-4"></th>
                </tr>
              </thead>

              <tbody>
                {pageItems.map((contact) => {
                  const behaviorInfo = behaviorMap[contact.behavior] || {
                    label: contact.behavior_display || "—",
                    tone: "gray",
                  };

                  const contactCategories = [];

                  if (contact.category) {
                    contactCategories.push({
                      id: contact.category,
                      name: contact.category_name,
                      parent: null,
                    });
                  }

                  if (contact.role) {
                    contactCategories.push({
                      id: contact.role,
                      name: contact.role_name,
                      parent: contact.category,
                    });
                  }

                  const phones = contact.phones ?? [];

                  const howMet = sources.find(
                    (source) => source.id === Number(contact.how_met_name),
                  );

                  return (
                    <tr
                      key={contact.id}
                      className="group border-b border-[#f1eee9] last:border-b-0 hover:bg-[#fdfcf9]"
                    >
                      {/* NAME */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#f4eee4] text-[#8d6a30]">
                            <UserRound className="size-3.75" />
                          </div>

                          <div className="min-w-0">
                            <div className="truncate text-[11px] font-bold text-[#413b34]">
                              {contact.fullname || "—"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* CATEGORY */}
                      <td className="px-3 py-4">
                        {contactCategories.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {contactCategories.map((category) => (
                              <Badge
                                key={category.id}
                                tone={
                                  category.parent === null ? "gold" : "blue"
                                }
                              >
                                {category.name}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[10px] text-[#c1bbb3]">—</span>
                        )}
                      </td>

                      {/* PHONES */}
                      <td className="px-3 py-4">
                        {phones.length > 0 ? (
                          <div className="flex flex-col gap-1.5">
                            {phones.map((phone) => (
                              <div
                                key={phone.id}
                                className="flex items-center gap-1.5 whitespace-nowrap text-[10px] text-[#615a52]"
                              >
                                <Phone className="size-3.5 shrink-0 text-[#9b948b]" />

                                <span>{phone.phone || "—"}</span>

                                <span className="text-[9px] text-[#aaa198]">
                                  {phone.category === "fixed"
                                    ? "ثابت"
                                    : phone.category === "mobile"
                                      ? "همراه"
                                      : phone.category || ""}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[10px] text-[#c1bbb3]">—</span>
                        )}
                      </td>

                      {/* WEBSITE */}
                      <td className="px-3 py-4">
                        {contact.website ? (
                          <div className="flex items-center gap-1.5 whitespace-nowrap text-[10px] text-[#6c665e]">
                            <Globe2 className="size-3.5 text-[#9b948b]" />

                            <a
                              href={contact.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="max-w-45 truncate hover:text-[#b48634] hover:underline"
                              title={contact.website}
                            >
                              {contact.website}
                            </a>
                          </div>
                        ) : (
                          <span className="text-[10px] text-[#c1bbb3]">—</span>
                        )}
                      </td>

                      {/* ADDRESS */}
                      <td className="max-w-42.5 px-3 py-4">
                        <div className="flex items-center gap-1.5 text-[10px] text-[#686158]">
                          <MapPin className="size-3.5 shrink-0 text-[#a39a90]" />

                          <span
                            className="truncate"
                            title={contact.address || ""}
                          >
                            {contact.address || "—"}
                          </span>
                        </div>
                      </td>

                      {/* HOW MET */}
                      <td className="px-3 py-4 text-[10px] text-[#6e675f]">
                        {contact.how_met_name || "—"}
                      </td>

                      {/* DESCRIPTION */}
                      <td className="max-w-42.5 px-3 py-4">
                        <span
                          className="block truncate text-[10px] text-[#827b72]"
                          title={contact.description || ""}
                        >
                          {contact.description || "—"}
                        </span>
                      </td>

                      {/* BEHAVIOR */}
                      <td className="px-3 py-4">
                        <Badge tone={behaviorInfo.tone}>
                          {behaviorInfo.label}
                        </Badge>
                      </td>

                      {/* ACTION */}
                      <td className="px-2 py-4">
                        <button
                          className="flex size-8 items-center justify-center rounded-lg text-[#a19a91] hover:bg-[#f4f0e9] hover:text-[#6e5124]"
                          onClick={() => openEdit(contact)}
                          title="ویرایش"
                        >
                          <EllipsisVertical className="size-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {pageItems.length === 0 && (
                  <tr>
                    <td
                      colSpan="8"
                      className="py-20 text-center text-xs text-[#9d968e]"
                    >
                      مخاطبی با این مشخصات پیدا نشد.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}

          <div className="flex min-h-14 flex-wrap items-center justify-between gap-3 border-t border-[#eeeae4] px-5 py-3">
            <div className="text-[10px] text-[#9b948c]">
              نمایش{" "}
              {filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} تا{" "}
              {Math.min(currentPage * pageSize, filtered.length)} از{" "}
              {filtered.length} مورد
            </div>

            <div className="flex items-center gap-2">
              {/* <span className="whitespace-nowrap text-[10px] text-[#8f887f]">
                نمایش در صفحه
              </span>

              <Select
                value={String(pageSize)}
                onChange={(value) => {
                  setPageSize(Number(value));
                  setPage(1);
                }}
                options={[
                  { value: "8", label: "8" },
                  { value: "16", label: "16" },
                  { value: "24", label: "24" },
                  { value: "32", label: "32" },
                ]}
                placeholder="تعداد"
                className="w-22"
              /> */}

              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="flex size-8 items-center justify-center rounded-lg border border-[#e8e3dc] text-[#8e877e] disabled:cursor-not-allowed disabled:opacity-35 hover:bg-[#faf8f4]"
                >
                  <ChevronRight className="size-4" />
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1)
                  .slice(0, 7)
                  .map((number) => (
                    <button
                      key={number}
                      onClick={() => setPage(number)}
                      className={`flex size-8 items-center justify-center rounded-lg text-[10px] font-semibold ${
                        number === currentPage
                          ? "bg-[#b48634] text-white"
                          : "text-[#7d756b] hover:bg-[#f4f0e9]"
                      }`}
                    >
                      {number}
                    </button>
                  ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="flex size-8 items-center justify-center rounded-lg border border-[#e8e3dc] text-[#8e877e] disabled:cursor-not-allowed disabled:opacity-35 hover:bg-[#faf8f4]"
                >
                  <ChevronLeft className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ContactModal
        open={modalOpen}
        contact={editing}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
        onDelete={editing ? () => handleDelete(editing.id) : undefined}
        roles={roles}
        categories={categories}
        howMetOptions={howMetOptions}
      />

      {importOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/30 p-4">
          <div className="max-h-[85vh] w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#eeeae4] px-5 py-4">
              <h2 className="text-sm font-bold text-[#3e3831]">
                پیش‌نمایش ایمپورت ({importRows.length} ردیف)
              </h2>
              <button
                onClick={() => {
                  setImportOpen(false);
                  setImportRows([]);
                }}
                className="text-xs text-[#9b948a] hover:text-[#6e5124]"
              >
                بستن
              </button>
            </div>

            <div className="max-h-[60vh] overflow-auto px-5 py-3">
              <table className="w-full min-w-150 text-right text-[11px]">
                <thead>
                  <tr className="text-[10px] text-[#8f887f]">
                    <th className="py-2">نام</th>
                    <th className="py-2">دسته‌بندی</th>
                    <th className="py-2">نقش</th>
                    <th className="py-2">تلفن</th>
                    <th className="py-2">وضعیت</th>
                    <th className="py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {importRows.map((row) => (
                    <tr key={row._rowId} className="border-t border-[#f1eee9]">
                      <td className="py-2">{row.fullname || "—"}</td>
                      <td className="py-2">
                        {row.category ? (
                          row.category_name
                        ) : (
                          <span className="text-red-500">
                            {row.category_name || "—"} (یافت نشد)
                          </span>
                        )}
                      </td>
                      <td className="py-2">
                        {row.role ? (
                          row.role_name
                        ) : (
                          <span className="text-amber-600">
                            {row.role_name || "—"}
                          </span>
                        )}
                      </td>
                      <td className="py-2">
                        {row.phones.map((p) => p.phone).join("، ") || "—"}
                      </td>
                      <td className="py-2">
                        {row._valid ? (
                          <Badge tone="blue">معتبر</Badge>
                        ) : (
                          <Badge tone="red">ناقص</Badge>
                        )}
                      </td>
                      <td className="py-2">
                        <button
                          onClick={() => handleRemoveImportRow(row._rowId)}
                          className="text-[10px] text-red-500 hover:underline"
                        >
                          حذف
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-[#eeeae4] px-5 py-4">
              <span className="text-[10px] text-[#9b948a]">
                {importRows.filter((r) => r._valid).length} ردیف معتبر برای
                ذخیره
              </span>
              <button
                onClick={handleConfirmImport}
                disabled={importing}
                className="flex h-9 items-center gap-2 rounded-lg bg-[#b48634] px-4 text-xs font-semibold text-white hover:bg-[#a4772b] disabled:opacity-50"
              >
                {importing ? "در حال ذخیره..." : "تأیید و ذخیره"}
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={openCreate}
        className="fixed bottom-7 left-7 z-20 flex size-12 items-center justify-center rounded-full bg-[#b48634] text-white shadow-[0_8px_24px_rgba(139,101,42,0.28)] transition hover:-translate-y-0.5 hover:bg-[#a4772b] xl:hidden"
      >
        <Plus className="size-5" />
      </button>
    </main>
  );
}
