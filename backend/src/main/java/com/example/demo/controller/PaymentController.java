package com.example.demo.controller;

import java.math.BigDecimal;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Booking;
import com.example.demo.repository.BookingRepository;
import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final BookingRepository bookingRepository;


    public PaymentController(BookingRepository bookingRepository, @Value("${stripe.secret.key}") String stripeKey) {
        this.bookingRepository = bookingRepository;
        Stripe.apiKey = stripeKey; // initialize Stripe
    }

    @PostMapping("/create-checkout-session")
    public String createCheckoutSession(@RequestParam UUID bookingId) {
        // find the booking
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // calculate amount
        long amountInCents = booking.getTotalPrice().multiply(new BigDecimal(100)).longValue();

        // create the stripe session
        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("http://localhost:5173/success") // where to go after payment
                .setCancelUrl("http://localhost:5173/search")  // where to go if they cancel
                .addLineItem(SessionCreateParams.LineItem.builder()
                        .setQuantity(1L)
                        .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                                .setCurrency("usd")
                                .setUnitAmount(amountInCents)
                                .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                        .setName("Pet Service Booking")
                                        .setDescription("Booking ID: " + booking.getId())
                                        .build())
                                .build())
                        .build())
                .build();

        try {
            Session session = Session.create(params);
            return session.getUrl(); // return the Stripe URL to the frontend
        } catch (Exception e) {
            throw new RuntimeException("Error creating Stripe session: " + e.getMessage());
        }
    }
}
