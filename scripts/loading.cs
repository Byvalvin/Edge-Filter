const loadingIndicator = document.getElementById('loadingIndicator') as HTMLDivElement;

function showLoading() {
    loadingIndicator.style.display = 'block';
}

function hideLoading() {
    loadingIndicator.style.display = 'none';
}
