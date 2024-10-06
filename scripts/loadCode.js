document.addEventListener('DOMContentLoaded', () => {
  // Define the stack of scripts
  const scriptStack = [
    { src: 'scripts/loading.js', msg: 'Done loading loading.js' },
    { src: 'scripts/cannySlider.js', msg: 'Done loading cannySlider.js' },
    { src: 'scripts/code.js', msg: 'Done loading code.js' },
    { src: 'scripts/reset.js', msg: 'Done loading reset.js' },
    { src: 'scripts/download.js', msg: 'Done loading download.js' },
    // Add more scripts here as needed
  ];

  // Start loading scripts from the stack
  loadScripts(scriptStack);
});

// Function to load scripts from the stack dynamically
const loadScripts = (stack) => {
  if (stack.length === 0) {
    console.log('All scripts loaded.');
    return;
  }

  const { src, msg } = stack.shift(); // Get the next script from the stack

  const script = document.createElement('script');
  script.src = src;
  script.defer = true;
  script.onload = () => {
    console.log(msg);
    loadScripts(stack); // Load the next script from the stack
  };
  script.onerror = () => console.error(`Failed to load ${src}`);
  document.body.appendChild(script);
};


  


