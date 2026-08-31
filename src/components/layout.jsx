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
    { icon: UserCog, label: "تنظیمات نام کاربری و رمز ورود" },
    { icon: Sparkles, label: "نحوه آشنایی" },
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
                  ? onAddCategory
                  : label === "افزودن نقش"
                    ? onAddRole
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
  activeCategory,
  onCategoryChange,
}) {
  return (
    <aside className="hidden w-58.75 shrink-0 border-r border-[#ebe7e0] bg-white xl:block">
      <div className="sticky top-0 px-5 py-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-bold text-[#4a433b]">
          <Users className="size-4.25 text-[#b48634]" />
          پیمانکاران
        </div>

        <div className="space-y-1">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs"
            >
              <span>{category.name}</span>

              {/* <span className="text-[10px] text-[#a39b91]">
                {category.count}
              </span> */}
            </button>
          ))}
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
  onAddRole,
  onAddCategory,
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
            onClose={onClose}
            categories={categories}
          />
        </div>

        <div className="px-5 py-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[#4a433b]">
            <Users className="size-4.25 text-[#b48634]" />
            پیمانکاران
          </div>
          <div className="space-y-1">
            {categories.map((item) => {
              return (
                <button
                  key={item.id}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs transition"
                >
                  <span>{item.name}</span>
                  <span className="text-[10px] text-[#aaa39a]">
                    {item.count}
                  </span>
                </button>
              );
            })}
          </div>
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
}) {
  const items = [
    [Users, "همه مخاطبین"],
    [UserCog, "تنظیمات نام کاربری و رمز ورود"],
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
