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

/**
 * Gets random valid index of an given array
 */
function getRandomIndex(array) {
  return Math.floor(Math.random() * array.length);
}

/**
 * Displays the text in the element in the page with given id
 */
function addTexttoPage(text, id){
  const container = document.getElementById(id);
  container.innerText = text;
}

// Global variable to track which topic has been randomly selected. 
// Initialize to -1 to represent no topic is selected when page is first loaded. 
var topicIndex = -1;
const books =
  ['Rangers', 'Exhalation', 'The Elegant Universe', 'Human Acts'];
const tvshows =
  ['Brookyln Nine Nine', 'Designated Survivor', 'Person of Interest', 'The Good Place', 'Broadchurch'];
const korean =
  ['안녕하세요!', '좋은 하루 되세요!', '오늘 날씨는 어떤가요?', '졸려요', '고맙습니다'];
const misc =
  ['Penguin', 'Blue', 'Baseball', 'Cheesecake'];
const cumultative =
  [books, tvshows, korean, misc];

/**
 * Generate random topic and display its description on the page 
 */
function getRandomTopic() {
  const topics = ['book recommendation', 'tv show recommendation', 'korean phrase', 'thing I like'];

  topicIndex = getRandomIndex(topics);
  addTexttoPage(topics[topicIndex], 'topic-container'); 
}

/**
 * Generate random element from topic if topic is valid and display it on the page.  
 */
function getRandomElementfromTopic(){
  if (topicIndex == -1){ 
      addTexttoPage('You have to select topic first!', 'elem-container');
      return;
  }
  const elemIndex = getRandomIndex(cumultative[topicIndex]);
  addTexttoPage(cumultative[topicIndex][elemIndex], 'elem-container');
}
