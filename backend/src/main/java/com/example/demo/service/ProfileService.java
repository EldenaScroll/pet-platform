package com.example.demo.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.demo.model.Profile;
import com.example.demo.repository.ProfileRepository;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final GeocodingService geocodingService;

    public ProfileService(ProfileRepository profileRepository, GeocodingService geocodingService) {
        this.profileRepository = profileRepository;
        this.geocodingService = geocodingService;
    }

    public Profile getProfile(UUID userId) {
        return profileRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
    }

    public Profile updateProfile(UUID userId, Profile updates) {
        Profile profile = profileRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        if (updates.getFullName() != null) {
            profile.setFullName(updates.getFullName());
        }
        if (updates.getBio() != null) {
            profile.setBio(updates.getBio());
        }
        if (updates.getZipCode() != null && !updates.getZipCode().equals(profile.getZipCode())) {
            profile.setZipCode(updates.getZipCode());
            // Re-geocode when zip changes
            var point = geocodingService.getPointFromZip(updates.getZipCode());
            if (point != null) {
                profile.setLocation(point);
            }
        }

        return profileRepository.save(profile);
    }
}
