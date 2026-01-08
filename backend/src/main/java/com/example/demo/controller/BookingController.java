package com.example.demo.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Booking;
import com.example.demo.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // POST /api/bookings -> Create a Request
    @PostMapping
    public Booking createBooking(@RequestBody Booking booking, @AuthenticationPrincipal Jwt jwt) {
        // The logged-in user is the Owner
        UUID ownerId = UUID.fromString(jwt.getSubject());
        booking.setOwnerId(ownerId);
        
        return bookingService.createBooking(booking);
    }

    // GET /api/bookings -> List my history
    @GetMapping
    public List<Booking> getMyBookings(@AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        return bookingService.getMyBookings(userId);
    }
}
