export function toggleSpinner(spinner, isVisible) {
  spinner.style.display = isVisible ? "block" : "none";
}

export function initSegmentedControl(segmentedControl, segments) {
  segmentedControl.addEventListener("click", (event) => {
    event.preventDefault();
    if (event.target.classList.contains("segment")) {
      const value = event.target.getAttribute("data-value");

      // Deselect previously selected segment
      for (let i = 0; i < segments.length; i++) {
        segments[i].classList.remove("selected");
      }

      // Select the clicked segment
      event.target.classList.add("selected");
    }
  });
}
