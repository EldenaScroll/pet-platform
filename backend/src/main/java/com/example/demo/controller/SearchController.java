package com.example.demo.controller;

import java.util.List;

import org.locationtech.jts.geom.Point;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Profile;
import com.example.demo.repository.ProfileRepository;
import com.example.demo.service.GeocodingService;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final ProfileRepository profileRepository;
    private final GeocodingService geocodingService;

    public SearchController(ProfileRepository profileRepository, GeocodingService geocodingService) {
        this.profileRepository = profileRepository;
        this.geocodingService = geocodingService;
    }

    // example: GET /api/search?zipCode=10001&radius=5
    @GetMapping
    public List<Profile> searchSitters(@RequestParam String zipCode, @RequestParam(defaultValue = "5") int radius) {
        // convert owner's zip to a point
        Point ownerLocation = geocodingService.getPointFromZip(zipCode);
        
        if (ownerLocation == null) {
            throw new RuntimeException("Invalid Zip Code");
        }

        // convert miles to meters
        double radiusInMeters = radius * 1609.34;

        // run the query
        return profileRepository.findSittersNearby(ownerLocation, radiusInMeters);
    }
}
