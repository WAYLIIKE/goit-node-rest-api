import { Contact } from '../models/contactModel.js';

// Returns contacts array.
export async function listContacts(owner) {
  try {
    const contacts = await Contact.find({ owner });

    return contacts;
  } catch (error) {
    return error;
  }
}

// Returns contact object. Returns null, if contact with contactsID was undefined.
export async function getContactById(contactId) {
  try {
    const contact = await Contact.findById(contactId);

    return contact;
  } catch (error) {
    return error;
  }
}

// Delete contact by id.
export async function removeContact(contactId) {
  try {
    const contact = await Contact.findByIdAndDelete(contactId);
    return contact;
  } catch (error) {
    return error;
  }
}

// Returns added contact object with ID.
export async function addContact(contact) {
  try {
    const newContact = await Contact.create(contact);

    return newContact;
  } catch (error) {
    return error;
  }
}

// Returns updated contact object.
export async function updateContact(id, contact) {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(id, contact, {
      new: true,
    });

    return updatedContact;
  } catch (error) {
    return error;
  }
}
