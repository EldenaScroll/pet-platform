package com.example.demo.service;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import tools.jackson.databind.JsonNode;

@Service
public class GeocodingService {

    private final GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
    private final RestTemplate restTemplate = new RestTemplate();

    public Point getPointFromZip(String zipCode) {
        try {
            // Free API
            String url = "https://nominatim.openstreetmap.org/search?postalcode=" + zipCode + "&country=USA&format=json";

            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "PetPlatform/1.0");
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<JsonNode[]> responseEntity = restTemplate.exchange(url, HttpMethod.GET, entity, JsonNode[].class);
            JsonNode[] response = responseEntity.getBody();

            if (response != null && response.length > 0) {
                double lat = response[0].get("lat").asDouble();
                double lon = response[0].get("lon").asDouble();
                return geometryFactory.createPoint(new Coordinate(lon, lat));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
