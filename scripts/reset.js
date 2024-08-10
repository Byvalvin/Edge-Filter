// Function for reset button
const buttonCode = `
const resetButton = document.getElementById('resetButton') as HTMLButtonElement;
//const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const sobelCanvas = document.getElementById('sobelCanvas') as HTMLCanvasElement;
const cannyCanvas = document.getElementById('cannyCanvas') as HTMLCanvasElement;
const edgeDetectionMethod = document.getElementById('edgeDetectionMethod') as HTMLSelectElement;
const cannyOptions = document.getElementById('cannyOptions') as HTMLDivElement;
const uploadInput = document.getElementById('upload') as HTMLInputElement;
const downloadButton = document.getElementById('downloadButton') as HTMLButtonElement;

if (resetButton && edgeDetectionMethod && uploadInput && sobelCanvas && cannyCanvas) {
    resetButton.addEventListener('click', () => {
        // const ctx = canvas.getContext('2d');
        const sobelCtx = sobelCanvas.getContext('2d');
        const cannyCtx = cannyCanvas.getContext('2d');

        if (sobelCtx) {
            sobelCtx.clearRect(0, 0, sobelCanvas.width, sobelCanvas.height);
        }
        
        if (cannyCtx) {
            cannyCtx.clearRect(0, 0, cannyCanvas.width, cannyCanvas.height);
        }
        
        // Reset dropdown to default (Sobel)
        edgeDetectionMethod.value = 'sobel'; // Reset to default option
        cannyOptions.style.display = 'none';
    
        // Clear file input to remove uploaded image
        uploadInput.value = ''; // Clear the file input

        // Hide the download button
        if (downloadButton) {
            downloadButton.style.display = 'none';
        }
    });
} else {
    console.error('Could not find the resetButton, edgeDetectionMethod, uploadInput, sobelCanvas, or cannyCanvas elements.');
}
`;

// Evaluate the TypeScript code and run it
const buttonJsCode = ts.transpile(buttonCode);
eval(buttonJsCode);
