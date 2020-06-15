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
import java.lang.Long;
import com.google.sps.data.Comment;

/** Server that deletes comments **/
@WebServlet("/delete-data")
public class DeleteDataServlet extends HttpServlet {

  private String message = "";

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("text/plain;");
    response.getWriter().println(message);
  }

  @Override 
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

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

    if (commentPassword.equals(userPassword)) {
      datastore.delete(commentKey);
      message = "Deleted!";
    } else {
      message = "Incorrect Password. Try again";
    }

    response.sendRedirect("/index.html#comments");
  }
}
