// Authentication management
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Check if user is already logged in
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        
        if (token && userData) {
            this.currentUser = JSON.parse(userData);
            this.updateUI();
        }
    }

    async login(username, password) {
        try {
            const response = await api.login(username, password);
            
            if (response.success) {
                // Store auth data
                localStorage.setItem('authToken', response.token);
                localStorage.setItem('userData', JSON.stringify(response.user));
                
                this.currentUser = response.user;
                this.updateUI();
                
                showNotification('Login successful!', 'success');
                
                // Redirect to home page
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
                
                return true;
            }
        } catch (error) {
            showNotification(error.message || 'Login failed', 'error');
            return false;
        }
    }

    async register(username, password, email) {
        try {
            const response = await api.register(username, password, email);
            
            if (response.success) {
                showNotification('Registration successful! Please login.', 'success');
                return true;
            }
        } catch (error) {
            showNotification(error.message || 'Registration failed', 'error');
            return false;
        }
    }

    logout() {
        // Clear stored data
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        
        this.currentUser = null;
        this.updateUI();
        
        showNotification('Logged out successfully', 'success');
        
        // Redirect to home page
        window.location.href = 'index.html';
    }

    updateUI() {
        const loginLink = document.getElementById('login-link');
        const reservationsLink = document.getElementById('reservations-link');
        const logoutLink = document.getElementById('logout-link');

        if (this.currentUser) {
            // User is logged in
            if (loginLink) loginLink.style.display = 'none';
            if (reservationsLink) reservationsLink.style.display = 'block';
            if (logoutLink) {
                logoutLink.style.display = 'block';
                logoutLink.textContent = `Logout (${this.currentUser.username})`;
            }
        } else {
            // User is not logged in
            if (loginLink) loginLink.style.display = 'block';
            if (reservationsLink) reservationsLink.style.display = 'none';
            if (logoutLink) logoutLink.style.display = 'none';
        }
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

// Create global auth manager instance
const authManager = new AuthManager();

// Utility function for notifications
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 10000;
        max-width: 300px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#4CAF50';
            break;
        case 'error':
            notification.style.backgroundColor = '#f44336';
            break;
        case 'warning':
            notification.style.backgroundColor = '#ff9800';
            break;
        default:
            notification.style.backgroundColor = '#2196F3';
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Set up logout functionality
document.addEventListener('DOMContentLoaded', () => {
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            authManager.logout();
        });
    }
});
