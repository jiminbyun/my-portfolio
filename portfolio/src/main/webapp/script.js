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

async function getGreetingfromServer() {
  const response = await fetch('/data');
  const comments = await response.json();
  console.log(comments);
  console.log(comments[1]);
}
