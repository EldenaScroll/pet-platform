package com.example.demo.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Pet;
import com.example.demo.service.PetService;

@RestController
@RequestMapping("/api/pets")
public class PetController {

    private final PetService petService;

    public PetController(PetService petService) {
        this.petService = petService;
    }

    // GET /api/pets: Returns only YOUR pets
    @GetMapping
    public List<Pet> getMyPets(@AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        return petService.getPetsByOwner(userId);
    }

    // POST /api/pets: creates a new pet for YOU
    @PostMapping
    public Pet createPet(@RequestBody Pet pet, @AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        return petService.createPet(pet, userId);
    }

    // PUT /api/pets/{id}: update your pet
    @PutMapping("/{id}")
    public Pet updatePet(@PathVariable UUID id, @RequestBody Pet pet, @AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        return petService.updatePet(id, pet, userId);
    }

    // DELETE /api/pets/{id}: delete your pet
    @DeleteMapping("/{id}")
    public void deletePet(@PathVariable UUID id, @AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        petService.deletePet(id, userId);
    }
}
