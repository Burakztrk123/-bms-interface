import haAPI from './ha-api.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Sayfa yüklendi');

    // Mode butonları için event listener
    const modeButtons = document.querySelectorAll('.mode-button');
    modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            modeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    // Demo Device işlevselliği
    const demoButton = document.querySelector('[data-filter="demo"]');
    const allButton = document.querySelector('[data-filter="all"]');
    const demoCard = document.querySelector('.device-card[data-type="demo"]');
    const connectButton = document.querySelector('.connect-btn');

    console.log('Elementler bulundu:', {
        demoButton: demoButton,
        allButton: allButton,
        demoCard: demoCard,
        connectButton: connectButton
    });

    // Demo butonu tıklama olayı
    if (demoButton) {
        demoButton.addEventListener('click', () => {
            console.log('Demo butonu tıklandı');
            // Aktif butonu değiştir
            demoButton.classList.add('active');
            allButton.classList.remove('active');
            
            // Demo cihazını göster
            if (demoCard) {
                console.log('Demo card gösteriliyor');
                demoCard.style.display = 'flex';
            }
        });
    }

    // All Devices butonu tıklama olayı
    if (allButton) {
        allButton.addEventListener('click', () => {
            console.log('All Devices butonu tıklandı');
            // Aktif butonu değiştir
            allButton.classList.add('active');
            demoButton.classList.remove('active');
            
            // Demo cihazını gizle
            if (demoCard) {
                console.log('Demo card gizleniyor');
                demoCard.style.display = 'none';
            }
        });
    }

    // Connect butonu işlevselliği
    if (connectButton) {
        connectButton.addEventListener('click', () => {
            console.log('Connect butonu tıklandı');
            const card = connectButton.closest('.device-card');
            if (card && card.getAttribute('data-type') === 'demo') {
                console.log('Demo sayfasına yönlendiriliyor');
                window.location.href = 'demo.html';
            }
        });
    }

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
            const socData = batteryData.find(data => data.entity_id === 'sensor.bms_soc');
            if (socData) {
                const socValue = parseFloat(socData.state);
                document.querySelector('.value').textContent = socValue.toFixed(1);
                updateGauge(socValue);
            }

            // Voltaj değerini güncelle
            const voltageData = batteryData.find(data => data.entity_id === 'sensor.bms_voltage');
            if (voltageData) {
                const voltageValue = parseFloat(voltageData.state);
                document.querySelector('.stat-value').textContent = `${voltageValue.toFixed(2)}V`;
            }

            // Akım değerini güncelle
            const currentData = batteryData.find(data => data.entity_id === 'sensor.bms_current');
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
            updateBatteryData();
        }
    });

    // Sayfa yüklendiğinde ilk verileri al
    await updateBatteryData();
    
    // Her 5 saniyede bir verileri güncelle
    setInterval(updateBatteryData, 5000);

    // Başlangıçta All Devices aktif olsun
    console.log('All Devices butonu aktif ediliyor');
    allButton.click();
});
