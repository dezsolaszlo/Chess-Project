// Reservations page functionality
class ReservationsPage {
    constructor() {
        this.reservations = [];
        this.currentEditingReservation = null;
        this.init();
    }

    async init() {
        // Check if user is logged in
        if (!authManager.isLoggedIn()) {
            window.location.href = 'login.html';
            return;
        }

        this.setupEventListeners();
        await this.loadUserReservations();
    }

    setupEventListeners() {
        // Close edit modal
        const closeEditModal = document.getElementById('close-edit-modal');
        if (closeEditModal) {
            closeEditModal.addEventListener('click', () => {
                this.closeEditModal();
            });
        }

        // Window click events for modals
        window.addEventListener('click', (event) => {
            const editModal = document.getElementById('edit-reservation-modal');
            if (event.target === editModal) {
                this.closeEditModal();
            }
        });

        const productLink = document.getElementById('product-link');
        if (productLink) {
            productLink.addEventListener('click', (e) => {
                e.preventDefault();
                // Set flag and navigate to index.html
                localStorage.setItem('showGallery', 'true');
                window.location.href = 'index.html';
            });
        }

        const browseCarsBtn = document.getElementById('browse-cars-btn');
        if (browseCarsBtn) {
            browseCarsBtn.addEventListener('click', () => {
                // Set flag and navigate to index.html to show gallery
                localStorage.setItem('showGallery', 'true');
                window.location.href = 'index.html';
            });
        }
    }

    async loadUserReservations() {
        try {
            const loadingElement = document.getElementById('reservations-loading');
            const listElement = document.getElementById('reservations-list');
            const noReservationsElement = document.getElementById('no-reservations');

            if (loadingElement) {
                loadingElement.style.display = 'block';
                loadingElement.textContent = 'Loading your reservations...';
            }

            const user = authManager.getCurrentUser();
            const response = await api.getUserReservations(user.id);

            if (response.success) {
                this.reservations = response.reservations;
                this.renderReservations();

                if (loadingElement) {
                    loadingElement.style.display = 'none';
                }

                if (this.reservations.length === 0) {
                    if (noReservationsElement) {
                        noReservationsElement.style.display = 'block';
                    }
                    if (listElement) {
                        listElement.style.display = 'none';
                    }
                } else {
                    if (noReservationsElement) {
                        noReservationsElement.style.display = 'none';
                    }
                    if (listElement) {
                        listElement.style.display = 'block';
                    }
                }
            }
        } catch (error) {
            console.error('Error loading reservations:', error);
            const loadingElement = document.getElementById('reservations-loading');
            if (loadingElement) {
                loadingElement.textContent = 'Failed to load reservations. Please refresh the page.';
                loadingElement.style.color = '#d40219';
            }
        }
    }

    renderReservations() {
        const listElement = document.getElementById('reservations-list');
        if (!listElement) return;

        listElement.innerHTML = '';

        this.reservations.forEach(reservation => {
            const reservationCard = this.createReservationCard(reservation);
            listElement.appendChild(reservationCard);
        });
    }

    createReservationCard(reservation) {
        const card = document.createElement('div');
        card.className = 'reservation-card';
        card.dataset.reservationId = reservation.id;

        const statusClass = `status-${reservation.status.toLowerCase()}`;
        const canEdit = reservation.status === 'ACTIVE';
        const canCancel = reservation.status === 'ACTIVE';

        // Calculate days and format dates
        const startDate = new Date(reservation.reservationData.startDate);
        const endDate = new Date(reservation.reservationData.endDate);
        const days = reservation.reservationData.days || 1;

        card.innerHTML = `
            <div class="reservation-header">
                <h3>Reservation #${reservation.id}</h3>
                <span class="reservation-status ${statusClass}">
                    ${reservation.status}
                </span>
            </div>
            <div class="reservation-content">
                <div class="car-section">
                    <div class="car-image">
                        <img src="images/${reservation.carData.image || reservation.carId + '.png'}" 
                            alt="${reservation.carData.name}"
                            onerror="this.src='images/default-car.png'">
                    </div>
                    <div class="car-details">
                        <h3>${reservation.carData.name}</h3>
                        <p class="car-specs">${reservation.carData.specs}</p>
                        <p class="car-price">${reservation.carData.price}</p>
                        <p class="daily-rate">Daily Rate: $${reservation.reservationData.dailyRate}/day</p>
                    </div>
                </div>
                
                <div class="reservation-details-section">
                    <h4>Reservation Details</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <span class="label">Start Date:</span>
                            <span class="value">${this.formatDate(reservation.reservationData.startDate)}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">End Date:</span>
                            <span class="value">${this.formatDate(reservation.reservationData.endDate)}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Duration:</span>
                            <span class="value">${days} day${days > 1 ? 's' : ''}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Total Price:</span>
                            <span class="value total-price">$${reservation.reservationData.totalPrice.toFixed(2)}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Reserved On:</span>
                            <span class="value">${this.formatDateTime(reservation.createdAt)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="reservation-actions">
                    <button class="action-button edit-button" 
                            ${!canEdit ? 'disabled' : ''}
                            onclick="reservationsPage.editReservation(${reservation.id})">

                        ${canEdit ? 'Edit Dates' : 'Cannot Edit'}
                    </button>
                    <button class="action-button delete-button" 
                            ${!canCancel ? 'disabled' : ''}
                            onclick="reservationsPage.deleteReservation(${reservation.id})">

                        ${canCancel ? 'Delete' : 'Cannot Delete'}
                    </button>
                </div>
            </div>
        `;

        return card;
    }



