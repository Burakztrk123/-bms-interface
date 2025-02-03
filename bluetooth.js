document.addEventListener('DOMContentLoaded', () => {
    // Mode butonları için event listener
    const modeButtons = document.querySelectorAll('.mode-button');
    modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Aktif sınıfını kaldır
            modeButtons.forEach(btn => btn.classList.remove('active'));
            // Tıklanan butona aktif sınıfını ekle
            button.classList.add('active');
        });
    });

    // Connect butonlarına tıklama olayı ekle
    document.querySelectorAll('.connect-btn').forEach(button => {
        button.addEventListener('click', () => {
            window.location.href = 'demo.html';
        });
    });

    // Gauge değerini güncelleme fonksiyonu
    function updateGauge(value) {
        const gaugeValue = document.querySelector('.gauge-value .value');
        gaugeValue.textContent = value;
    }

    // Test için örnek değer
    updateGauge(0);
});
