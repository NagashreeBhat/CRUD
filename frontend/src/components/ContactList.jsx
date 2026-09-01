function ContactList({ contacts, onEdit, onDelete }) {
  if (contacts.length === 0) {
    return <p className="empty-state">No contacts yet. Add one above to get started.</p>;
  }

  return (
    <table className="contact-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Address</th>
          <th>Phone</th>
          <th aria-label="Actions"></th>
        </tr>
      </thead>
      <tbody>
        {contacts.map((contact) => (
          <tr key={contact.id}>
            <td>{contact.name}</td>
            <td>{contact.address || "—"}</td>
            <td>{contact.phone}</td>
            <td className="row-actions">
              <button type="button" onClick={() => onEdit(contact)}>
                Edit
              </button>
              <button type="button" className="danger" onClick={() => onDelete(contact.id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ContactList;
