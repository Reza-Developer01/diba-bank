import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  Globe2,
  MapPin,
  Phone,
  Plus,
  SlidersHorizontal,
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
import { getHowMet } from "../../services/howMet.service";

const DEFAULT_PAGE_SIZE = 8;

const behaviorMap = {
  hot: { label: "داغ", tone: "red" },
  warm: { label: "گرم", tone: "gold" },
  cold: { label: "سرد", tone: "blue" },
};

function normalize(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

export default function ContactsPage({
  onCategoryChange,
  activeCategory,
  createTrigger,
  roles = [],
  categories = [],
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
  const [howMetOptions, setHowMetOptions] = useState([]);

  useEffect(() => {
    getContacts().then(setContacts);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, role, category, behavior, sort, activeCategory]);

  useEffect(() => {
    if (createTrigger > 0) {
      openCreate();
    }
  }, [createTrigger]);

  useEffect(() => {
    getHowMet()
      .then(setHowMetOptions)
      .catch((error) => {
        console.error("GET HOW MET ERROR:", error);
      });
  }, []);

  const filtered = useMemo(() => {
    const query = normalize(search);

    return contacts
      .filter((contact) => {
        const matchesCategory =
          !category ||
          (contact.categories_names ?? []).some(
            (item) => normalize(item) === normalize(category),
          );
        const matchesActiveCategory =
          activeCategory === "all" ||
          !activeCategory ||
          (contact.categories_names ?? []).some(
            (item) => normalize(item) === normalize(activeCategory),
          );

        const matchesRole =
          !role || normalize(contact.role) === normalize(role);

        const matchesBehavior = !behavior || contact.behavior === behavior;

        const categoryNames = (contact.categories_names ?? []).join(" ");

        const phoneNumbers = (contact.phones ?? [])
          .map((phone) => phone.phone)
          .join(" ");

        const phoneCategories = (contact.phones ?? [])
          .map((phone) => phone.category)
          .join(" ");

        const haystack = [
          contact.fullname,
          contact.email,
          categoryNames,
          contact.how_met_name,
          contact.address,
          contact.description,
          contact.behavior_display,
          phoneNumbers,
          phoneCategories,
        ]
          .map(normalize)
          .join(" ");

        return (
          matchesCategory &&
          matchesActiveCategory &&
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
        const updated = await updateContact(editing.id, data);

        setContacts((items) =>
          items.map((item) => (item.id === editing.id ? updated : item)),
        );
      } else {
        const created = await createContact(data);

        setContacts((items) => [created, ...items]);
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

      setContacts((items) => items.filter((item) => item.id !== id));
    } catch (error) {
      console.error("DELETE CONTACT ERROR:", error);
    }
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
              مدیریت و پیگیری ارتباط با مخاطبین و پیمانکاران
            </p>
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
            options={categories.map((item) => ({
              value: item.name,
              label: item.name,
            }))}
            placeholder="همه دسته‌ها"
            className="w-36.25"
          />

          <Select
            value={role}
            onChange={setRole}
            options={roles.map((item) => ({
              value: item.name,
              label: item.name,
            }))}
            placeholder="همه نقش‌ها"
            className="w-33.75"
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

                  const contactCategories = contact.categories_detail ?? [];
                  const phones = contact.phones ?? [];

                  const howMet = sources.find(
                    (source) => source.id === Number(contact.how_met),
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
                        {contact.email ? (
                          <div className="flex items-center gap-1.5 whitespace-nowrap text-[10px] text-[#6c665e]">
                            <Globe2 className="size-3.5 text-[#9b948b]" />

                            <a
                              href={contact.email}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="max-w-45 truncate hover:text-[#b48634] hover:underline"
                              title={contact.email}
                            >
                              {contact.email}
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
              <span className="whitespace-nowrap text-[10px] text-[#8f887f]">
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
              />

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

      <button
        onClick={openCreate}
        className="fixed bottom-7 left-7 z-20 flex size-12 items-center justify-center rounded-full bg-[#b48634] text-white shadow-[0_8px_24px_rgba(139,101,42,0.28)] transition hover:-translate-y-0.5 hover:bg-[#a4772b] xl:hidden"
      >
        <Plus className="size-5" />
      </button>
    </main>
  );
}
