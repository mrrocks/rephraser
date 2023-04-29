// app.js

import { initAnalytics } from "./modules/analytics";
import { toggleSpinner } from "./modules/ui";
import { initSegmentedControl } from "./modules/ui/SegmentedControl";
import { rephraseText } from "./modules/rephrase";
import {
  textBox,
  initTextBox,
  getHighlightedWords,
} from "./modules/ui/TextBox";

initAnalytics();
initTextBox();

const form = document.getElementById("rephrase-form");
const toneSelect = document.getElementById("tone-select");
const formatSelect = document.getElementById("format-select");
const maintainLengthCheck = document.getElementById("maintain-length");
const rephrasedText = document.getElementById("rephrased-text");
const spinner = document.getElementById("spinner");
const readabilitySelect = document.getElementById("readability-select");

toggleSpinner(spinner, false);

initSegmentedControl("variations-segmented-control", (selectedValue) => {});

form.addEventListener("submit", handleSubmit);

async function handleSubmit(event) {
  event.preventDefault();
  const text = textBox.innerText;
  const highlightedWords = getHighlightedWords();

  if (text) {
    const requestOptions = {
      tone: toneSelect.value,
      format: formatSelect.value,
      maintainOriginalLength: maintainLengthCheck.checked,
      variations: parseInt(
        document.querySelector(".segment.selected").dataset.value
      ),
      readability: readabilitySelect.value,
      highlightedWords: highlightedWords,
    };

    toggleSpinner(spinner, true);
    rephrasedText.innerHTML = await rephraseText(text, requestOptions);
    toggleSpinner(spinner, false);
  } else {
    rephrasedText.innerText = "Please enter some text to rephrase.";
  }
}
