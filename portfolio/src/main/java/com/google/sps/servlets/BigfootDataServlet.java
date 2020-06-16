package com.google.sps.servlets;

import com.google.sps.data.BigfootSighting;
import com.google.gson.Gson;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Scanner;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Returns Bigfoot data as a JSON array*/
@WebServlet("/bigfoot-data")
public class BigfootDataServlet extends HttpServlet {
  
  private Collection<BigfootSighting> bigfootSightings;

  @Override 
  public void init() {
    bigfootSightings = new ArrayList<>();
    Scanner scanner = new Scanner(getServletContext().getResourceAsStream("/WEB-INF/bf-data.csv"));
    scanner.nextLine(); //skip header line

    while (scanner.hasNextLine()) {
      String line = scanner.nextLine();
      String[] cells = line.split(",");

      // Because bf-data.csv file has inconsistent style, thus doesn't always split as columns
      // when line is split by comma.
      int lastIndex = cells.length - 1 ;
      double lat = Double.parseDouble(cells[lastIndex-1]);
      double lng = Double.parseDouble(cells[lastIndex]);

      bigfootSightings.add(new BigfootSighting(lat, lng));
    }
    scanner.close();
  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("application/json");
    Gson gson = new Gson();
    String json = gson.toJson(bigfootSightings);
    response.getWriter().println(json);
  }
}
