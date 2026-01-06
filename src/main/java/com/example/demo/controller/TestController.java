package com.example.demo.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/test")
    public String hello(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject(); 
        return "Hello! Your Supabase User ID is: " + userId;
    }
}
