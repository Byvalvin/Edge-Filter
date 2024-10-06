
// Update low threshold value display
function updateLowThreshold(value) {
    document.getElementById('lowThresholdValue').textContent = value;
    // Sync with the other slider if needed
    document.getElementById('lowThresholdSlider').value = value;
}

// Update high threshold value display
function updateHighThreshold(value) {
    document.getElementById('highThresholdValue').textContent = value;
    // Sync with the other slider if needed
    document.getElementById('highThresholdSlider').value = value;
}

// Function to sync slider values
function syncSliders(lowSliderId, highSliderId) {
    const lowValue = document.getElementById(lowSliderId).value;
    const highValue = document.getElementById(highSliderId).value;

    if (lowValue >= highValue) {
        document.getElementById(lowSliderId).value = highValue - 1; // Adjust low slider
    }
    updateLowThreshold(document.getElementById('lowThresholdSlider').value);
    updateHighThreshold(document.getElementById('highThresholdSlider').value);
}
