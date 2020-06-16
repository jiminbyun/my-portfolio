// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;

import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.cloud.translate.Translate;
import com.google.cloud.translate.TranslateOptions;
import com.google.cloud.translate.Translation;
import java.util.ArrayList;
import java.util.List;
import com.google.gson.Gson;
import com.google.sps.data.Comment;

/** Servlet that returns some example content. TODO: modify this file to handle comments data */
@WebServlet("/data")
public class DataServlet extends HttpServlet {

  private String convertToJson(List array) {
    Gson gson = new Gson();
    String json = gson.toJson(array);
    return json;
  }

  private List<Comment> getComments(int maxNumComments, String sortType, String language) {
    Query query = new Query("Comment");
    switch (sortType) {
      case "latest":
        query.addSort("timestamp", SortDirection.DESCENDING);
        break;
      case "oldest":
        query.addSort("timestamp", SortDirection.ASCENDING);
        break;
      case "name_ascend":
        query.addSort("username", SortDirection.ASCENDING);
        break;
      case "name_descend":
        query.addSort("username", SortDirection.DESCENDING);
    }

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery results = datastore.prepare(query);
    Translate translate = TranslateOptions.getDefaultInstance().getService();

    List<Comment> comments = new ArrayList<>();
    for (Entity entity : results.asIterable(FetchOptions.Builder.withLimit(maxNumComments))) {
      long id = entity.getKey().getId();
      String username = (String) entity.getProperty("username");
      String password = (String) entity.getProperty("password");
      long timestamp = (long) entity.getProperty("timestamp");
      String commentText = (String) entity.getProperty("text");
      Translation translation = translate.translate(commentText, Translate.TranslateOption.targetLanguage(language));
      String translatedText = translation.getTranslatedText();

      Comment comment = new Comment (id, username, password, timestamp, translatedText);
      comments.add(comment);
    }

    return comments;
  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    int maxNumComments = Integer.parseInt(getParameter(request, "num-comments", "5"));
    String sortType = getParameter(request, "sort-comments", "latest");
    String language = getParameter(request, "lang-comments", "en");

    List<Comment> comments = getComments(maxNumComments, sortType, language);

    response.setContentType("application/json; charset=UTF-8");
    response.setCharacterEncoding("UTF-8");
    response.getWriter().println(convertToJson(comments));
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String commentText = getParameter(request, "comment-input", "");
    String username = getParameter(request, "username", "Anonymous");
    String password = getParameter(request, "pwd", "");
    String maxNumComments = getParameter(request, "num-comments", "10");
    String sortType = getParameter(request, "sort-comments", "latest");

    if (!commentText.isEmpty()) {
      long timestamp = System.currentTimeMillis();

      Entity commentEntity = new Entity("Comment");
      commentEntity.setProperty("username", username);
      commentEntity.setProperty("password", password);
      commentEntity.setProperty("timestamp", timestamp);
      commentEntity.setProperty("text", commentText);

      DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
      datastore.put(commentEntity);
    }

    response.sendRedirect("/index.html?comments=true&num-comments="+maxNumComments+"&sort-comments="+sortType);
  }

  /**
   * @return the request parameter, or the default value if the parameter
   *         was not specified by the client
   */
  private String getParameter(HttpServletRequest request, String name, String defaultValue) {
    String value = request.getParameter(name);
    if (value == null) {
      return defaultValue;
    }
    return value;
  }
}
