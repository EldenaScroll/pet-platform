package com.example.demo.repository;

import java.util.List;
import java.util.UUID;

import org.locationtech.jts.geom.Point;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.model.Profile;

public interface ProfileRepository extends JpaRepository<Profile, UUID> {

    @Query(value = "SELECT * FROM profiles p WHERE p.role = 'sitter' AND ST_DWithin(p.location, :point, :radiusInMeters)", nativeQuery = true)
    List<Profile> findSittersNearby(@Param("point") Point point, @Param("radiusInMeters") double radiusInMeters);
}