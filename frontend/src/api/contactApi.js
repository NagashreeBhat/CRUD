const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/contacts";

async function handleResponse(response) {
  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.message || `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.fieldErrors = data?.errors || null;
    throw error;
  }

  return data;
}

export async function getContacts() {
  const response = await fetch(API_BASE_URL);
  return handleResponse(response);
}

export async function getContact(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  return handleResponse(response);
}

export async function createContact(contact) {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contact),
  });
  return handleResponse(response);
}

export async function updateContact(id, contact) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contact),
  });
  return handleResponse(response);
}

export async function deleteContact(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response);
}
