import React from "react";
import {
  Bell,
  BriefcaseBusiness,
  CircleHelp,
  FolderPlus,
  Grid2X2,
  LayoutDashboard,
  Menu,
  Plus,
  Settings,
  Sparkles,
  UserCog,
  Users,
  Wrench,
  ChevronDown,
} from "lucide-react";
import { categories } from "../data/contacts";
import { IconButton } from "./ui";

export function Header({ onAdd, onMenu }) {
  return (
    <header className="flex min-h-18 flex-wrap items-center gap-3 border-b border-[#ebe7e0] bg-white px-4 py-3 sm:flex-nowrap sm:gap-5 sm:px-7">
      {/* <div className="order-5 flex w-full max-w-none basis-full items-center sm:order-0 sm:mx-auto sm:max-w-135 sm:basis-auto">
        <div className="relative w-full">
          <input
            placeholder="جستجو در مخاطبین..."
            className="h-10 w-full rounded-lg border border-[#e8e4dd] bg-[#fcfbf9] px-4 pr-4 pl-10 text-xs text-[#4c463f] outline-none transition focus:border-[#b98a39] focus:ring-2 focus:ring-[#b98a39]/10"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9b958c]">
            ⌕
          </span>
        </div>
      </div> */}

      <button
        onClick={onMenu}
        className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#e7e2da] text-[#756e65] hover:bg-[#faf8f4] lg:hidden"
        aria-label="باز کردن منو"
      >
        <Menu className="size-4.75" />
      </button>

      <div className="flex items-center justify-between w-full">
        <div className="flex shrink-0 items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-[#b48634] text-white shadow-sm">
            <BriefcaseBusiness className="size-4.75" />
          </div>
          <div>
            <div className="text-sm font-extrabold tracking-tight text-[#3c3429]">
              دیبا بانک
            </div>
            <div className="mt-0.5 text-[9px] text-[#9a9389]">
              مدیریت ارتباطات
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-5">
          <div className="flex shrink-0 items-center gap-1">
            <IconButton title="اعلان‌ها">
              <Bell className="size-4.5" />
            </IconButton>
            <IconButton title="تنظیمات">
              <Settings className="size-4.5" />
            </IconButton>
          </div>

          <button
            onClick={onAdd}
            className="flex h-10 shrink-0 items-center gap-2 rounded-lg bg-[#b48634] px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-[#a4772b]"
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">افزودن مخاطب</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export function MainSidebar({
  open,
  onClose,
  activeCategory,
  onCategoryChange,
  onAddRole,
  onAddCategory,
  onHowMet,
}) {
  const items = [
    { icon: Users, label: "همه مخاطبین", active: true },
    { icon: UserCog, label: "تنظیمات نام کاربری و رمز ورود ( به زودی )" },
    { icon: Sparkles, label: "نحوه آشنایی", accent: true },
    { icon: Users, label: "افزودن نقش", accent: true },
    { icon: FolderPlus, label: "افزودن دسته", accent: true },
  ];

  return (
    <aside className="hidden w-58.75 shrink-0 border-l border-[#ebe7e0] bg-white lg:block">
      <div className="sticky top-0 px-5 py-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-bold text-[#4a433b]">
          <Users className="size-4.25 text-[#b48634]" />
          مخاطبین
        </div>

        <div className="space-y-1">
          {items.map(({ icon: Icon, label, active, accent }) => (
            <button
              key={label}
              onClick={
                label === "افزودن دسته"
                  ? onAddRole
                  : label === "افزودن نقش"
                    ? onAddCategory
                    : label === "نحوه آشنایی"
                      ? onHowMet
                      : undefined
              }
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-xs transition ${
                active
                  ? "bg-[#f8f1e5] font-semibold text-[#76531d]"
                  : accent
                    ? "text-[#80602a] hover:bg-[#faf8f4]"
                    : "text-[#716a61] hover:bg-[#faf8f4]"
              }`}
            >
              <Icon className="size-4 shrink-0" />
              <span className="text-right leading-5">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

export function ContractorSidebar({
  categories = [],
  allCategories = [],
  contacts = [],
  activeCategory,
  onCategoryChange,
}) {
  const [openCategory, setOpenCategory] = React.useState(null);

  const toggleCategory = (categoryId) => {
    setOpenCategory((current) =>
      String(current) === String(categoryId) ? null : categoryId,
    );
  };

  return (
    <aside className="hidden w-58.75 shrink-0 border-r border-[#ebe7e0] bg-white xl:block">
      <div className="sticky top-0 px-5 py-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-bold text-[#4a433b]">
          <Users className="size-4.25 text-[#b48634]" />
          گروه بندی
        </div>

        <div className="space-y-1">
          {categories.map((category) => {
            const categoryRoles = allCategories.filter(
              (item) =>
                item.is_role === true &&
                String(item.parent) === String(category.id),
            );

            const isOpen = String(openCategory) === String(category.id);

            return (
              <div key={category.id}>
                <button
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs transition hover:bg-[#faf8f4]"
                >
                  <span className="text-[#5f574f]">{category.name}</span>

                  <div className="flex items-center gap-2">
                    <span className="min-w-5 rounded-full bg-[#f3eee6] px-1.5 py-0.5 text-center text-[9px] font-semibold text-[#9a7946]">
                      {
                        contacts.filter(
                          (contact) =>
                            String(contact.category) === String(category.id),
                        ).length
                      }
                    </span>

                    <span
                      className={`text-[#aaa39a] transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </div>
                </button>

                <div
                  className={`grid transition-all duration-200 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="mr-3 mt-1 space-y-1 border-r border-[#eee7df] pr-3">
                      {categoryRoles.length > 0 ? (
                        categoryRoles.map((role) => {
                          const roleContactsCount = contacts.filter(
                            (contact) =>
                              String(contact.role) === String(role.id),
                          ).length;

                          return (
                            <div
                              key={role.id}
                              className="flex items-center justify-between rounded-lg px-3 py-2.5 text-xs text-[#716a61] transition hover:bg-[#faf8f4]"
                            >
                              <span>{role.name}</span>

                              <span className="min-w-5 rounded-full bg-[#f3eee6] px-1.5 py-0.5 text-center text-[9px] font-semibold text-[#9a7946]">
                                {roleContactsCount}
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <div className="px-3 py-2.5 text-[10px] text-[#aaa39a]">
                          نقشی برای این دسته ثبت نشده
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

export function MobileDrawer({
  open,
  onClose,
  activeCategory,
  onCategoryChange,
  categories = [],
  allCategories = [],
  contacts = [],
  onAddRole,
  onAddCategory,
  onHowMet,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        className="absolute inset-0 bg-[#211c16]/35 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="بستن منو"
      />
      <aside className="absolute right-0 top-0 flex h-full w-[min(88vw,330px)] flex-col overflow-y-auto bg-white shadow-[-12px_0_40px_rgba(43,33,22,0.14)]">
        <div className="flex h-18 shrink-0 items-center justify-between border-b border-[#eeeae4] px-5">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[#3f3932]">
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#b48634] text-white">
              <BriefcaseBusiness className="size-4" />
            </div>
            دیبا بانک
          </div>
          <button
            onClick={onClose}
            className="size-9 rounded-lg text-[#8d867e] hover:bg-[#f5f2ed]"
          >
            ×
          </button>
        </div>

        <div className="border-b border-[#f0ede8] px-5 py-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[#4a433b]">
            <Users className="size-4.25 text-[#b48634]" />
            مخاطبین
          </div>
          <MobileMenuItems
            onAddRole={onAddRole}
            onAddCategory={onAddCategory}
            onHowMet={onHowMet}
            onClose={onClose}
            categories={categories}
          />
        </div>

        <div className="px-5 py-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[#4a433b]">
            <Users className="size-4.25 text-[#b48634]" />
            گروه بندی
          </div>

          <MobileContractorCategories
            categories={categories}
            allCategories={allCategories}
            contacts={contacts}
          />
        </div>
      </aside>
    </div>
  );
}

function MobileMenuItems({
  onAddRole,
  onAddCategory,
  onClose,
  categories = [],
  onHowMet,
}) {
  const items = [
    [Users, "همه مخاطبین"],
    [UserCog, "تنظیمات نام کاربری و رمز ورود ( به زودی )"],
    [Sparkles, "نحوه آشنایی"],
    [Users, "افزودن نقش"],
    [FolderPlus, "افزودن دسته"],
  ];

  return (
    <div className="space-y-1">
      {items.map(([Icon, label], index) => (
        <button
          key={label}
          onClick={
            label === "افزودن دسته"
              ? onAddCategory
              : label === "افزودن نقش"
                ? onAddRole
                : label === "نحوه آشنایی"
                  ? onHowMet
                  : undefined
          }
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-xs ${
            index === 0
              ? "bg-[#f8f1e5] font-semibold text-[#76531d]"
              : "text-[#716a61] hover:bg-[#faf8f4]"
          }`}
        >
          <Icon className="size-4 shrink-0" />
          <span className="text-right leading-5">{label}</span>
        </button>
      ))}
    </div>
  );
}

export function LeftRail() {
  const items = [
    [LayoutDashboard, "پیشخوان"],
    [Users, "مخاطبین"],
    [BriefcaseBusiness, "پروژه‌ها"],
    [Grid2X2, "ماژول‌ها"],
  ];

  return (
    <div className="hidden w-18.5 shrink-0 flex-col items-center border-r border-[#ebe7e0] bg-[#fcfbf9] py-5 xl:flex">
      <div className="mb-8 flex size-9 items-center justify-center rounded-xl bg-[#eadbbd] text-[#8c6528]">
        <Wrench className="size-4.5" />
      </div>
      <div className="flex flex-1 flex-col gap-3">
        {items.map(([Icon, label], index) => (
          <button
            key={label}
            title={label}
            className={`flex size-11 flex-col items-center justify-center rounded-xl ${
              index === 1
                ? "bg-[#f3eadb] text-[#9a702b]"
                : "text-[#a09a92] hover:bg-[#f4f1eb]"
            }`}
          >
            <Icon className="size-4.25" />
          </button>
        ))}
      </div>
      <button className="flex size-11 items-center justify-center rounded-xl text-[#a09a92] hover:bg-[#f4f1eb]">
        <CircleHelp className="size-4.25" />
      </button>
    </div>
  );
}

function MobileContractorCategories({
  categories = [],
  allCategories = [],
  contacts = [],
}) {
  const [openCategory, setOpenCategory] = React.useState(null);

  const toggleCategory = (categoryId) => {
    setOpenCategory((current) =>
      String(current) === String(categoryId) ? null : categoryId,
    );
  };

  return (
    <div className="space-y-1">
      {categories.map((category) => {
        const categoryRoles = allCategories.filter(
          (item) =>
            item.is_role === true &&
            String(item.parent) === String(category.id),
        );

        const isOpen = String(openCategory) === String(category.id);

        return (
          <div key={category.id}>
            <button
              type="button"
              onClick={() => toggleCategory(category.id)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs transition hover:bg-[#faf8f4]"
            >
              <span className="text-[#5f574f]">{category.name}</span>

              <div className="flex items-center gap-2">
                <span className="min-w-5 rounded-full bg-[#f3eee6] px-1.5 py-0.5 text-center text-[9px] font-semibold text-[#9a7946]">
                  {
                    contacts.filter(
                      (contact) =>
                        String(contact.category) === String(category.id),
                    ).length
                  }
                </span>

                <span
                  className={`text-[#aaa39a] transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  <ChevronDown className="h-4 w-4" />
                </span>
              </div>
            </button>

            <div
              className={`grid transition-all duration-200 ease-in-out ${
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="mr-3 mt-1 space-y-1 border-r border-[#eee7df] pr-3">
                  {categoryRoles.length > 0 ? (
                    categoryRoles.map((role) => {
                      const roleContactsCount = contacts.filter(
                        (contact) => String(contact.role) === String(role.id),
                      ).length;

                      return (
                        <div
                          key={role.id}
                          className="flex items-center justify-between rounded-lg px-3 py-2.5 text-xs text-[#716a61] transition hover:bg-[#faf8f4]"
                        >
                          <span>{role.name}</span>

                          <span className="min-w-5 rounded-full bg-[#f3eee6] px-1.5 py-0.5 text-center text-[9px] font-semibold text-[#9a7946]">
                            {roleContactsCount}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="px-3 py-2.5 text-[10px] text-[#aaa39a]">
                      نقشی برای این دسته ثبت نشده
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
