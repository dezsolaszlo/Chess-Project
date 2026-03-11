// API Configuration
const API_CONFIG = {
    baseURL: 'http://localhost:3000/api',
    timeout: 10000
};

// API utility class
class API {
    constructor() {
        this.baseURL = API_CONFIG.baseURL;
    }

    // Generic request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        // Add auth token if available
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Authentication methods
    async login(username, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
    }

    async register(username, password, email) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, password, email })
        });
    }

    // Car methods
    async getCars() {
        return this.request('/cars');
    }

    async getCarById(carId) {
        return this.request(`/cars/${carId}`);
    }

    async getAvailableCars() {
        return this.request('/cars/available/list');
    }

    // Reservation methods
    async createReservation(userId, carId, reservationData) {
        return this.request('/reservations', {
            method: 'POST',
            body: JSON.stringify({ userId, carId, reservationData })
        });
    }

    async getUserReservations(userId) {
        return this.request(`/reservations/user/${userId}`);
    }

    async updateReservation(reservationId, reservationData) {
        return this.request(`/reservations/${reservationId}`, {
            method: 'PUT',
            body: JSON.stringify({ reservationData })
        });
    }

    async deleteReservation(reservationId) {
        return this.request(`/reservations/${reservationId}`, {
            method: 'DELETE'
        });
    }

    // Health check
    async healthCheck() {
        return this.request('/health');
    }
}

// Create global API instance
const api = new API();

// Test API connection on load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await api.healthCheck();
        console.log('API connection successful');
    } catch (error) {
        console.error('API connection failed:', error);
        showNotification('Unable to connect to server. Please try again later.', 'error');
    }
});
