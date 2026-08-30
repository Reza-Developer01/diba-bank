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
} from "./services/categories.service";

export default function App() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [createTrigger, setCreateTrigger] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState("");

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

  const handleCreateRole = async (name, parentId) => {
    const createdRole = await createRole(name, parentId);

    setCategories((currentCategories) => [...currentCategories, createdRole]);

    setRoleModalOpen(false);
  };

  const handleCreateCategory = async (name) => {
    const createdCategory = await createCategory(name);

    setCategories((currentCategories) => [
      ...currentCategories,
      createdCategory,
    ]);

    setCategoryModalOpen(false);
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
        />
        <ContactsPage
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          createTrigger={createTrigger}
          roles={roles}
          categories={categories}
        />
        <ContractorSidebar
          categories={categories.filter((category) => category.parent === null)}
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
        categories={categories.filter((category) => category.parent === null)}
      />
      <RoleModal
        open={roleModalOpen}
        roles={roles}
        categories={rootCategories}
        onClose={() => setRoleModalOpen(false)}
        onSubmit={handleCreateRole}
      />
      <CategoryModal
        open={categoryModalOpen}
        categories={rootCategories}
        onClose={() => setCategoryModalOpen(false)}
        onSubmit={handleCreateCategory}
      />
    </div>
  );
}
