import haAPI from './ha-api.js';

document.addEventListener('DOMContentLoaded', async () => {
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

    // Batarya verilerini güncelle
    async function updateBatteryData() {
        try {
            const batteryData = await haAPI.getBatteryData();
            
            // SOC değerini güncelle
            const socData = batteryData.find(data => data.entity_id === 'sensor.battery_soc');
            if (socData) {
                const socValue = parseFloat(socData.state);
                document.querySelector('.value').textContent = socValue.toFixed(1);
                updateGauge(socValue);
            }

            // Voltaj değerini güncelle
            const voltageData = batteryData.find(data => data.entity_id === 'sensor.battery_voltage');
            if (voltageData) {
                const voltageValue = parseFloat(voltageData.state);
                document.querySelector('.stat-value').textContent = `${voltageValue.toFixed(2)}V`;
            }

            // Akım değerini güncelle
            const currentData = batteryData.find(data => data.entity_id === 'sensor.battery_current');
            if (currentData) {
                const currentValue = parseFloat(currentData.state);
                document.querySelectorAll('.stat-value')[1].textContent = `${currentValue.toFixed(2)}A`;
            }
        } catch (error) {
            console.error('Error updating battery data:', error);
        }
    }

    // WebSocket bağlantısını kur
    haAPI.connectWebSocket((data) => {
        if (data.type === 'state_changed') {
            // Batarya verilerini güncelle
            updateBatteryData();
        }
    });

    // Sayfa yüklendiğinde ilk verileri al
    await updateBatteryData();
    // Her 5 saniyede bir verileri güncelle
    setInterval(updateBatteryData, 5000);

    // Test için örnek değer
    updateGauge(0);
});
