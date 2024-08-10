const downloadCode = `
// download.ts

// Function to download the canvas image
function downloadImage(canvas: HTMLCanvasElement, filename: string) {
    const link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = filename;
    link.click();
}

// Event listener for the download button
document.addEventListener('DOMContentLoaded', () => {
    const downloadButton = document.getElementById('downloadButton') as HTMLButtonElement;

    downloadButton.addEventListener('click', () => {
        const selectedMethod = (document.getElementById('edgeDetectionMethod') as HTMLSelectElement).value;

        if (selectedMethod === 'sobel') {
            const sobelCanvas = document.getElementById('sobelCanvas') as HTMLCanvasElement;
            downloadImage(sobelCanvas, 'sobel_edges.png');
        } else if (selectedMethod === 'canny') {
            const cannyCanvas = document.getElementById('cannyCanvas') as HTMLCanvasElement;
            downloadImage(cannyCanvas, 'canny_edges.png');
        } else if (selectedMethod === 'both') {
            const sobelCanvas = document.getElementById('sobelCanvas') as HTMLCanvasElement;
            const cannyCanvas = document.getElementById('cannyCanvas') as HTMLCanvasElement;
            // Download both images
            downloadImage(sobelCanvas, 'sobel_edges.png');
            downloadImage(cannyCanvas, 'canny_edges.png');
        }
    });
});

`

// Evaluate the TypeScript code and run it
const dlJsCode = ts.transpile(downloadCode);
eval(dlJsCode);
