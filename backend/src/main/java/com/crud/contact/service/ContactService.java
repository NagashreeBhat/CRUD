package com.crud.contact.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.crud.contact.dto.ContactRequest;
import com.crud.contact.dto.ContactResponse;
import com.crud.contact.exception.ResourceNotFoundException;
import com.crud.contact.model.Contact;
import com.crud.contact.repository.ContactRepository;

@Service
public class ContactService {

    private final ContactRepository contactRepository;

    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    public List<ContactResponse> getAllContacts() {
        return contactRepository.findAll().stream()
                .map(ContactResponse::fromEntity)
                .toList();
    }

    public ContactResponse getContactById(Long id) {
        Contact contact = findContactOrThrow(id);
        return ContactResponse.fromEntity(contact);
    }

    public ContactResponse createContact(ContactRequest request) {
        Contact contact = new Contact();
        contact.setName(request.getName());
        contact.setAddress(request.getAddress());
        contact.setPhone(request.getPhone());
        Contact saved = contactRepository.save(contact);
        return ContactResponse.fromEntity(saved);
    }

    public ContactResponse updateContact(Long id, ContactRequest request) {
        Contact contact = findContactOrThrow(id);
        contact.setName(request.getName());
        contact.setAddress(request.getAddress());
        contact.setPhone(request.getPhone());
        Contact saved = contactRepository.save(contact);
        return ContactResponse.fromEntity(saved);
    }

    public void deleteContact(Long id) {
        Contact contact = findContactOrThrow(id);
        contactRepository.delete(contact);
    }

    private Contact findContactOrThrow(Long id) {
        return contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id: " + id));
    }
}
