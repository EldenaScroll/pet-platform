package com.example.demo.service;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
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
            
            JsonNode[] response = restTemplate.getForObject(url, JsonNode[].class);

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
