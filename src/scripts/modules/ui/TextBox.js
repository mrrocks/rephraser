const textBox = document.getElementById("textBox");
textBox.addEventListener("paste", removeTextFormating);

function initTextBox() {
  textBox.addEventListener("mousedown", preventSelection);
  textBox.addEventListener("dblclick", highlightWord);
}

function getCaretPosition(x, y) {
  return document.caretPositionFromPoint
    ? document.caretPositionFromPoint(x, y)
    : document.caretRangeFromPoint(x, y);
}

function preventSelection(event) {
  if (event.detail > 1) {
    event.preventDefault();
    textBox.style.userSelect = "none";
  }
}

function highlightWord(event) {
  textBox.style.userSelect = "auto";
  const word = findWordAtCoordinates(
    event.target,
    event.clientX,
    event.clientY
  );
  word && toggleHighlight(word);

  updateCaretPosition(event.clientX, event.clientY);
}

function updateCaretPosition(x, y) {
  const caretPos = getCaretPosition(x, y);

  if (!caretPos) return;

  const textNode = caretPos.offsetNode || caretPos.startContainer;
  const offset = caretPos.offset || caretPos.startOffset;
  const range = document.createRange();
  const selection = window.getSelection();

  range.setStart(textNode, offset);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
}

function toggleHighlight(word) {
  isHighlighted(word.node) ? removeHighlight(word.node) : applyHighlight(word);
}

function createHighlightedSpan() {
  const span = document.createElement("span");
  span.className = "marked";
  return span;
}

function isHighlighted(node) {
  return node.parentElement.classList.contains("marked");
}

function removeHighlight(node) {
  const textNode = document.createTextNode(node.parentElement.textContent);
  node.parentElement.replaceWith(textNode);
}

function applyHighlight(word) {
  const range = document.createRange();
  const highlightedWord = createHighlightedSpan();
  range.setStart(word.node, word.startOffset);
  range.setEnd(word.node, word.endOffset);
  range.surroundContents(highlightedWord);
}

function findWordAtCoordinates(element, x, y) {
  const caretPos = getCaretPosition(x, y);

  if (!caretPos) return null;

  const textNode = caretPos.offsetNode || caretPos.startContainer;
  const offset = caretPos.offset || caretPos.startOffset;
  const text = textNode.textContent;
  const startOffset = text.lastIndexOf(" ", offset) + 1;
  const endOffset = findWordEndOffset(text, offset);

  return { node: textNode, startOffset, endOffset };
}

function findWordEndOffset(text, offset) {
  const endOffset = text.indexOf(" ", offset);
  return endOffset === -1 ? text.length : endOffset;
}

function getHighlightedWords() {
  const markedElements = textBox.querySelectorAll(".marked");
  const markedWordsArray = Array.from(markedElements, (el) =>
    el.innerText.replace(/[^\w\s]/gi, "").trim()
  );
  return markedWordsArray
    .map((word, idx, arr) =>
      idx === arr.length - 1 && idx !== 0 ? ` and "${word}"` : `"${word}"`
    )
    .join(", ");
}

function removeTextFormating(e) {
  e.preventDefault();
  const plainText = e.clipboardData.getData("text/plain");
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  range.deleteContents();
  range.insertNode(document.createTextNode(plainText));
  range.setStartAfter(range.endContainer);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
}

export { textBox, initTextBox, getHighlightedWords };
