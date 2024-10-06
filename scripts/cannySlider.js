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

