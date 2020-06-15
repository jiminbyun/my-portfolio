package com.google.sps.data;

public final class Comment {

  private final long id;
  private final String username;
  private final String password;
  private final long timestamp;
  private final String text;

  public Comment(long id, String username, String pwd, long timestamp, String text) {
    this.id = id;
    this.username = username;
    this.password = pwd;
    this.timestamp = timestamp;
    this.text = text;
  }
}
