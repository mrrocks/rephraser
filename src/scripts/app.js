import { initAnalytics } from "./modules/analytics";
import { toggleSpinner, initSegmentedControl } from "./modules/ui";
import { rephraseText } from "./modules/rephrase";

initAnalytics();

const form = document.getElementById("rephrase-form");
const inputText = document.getElementById("input-text");
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

async function handleSubmit(event) {
  event.preventDefault();

  const text = inputText.value;
  const tone = toneSelect.value;
  const format = formatSelect.value;
  const maintainOriginalLength = maintainLengthCheck.checked;
  const variations = parseInt(
    document.querySelector(".segment.selected").getAttribute("data-value")
  );
  const readability = readabilitySelect.value;
  if (text) {
    toggleSpinner(spinner, true);
    const result = await rephraseText(
      text,
      tone,
      format,
      maintainOriginalLength,
      variations,
      readability
    );
    toggleSpinner(spinner, false);
    rephrasedText.innerHTML = result;
  } else {
    rephrasedText.innerText = "Please enter some text to rephrase.";
  }
}

form.addEventListener("submit", handleSubmit);
