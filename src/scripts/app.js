import { initAnalytics } from "./modules/analytics";
import { toggleSpinner, initSegmentedControl } from "./modules/ui";
import { rephraseText } from "./modules/rephrase";
import { textBox, initTextBox, extractMarkedWords } from "./modules/ui/TextBox";

initAnalytics();
initTextBox();

const form = document.getElementById("rephrase-form");
const toneSelect = document.getElementById("tone-select");
const formatSelect = document.getElementById("format-select");
const maintainLengthCheck = document.getElementById("maintain-length");
const rephrasedText = document.getElementById("rephrased-text");
const spinner = document.getElementById("spinner");
const readabilitySelect = document.getElementById("readability-select");
const segmentedControl = document.getElementById(
  "variations-segmented-control"
);
const segments = segmentedControl.getElementsByClassName("segment");

toggleSpinner(spinner, false);
initSegmentedControl(segmentedControl, segments);

form.addEventListener("submit", handleSubmit);

async function handleSubmit(event) {
  event.preventDefault();
  const text = textBox.innerText;
  const markedWords = extractMarkedWords();

  if (text) {
    const requestOptions = {
      tone: toneSelect.value,
      format: formatSelect.value,
      maintainOriginalLength: maintainLengthCheck.checked,
      variations: parseInt(
        document.querySelector(".segment.selected").dataset.value
      ),
      readability: readabilitySelect.value,
      markedWords: markedWords,
    };
    console.log(markedWords);
    toggleSpinner(spinner, true);
    rephrasedText.innerHTML = await rephraseText(text, requestOptions);
    toggleSpinner(spinner, false);
  } else {
    rephrasedText.innerText = "Please enter some text to rephrase.";
  }
}
