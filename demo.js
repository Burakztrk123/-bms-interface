// Simülasyon verileri için aralıklar
const ranges = {
    power: { min: 90, max: 100 },
    voltage: { min: 23.0, max: 23.5 },
    current: { min: 3.8, max: 4.3 },
    temp1: { min: 22.0, max: 23.5 },
    temp2: { min: 24.0, max: 25.5 },
    cells: [
        { min: 3.55, max: 3.60 },
        { min: 3.74, max: 3.78 },
        { min: 3.44, max: 3.48 },
        { min: 3.62, max: 3.65 },
        { min: 3.53, max: 3.56 },
        { min: 3.52, max: 3.55 }
    ]
};

// Rastgele değer üretme fonksiyonu
function getRandomValue(min, max) {
    return (Math.random() * (max - min) + min).toFixed(3);
}

let lastBatteryPercentage = 99.6;

// Pil yüzdesini güncelleme
function updateBatteryPercentage() {
    const percentageElement = document.querySelector('.percentage-value');
    const batteryShape = document.querySelector('.battery-shape');
    
    // Rastgele bir değişim miktarı (-0.2 ile +0.2 arasında)
    const change = (Math.random() * 0.4 - 0.2).toFixed(3);
    const newPercentage = Math.max(0, Math.min(100, parseFloat(lastBatteryPercentage) + parseFloat(change))).toFixed(1);
    
    // Değişim yönüne göre sınıfları güncelle
    percentageElement.classList.remove('increasing', 'decreasing');
    batteryShape.classList.remove('increasing', 'decreasing');
    
    if (newPercentage > lastBatteryPercentage) {
        percentageElement.classList.add('increasing');
        batteryShape.classList.add('increasing');
    } else if (newPercentage < lastBatteryPercentage) {
        percentageElement.classList.add('decreasing');
        batteryShape.classList.add('decreasing');
    }
    
    // Yeni değeri göster
    percentageElement.textContent = `${newPercentage}%`;
    lastBatteryPercentage = newPercentage;
}

// Güç istatistiklerini güncelleme
function updatePowerStats() {
    const power = getRandomValue(ranges.power.min, ranges.power.max);
    const voltage = getRandomValue(ranges.voltage.min, ranges.voltage.max);
    const current = getRandomValue(ranges.current.min, ranges.current.max);
    
    document.querySelector('.power-value').textContent = `${power} W`;
    document.querySelector('.voltage-value').textContent = `${voltage} V`;
    document.querySelector('.current-value').textContent = `${current} A`;
}

// Sıcaklık değerlerini güncelleme
function updateTemperatures() {
    const temp1 = getRandomValue(ranges.temp1.min, ranges.temp1.max);
    const temp2 = getRandomValue(ranges.temp2.min, ranges.temp2.max);
    
    document.querySelector('.temp1').textContent = `${temp1}°C`;
    document.querySelector('.temp2').textContent = `${temp2}°C`;
}

// Hücre voltajlarını güncelleme
function updateCellVoltages() {
    const cells = document.querySelectorAll('.voltage-item');
    let lowestVoltage = 5.0;
    let highestVoltage = 0.0;
    let lowestCell = 1;
    let highestCell = 1;
    
    cells.forEach((cell, index) => {
        const voltage = getRandomValue(ranges.cells[index].min, ranges.cells[index].max);
        const bar = cell.querySelector('.bar');
        const value = cell.querySelector('.value');
        const batteryLevel = cell.querySelector('.battery-level');
        
        // Voltaj değerini güncelle
        value.textContent = `${voltage} V`;
        
        // Bar ve batarya seviyesini güncelle (3.0V-%0, 4.2V-%100 arası)
        const percentage = ((voltage - 3.0) / (4.2 - 3.0)) * 100;
        bar.style.width = `${percentage}%`;
        batteryLevel.style.width = `${Math.min(percentage, 100)}%`;
        
        // En düşük ve en yüksek voltajları takip et
        if (parseFloat(voltage) < lowestVoltage) {
            lowestVoltage = parseFloat(voltage);
            lowestCell = index + 1;
        }
        if (parseFloat(voltage) > highestVoltage) {
            highestVoltage = parseFloat(voltage);
            highestCell = index + 1;
        }
        
        // Batarya seviyesinin rengini voltaja göre ayarla
        if (percentage < 20) {
            batteryLevel.style.background = '#ff5252';
            bar.style.background = '#ff5252';
        } else if (percentage < 50) {
            batteryLevel.style.background = '#ffd740';
            bar.style.background = '#ffd740';
        } else {
            batteryLevel.style.background = '#4CAF50';
            bar.style.background = '#4CAF50';
        }
    });
    
    // Voltaj ekstremlerini güncelle
    document.querySelector('.lowest .extreme-value').textContent = `${lowestVoltage.toFixed(3)} V`;
    document.querySelector('.lowest .extreme-cell').textContent = `Cell ${lowestCell}`;
    document.querySelector('.highest .extreme-value').textContent = `${highestVoltage.toFixed(3)} V`;
    document.querySelector('.highest .extreme-cell').textContent = `Cell ${highestCell}`;
}

