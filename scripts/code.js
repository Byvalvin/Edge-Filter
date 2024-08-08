const code = `
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');
const uploadInput = document.getElementById('upload') as HTMLInputElement;
const edgeDetectionMethod = document.getElementById('edgeDetectionMethod') as HTMLSelectElement;

function convertToGrayscale(data: Uint8ClampedArray, width: number, height: number): Uint8ClampedArray {
    const grayscaleData = new Uint8ClampedArray(data.length);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            const gray = (data[index] + data[index + 1] + data[index + 2]) / 3;
            grayscaleData[index] = gray; // R
            grayscaleData[index + 1] = gray; // G
            grayscaleData[index + 2] = gray; // B
            grayscaleData[index + 3] = 255; // Alpha
        }
    }
    return grayscaleData;
}


uploadInput.addEventListener('change', (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                // Maintain aspect ratio
                const aspectRatio = img.width / img.height;
                if (img.width > img.height) {
                    canvas.width = 500; // Set a max width
                    canvas.height = 500 / aspectRatio;
                } else {
                    canvas.height = 500; // Set a max height
                    canvas.width = 500 * aspectRatio;
                }
                ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                applyEdgeDetection();
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    } else {
        alert('No file selected. Please upload an image.');
    }
});

function applyEdgeDetection() {
    const method = edgeDetectionMethod.value; // Get the selected method
    if (method === 'sobel') {
        applySobelEdgeDetection();
    } else if (method === 'canny') {
        applyCannyEdgeDetection();
    }
}

// Sobel Edge Detection Function
function applySobelEdgeDetection() {
    if (!ctx) return;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;

    const output = ctx.createImageData(width, height);
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

    ctx.putImageData(output, 0, 0);
}

// Canny Edge Detection Functions
function gaussianBlur(data: Uint8ClampedArray, width: number, height: number) {
    const kernel = [
        [1, 4, 6, 4, 1],
        [4, 16, 24, 16, 4],
        [6, 24, 36, 24, 6],
        [4, 16, 24, 16, 4],
        [1, 4, 6, 4, 1],
    ];
    const kernelSum = 256;

    const output = new Uint8ClampedArray(data.length);

    for (let y = 2; y < height - 2; y++) {
        for (let x = 2; x < width - 2; x++) {
            let r = 0, g = 0, b = 0;
            for (let ky = -2; ky <= 2; ky++) {
                for (let kx = -2; kx <= 2; kx++) {
                    const index = ((y + ky) * width + (x + kx)) * 4;
                    r += data[index] * kernel[ky + 2][kx + 2];
                    g += data[index + 1] * kernel[ky + 2][kx + 2];
                    b += data[index + 2] * kernel[ky + 2][kx + 2];
                }
            }
            const index = (y * width + x) * 4;
            output[index] = r / kernelSum;
            output[index + 1] = g / kernelSum;
            output[index + 2] = b / kernelSum;
            output[index + 3] = 255;
        }
    }

    return output;
}

function computeGradients(data: Uint8ClampedArray, width: number, height: number) {
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

    const magnitude = new Uint8ClampedArray(data.length);
    const direction = new Float32Array(width * height);

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            let pixelX = 0;
            let pixelY = 0;

            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const gray = (data[((y + ky) * width + (x + kx)) * 4] +
                                   data[((y + ky) * width + (x + kx)) * 4 + 1] +
                                   data[((y + ky) * width + (x + kx)) * 4 + 2]) / 3;
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

function nonMaximumSuppression(magnitude: Uint8ClampedArray, direction: number[], width: number, height: number) {
    const output = new Uint8ClampedArray(magnitude.length);

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const index = (y * width + x);
            const angle = direction[index];

            let q = 255, r = 255;
            if ((angle >= 0 && angle < 45) || (angle >= 135 && angle < 180)) {
                q = magnitude[index - 1]; // Pixel to the left
                r = magnitude[index + 1]; // Pixel to the right
            } else if (angle >= 45 && angle < 135) {
                q = magnitude[index - width]; // Pixel above
                r = magnitude[index + width]; // Pixel below
            }

            if (magnitude[index] >= q && magnitude[index] >= r) {
                output[index] = magnitude[index];
            } else {
                output[index] = 0;
            }
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
            const index = (y * width + x);
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
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;

    // Step 1: Convert to Grayscale
    const grayscaleData = convertToGrayscale(data, width, height);
    
    // Step 2: Gaussian Blur
    const blurredData = gaussianBlur(grayscaleData, width, height);
    
    // Step 3: Compute Gradients
    const [gradientMagnitude, gradientDirection] = computeGradients(blurredData, width, height);
    
    // Step 4: Non-Maximum Suppression
    const suppressed = nonMaximumSuppression(gradientMagnitude, gradientDirection, width, height);

    // Step 5: Double Thresholding
    const lowThreshold = 0;
    const highThreshold = 50;
    const thresholded = doubleThresholding(suppressed, width, height, lowThreshold, highThreshold);
    
    // Log threshold values and magnitude before double thresholding
    console.log(`Low Threshold: ${lowThreshold}, High Threshold: ${highThreshold}`);
    console.log(`Gradient Magnitudes:`, gradientMagnitude);
    
    // Step 6: Edge Tracking
    const finalOutput = edgeTracking(thresholded, width, height);

    // Clear the canvas before drawing the new image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    

    // Step 7: Set the output image data
    const output = ctx.createImageData(width, height);
    const outputData = output.data;

    for (let i = 0; i < finalOutput.length; i++) {
        const value = finalOutput[i] === 255 ? 255 : 0; // Black and white
        outputData[i] = value;      // Red
        outputData[i + 1] = value;  // Green
        outputData[i + 2] = value;  // Blue
        outputData[i + 3] = 255;     // Alpha
    }

    ctx.putImageData(output, 0, 0);
}
`;

// Evaluate the TypeScript code and run it
const jsCode = ts.transpile(code);
eval(jsCode);
