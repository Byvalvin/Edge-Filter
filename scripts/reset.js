// Function for reset button
const buttonCode = `
const resetButton = document.getElementById('resetButton') as HTMLButtonElement;
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const edgeDetectionMethod = document.getElementById('edgeDetectionMethod') as HTMLSelectElement;
const cannyOptions = document.getElementById('cannyOptions') as HTMLDivElement;
const uploadInput = document.getElementById('upload') as HTMLInputElement;

if (resetButton && canvas && edgeDetectionMethod && uploadInput) {
    resetButton.addEventListener('click', () => {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            // Clear the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        
        // Reset dropdown to default (Sobel)
        edgeDetectionMethod.value = 'sobel'; // Reset to default option
        cannyOptions.style.display = edgeDetectionMethod.value === 'canny' ? 'block' : 'none';
    
        // Clear file input to remove uploaded image
        uploadInput.value = ''; // Clear the file input
    });
} else {
    console.error('Could not find the resetButton, canvas, edgeDetectionMethod, or uploadInput elements.');
}
`;

// Evaluate the TypeScript code and run it
const buttonJsCode = ts.transpile(buttonCode);
eval(buttonJsCode);

