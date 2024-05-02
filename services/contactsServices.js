import { promises as fs } from 'fs';
import path from 'path';
import { v4 } from 'uuid';

const contactsPath = path.join('./db', 'contacts.json');

// Returns contacts array.
export async function listContacts() {
  try {
    const contacts = await fs.readFile(contactsPath);

    return JSON.parse(contacts);
  } catch (error) {
    return error;
  }
}

// Returns contact object. Returns null, if contact with contactsID was undefined.
export async function getContactById(contactId) {
  try {
    const contacts = await listContacts();

    const isContact = contacts.find(item => item.id === contactId);
    return isContact || null;
  } catch (error) {
    return error;
  }
}

// Returns deleted contact object. Returns null, if contact with contactsID was undefined.
export async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const deletedContactIdx = contacts.findIndex(item => item.id === contactId);

    if (deletedContactIdx === -1) return null;

    const deletedContact = contacts.splice(deletedContactIdx, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts));
    return deletedContact;
  } catch (error) {
    return error;
  }
}

// Returns added contact object with ID.
export async function addContact(contact) {
  const { name, email, phone } = contact;

  if (!name || !email || !phone) {
    throw new Error('Enter all data');
  }

  try {
    const contacts = await listContacts();

    const newContact = {
      id: v4(),
      name,
      email,
      phone,
    };

    const newContactsArray = [...contacts, newContact];

    await fs.writeFile(contactsPath, JSON.stringify(newContactsArray));
    return newContact;
  } catch (error) {
    return error;
  }
}

// Returns updated contact object.
export async function updateContact(id, contact) {
  const { name, email, phone } = contact;

  const updatedContact = {
    id,
    name,
    email,
    phone,
  };

  try {
    const contacts = await listContacts();
    const updatedContacts = [...contacts];
    const updatedContactIdx = updatedContacts.findIndex(item => item.id === id);

    if (updatedContactIdx === -1) return null;

    updatedContacts[updatedContactIdx] = updatedContact;

    await fs.writeFile(contactsPath, JSON.stringify(updatedContacts));
    return updatedContact;
  } catch (error) {
    return error;
  }
}
