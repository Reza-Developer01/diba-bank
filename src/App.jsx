import { useEffect, useState } from "react";
import {
  Header,
  MainSidebar,
  ContractorSidebar,
  MobileDrawer,
} from "./components/layout";
import ContactsPage from "./features/contacts/ContactsPage";
import { RoleModal } from "./features/roles/RoleModal";
import { initialRoles } from "./data/roles";
import { CategoryModal } from "./features/categories/CategoryModal";
import {
  createCategory,
  createRole,
  getCategories,
  updateCategory,
  deleteCategory,
  updateRole,
  deleteRole,
} from "./services/categories.service";
import { HowMetModal } from "./features/contacts/HowMetModal";
import { getHowMet } from "./services/howMet.service";

export default function App() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [createTrigger, setCreateTrigger] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState("");
  const [howMetModalOpen, setHowMetModalOpen] = useState(false);
  const [howMetOptions, setHowMetOptions] = useState([]);
  const [contacts, setContacts] = useState([]);

  const roles = categories.filter((category) => category.parent !== null);

  const rootCategories = categories.filter(
    (category) => category.parent === null,
  );

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        setCategoryError("");

        const data = await getCategories();

        setCategories(data);
      } catch (error) {
        setCategoryError(error?.message || "دریافت دسته‌ها با خطا مواجه شد.");
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    loadHowMetOptions();
  }, []);

  const handleCreateRole = async (name, parentId) => {
    const createdRole = await createRole(name, parentId);

    setCategories((currentCategories) => [...currentCategories, createdRole]);

    setRoleModalOpen(false);
  };

  const handleUpdateRole = async (id, name, parentId) => {
    const updatedRole = await updateRole(id, name, parentId);

    setCategories((currentCategories) =>
      currentCategories.map((category) =>
        category.id === id ? updatedRole : category,
      ),
    );

    window.location.reload();
  };

  const handleDeleteRole = async (id) => {
    await deleteRole(id);

    setCategories((currentCategories) =>
      currentCategories.filter((category) => category.id !== id),
    );
  };

  const handleCreateCategory = async (name) => {
    const createdCategory = await createCategory(name);

    setCategories((currentCategories) => [
      ...currentCategories,
      createdCategory,
    ]);

    setCategoryModalOpen(false);
  };

  const handleEditCategory = async (id, name) => {
    const updatedCategory = await updateCategory(id, name);

    setCategories((currentCategories) =>
      currentCategories.map((category) =>
        category.id === id ? updatedCategory : category,
      ),
    );

    window.location.reload();
  };

  const handleDeleteCategory = async (id) => {
    await deleteCategory(id);

    setCategories((currentCategories) =>
      currentCategories.filter((category) => category.id !== id),
    );

    // اگر دسته حذف‌شده دسته فعال بوده، برگرد به همه مخاطبین
    if (String(activeCategory) === String(id)) {
      setActiveCategory("all");
    }
  };

  const loadHowMetOptions = async () => {
    try {
      const data = await getHowMet();
      setHowMetOptions(data);
    } catch (error) {
      console.error("GET HOW MET ERROR:", error);
    }
  };

  return (
    <div dir="rtl" className="ss02 min-h-screen bg-[#f8f7f4]">
      <Header
        onAdd={() => setCreateTrigger((value) => value + 1)}
        onMenu={() => setMobileMenuOpen(true)}
      />
      <div className="flex min-h-[calc(100vh-72px)]">
        <MainSidebar
          onAddRole={() => setRoleModalOpen(true)}
          onAddCategory={() => setCategoryModalOpen(true)}
          onHowMet={() => setHowMetModalOpen(true)}
        />
        <ContactsPage
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          createTrigger={createTrigger}
          roles={roles}
          categories={categories}
          howMetOptions={howMetOptions}
          onContactsChange={setContacts}
        />
        <ContractorSidebar
          categories={categories.filter((category) => category.parent === null)}
          allCategories={categories}
          contacts={contacts}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        {/* <LeftRail /> */}
      </div>
      <MobileDrawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        onAddRole={() => setRoleModalOpen(true)}
        onAddCategory={() => setCategoryModalOpen(true)}
        onHowMet={() => setHowMetModalOpen(true)}
        categories={categories.filter((category) => category.parent === null)}
        allCategories={categories}
      />
      <RoleModal
        open={roleModalOpen}
        roles={roles}
        categories={rootCategories}
        onClose={() => setRoleModalOpen(false)}
        onSubmit={handleCreateRole}
        onUpdate={handleUpdateRole}
        onDelete={handleDeleteRole}
      />
      <CategoryModal
        open={categoryModalOpen}
        categories={categories}
        onClose={() => setCategoryModalOpen(false)}
        onSubmit={handleCreateCategory}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
      />

      <HowMetModal
        open={howMetModalOpen}
        onClose={() => setHowMetModalOpen(false)}
        onHowMetChange={loadHowMetOptions}
      />
    </div>
  );
}
