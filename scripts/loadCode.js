document.addEventListener('DOMCOntentLoaded', () => {
  
  const code = document.getElementById('code');
  const codeHolder = document.createElement('div');
  codeHolder.innerHTML = 
          `
          <textarea id="ts-code">
          const canvas = document.getElementById('canvas') as HTMLCanvasElement;
          const ctx = canvas.getContext('2d');
          const uploadInput = document.getElementById('upload') as HTMLInputElement;
          
          uploadInput.addEventListener('change', (event) => {
              const file = (event.target as HTMLInputElement).files?.[0];
              if (file) {
                  const reader = new FileReader();
                  reader.onload = function(e) {
                      const img = new Image();
                      img.onload = function() {
                          canvas.width = img.width;
                          canvas.height = img.height;
                          ctx?.drawImage(img, 0, 0);
                          applyEdgeDetection();
                      };
                      img.src = e.target?.result as string;
                  };
                  reader.readAsDataURL(file);
              }
          });
          
          function applyEdgeDetection() {
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
      </textarea>
      <pre id="js-code"></pre>
      `
  code.appendChild(codeHolder);
  
});
