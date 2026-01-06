package com.example.demo.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.demo.model.Pet;
import com.example.demo.repository.PetRepository;

@Service
public class PetService {

    private final PetRepository petRepository;

    // constructor Injection
    public PetService(PetRepository petRepository) {
        this.petRepository = petRepository;
    }

    public List<Pet> getPetsByOwner(UUID ownerId) {
        return petRepository.findByOwnerId(ownerId);
    }

    public Pet createPet(Pet pet, UUID ownerId) {
        // force the ownerID to be the logged-in user
        pet.setOwnerId(ownerId);
        return petRepository.save(pet);
    }
    
}
