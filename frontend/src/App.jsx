import { useEffect, useState } from "react";
import ContactForm from "./components/ContactForm";
import ContactList from "./components/ContactList";
import { createContact, deleteContact, getContacts, updateContact } from "./api/contactApi";
import "./App.css";

function App() {
  const [contacts, setContacts] = useState([]);
  const [editingContact, setEditingContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    loadContacts();
  }, []);

  async function loadContacts() {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await getContacts();
      setContacts(data ?? []);
    } catch (error) {
      setLoadError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(formData) {
    if (editingContact) {
      const updated = await updateContact(editingContact.id, formData);
      setContacts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      setEditingContact(null);
    } else {
      const created = await createContact(formData);
      setContacts((prev) => [...prev, created]);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this contact?")) {
      return;
    }
    try {
      await deleteContact(id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
      if (editingContact?.id === id) {
        setEditingContact(null);
      }
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="app-container">
      <h1>Contact Management</h1>

      <ContactForm
        editingContact={editingContact}
        onSave={handleSave}
        onCancel={() => setEditingContact(null)}
      />

      <h2>Contacts</h2>
      {loading && <p>Loading contacts...</p>}
      {loadError && (
        <p className="error-text">
          Could not load contacts: {loadError}. Is the backend running on the configured API URL?
        </p>
      )}
      {!loading && !loadError && (
        <ContactList contacts={contacts} onEdit={setEditingContact} onDelete={handleDelete} />
      )}
    </div>
  );
}

export default App;
