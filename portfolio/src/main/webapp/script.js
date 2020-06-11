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

// Global variable to track which topic has been randomly selected. 
// Initialize to empty string to represent no topic is selected when page is first loaded. 
var topic="";

const TOPIC_ELEMENT_MAP = new Map([
  ['book recommendation', ['Rangers', 'Exhalation', 'The Elegant Universe', 'Human Acts']],
  ['tv show recommendation', ['Brookyln Nine Nine', 'Designated Survivor', 'Person of Interest', 'The Good Place', 'Broadchurch']],
  ['korean phrase', ['안녕하세요!', '좋은 하루 되세요!', '오늘 날씨는 어떤가요?', '졸려요', '고맙습니다']],
  ['thing I like', ['Penguin', 'Blue', 'Baseball', 'Cheesecake']],
]);

/**
 * Gets a random element of a given array.
 */
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Displays the text in the element in the page with given id.
 */
function setElementText(text, id) {
  const container = document.getElementById(id);
  container.innerText = text;
}

/**
 * Generate random topic and display its description on the page.
 */
function getRandomTopic() {
  const TOPICS = Array.from(TOPIC_ELEMENT_MAP.keys());
  topic = getRandomElement(TOPICS);
  setElementText(topic, 'topic-container'); 
}

/**
 * Generate random element from topic if topic is valid and display it on the page.  
 */
function getRandomElementfromTopic() {
  if (topic.length == 0){ 
      setElementText('You have to select topic first!', 'elem-container');
      return;
  }
  let elemArr = TOPIC_ELEMENT_MAP.get(topic);
  let elem = getRandomElement(elemArr)
  setElementText(elem, 'elem-container');
}

/**
 * Creates an <li> element for comments-container containing text. 
 */
function createCommentsListElement(comment) {
  const liElement = document.createElement('li');

  const addInfoElement = document.createElement('p');
  const date = new Date(comment.timestamp);
  addInfoElement.innerText = "Written by: "+ comment.username + " | " + date.toDateString();
  liElement.appendChild(addInfoElement);

  const commentElement = document.createElement('p');
  commentElement.innerText = comment.text;
  liElement.appendChild(commentElement);

  const deleteButtonElement = document.createElement('button');
  deleteButtonElement.innerText = "Delete";
  deleteButtonElement.addEventListener('click', () => {
    const passwordForm = createPasswordForm(comment);
    liElement.appendChild(passwordForm);
    deleteButtonElement.disabled = true;
  });
  liElement.appendChild(deleteButtonElement);

  return liElement;
}

function createPasswordForm(comment) {
  const passwordForm = document.createElement('form');
  passwordForm.setAttribute('method', "POST");
  passwordForm.setAttribute('action', "/delete-data");
  passwordForm.className = "passwordForm";

  const label = document.createElement('label');
  label.innerText = "Password:";
  label.setAttribute("for", "user-pwd");

  const userPassword = document.createElement('input');
  userPassword.setAttribute('type', "password");
  userPassword.setAttribute('name', "user-pwd");

  const commentID = document.createElement('input');
  commentID.setAttribute('type', 'text');
  commentID.setAttribute('name', "id");
  commentID.setAttribute('value', comment.id);
  commentID.className = "comment-id";

  const submitButton = document.createElement('input');
  submitButton.setAttribute('type', "submit");

  passwordForm.appendChild(label);
  passwordForm.appendChild(userPassword);
  passwordForm.appendChild(submitButton);
  passwordForm.appendChild(commentID);

  passwordForm.onsubmit = async function() {
    await getCommentsfromServer();
    deleteResult();
  };
  
  return passwordForm;
}

async function deleteResult() {
  const response = await fetch('/delete-data');
  const matchResult = await response.text();
  alert(matchResult);
}

/**
 * Fetch comments from the server and display it on the page
 */
async function getCommentsfromServer() {
  var maxNumComments = document.getElementById("num-comments").value;

  const response = await fetch('/data?num-comments=' + maxNumComments);
  const comments = await response.json();
  
  const commentsListElement = document.getElementById('comments-container');
  commentsListElement.innerHTML = '';
  for (var i = 0; i < comments.length; i++) {
    commentsListElement.appendChild(createCommentsListElement(comments[i]));
  }
}
