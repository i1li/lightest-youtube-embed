function shuffle(array, limit = Infinity) {
  if (array.length === 1) {
    return array;
  } else
  if (array.length < Math.min(limit * 2, array.length)) {
    const result = [];
    const indices = new Set();
    while (indices.size < Math.min(limit, array.length)) {
      const randomIndex = Math.floor(Math.random() * array.length);
      indices.add(randomIndex);
    }
    for (const index of indices) {
      result.push(array[index]);
    }
    return result;
  } else {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array.slice(0, Math.min(limit, array.length));
  }
}
const shuffleDiv = document.getElementById('shuffle');
const elements = [...shuffleDiv.querySelectorAll('y-t')];
let combinedElements = [];
let elementIdsMap = new Map();
function processAndCombine(element, index) {
  if (processedElements.has(index)) {
    return;
  }
  const elementIdsString = element.getAttribute('v');
  let elementIds;
  if (elementIdsMap.has(index)) {
    elementIds = elementIdsMap.get(index);
  } else {
    elementIds = elementIdsString.split(',');
    elementIdsMap.set(index, elementIds);
  }
  const limitedIds = shuffle(elementIds, 3);
  limitedIds.forEach(id => combinedElements.push(id.split('?')[0]));
  const shuffledArray = shuffle(elementIds, 150);
  element.setAttribute('v', shuffledArray.join(','));
  processedElements.add(index);
  if (index < elements.length - 1) {
    processAndCombine(elements[index + 1], index + 1);
  }
  else {
    const combo = document.getElementById('combined-list');
    const comboElement = combo.querySelector('y-t');
    const uniqueCombinedElements = [...new Set(combinedElements)];
    const shuffledCombinedElements = shuffle(uniqueCombinedElements, 150);
    comboElement.setAttribute('v', shuffledCombinedElements.join(','));
  }
}
let processedElements = new Set();
processAndCombine(elements[0], 0);
function shuffleAndDraw() {
  shuffle(elements);
  let currentIndex = 0;
  let draw = document.getElementById('draw');
  const clonedElement = elements[currentIndex].cloneNode(false);
  processAndCombine(clonedElement, currentIndex);
  draw.appendChild(clonedElement);
  let next = document.querySelector("#next");
  next.addEventListener('click', function() {
    currentIndex = (currentIndex + 1) % elements.length;
    draw.innerHTML = '';
    const clonedElement = elements[currentIndex].cloneNode(false);
    processAndCombine(clonedElement, currentIndex);
    draw.appendChild(clonedElement);
  });
}
shuffleAndDraw();
