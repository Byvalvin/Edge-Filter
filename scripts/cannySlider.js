let lowThreshold = 50;
let highThreshold = 100;

function updateThresholds(value, value2) {
    lowThreshold = value; // Get the new low value from the slider
    highThreshold = value2; // Get the new high value from the slider

    document.getElementById('lowThresholdValue').textContent = lowThreshold;
    document.getElementById('highThresholdValue').textContent = highThreshold;

    // Ensure the sliders can't cross
    if (lowThreshold >= highThreshold) {
        lowThreshold = highThreshold - 1; // Adjust low threshold
    }

    document.getElementById('thresholdRange').value = lowThreshold;
    document.getElementById('thresholdRangeHigh').value = highThreshold;
    document.getElementById('thresholdRangeValue').textContent = `${lowThreshold} - ${highThreshold}`;
}
/*
Regarding the Slider
If you're planning to implement the double-headed slider later, consider using libraries like noUiSlider or ion.RangeSlider, which can provide more robust functionality out of the box and save you some headaches.


*/
