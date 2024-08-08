document.addEventListener('DOMContentLoaded', () => {

  loadScript('scripts/code.js', 'Done loading code.js');
  
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


  


