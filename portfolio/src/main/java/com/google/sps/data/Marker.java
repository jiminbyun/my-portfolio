package com.google.sps.data;

/** Represents a marker on the map. */
public class Marker {

  private final double latitude;
  private final double longitude;
  private final String name;
  private final String content;

  public Marker(double latitude, double longitude, String name, String content) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.name = name;
    this.content = content;
  }

  public double getLatitude() {
    return latitude;
  }

  public double getLongitude() {
    return longitude;
  }

  public String getName() {
    return name;
  }

  public String getContent() {
    return content;
  }
}
