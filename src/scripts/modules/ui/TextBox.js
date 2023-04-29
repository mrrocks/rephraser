const textBox = document.getElementById("textBox");
textBox.addEventListener("paste", handlePaste);

function initTextBox() {
  textBox.addEventListener("mousedown", preventTextSelectionOnMultiClick);
  textBox.addEventListener("dblclick", selectAndHighlightWord);
}

function preventTextSelectionOnMultiClick(event) {
  if (event.detail > 1) {
    event.preventDefault();
    textBox.style.userSelect = "none";
  }
}

function selectAndHighlightWord(event) {
  textBox.style.userSelect = "auto";
  const word = getWordAtCoordinates(event.target, event.clientX, event.clientY);
  word && toggleWordHighlight(word);

  setCaretPosition(event.clientX, event.clientY);
}

function setCaretPosition(x, y) {
  const caretPos = document.caretPositionFromPoint
    ? document.caretPositionFromPoint(x, y)
    : document.caretRangeFromPoint(x, y);

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

function toggleWordHighlight(word) {
  isWordHighlighted(word.node)
    ? unhighlightWord(word.node)
    : highlightWord(word);
}

function createHighlightedWord() {
  const span = document.createElement("span");
  span.className = "marked";
  return span;
}

function isWordHighlighted(node) {
  return node.parentElement.classList.contains("marked");
}

function unhighlightWord(node) {
  const textNode = document.createTextNode(node.parentElement.textContent);
  node.parentElement.replaceWith(textNode);
}

function highlightWord(word) {
  const range = document.createRange();
  const highlightedWord = createHighlightedWord();
  range.setStart(word.node, word.startOffset);
  range.setEnd(word.node, word.endOffset);
  range.surroundContents(highlightedWord);
}

function getWordAtCoordinates(element, x, y) {
  const caretPos = document.caretPositionFromPoint
    ? document.caretPositionFromPoint(x, y)
    : document.caretRangeFromPoint(x, y);

  if (!caretPos) return null;

  const textNode = caretPos.offsetNode || caretPos.startContainer;
  const offset = caretPos.offset || caretPos.startOffset;
  const text = textNode.textContent;
  const startOffset = text.lastIndexOf(" ", offset) + 1;
  const endOffset = findEndOffset(text, offset);

  return { node: textNode, startOffset, endOffset };
}

function findEndOffset(text, offset) {
  const endOffset = text.indexOf(" ", offset);
  return endOffset === -1 ? text.length : endOffset;
}

function extractMarkedWords() {
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

function handlePaste(e) {
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

export { textBox, initTextBox, extractMarkedWords };
