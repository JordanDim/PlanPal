import {
  equalTo,
  onValue,
  orderByChild,
  push,
  query,
  ref,
  update,
} from "firebase/database";
import { db } from "../config/firebase-config";
import { restrictDemoUser } from "../common/helpers/demoUserRestriction";

export const createContactList = async (title, user) => {
  restrictDemoUser("create contact lists");

  const creator = user.toLowerCase();
  const list = await push(ref(db, "contactLists"), { title, creator });
  const contactListKey = list.key;
  const updates = {
    [`users/${creator}/contactLists/${contactListKey}`]: true,
    [`contactLists/${contactListKey}/key/`]: contactListKey,
  };
  await update(ref(db), updates);
};

export const deleteContactList = async (listId, user) => {
  restrictDemoUser("delete contact lists");

  const creator = user.toLowerCase();
  const updates = {
    [`contactLists/${listId}`]: null,
    [`users/${creator}/contactLists/${listId}`]: null,
  };

  await update(ref(db), updates);
};

export const contactListsListener = (user, callBack) => {
  const handle = user.toLowerCase();
  const queryRef = query(
    ref(db, "contactLists"),
    orderByChild("creator"),
    equalTo(handle)
  );

  return onValue(queryRef, (snapshot) => {
    const data = snapshot.val() ? Object.values(snapshot.val()) : [];
    callBack(data);
  });
};

export const addContact = async (handle, contactName) => {
  restrictDemoUser("add contacts");

  const user = handle.toLowerCase();
  const contact = contactName.toLowerCase();
  const updates = {
    [`users/${user}/contacts/${contact}`]: true,
  };

  try {
    await update(ref(db), updates);
  } catch (error) {
    console.error("Error adding contact", error);
  }
};

export const removeContact = async (handle, contactName) => {
  restrictDemoUser("remove contacts");

  const user = handle.toLowerCase();
  const contact = contactName.toLowerCase();
  const updates = {
    [`users/${user}/contacts/${contact}`]: null,
  };

  try {
    await update(ref(db), updates);
  } catch (error) {
    console.error("Error removing contact", error);
  }
};

export const updateContact = async (contactListKey, updatedContacts) => {
  restrictDemoUser("update contact lists");

  const updates = {
    [`contactLists/${contactListKey}/contacts`]: updatedContacts,
  };

  await update(ref(db), updates);
};
