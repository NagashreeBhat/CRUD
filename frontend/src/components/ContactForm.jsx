import { useEffect, useState } from "react";

const EMPTY_CONTACT = { name: "", address: "", phone: "" };

function ContactForm({ editingContact, onSave, onCancel }) {
  const [formData, setFormData] = useState(EMPTY_CONTACT);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setFormData(editingContact ? { ...editingContact } : EMPTY_CONTACT);
    setFieldErrors({});
  }, [editingContact]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setFieldErrors({});
    try {
      await onSave(formData);
      setFormData(EMPTY_CONTACT);
    } catch (error) {
      if (error.fieldErrors) {
        setFieldErrors(error.fieldErrors);
      } else {
        setFieldErrors({ general: error.message });
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <h2>{editingContact ? "Edit Contact" : "Add Contact"}</h2>

      {fieldErrors.general && <p className="error-text">{fieldErrors.general}</p>}

      <div className="form-field">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Jane Doe"
        />
        {fieldErrors.name && <span className="error-text">{fieldErrors.name}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="address">Address</label>
        <input
          id="address"
          name="address"
          type="text"
          value={formData.address}
          onChange={handleChange}
          placeholder="123 Main St, Springfield"
        />
        {fieldErrors.address && <span className="error-text">{fieldErrors.address}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          name="phone"
          type="text"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+1 555-123-4567"
        />
        {fieldErrors.phone && <span className="error-text">{fieldErrors.phone}</span>}
      </div>

      <div className="form-actions">
        <button type="submit" disabled={submitting}>
          {editingContact ? "Update" : "Add"}
        </button>
        {editingContact && (
          <button type="button" className="secondary" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default ContactForm;
