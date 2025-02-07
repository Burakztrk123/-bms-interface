import { config } from './config.js';

// Home Assistant API Configuration
const HA_CONFIG = {
    baseUrl: config.baseUrl,
    token: config.token,
    headers: {
        'Authorization': `Bearer ${config.token}`,
        'Content-Type': 'application/json',
    }
};

class HomeAssistantAPI {
    constructor(config) {
        this.config = config;
    }

    // Home Assistant'dan tüm sensörleri al
    async getAllSensors() {
        try {
            const response = await fetch(`${this.config.baseUrl}/api/states`, {
                headers: this.config.headers
            });
            if (!response.ok) throw new Error('Failed to fetch sensors');
            return await response.json();
        } catch (error) {
            console.error('Error fetching sensors:', error);
            throw error;
        }
    }

    // Belirli bir sensörün durumunu al
    async getSensorState(entityId) {
        try {
            const response = await fetch(`${this.config.baseUrl}/api/states/${entityId}`, {
                headers: this.config.headers
            });
            if (!response.ok) throw new Error(`Failed to fetch sensor: ${entityId}`);
            return await response.json();
        } catch (error) {
            console.error(`Error fetching sensor ${entityId}:`, error);
            throw error;
        }
    }

    // Batarya verilerini al (örnek entity_id'ler)
    async getBatteryData() {
        const batteryEntities = [
            'sensor.battery_voltage',
            'sensor.battery_current',
            'sensor.battery_power',
            'sensor.battery_soc'
        ];

        try {
            const promises = batteryEntities.map(entity => this.getSensorState(entity));
            return await Promise.all(promises);
        } catch (error) {
            console.error('Error fetching battery data:', error);
            throw error;
        }
    }

    // WebSocket bağlantısı kur
    connectWebSocket(callback) {
        const auth = JSON.stringify({
            type: 'auth',
            access_token: this.config.token
        });

        const ws = new WebSocket(`${this.config.baseUrl.replace('http', 'ws')}/api/websocket`);

        ws.onopen = () => {
            console.log('WebSocket Connected');
            ws.send(auth);
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            callback(data);
        };

        ws.onerror = (error) => {
            console.error('WebSocket Error:', error);
        };

        ws.onclose = () => {
            console.log('WebSocket Connection Closed');
            // Bağlantı koptuğunda yeniden bağlanmayı dene
            setTimeout(() => this.connectWebSocket(callback), 5000);
        };

        return ws;
    }

    // Servis çağrısı yap
    async callService(domain, service, serviceData) {
        try {
            const response = await fetch(`${this.config.baseUrl}/api/services/${domain}/${service}`, {
                method: 'POST',
                headers: this.config.headers,
                body: JSON.stringify(serviceData)
            });
            if (!response.ok) throw new Error(`Failed to call service: ${domain}.${service}`);
            return await response.json();
        } catch (error) {
            console.error(`Error calling service ${domain}.${service}:`, error);
            throw error;
        }
    }
}

// API instance'ını oluştur
const haAPI = new HomeAssistantAPI(HA_CONFIG);

// Export the API instance
export default haAPI;
