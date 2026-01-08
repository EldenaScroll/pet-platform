package com.example.demo.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.model.Booking;

public interface BookingRepository extends JpaRepository<Booking, UUID> {

    // Find bookings for a specific user (Owner OR Sitter)
    List<Booking> findByOwnerId(UUID ownerId);
    List<Booking> findBySitterId(UUID sitterId);

    // Returns a list of bookings that crash with the requested time.
    // only care if the status is NOT rejected or cancelled.
    @Query("SELECT b FROM Booking b WHERE b.sitterId = :sitterId " +
           "AND b.status != 'REJECTED' " +
           "AND b.startTime < :endTime " +
           "AND b.endTime > :startTime")
    List<Booking> findOverlappingBookings(
        @Param("sitterId") UUID sitterId, 
        @Param("startTime") LocalDateTime startTime, 
        @Param("endTime") LocalDateTime endTime);
}
