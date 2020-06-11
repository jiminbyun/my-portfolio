package com.google.sps.servlets;

import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import java.util.ArrayList;
import java.util.List;
import com.google.sps.data.Comment;

/** Server that deletes comments **/
@WebServlet("/delete-data")
public class DeleteDataServlet extends HttpServlet {

  @Override 
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    response.setContentType("text/plain;");

    String userPassword = request.getParameter("user-pwd");
    long id = Long.parseLong(request.getParameter("id"));
    Key commentKey = KeyFactory.createKey("Comment", id);
    String commentPassword = "";
    try {
      commentPassword = (String) datastore.get(commentKey).getProperty("password");
    } catch (Exception exception) {
      response.getWriter().println(exception);
      return;
    }

    if(commentPassword.equals(userPassword)) {
      datastore.delete(commentKey);
      response.getWriter().println("Deleted!");
    } else {
      response.getWriter().println("Incorrect Password. Try again.");
    }
  }
}