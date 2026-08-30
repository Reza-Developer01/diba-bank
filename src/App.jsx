import { useEffect, useState } from "react";
import {
  Header,
  MainSidebar,
  ContractorSidebar,
  MobileDrawer,
} from "./components/layout";
import ContactsPage from "./features/contacts/ContactsPage";
import { RoleModal } from "./features/roles/RoleModal";
import { createRole, getRoles } from "./services/roles.service";
import { initialRoles } from "./data/roles";
import { CategoryModal } from "./features/categories/CategoryModal";
import { createCategory, getCategories } from "./services/categories.service";

export default function App() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [createTrigger, setCreateTrigger] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const [roles, setRoles] = useState(initialRoles);

  useEffect(() => {
    getRoles().then(setRoles);
  }, []);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const handleCreateRole = async (name) => {
    const createdRole = await createRole(name);

    setRoles((currentRoles) => [...currentRoles, createdRole]);

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
          categories={categories}
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
        categories={categories}
      />
      <RoleModal
        open={roleModalOpen}
        roles={roles}
        onClose={() => setRoleModalOpen(false)}
        onSubmit={handleCreateRole}
      />
      <CategoryModal
        open={categoryModalOpen}
        categories={categories}
        onClose={() => setCategoryModalOpen(false)}
        onSubmit={handleCreateCategory}
      />
    </div>
  );
}
