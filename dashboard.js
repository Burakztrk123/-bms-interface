document.addEventListener('DOMContentLoaded', () => {
    // Local monitoring card click event
    document.querySelector('.monitoring-card.local').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'bluetooth.html';
    });

    // Remote monitoring card click event
    document.querySelector('.monitoring-card.remote').addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Remote monitoring selected');
        // Burada remote monitoring sayfasına yönlendirme yapılabilir
    });
});
