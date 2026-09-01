package com.crud.contact.dto;

import com.crud.contact.model.Contact;

public class ContactResponse {

    private Long id;
    private String name;
    private String address;
    private String phone;

    public ContactResponse() {
    }

    public ContactResponse(Long id, String name, String address, String phone) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.phone = phone;
    }

    public static ContactResponse fromEntity(Contact contact) {
        return new ContactResponse(contact.getId(), contact.getName(), contact.getAddress(), contact.getPhone());
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
