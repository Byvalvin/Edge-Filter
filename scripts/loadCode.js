document.addEventListener('DOMContentLoaded', () => {

  loadScript('scripts/code.js', 'Done loading code.js');
  resetControl();
  
});



// Function to load chained scripts dynamically
const loadScript = (src, successMessage, nextScript) => {
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    script.onload = () => {
        console.log(successMessage);
        if(nextScript){
            loadScript(nextScript.src, nextScript.msg, nextScript.next);
        }
    }
    script.onerror = () => console.error(`Failed to load ${src}`);
    document.body.appendChild(script);
};

// Function for reset button
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

  


