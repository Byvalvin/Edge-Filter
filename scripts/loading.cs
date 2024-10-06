// Function for loading scrrem
const loadingCode = `
const loadingIndicator = document.getElementById('loadingIndicator') as HTMLDivElement;

function showLoading() {
    loadingIndicator.style.display = 'block';
}

function hideLoading() {
    loadingIndicator.style.display = 'none';
}
`;

// Evaluate the TypeScript code and run it
const loadingJsCode = ts.transpile(loadingCode);
eval(loadingJsCode);



