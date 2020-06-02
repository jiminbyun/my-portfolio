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
 * Gets random valid index of an array
 */
function getRandomIndex(array) {
  return Math.floor(Math.random() * array.length);
}

var index = -1;
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

function getRandomTopic() {
  const topics = ['book recommendation', 'tv show recommendation', 'korean phrase', 'thing I like'];

  index = getRandomIndex(topics);
  addTexttoPage(topics[index], 'topic-container'); 
}

function getRandomElementfromTopic(){
  if (index == -1){
      addTexttoPage('You have to select topic first!', 'elem-container');
      return;
  }
  const elemIndex = getRandomIndex(cumultative[index]);
  addTexttoPage(cumultative[index][elemIndex], 'elem-container');
}

function addTexttoPage(text, id){
  const container = document.getElementById(id);
  container.innerText = text;
}