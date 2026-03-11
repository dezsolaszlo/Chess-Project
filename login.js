// Login page functionality
class LoginPage {
    constructor() {
        this.init();
    }

    init() {
        // Check if user is already logged in
        if (authManager.isLoggedIn()) {
            window.location.href = 'index.html';
            return;
        }

        this.setupEventListeners();
        this.setupFormValidation();
    }

    setupEventListeners() {
        // Login form submission
        const loginForm = document.getElementById('login-form-element');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Registration form submission
        const registerForm = document.getElementById('register-form-element');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegistration();
            });
        }

        // Form switching
        const showRegisterLink = document.getElementById('show-register');
        const showLoginLink = document.getElementById('show-login');

        if (showRegisterLink) {
            showRegisterLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showRegistrationForm();
            });
        }

        if (showLoginLink) {
            showLoginLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLoginForm();
            });
        }
    }

    setupFormValidation() {
        // Real-time password confirmation validation
        const registerPassword = document.getElementById('register-password');
        const confirmPassword = document.getElementById('register-confirm-password');

        if (registerPassword && confirmPassword) {
            const validatePasswords = () => {
                if (confirmPassword.value && registerPassword.value !== confirmPassword.value) {
                    confirmPassword.setCustomValidity('Passwords do not match');
                } else {
                    confirmPassword.setCustomValidity('');
                }
            };

            registerPassword.addEventListener('input', validatePasswords);
            confirmPassword.addEventListener('input', validatePasswords);
        }
    }

    async handleLogin() {
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;

        if (!username || !password) {
            showNotification('Please fill in all fields', 'warning');
            return;
        }

        // Disable form during login
        this.setFormLoading(true, 'login');

        try {
            const success = await authManager.login(username, password);
            
            if (success) {
                // Login successful - authManager handles redirect
                return;
            }
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            this.setFormLoading(false, 'login');
        }
    }

    async handleRegistration() {
        const username = document.getElementById('register-username').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;

        // Validation
        if (!username || !email || !password || !confirmPassword) {
            showNotification('Please fill in all fields', 'warning');
            return;
        }

        if (username.length < 3) {
            showNotification('Username must be at least 3 characters long', 'warning');
            return;
        }

        if (password.length < 6) {
            showNotification('Password must be at least 6 characters long', 'warning');
            return;
        }

        if (password !== confirmPassword) {
            showNotification('Passwords do not match', 'warning');
            return;
        }

        // Disable form during registration
        this.setFormLoading(true, 'register');

        try {
            const success = await authManager.register(username, password, email);
            
            if (success) {
                // Clear registration form
                document.getElementById('register-form-element').reset();
                
                // Switch to login form
                this.showLoginForm();
                
                // Pre-fill username
                document.getElementById('login-username').value = username;
            }
        } catch (error) {
            console.error('Registration error:', error);
        } finally {
            this.setFormLoading(false, 'register');
        }
    }

    showLoginForm() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');

        if (loginForm && registerForm) {
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
        }
    }

    showRegistrationForm() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');

        if (loginForm && registerForm) {
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
        }
    }

    setFormLoading(loading, formType) {
        const button = formType === 'login' 
            ? document.querySelector('.login-button')
            : document.querySelector('.reg-button');
        
        const form = formType === 'login'
            ? document.getElementById('login-form-element')
            : document.getElementById('register-form-element');

        if (button && form) {
            if (loading) {
                button.disabled = true;
                button.textContent = formType === 'login' ? 'Logging in...' : 'Creating Account...';
                
                // Disable all form inputs
                const inputs = form.querySelectorAll('input');
                inputs.forEach(input => input.disabled = true);
            } else {
                button.disabled = false;
                button.textContent = formType === 'login' ? 'Login' : 'Register';
                
                // Enable all form inputs
                const inputs = form.querySelectorAll('input');
                inputs.forEach(input => input.disabled = false);
            }
        }
    }
}

// Initialize login page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.loginPage = new LoginPage();
});
