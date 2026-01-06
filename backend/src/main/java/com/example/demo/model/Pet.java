package com.example.demo.model;


import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Data
@Entity
@Table(name = "pets", schema = "public")
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "owner_id", nullable = false)
    private UUID ownerId;

    @Column(nullable = false)
    private String name;

    private String breed;
    private Integer age;

    @Column(name = "image_url")
    private String imageUrl;

}
