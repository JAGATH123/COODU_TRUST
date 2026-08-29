/* =============================================
   DONATE.JS - RAZORPAY INTEGRATION
   ============================================= */

// API Configuration
const API_BASE_URL = 'http://localhost:3000/api'; // Change this to your deployed backend URL

document.addEventListener('DOMContentLoaded', function() {
    
    // =========== 1. AMOUNT SELECTION FUNCTIONALITY ===========
    
    const amountButtons = document.querySelectorAll('.amount-btn');
    const customAmountInput = document.getElementById('custom-amount');
    
    // Handle preset amount selection
    amountButtons.forEach(button => {
        button.addEventListener('click', function() {
            const amount = this.getAttribute('data-amount');
            
            // Update active state
            amountButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Set amount in input
            customAmountInput.value = amount;
        });
    });
    
    // Handle custom amount input
    customAmountInput.addEventListener('input', function() {
        // Remove active state from preset buttons
        amountButtons.forEach(btn => btn.classList.remove('active'));
        
        // Validate amount
        const amount = parseFloat(this.value);
        if (amount < 1 && this.value !== '') {
            this.setCustomValidity('Minimum donation amount is ₹1');
        } else {
            this.setCustomValidity('');
        }
    });
    
    // Set default amount
    customAmountInput.value = '1000';
    
    // =========== 2. FORM VALIDATION & SUBMISSION ===========
    
    const donationForm = document.getElementById('donation-form');
    const donateBtn = document.getElementById('donate-btn');
    const btnText = document.getElementById('btn-text');
    const btnLoader = document.getElementById('btn-loader');
    
    donationForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate form
        if (!donationForm.checkValidity()) {
            donationForm.reportValidity();
            return;
        }
        
        // Validate amount
        const amount = parseFloat(customAmountInput.value);
        if (!amount || amount < 1) {
            showMessage('Please enter a valid donation amount', 'error');
            return;
        }
        
        // Show loading state
        setButtonLoading(true);
        
        try {
            // Collect form data
            const formData = {
                amount: amount,
                donationType: document.getElementById('donation-type').value,
                cause: document.getElementById('cause').value,
                donorInfo: {
                    name: document.getElementById('donor-name').value,
                    email: document.getElementById('donor-email').value,
                    phone: document.getElementById('donor-phone').value,
                    address: document.getElementById('donor-address').value,
                    panNumber: document.getElementById('donor-pan').value
                },
                isAnonymous: document.getElementById('anonymous').checked,
                receiptRequested: document.getElementById('receipt').checked,
                notes: document.getElementById('donation-notes').value
            };
            
            // Create Razorpay order
            const orderResponse = await fetch(`${API_BASE_URL}/donations/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            const orderData = await orderResponse.json();
            
            if (!orderResponse.ok) {
                throw new Error(orderData.message || 'Failed to create order');
            }
            
            // Initialize Razorpay payment
            const options = {
                "key": orderData.data.key,
                "amount": orderData.data.amount,
                "currency": orderData.data.currency,
                "name": "Coodu Trust",
                "description": `Donation for ${formData.cause.replace('-', ' ').toUpperCase()}`,
                "image": "https://res.cloudinary.com/usq2sbox/image/upload/f_auto,q_auto,w_550/v1787987101/coodu-trust/images/logos/123",
                "order_id": orderData.data.orderId,
                "handler": function(response) {
                    handlePaymentSuccess(response);
                },
                "prefill": {
                    "name": formData.donorInfo.name,
                    "email": formData.donorInfo.email,
                    "contact": formData.donorInfo.phone
                },
                "notes": {
                    "cause": formData.cause,
                    "donation_type": formData.donationType
                },
                "theme": {
                    "color": "#28a745"
                },
                "modal": {
                    "ondismiss": function() {
                        setButtonLoading(false);
                        showMessage('Payment cancelled', 'info');
                    }
                }
            };
            
            const rzp = new Razorpay(options);
            rzp.open();
            
        } catch (error) {
            console.error('Payment initiation error:', error);
            setButtonLoading(false);
            showMessage(error.message || 'Failed to initiate payment. Please try again.', 'error');
        }
    });
    
    // =========== 3. PAYMENT SUCCESS HANDLER ===========
    
    async function handlePaymentSuccess(response) {
        try {
            // Verify payment on server
            const verifyResponse = await fetch(`${API_BASE_URL}/donations/verify-payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature
                })
            });
            
            const verifyData = await verifyResponse.json();
            
            if (verifyResponse.ok) {
                // Payment successful
                showSuccessMessage(verifyData.data);
                resetForm();
            } else {
                throw new Error(verifyData.message || 'Payment verification failed');
            }
            
        } catch (error) {
            console.error('Payment verification error:', error);
            showMessage(error.message || 'Payment verification failed. Please contact support.', 'error');
        } finally {
            setButtonLoading(false);
        }
    }
    
    // =========== 4. UTILITY FUNCTIONS ===========
    
    function setButtonLoading(isLoading) {
        if (isLoading) {
            donateBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoader.style.display = 'inline';
        } else {
            donateBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
        }
    }
    
    function showMessage(message, type = 'info') {
        // Remove existing messages
        const existingMessage = document.querySelector('.donation-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `donation-message message-${type}`;
        messageDiv.innerHTML = `
            <span>${message}</span>
            <button class="message-close">&times;</button>
        `;
        
        // Insert message
        donationForm.insertBefore(messageDiv, donationForm.firstChild);
        
        // Add close functionality
        messageDiv.querySelector('.message-close').addEventListener('click', function() {
            messageDiv.remove();
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
    
    function showSuccessMessage(data) {
        const successHtml = `
            <div class="donation-success">
                <h3>🎉 Thank You for Your Generous Donation!</h3>
                <div class="success-details">
                    <p><strong>Receipt Number:</strong> ${data.receiptNumber}</p>
                    <p><strong>Amount:</strong> ₹${data.amount}</p>
                    <p><strong>Donor:</strong> ${data.donorName}</p>
                </div>
                <p>A confirmation email has been sent to your registered email address. Your donation receipt will be processed within 24 hours.</p>
                <button class="btn btn-secondary" onclick="window.location.reload()">Make Another Donation</button>
            </div>
        `;
        
        // Replace form with success message
        const onlineTab = document.getElementById('online');
        onlineTab.innerHTML = successHtml;
    }
    
    function resetForm() {
        donationForm.reset();
        customAmountInput.value = '1000';
        amountButtons.forEach(btn => btn.classList.remove('active'));
        amountButtons[1].classList.add('active'); // Default to ₹1000
    }
    
    // =========== 5. PAN NUMBER FORMATTING ===========
    
    const panInput = document.getElementById('donor-pan');
    panInput.addEventListener('input', function() {
        this.value = this.value.toUpperCase();
        
        // Basic PAN validation pattern
        const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (this.value.length === 10 && !panPattern.test(this.value)) {
            this.setCustomValidity('Please enter a valid PAN number (e.g., ABCDE1234F)');
        } else {
            this.setCustomValidity('');
        }
    });
    
    // =========== 6. PHONE NUMBER VALIDATION ===========
    
    const phoneInput = document.getElementById('donor-phone');
    phoneInput.addEventListener('input', function() {
        // Remove non-numeric characters
        this.value = this.value.replace(/[^0-9]/g, '');
        
        // Basic Indian phone number validation
        if (this.value.length > 0 && (this.value.length < 10 || this.value.length > 10)) {
            this.setCustomValidity('Please enter a valid 10-digit phone number');
        } else {
            this.setCustomValidity('');
        }
    });
    
});