// Şarj/Deşarj durumunu değiştirme
let isCharging = true;
function toggleChargingStatus() {
    const chargingBtn = document.querySelector('.status-btn.charging');
    const dischargingBtn = document.querySelector('.status-btn.discharging');
    
    isCharging = !isCharging;
    if (isCharging) {
        chargingBtn.classList.add('active');
        dischargingBtn.classList.remove('active');
    } else {
        chargingBtn.classList.remove('active');
        dischargingBtn.classList.add('active');
    }
}

// Döngü sayacını artırma
let cycleCount = 124;
function updateCycleCount() {
    cycleCount++;
    document.querySelector('.cycle-count').textContent = cycleCount;
}

// Tüm değerleri periyodik olarak güncelleme
function updateAllValues() {
    updatePowerStats();
    updateTemperatures();
    updateCellVoltages();
    updateBatteryPercentage();
    
    // %50 ihtimalle şarj durumunu değiştir
    if (Math.random() > 0.95) {
        toggleChargingStatus();
    }
    
    // %10 ihtimalle döngü sayacını artır
    if (Math.random() > 0.99) {
        updateCycleCount();
    }
}

// Başlangıç değerlerini ayarla
updateBatteryPercentage();

// Her 2 saniyede bir değerleri güncelle
setInterval(updateAllValues, 2000);

// Event Listeners
document.querySelector('.status-btn.charging').addEventListener('click', () => {
    if (!isCharging) toggleChargingStatus();
});

document.querySelector('.status-btn.discharging').addEventListener('click', () => {
    if (isCharging) toggleChargingStatus();
});

// Sekme değiştirme
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const page = btn.dataset.page;
        
        if (page === 'statistics') {
            window.location.href = 'statistics.html';
            return;
        }
        
        // Overview sayfasını göster/gizle
        const batteryStatus = document.querySelector('.battery-status');
        if (batteryStatus) {
            batteryStatus.style.display = page === 'overview' ? 'block' : 'none';
        }
        
        // Aktif buton stilini güncelle
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// Grafik verilerini tutacak diziler
let batteryData = [];
let voltageData = [];
let currentData = [];
let temperatureData = [];
let cellData = Array(6).fill().map(() => []);

// Grafikleri tutacak değişkenler
let batteryChart, voltageChart, currentChart, temperatureChart, cellChart;

// Grafik renkleri
const chartColors = {
    battery: '#4CAF50',
    voltage: '#2196F3',
    current: '#FFC107',
    temperature: '#FF5722',
    cells: ['#4CAF50', '#2196F3', '#FFC107', '#FF5722', '#9C27B0', '#3F51B5']
};

// Zaman aralığı (varsayılan: 1 saat)
let timeRange = 3600000; // 1 saat (milisaniye)

