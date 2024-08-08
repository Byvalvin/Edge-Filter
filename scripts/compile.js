let lastCode = '';
const tsCodeElem = document.getElementById('ts-code');
const jsCodeElem = document.getElementById('js-code');

function compileTS() {
    const tsCode = tsCodeElem.value;
    if (tsCode !== lastCode) {
        lastCode = tsCode;
        const jsCode = ts.transpile(tsCode);
        jsCodeElem.textContent = jsCode;
        try {
            eval(jsCode);
        } catch (e) {
            console.error('Error in TypeScript code:', e);
        }
    }
}

tsCodeElem.addEventListener('input', compileTS);

// Initial compilation
compileTS();

