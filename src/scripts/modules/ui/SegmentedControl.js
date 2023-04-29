function toggleSelectedClass(segments, target) {
  for (const segment of segments) {
    segment.classList.remove("selected");
  }
  target.classList.add("selected");
}

function handleSegmentClick(event, segments, onSegmentChange) {
  event.preventDefault();
  const target = event.target;

  if (target.classList.contains("segment")) {
    const value = target.getAttribute("data-value");
    toggleSelectedClass(segments, target);

    if (onSegmentChange) {
      onSegmentChange(value);
    }
  }
}

export function initSegmentedControl(selector, onSegmentChange) {
  const segmentedControl = document.getElementById(selector);
  const segments = segmentedControl.getElementsByClassName("segment");
  segmentedControl.addEventListener("click", (event) =>
    handleSegmentClick(event, segments, onSegmentChange)
  );
}
