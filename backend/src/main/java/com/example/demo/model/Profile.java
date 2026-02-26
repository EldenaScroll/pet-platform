package com.example.demo.model;
import java.util.UUID;

import org.locationtech.jts.geom.Point;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column; // The class for Spatial Data
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "profiles", schema = "public")
public class Profile {

    @Id
    private UUID id;
    
    private String email;
    private String role;
    
    @Column(name = "full_name")
    private String fullName;

    @Column(name = "zip_code")
    private String zipCode;

    private String bio;

    // The PostGIS Column
    @JsonIgnore 
    @Column(columnDefinition = "geography(Point,4326)")
    private Point location;

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getZipCode() { return zipCode; }
    public void setZipCode(String zipCode) { this.zipCode = zipCode; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public Point getLocation() { return location; }
    public void setLocation(Point location) { this.location = location; }
    
    public Double getLongitude() {
        if (location == null) return null;
        return location.getX();
    }

    public Double getLatitude() {
        if (location == null) return null;
        return location.getY();
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getEmail() {
        return email;
    }
}
