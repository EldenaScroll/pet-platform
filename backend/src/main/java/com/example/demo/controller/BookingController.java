package com.example.demo.controller;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Booking;
import com.example.demo.model.BookingStatus;
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

    // GET /api/bookings -> List owner's bookings
    @GetMapping
    public List<Booking> getMyBookings(@AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        return bookingService.getMyBookings(userId);
    }

    // GET /api/bookings/sitter -> List sitter's incoming requests
    @GetMapping("/sitter")
    public List<Booking> getSitterBookings(@AuthenticationPrincipal Jwt jwt) {
        UUID sitterId = UUID.fromString(jwt.getSubject());
        return bookingService.getSitterBookings(sitterId);
    }

    // PUT /api/bookings/{id}/status -> Accept or Reject
    @PutMapping("/{id}/status")
    public Booking updateBookingStatus(@PathVariable UUID id, @RequestBody Map<String, String> body, @AuthenticationPrincipal Jwt jwt) {
        UUID sitterId = UUID.fromString(jwt.getSubject());
        BookingStatus status = BookingStatus.valueOf(body.get("status"));
        return bookingService.updateBookingStatus(id, status, sitterId);
    }
}
