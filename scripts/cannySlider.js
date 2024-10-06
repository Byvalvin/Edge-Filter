
function updateLowThreshold(value) {
    document.getElementById('lowThresholdValue').textContent = value;
    const highSlider = document.getElementById('highThresholdSlider');
    if (parseInt(value) > parseInt(highSlider.value)) {
        highSlider.value = value;
        document.getElementById('highThresholdValue').textContent = highSlider.value;
    }
}

function updateHighThreshold(value) {
    document.getElementById('highThresholdValue').textContent = value;
    const lowSlider = document.getElementById('lowThresholdSlider');
    if (parseInt(value) < parseInt(lowSlider.value)) {
        lowSlider.value = value;
        document.getElementById('lowThresholdValue').textContent = lowSlider.value;
    }
}

function syncSliders(lowSliderId, highSliderId) {
    const lowSlider = document.getElementById(lowSliderId);
    const highSlider = document.getElementById(highSliderId);
    const lowValue = parseInt(lowSlider.value);
    const highValue = parseInt(highSlider.value);

    if (lowValue > highValue) {
        lowSlider.value = highValue;
    }
}
