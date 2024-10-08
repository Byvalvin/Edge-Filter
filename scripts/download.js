const downloadCode = `
// download.ts
console.log('in');
// Function to download the canvas image with a given filename
function downloadImage(canvas: HTMLCanvasElement, filename: string) {
    const link = document.createElement('a');
    const imageFormat = 'image/png';
    link.href = canvas.toDataURL(imageFormat); // Specify image format
    link.download = filename;
    link.click();
}

// Function to show or hide the download button
function toggleDownloadButton(show: boolean) {
    
    const downloadButton = document.getElementById('downloadButton') as HTMLButtonElement;
    if (downloadButton) {
        downloadButton.style.display = show ? 'block' : 'none';
    }
}

// Event listener for the download button
const downloadButton = document.getElementById('downloadButton') as HTMLButtonElement;
const uploadInput = document.getElementById('upload') as HTMLInputElement;
let uploadedFileName = '';

// Store the name of the uploaded file
uploadInput.addEventListener('change', (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
        uploadedFileName = file.name.split('.').slice(0, -1).join('.'); // Remove file extension
        // Show the download button if output exists
        updateDownloadButtonVisibility();
    }
});

// Check visibility of download button based on output
function updateDownloadButtonVisibility() {
    const sobelCanvas = document.getElementById('sobelCanvas') as HTMLCanvasElement;
    const cannyCanvas = document.getElementById('cannyCanvas') as HTMLCanvasElement;

    const showButton = (sobelCanvas && getComputedStyle(sobelCanvas).display !== 'none') ||
                       (cannyCanvas && getComputedStyle(cannyCanvas).display !== 'none');

    toggleDownloadButton(showButton);
}


downloadButton.addEventListener('click', () => {
    const selectedMethod = (document.getElementById('edgeDetectionMethod') as HTMLSelectElement).value;

    if (!uploadedFileName) {
        alert('Please upload a file first.');
        return;
    }

    const sobelCanvas = document.getElementById('sobelCanvas') as HTMLCanvasElement;
    const cannyCanvas = document.getElementById('cannyCanvas') as HTMLCanvasElement;

    if (selectedMethod === 'sobel' && sobelCanvas) {
        downloadImage(sobelCanvas, uploadedFileName + "_sobel.png");
    } else if (selectedMethod === 'canny' && cannyCanvas) {
        downloadImage(cannyCanvas, uploadedFileName + "_canny.png");
    } else if (selectedMethod === 'both') {
        if (sobelCanvas) {
            downloadImage(sobelCanvas, uploadedFileName + "_sobel.png");
        }
        if (cannyCanvas) {
            downloadImage(cannyCanvas, uploadedFileName + "_canny.png");
        }
    }
});

// Call this function whenever the canvas output is updated
// For example, after processing the image or changing detection method
function onCanvasOutputUpdated() {
    updateDownloadButtonVisibility();
}
`;

// Evaluate the TypeScript code and run it
const dlJsCode = ts.transpile(downloadCode);
eval(dlJsCode);

