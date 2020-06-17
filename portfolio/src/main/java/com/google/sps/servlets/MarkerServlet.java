package com.google.sps.servlets;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.sps.data.Marker;
import com.google.gson.Gson;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Handles fetching and saving markers data. */
@WebServlet("/markers")
public class MarkerServlet extends HttpServlet {

  private Collection<Marker> getMarkers() {
    Query query = new Query("Marker");
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery results = datastore.prepare(query);

    Collection<Marker> markers = new ArrayList<>();
    for (Entity entity : results.asIterable()) {
      double latitude = (double) entity.getProperty("latitude");
      double longitude = (double) entity.getProperty("longitude");
      String name = (String) entity.getProperty("name");
      String content = (String) entity.getProperty("content");

      Marker marker = new Marker(latitude, longitude, name, content);
      markers.add(marker);
    }

    return markers;
  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    Collection<Marker> markers = getMarkers();

    response.setContentType("application/json");
    Gson gson = new Gson();
    String json = gson.toJson(markers);

    response.getWriter().println(json);
  }

}
