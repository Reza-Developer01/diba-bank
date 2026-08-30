import { initialContacts } from "../data/contacts";

const wait = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

let contacts = structuredClone(initialContacts);

export async function getContacts() {
  await wait();
  return structuredClone(contacts);
}

export async function createContact(data) {
  await wait();
  const newContact = {
    ...data,
    id: Date.now(),
  };
  contacts = [newContact, ...contacts];
  return structuredClone(newContact);
}

export async function updateContact(id, data) {
  await wait();
  contacts = contacts.map((contact) =>
    contact.id === id ? { ...contact, ...data, id } : contact
  );
  return structuredClone(contacts.find((contact) => contact.id === id));
}

export async function deleteContact(id) {
  await wait();
  contacts = contacts.filter((contact) => contact.id !== id);
}