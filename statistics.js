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

// Grafik ayarları
const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
        duration: 0
    },
    elements: {
        line: {
            tension: 0.4,
            borderWidth: 2,
        },
        point: {
            radius: 2,
            hitRadius: 10,
        }
    },
    scales: {
        x: {
            type: 'time',
            time: {
                unit: 'second',
                displayFormats: {
                    second: 'HH:mm:ss'
                }
            },
            grid: {
                color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
                color: 'rgba(255, 255, 255, 0.7)',
                maxRotation: 0
            }
        },
        y: {
            beginAtZero: true,
            grid: {
                color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
                color: 'rgba(255, 255, 255, 0.7)',
                stepSize: 20,
                callback: function(value) {
                    return value.toFixed(1);
                }
            }
        }
    },
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
                label: function(context) {
                    let label = context.dataset.label || '';
                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed.y !== null) {
                        label += context.parsed.y.toFixed(2);
                    }
                    return label;
                }
            }
        }
    }
};

// Grafikleri başlat
function initializeCharts() {
    // Ana batarya grafiği
    batteryChart = new Chart(document.getElementById('batteryChart'), {
        type: 'line',
        data: {
            datasets: [{
                label: 'Battery Level',
                data: batteryData,
                borderColor: chartColors.battery,
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                fill: true
            }]
        },
        options: {
            ...commonOptions,
            scales: {
                ...commonOptions.scales,
                y: {
                    ...commonOptions.scales.y,
                    min: 0,
                    max: 100,
                    ticks: {
                        callback: value => value + '%'
                    }
                }
            }
        }
    });

    // Voltaj grafiği
    voltageChart = new Chart(document.getElementById('voltageChart'), {
        type: 'line',
        data: {
            datasets: [{
                label: 'Voltage',
                data: voltageData,
                borderColor: chartColors.voltage,
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                fill: true
            }]
        },
        options: {
            ...commonOptions,
            scales: {
                ...commonOptions.scales,
                y: {
                    ...commonOptions.scales.y,
                    ticks: {
                        callback: value => value + 'V'
                    }
                }
            }
        }
    });

    // Akım grafiği
    currentChart = new Chart(document.getElementById('currentChart'), {
        type: 'line',
        data: {
            datasets: [{
                label: 'Current',
                data: currentData,
                borderColor: chartColors.current,
                backgroundColor: 'rgba(255, 193, 7, 0.1)',
                fill: true
            }]
        },
        options: {
            ...commonOptions,
            scales: {
                ...commonOptions.scales,
                y: {
                    ...commonOptions.scales.y,
                    ticks: {
                        callback: value => value + 'A'
                    }
                }
            }
        }
    });

    // Sıcaklık grafiği
    temperatureChart = new Chart(document.getElementById('temperatureChart'), {
        type: 'line',
        data: {
            datasets: [{
                label: 'Temperature',
                data: temperatureData,
                borderColor: chartColors.temperature,
                backgroundColor: 'rgba(255, 87, 34, 0.1)',
                fill: true
            }]
        },
        options: {
            ...commonOptions,
            scales: {
                ...commonOptions.scales,
                y: {
                    ...commonOptions.scales.y,
                    ticks: {
                        callback: value => value + '°C'
                    }
                }
            }
        }
    });

    // Hücre voltajları grafiği
    cellChart = new Chart(document.getElementById('cellChart'), {
        type: 'line',
        data: {
            datasets: cellData.map((data, index) => ({
                label: `Cell ${index + 1}`,
                data: data,
                borderColor: chartColors.cells[index],
                backgroundColor: 'transparent',
                borderWidth: 2
            }))
        },
        options: {
            ...commonOptions,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        usePointStyle: true
                    }
                }
            },
            scales: {
                ...commonOptions.scales,
                y: {
                    ...commonOptions.scales.y,
                    ticks: {
                        callback: value => value + 'V'
                    }
                }
            }
        }
    });
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

// Ana sayfadaki verileri al ve güncelle
function syncWithDemoPage() {
    try {
        // Demo sayfasını bul
        const demoPage = document.querySelector('iframe[src="demo.html"]')?.contentWindow || 
                        window.opener || 
                        window.parent;
                        
        if (!demoPage) {
            window.location.href = 'demo.html';
            return;
        }

        // Demo sayfasından verileri al ve temizle
        const parseValue = (element, unit) => {
            const text = element?.textContent || '0';
            return parseFloat(text.replace(unit, '').trim());
        };

        const now = new Date();
        
        // Ana değerleri al
        const batteryElement = demoPage.document.querySelector('.percentage-value');
        const voltageElement = demoPage.document.querySelector('.voltage-value');
        const currentElement = demoPage.document.querySelector('.current-value');
        const tempElement = demoPage.document.querySelector('.temp1');

        const battery = parseValue(batteryElement, '%');
        const voltage = parseValue(voltageElement, 'V');
        const current = parseValue(currentElement, 'A');
        const temp = parseValue(tempElement, '°C');

        // Anlık değerleri güncelle
        document.querySelector('.battery-value').textContent = battery.toFixed(2) + '%';
        document.querySelector('.voltage-value').textContent = voltage.toFixed(2) + 'V';
        document.querySelector('.current-value').textContent = current.toFixed(2) + 'A';
        document.querySelector('.temp-value').textContent = temp.toFixed(1) + '°C';
        document.querySelector('.update-time').textContent = `Last Update: ${now.toLocaleTimeString()}`;

        // Grafik verilerini güncelle
        if (!isNaN(battery)) batteryData.push({ x: now, y: battery });
        if (!isNaN(voltage)) voltageData.push({ x: now, y: voltage });
        if (!isNaN(current)) currentData.push({ x: now, y: current });
        if (!isNaN(temp)) temperatureData.push({ x: now, y: temp });

        // Hücre verilerini güncelle
        const cells = demoPage.document.querySelectorAll('.voltage-item');
        cells.forEach((cell, index) => {
            const cellVoltage = parseValue(cell.querySelector('.value'), 'V');
            if (!isNaN(cellVoltage)) {
                cellData[index].push({ x: now, y: cellVoltage });
                while (cellData[index].length > 0 && cellData[index][0].x < now - timeRange) {
                    cellData[index].shift();
                }
            }
        });

        // Eski verileri temizle
        const cleanOldData = (data) => {
            while (data.length > 0 && data[0].x < now - timeRange) {
                data.shift();
            }
        };

        cleanOldData(batteryData);
        cleanOldData(voltageData);
        cleanOldData(currentData);
        cleanOldData(temperatureData);

        // Grafikleri güncelle
        updateCharts();

    } catch (error) {
        console.error('Error syncing with demo page:', error);
    }
}

