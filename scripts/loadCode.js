document.addEventListener('DOMCOntentLoaded', () => {
  next = {
    src:'scripts/compile.js',
    msg:"Done loading compile.js"
  }
  loadScript('scripts/code.js', 'Done loading code.js', next)
  
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
  


