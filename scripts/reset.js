// Function for reset button
const code = `
const resetControl = () => {
  const resetButton = document.getElementById('resetButton') as HTMLButtonElement;
    resetButton.addEventListener('click', () => {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Reset dropdown to default (Sobel)
        const edgeDetectionMethod = document.getElementById('edgeDetectionMethod') as HTMLSelectElement;
        edgeDetectionMethod.value = 'sobel'; // Reset to default option
    });
  
};
`
// Evaluate the TypeScript code and run it
const jsCode = ts.transpile(code);
eval(jsCode);