    editReservation(reservationId) {
        console.log('=== EDIT RESERVATION DEBUG ===');
        console.log('Reservation ID:', reservationId);
        console.log('All reservations:', this.reservations);
        
        const reservation = this.reservations.find(r => r.id === reservationId);
        console.log('Found reservation:', reservation);
        
        const modal = document.getElementById('edit-reservation-modal');
        console.log('Modal element:', modal);
        
        if (!reservation) {
            console.error('Reservation not found!');
            showNotification('Reservation not found', 'error');
            return;
        }
        
        if (reservation.status !== 'ACTIVE') {
            console.error('Reservation not active:', reservation.status);
            showNotification('Cannot edit this reservation', 'warning');
            return;
        }

        this.currentEditingReservation = reservation;
        this.showEditModal(reservation);
    }



    showEditModal(reservation) {
        console.log('Showing edit modal for reservation:', reservation);
        
        const modal = document.getElementById('edit-reservation-modal');
        const formContainer = document.getElementById('edit-reservation-form');

        if (!modal || !formContainer) {
            console.error('Modal elements not found');
            return;
        }

        // Prevent body scroll
        document.body.classList.add('modal-open');

        // Get today's date
        const today = new Date();
        const todayString = today.getFullYear() + '-' + 
                        String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                        String(today.getDate()).padStart(2, '0');

        // Clear existing content
        formContainer.innerHTML = '';
        
        // Create the form content
        const formHTML = `
            <div class="edit-form-content">
                <div class="car-info-summary">
                    <h3>Editing: ${reservation.carData.name}</h3>
                    <p><strong>Daily Rate:</strong> $${reservation.reservationData.dailyRate}/day</p>
                    <p><strong>Current Total:</strong> $${reservation.reservationData.totalPrice.toFixed(2)}</p>
                </div>
                
                <div class="form-group">
                    <label for="edit-start-date">Start Date:</label>
                    <input type="date" 
                        id="edit-start-date" 
                        class="styled-input" 
                        value="${reservation.reservationData.startDate}"
                        min="${todayString}">
                </div>
                
                <div class="form-group">
                    <label for="edit-end-date">End Date:</label>
                    <input type="date" 
                        id="edit-end-date" 
                        class="styled-input" 
                        value="${reservation.reservationData.endDate}"
                        min="${todayString}">
                </div>
                
                <div id="edit-total-price" class="total-price" style="display: none;"></div>
                
                <div class="edit-actions">
                    <button id="save-edit-btn" class="confirm-button">
                        Save Changes
                    </button>
                    <button id="cancel-edit-btn" class="cancel-button" type="button">
                        Cancel
                    </button>
                </div>
            </div>
        `;

        // Inject the content
        formContainer.innerHTML = formHTML;
        
        // Show modal
        modal.style.display = 'block';
        
        // Setup listeners after a small delay to ensure DOM is ready
        setTimeout(() => {
            this.setupEditFormListeners(reservation);
            console.log('Form content loaded and listeners attached');
        }, 100);
    }





    setupEditFormListeners(reservation) {
        const startDateInput = document.getElementById('edit-start-date');
        const endDateInput = document.getElementById('edit-end-date');
        const totalPriceElement = document.getElementById('edit-total-price');
        const saveButton = document.getElementById('save-edit-btn');
        const cancelButton = document.getElementById('cancel-edit-btn');

        if (!startDateInput || !endDateInput) {
            console.error('Edit form inputs not found');
            return;
        }

        const updateTotalPrice = () => {
            const startDate = new Date(startDateInput.value);
            const endDate = new Date(endDateInput.value);
            
            if (startDate && endDate && endDate >= startDate) {
                const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
                const totalPrice = days * reservation.reservationData.dailyRate;
                
                totalPriceElement.textContent = `New Total Price: $${totalPrice.toFixed(2)} for ${days} day${days > 1 ? 's' : ''}`;
                totalPriceElement.style.display = 'block';
                
                if (saveButton) {
                    saveButton.disabled = false;
                    saveButton.textContent = 'Save Changes';
                }
            } else {
                totalPriceElement.textContent = '';
                totalPriceElement.style.display = 'none';
                if (saveButton) {
                    saveButton.disabled = true;
                    saveButton.textContent = 'Select Valid Dates';
                }
            }

            // Update end date minimum
            if (startDate) {
                endDateInput.min = startDateInput.value;
            }
        };

        // Add event listeners
        startDateInput.addEventListener('change', updateTotalPrice);
        endDateInput.addEventListener('change', updateTotalPrice);

        if (saveButton) {
            saveButton.addEventListener('click', () => {
                this.saveReservationChanges();
            });
        }

        if (cancelButton) {
            cancelButton.addEventListener('click', () => {
                this.closeEditModal();
            });
        }

        // Initial calculation
        updateTotalPrice();
    }


