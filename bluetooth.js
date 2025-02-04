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

    // Filtre butonlarını seç
    const filterButtons = document.querySelectorAll('.filter-btn');
    const deviceCards = document.querySelectorAll('.device-card');
    const deviceCount = document.getElementById('deviceCount');

    // Demo Device butonunu varsayılan olarak aktif yap
    const demoButton = document.querySelector('[data-filter="demo"]');
    const allButton = document.querySelector('[data-filter="all"]');
    
    // Başlangıçta All Devices aktif, ama hiç cihaz gösterme
    updateDeviceDisplay('all');

    // Filtre butonlarına tıklama olayı ekle
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Aktif butonu güncelle
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Cihazları filtrele
            const filterValue = button.getAttribute('data-filter');
            updateDeviceDisplay(filterValue);
        });
    });

    // Cihaz görüntüleme ve sayaç güncelleme fonksiyonu
    function updateDeviceDisplay(filterValue) {
        let visibleCount = 0;

        deviceCards.forEach(card => {
            const cardType = card.getAttribute('data-type');
            
            if (filterValue === 'demo') {
                // Demo Device filtresinde sadece demo cihazını göster
                if (cardType === 'demo') {
                    card.style.display = 'flex';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            } else {
                // All Devices filtresinde şimdilik hiçbir cihaz gösterme
                card.style.display = 'none';
            }
        });

        // Cihaz sayısını güncelle
        deviceCount.textContent = visibleCount;
    }

    // Connect butonlarına tıklama olayı ekle
    const connectButtons = document.querySelectorAll('.connect-btn');
    connectButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Demo sayfasına yönlendir
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
