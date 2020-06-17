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
var topic = "";

const TOPIC_ELEMENT_MAP = new Map([
  ['book recommendation', ['Rangers', 'Exhalation', 'The Elegant Universe', 'Human Acts']],
  ['tv show recommendation', ['Brookyln Nine Nine', 'Designated Survivor', 'Person of Interest', 'The Good Place', 'Broadchurch']],
  ['korean phrase', ['안녕하세요!', '좋은 하루 되세요!', '오늘 날씨는 어떤가요?', '졸려요', '고맙습니다']],
  ['thing I like', ['Penguin', 'Blue', 'Baseball', 'Cheesecake']],
]);

let currentMarker;
let map;

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
  if (topic.length == 0) {
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
  const date = (new Date(comment.timestamp)).toDateString();
  addInfoElement.innerText = `Written by: ${comment.username} | ${date}`;
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
  commentID.className = "invisible-form";

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

function setSelectValues() {
  const params = (new URL(document.location)).searchParams;
  const maxNumComments = params.get("num-comments");
  const sortType = params.get("sort-comments");
  const comments = params.get("comments");
  if (maxNumComments) {
    console.log(maxNumComments);
    document.getElementById(maxNumComments).setAttribute("selected", "selected");
  }
  if (sortType) {
    console.log(sortType);
    document.getElementById(sortType).setAttribute("selected", "selected");
  }
  if (comments) {
    window.history.replaceState({}, document.title, "/" + "index.html");
    window.location.hash = "#comments";
  }
}

function generateUrlQuery() {
  const maxNumComments = document.getElementById("num-comments").value;
  const sortType = document.getElementById("sort-comments").value;
  const language = document.getElementById("lang-comments").value;

  document.getElementById("comment-form-num-comments").setAttribute("value", maxNumComments);
  document.getElementById("comment-form-sort-comments").setAttribute("value", sortType);

  const searchParams = new URLSearchParams();
  searchParams.append("num-comments", maxNumComments);
  searchParams.append("sort-comments", sortType);
  searchParams.append("lang-comments", language);
  return searchParams;
}

/**
 * Fetch comments from the server and display it on the page
 */
async function getCommentsfromServer() {
  const searchParams = generateUrlQuery();

  const response = await fetch('/data?' + searchParams);
  const comments = await response.json();

  const commentsListElement = document.getElementById('comments-container');
  commentsListElement.innerHTML = '';

  for (var i = 0; i < comments.length; i++) {
    commentsListElement.appendChild(createCommentsListElement(comments[i]));
  }
}

function onload() {
  setSelectValues();
  getCommentsfromServer();
}

function initMap() {
  map = new google.maps.Map(
    document.getElementById('map'),
    { center: { lat: 37.422, lng: -122.084 }, zoom: 10 });

  map.addListener('click', (event) => {
    createMarker(event.latLng.lat(), event.latLng.lng());
  });

  getMarkersfromServer();
}

/** Fetches bigfoot sightings data from the server and displays it in a map. */
async function createBigfootSightingsMap() {
  const response = await fetch('/bigfoot-data');
  const bigfootSightings = await response.json();

  const map = new google.maps.Map(
    document.getElementById('map'),
    { center: { lat: 35.78613674, lng: -119.4491591 }, zoom: 7 });

  bigfootSightings.forEach((bigfootSighting) => {
    new google.maps.Marker(
      { position: { lat: bigfootSighting.latitude, lng: bigfootSighting.longitude }, map: map });
  });
}

async function getMarkersfromServer() {
  const response = await fetch('/markers');
  const markers = await response.json();

  markers.forEach((marker) => {
    displayMarker(marker.latitude, marker.longitude, marker.name, marker.content);
  });
}

/** Creates a marker that shows info-window when clicked */
function displayMarker(latitude, longitude, name, content) {
  const marker = new google.maps.Marker({ position: { lat: latitude, lng: longitude }, map: map });
  const infoWindow = new google.maps.InfoWindow({ content: `${content} - Submitted by: ${name}` });

  marker.addListener('click', () => {
    infoWindow.open(map, marker);
  });
}

function postMarker(latitude, longitude, name, content) {
  const searchParams = new URLSearchParams();
  searchParams.append('latitude', latitude);
  searchParams.append('longitude', longitude);
  searchParams.append('name', name);
  searchParams.append('content', content);

  fetch('/markers', { method: 'POST', body: searchParams });
}

function createMarker(latitude, longitude) {
  // If there is a marker user is editing on the map, remove it
  if (currentMarker) {
    currentMarker.setMap(null);
  }

  currentMarker = new google.maps.Marker({ position: { lat: latitude, lng: longitude }, map: map });

  const infoWindow = new google.maps.InfoWindow({ content: createWindowInput(latitude, longitude) });

  google.maps.event.addListener(infoWindow, 'closeclick', () => {
    currentMarker.setMap(null);
  });

  infoWindow.open(map, currentMarker);
}

function createWindowInput(latitude, longitude) {
  const name = document.createElement('input');
  name.setAttribute("type", 'text');
  name.setAttribute("value", 'Anonymous');
  name.setAttribute("onfocus", "this.value=''")
  const content = document.createElement('textarea');
  content.setAttribute("placeholder", 'Description');
  const submit = document.createElement('button');
  submit.innerText = "Submit";

  submit.onclick = () => {
    postMarker(latitude, longitude, name.value, content.value);
    displayMarker(latitude, longitude, name.value, content.value);
    currentMarker.setMap(null);
  };

  const infoWindow = document.createElement('div');
  infoWindow.appendChild(name);
  infoWindow.appendChild(document.createElement('br'));
  infoWindow.appendChild(content);
  infoWindow.appendChild(document.createElement('br'));
  infoWindow.appendChild(submit);

  return infoWindow;
}