// Grafikleri güncelle
function updateCharts() {
    if (batteryChart) batteryChart.update('none');
    if (voltageChart) voltageChart.update('none');
    if (currentChart) currentChart.update('none');
    if (temperatureChart) temperatureChart.update('none');
    if (cellChart) cellChart.update('none');
}

// Excel'e aktar
function exportToExcel() {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Battery Data');

    // Başlıkları ekle ve stil uygula
    sheet.columns = [
        { header: 'Time', key: 'time', width: 20 },
        { header: 'Battery Level (%)', key: 'battery', width: 15, style: { numFmt: '0.00' } },
        { header: 'Voltage (V)', key: 'voltage', width: 15, style: { numFmt: '0.00' } },
        { header: 'Current (A)', key: 'current', width: 15, style: { numFmt: '0.00' } },
        { header: 'Temperature (°C)', key: 'temperature', width: 15, style: { numFmt: '0.0' } },
        { header: 'Cell 1 (V)', key: 'cell1', width: 12, style: { numFmt: '0.000' } },
        { header: 'Cell 2 (V)', key: 'cell2', width: 12, style: { numFmt: '0.000' } },
        { header: 'Cell 3 (V)', key: 'cell3', width: 12, style: { numFmt: '0.000' } },
        { header: 'Cell 4 (V)', key: 'cell4', width: 12, style: { numFmt: '0.000' } },
        { header: 'Cell 5 (V)', key: 'cell5', width: 12, style: { numFmt: '0.000' } },
        { header: 'Cell 6 (V)', key: 'cell6', width: 12, style: { numFmt: '0.000' } }
    ];

    // Başlık stilini ayarla
    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4CAF50' }
    };
    sheet.getRow(1).alignment = { horizontal: 'center' };

    // Verileri topla ve sırala
    const timestamps = new Set();
    batteryData.forEach(d => timestamps.add(d.x.getTime()));
    voltageData.forEach(d => timestamps.add(d.x.getTime()));
    currentData.forEach(d => timestamps.add(d.x.getTime()));
    temperatureData.forEach(d => timestamps.add(d.x.getTime()));
    cellData.forEach(cells => cells.forEach(d => timestamps.add(d.x.getTime())));

    const sortedTimestamps = Array.from(timestamps).sort();

    // Verileri ekle
    sortedTimestamps.forEach(timestamp => {
        const time = new Date(timestamp);
        const battery = batteryData.find(d => d.x.getTime() === timestamp)?.y || 0;
        const voltage = voltageData.find(d => d.x.getTime() === timestamp)?.y || 0;
        const current = currentData.find(d => d.x.getTime() === timestamp)?.y || 0;
        const temperature = temperatureData.find(d => d.x.getTime() === timestamp)?.y || 0;

        const row = {
            time: time.toLocaleString(),
            battery: battery,
            voltage: voltage,
            current: current,
            temperature: temperature
        };

        // Hücre verilerini ekle
        cellData.forEach((cells, index) => {
            const cellVoltage = cells.find(d => d.x.getTime() === timestamp)?.y || 0;
            row[`cell${index + 1}`] = cellVoltage;
        });

        const excelRow = sheet.addRow(row);
        excelRow.alignment = { horizontal: 'center' };
        
        // Sayı formatını ayarla
        excelRow.getCell('battery').numFmt = '0.00';
        excelRow.getCell('voltage').numFmt = '0.00';
        excelRow.getCell('current').numFmt = '0.00';
        excelRow.getCell('temperature').numFmt = '0.0';
        for (let i = 1; i <= 6; i++) {
            excelRow.getCell(`cell${i}`).numFmt = '0.000';
        }
    });

    // Excel dosyasını indir
    workbook.xlsx.writeBuffer().then(buffer => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `battery_data_${new Date().toISOString().split('T')[0]}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
    });
}

// ExcelJS kütüphanesini yükle
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/exceljs@4.3.0/dist/exceljs.min.js';
document.head.appendChild(script);

// Grafikleri başlat ve veri güncelleme döngüsünü başlat
initializeCharts();
setInterval(syncWithDemoPage, 1000); // Her saniye güncelle
