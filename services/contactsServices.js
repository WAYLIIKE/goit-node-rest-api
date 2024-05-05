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
export async function getContactById(contactId, owner) {
  try {
    const contact = await Contact.findOne({ owner, _id: contactId });

    return contact;
  } catch (error) {
    return error;
  }
}

// Delete contact by id.
export async function removeContact(contactId, owner) {
  try {
    const contact = await Contact.findOneAndDelete({ owner, _id: contactId });
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
export async function updateContact(contactId, contact, owner) {
  try {
    const updatedContact = await Contact.findOneAndUpdate(
      {
        _id: contactId,
        owner,
      },
      contact,
      {
        new: true,
      },
    );

    return updatedContact;
  } catch (error) {
    return error;
  }
}
