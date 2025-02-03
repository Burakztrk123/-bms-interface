document.addEventListener('DOMContentLoaded', () => {
    // 3 saniye sonra login sayfasına yönlendir
    setTimeout(() => {
        window.location.href = 'login.html';  // index.html yerine login.html'e yönlendirme yapıyoruz
    }, 3000);
});
