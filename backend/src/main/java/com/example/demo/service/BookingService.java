package com.example.demo.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.demo.model.Booking;
import com.example.demo.model.BookingStatus;
import com.example.demo.repository.BookingRepository;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public Booking createBooking(Booking booking) {
        // validate time
        if (booking.getEndTime().isBefore(booking.getStartTime())) {
            throw new IllegalArgumentException("End time cannot be before start time");
        }

        // check for double booking
        List<Booking> conflicts = bookingRepository.findOverlappingBookings(
            booking.getSitterId(), 
            booking.getStartTime(), 
            booking.getEndTime()
        );

        if (!conflicts.isEmpty()) {
            throw new IllegalStateException("This sitter is already booked for that time slot!");
        }

        // set defaults
        booking.setStatus(BookingStatus.PENDING);
        
        return bookingRepository.save(booking);
    }

    public List<Booking> getMyBookings(UUID userId) {
        // returns bookings where you are the owner
        return bookingRepository.findByOwnerId(userId);
    }

    public List<Booking> getSitterBookings(UUID sitterId) {
        return bookingRepository.findBySitterId(sitterId);
    }

    public Booking updateBookingStatus(UUID bookingId, BookingStatus status, UUID sitterId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getSitterId().equals(sitterId)) {
            throw new RuntimeException("Only the assigned sitter can update this booking");
        }

        booking.setStatus(status);
        return bookingRepository.save(booking);
    }
}
