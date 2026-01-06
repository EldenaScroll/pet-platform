package com.example.demo.repository;


import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Pet;

public interface PetRepository extends JpaRepository<Pet, UUID> {
    // custom query to find all pets belonging to a user
    List<Pet> findByOwnerId(UUID ownerId);
}
