// Update low threshold value display
function updateLowThreshold(value) {
    document.getElementById('lowThresholdValue').textContent = value;

    const lowSlider = document.getElementById('lowThresholdSlider');
    const highSlider = document.getElementById('highThresholdSlider');

    if (parseInt(value) >= parseInt(highSlider.value)) {
        highSlider.value = value;
        document.getElementById('highThresholdValue').textContent = value;
    }
}

// Update high threshold value display
function updateHighThreshold(value) {
    document.getElementById('highThresholdValue').textContent = value;

    const lowSlider = document.getElementById('lowThresholdSlider');
    const highSlider = document.getElementById('highThresholdSlider');

    if (parseInt(value) <= parseInt(lowSlider.value)) {
        lowSlider.value = value;
        document.getElementById('lowThresholdValue').textContent = value;
    }
}

// Function to sync slider values
function syncSliders(lowSliderId, highSliderId) {
    const lowValue = document.getElementById(lowSliderId).value;
    const highValue = document.getElementById(highSliderId).value;

    if (parseInt(lowValue) >= parseInt(highValue)) {
        document.getElementById(lowSliderId).value = parseInt(highValue) - 1; // Adjust low slider
    }

    updateLowThreshold(document.getElementById(lowSliderId).value);
    updateHighThreshold(document.getElementById(highSliderId).value);
}

// Add event listeners for sliders to sync values on input
document.getElementById('lowThresholdSlider').addEventListener('input', () => syncSliders('lowThresholdSlider', 'highThresholdSlider'));
document.getElementById('highThresholdSlider').addEventListener('input', () => syncSliders('lowThresholdSlider', 'highThresholdSlider'));