    async saveReservationChanges() {
        if (!this.currentEditingReservation) return;

        const startDateInput = document.getElementById('edit-start-date');
        const endDateInput = document.getElementById('edit-end-date');

        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);

        if (!startDate || !endDate || endDate < startDate) {
            showNotification('Please select valid dates', 'warning');
            return;
        }

        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        const totalPrice = days * this.currentEditingReservation.reservationData.dailyRate;

        const updatedReservationData = {
            ...this.currentEditingReservation.reservationData,
            startDate: startDateInput.value,
            endDate: endDateInput.value,
            days: days,
            totalPrice: totalPrice,
            lastModified: new Date().toISOString()
        };

        try {
            const response = await api.updateReservation(
                this.currentEditingReservation.id,
                updatedReservationData
            );

            if (response.success) {
                showNotification('Reservation updated successfully!', 'success');
                this.closeEditModal();
                await this.loadUserReservations(); // Refresh the list
            }
        } catch (error) {
            console.error('Error updating reservation:', error);
            showNotification(error.message || 'Failed to update reservation', 'error');
        }
    }

    async deleteReservation(reservationId) {
        const reservation = this.reservations.find(r => r.id === reservationId);
        if (!reservation || reservation.status !== 'ACTIVE') {
            showNotification('Cannot delete this reservation', 'warning');
            return;
        }

        const confirmDelete = confirm(
            `Are you sure you want to permanently delete your reservation for ${reservation.carData.name}?\n\n` +
            `Reservation Details:\n` +
            `• Start Date: ${this.formatDate(reservation.reservationData.startDate)}\n` +
            `• End Date: ${this.formatDate(reservation.reservationData.endDate)}\n` +
            `• Total Price: $${reservation.reservationData.totalPrice.toFixed(2)}\n\n` +
            `This will permanently remove the reservation and cannot be undone.`
        );

        if (!confirmDelete) return;

        try {
            // Show loading state
            const deleteButton = document.querySelector(`[onclick="reservationsPage.deleteReservation(${reservationId})"]`);
            if (deleteButton) {
                deleteButton.disabled = true;
                deleteButton.innerHTML = '<span class="button-icon">⏳</span> Deleting...';
            }

            const response = await api.deleteReservation(reservationId);

            if (response.success) {
                showNotification('Reservation deleted successfully', 'success');
                
                // Remove the reservation from local array
                this.reservations = this.reservations.filter(r => r.id !== reservationId);
                
                // Remove the card from DOM immediately
                const reservationCard = document.querySelector(`[data-reservation-id="${reservationId}"]`);
                if (reservationCard) {
                    reservationCard.style.transition = 'all 0.3s ease';
                    reservationCard.style.opacity = '0';
                    reservationCard.style.transform = 'translateX(-100%)';
                    
                    setTimeout(() => {
                        reservationCard.remove();
                        
                        // Check if no reservations left
                        if (this.reservations.length === 0) {
                            const noReservationsElement = document.getElementById('no-reservations');
                            const listElement = document.getElementById('reservations-list');
                            
                            if (noReservationsElement && listElement) {
                                listElement.style.display = 'none';
                                noReservationsElement.style.display = 'block';
                            }
                        }
                    }, 300);
                }
            }
        } catch (error) {
            console.error('Error deleting reservation:', error);
            showNotification(error.message || 'Failed to delete reservation', 'error');
            
            // Reset button state on error
            const deleteButton = document.querySelector(`[onclick="reservationsPage.deleteReservation(${reservationId})"]`);
            if (deleteButton) {
                deleteButton.disabled = false;
                deleteButton.innerHTML = '<span class="button-icon">🗑️</span> Delete';
            }
        }
    }



    closeEditModal() {
        const modal = document.getElementById('edit-reservation-modal');
        if (modal) {
            modal.style.display = 'none';
        }
        this.currentEditingReservation = null;
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    formatDateTime(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    closeEditModal() {
        const modal = document.getElementById('edit-reservation-modal');
        if (modal) {
            modal.style.display = 'none';
        }
        
        // Restore body scroll
        document.body.classList.remove('modal-open');
        
        this.currentEditingReservation = null;
    }

}

// Initialize reservations page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.reservationsPage = new ReservationsPage();
});
