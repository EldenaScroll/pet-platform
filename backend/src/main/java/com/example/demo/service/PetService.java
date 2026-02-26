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

    public Pet updatePet(UUID petId, Pet updates, UUID ownerId) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new RuntimeException("Pet not found"));
        
        if (!pet.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("You can only edit your own pets");
        }

        if (updates.getName() != null) pet.setName(updates.getName());
        if (updates.getBreed() != null) pet.setBreed(updates.getBreed());
        if (updates.getAge() != null) pet.setAge(updates.getAge());

        return petRepository.save(pet);
    }

    public void deletePet(UUID petId, UUID ownerId) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new RuntimeException("Pet not found"));
        
        if (!pet.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("You can only delete your own pets");
        }

        petRepository.delete(pet);
    }
}