// Grafikleri başlat
function initializeCharts() {
    if (!document.getElementById('batteryChart')) return;

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 0
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'minute'
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.7)'
                }
            },
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.7)'
                }
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    };

    // Eğer grafikler zaten oluşturulmuşsa yeniden oluşturma
    if (batteryChart) batteryChart.destroy();
    if (voltageChart) voltageChart.destroy();
    if (currentChart) currentChart.destroy();
    if (temperatureChart) temperatureChart.destroy();
    if (cellChart) cellChart.destroy();

    // Ana batarya grafiği
    batteryChart = new Chart(document.getElementById('batteryChart'), {
        type: 'line',
        data: {
            datasets: [{
                label: 'Battery Level',
                data: batteryData,
                borderColor: chartColors.battery,
                borderWidth: 2,
                fill: false,
                tension: 0.4
            }]
        },
        options: commonOptions
    });

    // Voltaj grafiği
    voltageChart = new Chart(document.getElementById('voltageChart'), {
        type: 'line',
        data: {
            datasets: [{
                label: 'Voltage',
                data: voltageData,
                borderColor: chartColors.voltage,
                borderWidth: 2,
                fill: false,
                tension: 0.4
            }]
        },
        options: commonOptions
    });

    // Akım grafiği
    currentChart = new Chart(document.getElementById('currentChart'), {
        type: 'line',
        data: {
            datasets: [{
                label: 'Current',
                data: currentData,
                borderColor: chartColors.current,
                borderWidth: 2,
                fill: false,
                tension: 0.4
            }]
        },
        options: commonOptions
    });

    // Sıcaklık grafiği
    temperatureChart = new Chart(document.getElementById('temperatureChart'), {
        type: 'line',
        data: {
            datasets: [{
                label: 'Temperature',
                data: temperatureData,
                borderColor: chartColors.temperature,
                borderWidth: 2,
                fill: false,
                tension: 0.4
            }]
        },
        options: commonOptions
    });

    // Hücre voltajları grafiği
    cellChart = new Chart(document.getElementById('cellChart'), {
        type: 'line',
        data: {
            datasets: cellData.map((data, index) => ({
                label: `Cell ${index + 1}`,
                data: data,
                borderColor: chartColors.cells[index],
                borderWidth: 2,
                fill: false,
                tension: 0.4
            }))
        },
        options: {
            ...commonOptions,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                }
            }
        }
    });
}

// Grafik verilerini güncelle
function updateChartData() {
    const statisticsSection = document.querySelector('.statistics-section');
    if (!statisticsSection || statisticsSection.style.display !== 'block') return;

    const now = Date.now();
    
    try {
        const batteryPercentage = parseFloat(document.querySelector('.percentage-value').textContent);
        const voltage = parseFloat(document.querySelector('.voltage-value').textContent);
        const current = parseFloat(document.querySelector('.current-value').textContent);
        const temp1 = parseFloat(document.querySelector('.temp1').textContent);
        
        // Verileri ekle
        if (!isNaN(batteryPercentage)) batteryData.push({ x: now, y: batteryPercentage });
        if (!isNaN(voltage)) voltageData.push({ x: now, y: voltage });
        if (!isNaN(current)) currentData.push({ x: now, y: current });
        if (!isNaN(temp1)) temperatureData.push({ x: now, y: temp1 });
        
        // Hücre verilerini güncelle
        document.querySelectorAll('.voltage-item').forEach((cell, index) => {
            const voltage = parseFloat(cell.querySelector('.value').textContent);
            if (!isNaN(voltage)) {
                cellData[index].push({ x: now, y: voltage });
                
                // Eski verileri temizle
                while (cellData[index].length > 0 && cellData[index][0].x < now - timeRange) {
                    cellData[index].shift();
                }
            }
        });
        
        // Eski verileri temizle
        while (batteryData.length > 0 && batteryData[0].x < now - timeRange) {
            batteryData.shift();
        }
        while (voltageData.length > 0 && voltageData[0].x < now - timeRange) {
            voltageData.shift();
        }
        while (currentData.length > 0 && currentData[0].x < now - timeRange) {
            currentData.shift();
        }
        while (temperatureData.length > 0 && temperatureData[0].x < now - timeRange) {
            temperatureData.shift();
        }
        
        // Grafikleri güncelle
        if (batteryChart && voltageChart && currentChart && temperatureChart && cellChart) {
            batteryChart.update('none');
            voltageChart.update('none');
            currentChart.update('none');
            temperatureChart.update('none');
            cellChart.update('none');
        }
    } catch (error) {
        console.error('Error updating chart data:', error);
    }
}

// Zaman aralığı butonlarını yönet
document.querySelectorAll('.time-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const range = btn.dataset.range;
        switch (range) {
            case '1h':
                timeRange = 3600000;
                break;
            case '6h':
                timeRange = 21600000;
                break;
            case '24h':
                timeRange = 86400000;
                break;
        }
    });
});

// Her güncelleme ile grafik verilerini de güncelle
const originalUpdateAllValues = updateAllValues;
updateAllValues = function() {
    originalUpdateAllValues();
    updateChartData();
};

// Grafikleri başlat
initializeCharts();
