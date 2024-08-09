const code = `
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const sobelCanvas = document.getElementById('sobelCanvas') as HTMLCanvasElement;
const cannyCanvas = document.getElementById('cannyCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');
const ctxSobel = sobelCanvas.getContext('2d');
const ctxCanny = cannyCanvas.getContext('2d');
const uploadInput = document.getElementById('upload') as HTMLInputElement;
const edgeDetectionMethod = document.getElementById('edgeDetectionMethod') as HTMLSelectElement;
const lowThresholdInput = document.getElementById('lowThreshold') as HTMLInputElement;
const highThresholdInput = document.getElementById('highThreshold') as HTMLInputElement;
const thresholdRange = document.getElementById('thresholdRange') as HTMLInputElement;
const thresholdRangeHigh = document.getElementById('thresholdRangeHigh') as HTMLInputElement;
const cannyOptions = document.getElementById('cannyOptions') as HTMLDivElement;

// Sobel Edge Detection Function
function applySobelEdgeDetection() {
    if (!ctx || !ctxSobel) return;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;

    const output = ctxSobel.createImageData(width, height);
    const outputData = output.data;

    const Gx = [
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1]
    ];
    const Gy = [
        [1, 2, 1],
        [0, 0, 0],
        [-1, -2, -1]
    ];

    function getPixel(x: number, y: number) {
        const index = (y * width + x) * 4;
        return [data[index], data[index + 1], data[index + 2], data[index + 3]];
    }

    function setPixel(x: number, y: number, r: number, g: number, b: number) {
        const index = (y * width + x) * 4;
        outputData[index] = r;
        outputData[index + 1] = g;
        outputData[index + 2] = b;
        outputData[index + 3] = 255; // Alpha
    }

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            let pixelX = 0;
            let pixelY = 0;

            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const [r, g, b] = getPixel(x + kx, y + ky);
                    const gray = (r + g + b) / 3;
                    pixelX += gray * Gx[ky + 1][kx + 1];
                    pixelY += gray * Gy[ky + 1][kx + 1];
                }
            }

            const magnitude = Math.sqrt(pixelX * pixelX + pixelY * pixelY);
            const value = Math.min(magnitude, 255);
            setPixel(x, y, value, value, value);
        }
    }

    ctxSobel.putImageData(output, 0, 0);
}

// Canny Edge Detection Function
function convertToGrayscale(data: Uint8ClampedArray, width: number, height: number): Uint8ClampedArray {
    const grayscaleData = new Uint8ClampedArray(data.length);
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        grayscaleData[i] = gray;
        grayscaleData[i + 1] = gray;
        grayscaleData[i + 2] = gray;
        grayscaleData[i + 3] = 255; // Alpha
    }
    return grayscaleData;
}

function gaussianBlur(data: Uint8ClampedArray, width: number, height: number): Uint8ClampedArray {
    const kernel = [
        [1, 4, 6, 4, 1],
        [4, 16, 24, 16, 4],
        [6, 24, 36, 24, 6],
        [4, 16, 24, 16, 4],
        [1, 4, 6, 4, 1]
    ];
    const kernelSum = 256;
    const output = new Uint8ClampedArray(data.length);

    for (let y = 2; y < height - 2; y++) {
        for (let x = 2; x < width - 2; x++) {
            let sum = 0;
            for (let ky = -2; ky <= 2; ky++) {
                for (let kx = -2; kx <= 2; kx++) {
                    const index = ((y + ky) * width + (x + kx)) * 4;
                    sum += data[index] * kernel[ky + 2][kx + 2];
                }
            }
            const index = (y * width + x) * 4;
            output[index] = sum / kernelSum;
            output[index + 1] = sum / kernelSum;
            output[index + 2] = sum / kernelSum;
            output[index + 3] = 255; // Alpha
        }
    }
    return output;
}

function computeGradients(data: Uint8ClampedArray, width: number, height: number): [Uint8ClampedArray, Float32Array] {
    const Gx = [
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1]
    ];
    const Gy = [
        [1, 2, 1],
        [0, 0, 0],
        [-1, -2, -1]
    ];

    const magnitude = new Uint8ClampedArray(width * height);
    const direction = new Float32Array(width * height);

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            let pixelX = 0;
            let pixelY = 0;

            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const gray = data[((y + ky) * width + (x + kx)) * 4];
                    pixelX += gray * Gx[ky + 1][kx + 1];
                    pixelY += gray * Gy[ky + 1][kx + 1];
                }
            }

            const index = y * width + x;
            const mag = Math.sqrt(pixelX * pixelX + pixelY * pixelY);
            magnitude[index] = Math.min(mag, 255);
            direction[index] = Math.atan2(pixelY, pixelX) * (180 / Math.PI) + 180; // Normalize to 0-360
        }
    }

    return [magnitude, direction];
}

function nonMaximumSuppression(magnitude: Uint8ClampedArray, direction: Float32Array, width: number, height: number): Uint8ClampedArray {
    const output = new Uint8ClampedArray(magnitude.length);

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const index = y * width + x;
            const angle = direction[index] % 180;

            let q = 0, r = 0;
            if ((angle >= 0 && angle < 22.5) || (angle >= 157.5 && angle < 180)) {
                q = magnitude[index - 1]; // Pixel to the left
                r = magnitude[index + 1]; // Pixel to the right
            } else if (angle >= 22.5 && angle < 67.5) {
                q = magnitude[index - width - 1]; // Top-right diagonal
                r = magnitude[index + width + 1]; // Bottom-left diagonal
            } else if (angle >= 67.5 && angle < 112.5) {
                q = magnitude[index - width]; // Pixel above
                r = magnitude[index + width]; // Pixel below
            } else if (angle >= 112.5 && angle < 157.5) {
                q = magnitude[index - width + 1]; // Top-left diagonal
                r = magnitude[index + width - 1]; // Bottom-right diagonal
            }

            output[index] = (magnitude[index] >= q && magnitude[index] >= r) ? magnitude[index] : 0;
        }
    }

    return output;
}

function doubleThresholding(magnitude: Uint8ClampedArray, width: number, height: number, lowThreshold: number, highThreshold: number) {
    const output = new Uint8ClampedArray(magnitude.length);

    for (let i = 0; i < magnitude.length; i++) {
        if (magnitude[i] >= highThreshold) {
            output[i] = 255; // Strong edge
        } else if (magnitude[i] >= lowThreshold) {
            output[i] = 127; // Weak edge
        } else {
            output[i] = 0; // Non-edge
        }
    }

    return output;
}

function edgeTracking(output: Uint8ClampedArray, width: number, height: number) {
    const finalOutput = new Uint8ClampedArray(output.length);

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const index = y * width + x;
            if (output[index] === 255) {
                finalOutput[index] = 255; // Strong edge
            } else if (output[index] === 127) {
                // Check neighboring pixels for strong edges
                if (output[index - 1] === 255 || output[index + 1] === 255 ||
                    output[index - width] === 255 || output[index + width] === 255 ||
                    output[index - width - 1] === 255 || output[index - width + 1] === 255 ||
                    output[index + width - 1] === 255 || output[index + width + 1] === 255) {
                    finalOutput[index] = 255; // Weak edge connected to a strong edge
                }
            }
        }
    }

    return finalOutput;
}

function applyCannyEdgeDetection() {
    if (!ctx || !ctxCanny) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;

    const grayscaleData = convertToGrayscale(data, width, height);
    const blurredData = gaussianBlur(grayscaleData, width, height);
    const [gradientMagnitude, gradientDirection] = computeGradients(blurredData, width, height);
    const suppressed = nonMaximumSuppression(gradientMagnitude, gradientDirection, width, height);
    
    const lowThreshold = parseInt(lowThresholdInput.value, 10) || 0;
    const highThreshold = parseInt(highThresholdInput.value, 10) || 255;

    const doubleThreshold = doubleThresholding(suppressed, width, height, lowThreshold, highThreshold);
    const finalEdges = edgeTracking(doubleThreshold, width, height);

    const cannyImageData = new ImageData(width, height);
    const cannyOutputData = cannyImageData.data;

    for (let i = 0; i < finalEdges.length; i++) {
        const value = finalEdges[i];
        cannyOutputData[i * 4] = cannyOutputData[i * 4 + 1] = cannyOutputData[i * 4 + 2] = value; // Set RGB to edge value
        cannyOutputData[i * 4 + 3] = 255; // Alpha
    }

    ctxCanny.putImageData(cannyImageData, 0, 0);
}

uploadInput.addEventListener('change', function () {
    const file = uploadInput.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                canvas.width = img.width;
                canvas.height = img.height;
                sobelCanvas.width = img.width;
                sobelCanvas.height = img.height;
                cannyCanvas.width = img.width;
                cannyCanvas.height = img.height;
                ctx?.drawImage(img, 0, 0);
                applyEdgeDetection();
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    }
});

function applyEdgeDetection() {
    const method = edgeDetectionMethod.value; // Get the selected method
    if (method === 'sobel') {
        applySobelEdgeDetection();
        sobelCanvas.style.display = 'block';
        cannyCanvas.style.display = 'none';
    } else if (method === 'canny') {
        applyCannyEdgeDetection();
        sobelCanvas.style.display = 'none';
        cannyCanvas.style.display = 'block';
    } else if (method === 'both') {
        applySobelEdgeDetection();
        applyCannyEdgeDetection();
        sobelCanvas.style.display = 'block';
        cannyCanvas.style.display = 'block';
    }
}

edgeDetectionMethod.addEventListener('change', function () {
    cannyOptions.style.display = edgeDetectionMethod.value === 'canny' ? 'block' : 'none';
});

lowThresholdInput.addEventListener('input', function () {
    thresholdRange.value = lowThresholdInput.value;
});

highThresholdInput.addEventListener('input', function () {
    thresholdRangeHigh.value = highThresholdInput.value;
});

thresholdRange.addEventListener('input', function () {
    lowThresholdInput.value = thresholdRange.value;
});

thresholdRangeHigh.addEventListener('input', function () {
    highThresholdInput.value = thresholdRangeHigh.value;
});

`;

// Evaluate the TypeScript code and run it
const jsCode = ts.transpile(code);
eval(jsCode);

