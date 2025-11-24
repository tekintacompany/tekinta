document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    // Service options for WhatsApp
    const serviceOptions = [
        { id: 'web-development', name: 'Web Development' },
        { id: 'cybersecurity', name: 'Cybersecurity' },
        { id: 'pos-systems', name: 'POS Systems' },
        { id: 'system-repair', name: 'System Repair' },
        { id: 'training', name: 'Training' },
        { id: 'other', name: 'Other Services' }
    ];
    
    // Populate service dropdown
    const serviceSelect = document.getElementById('service-required');
    if (serviceSelect) {
        serviceOptions.forEach(service => {
            const option = document.createElement('option');
            option.value = service.id;
            option.textContent = service.name;
            serviceSelect.appendChild(option);
        });
    }
    
    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm(contactForm)) {
            return;
        }
        
        // Get form data
        const formData = new FormData(contactForm);
        const formDataObj = {};
        
        formData.forEach((value, key) => {
            formDataObj[key] = value;
        });
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Show success message
            showFormSuccess();
            
            // Generate WhatsApp link with form data
            const service = serviceOptions.find(s => s.id === formDataObj['service-required']) || 
                           { name: formDataObj['service-required'] || 'your services' };
            
            const whatsappMessage = `Hello TEKINTA, I'm interested in ${service.name}. My name is ${formDataObj.name} and you can reach me at ${formDataObj.email} or ${formDataObj.phone}. My budget is ₦${formDataObj.budget} and I need this done by ${formDataObj.deadline}.`;
            
            const whatsappLink = generateWhatsAppLink('2341234567890', whatsappMessage);
            
            // Update WhatsApp link
            const whatsappBtn = document.getElementById('whatsapp-direct-link');
            if (whatsappBtn) {
                whatsappBtn.href = whatsappLink;
            }
            
            // Log form data (in a real application, this would be sent to a server)
            console.log('Form submitted with data:', formDataObj);
            
            // Push to dataLayer for analytics
            if (typeof dataLayer !== 'undefined') {
                dataLayer.push({
                    'event': 'form_submission',
                    'form_id': 'contact_form',
                    'service': formDataObj['service-required']
                });
            }
            
            // Facebook Pixel tracking
            if (typeof fbq !== 'undefined') {
                fbq('track', 'Lead', {
                    content_name: 'Contact Form',
                    content_category: formDataObj['service-required']
                });
            }
        }, 1500);
    });
    
    // Function to validate form
    function validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
                
                // Show error message
                const errorMsg = field.parentNode.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.textContent = 'This field is required';
                } else {
                    const newErrorMsg = document.createElement('span');
                    newErrorMsg.className = 'error-message';
                    newErrorMsg.textContent = 'This field is required';
                    field.parentNode.appendChild(newErrorMsg);
                }
            } else {
                field.classList.remove('error');
                
                // Remove error message if exists
                const errorMsg = field.parentNode.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.remove();
                }
            }
        });
        
        // Email validation
        const emailField = form.querySelector('[type="email"]');
        if (emailField && emailField.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value.trim())) {
                emailField.classList.add('error');
                isValid = false;
                
                // Show error message
                const errorMsg = emailField.parentNode.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.textContent = 'Please enter a valid email address';
                } else {
                    const newErrorMsg = document.createElement('span');
                    newErrorMsg.className = 'error-message';
                    newErrorMsg.textContent = 'Please enter a valid email address';
                    emailField.parentNode.appendChild(newErrorMsg);
                }
            }
        }
        
        // Phone validation (simple check for numbers and +)
        const phoneField = form.querySelector('[type="tel"]');
        if (phoneField && phoneField.value.trim()) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(phoneField.value.trim())) {
                phoneField.classList.add('error');
                isValid = false;
                
                // Show error message
                const errorMsg = phoneField.parentNode.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.textContent = 'Please enter a valid phone number';
                } else {
                    const newErrorMsg = document.createElement('span');
                    newErrorMsg.className = 'error-message';
                    newErrorMsg.textContent = 'Please enter a valid phone number';
                    phoneField.parentNode.appendChild(newErrorMsg);
                }
            }
        }
        
        return isValid;
    }
    
    // Function to show form success message
    function showFormSuccess() {
        const successMessage = document.createElement('div');
        successMessage.className = 'form-success-message';
        successMessage.innerHTML = `
            <div class="form-success-message__icon">✓</div>
            <h3>Thank You!</h3>
            <p>Your message has been sent successfully. We'll get back to you soon.</p>
            <div class="form-success-message__actions">
                <a href="https://wa.me/2341234567890?text=Hello%20TEKINTA,%20I%20just%20submitted%20a%20contact%20form%20on%20your%20website" 
                   class="btn btn--whatsapp" target="_blank" rel="noopener noreferrer">
                    Chat on WhatsApp
                </a>
                <button class="btn btn--outline" id="new-message-btn">Send Another Message</button>
            </div>
        `;
        
        // Insert success message after form
        contactForm.parentNode.insertBefore(successMessage, contactForm.nextSibling);
        
        // Hide form
        contactForm.style.display = 'none';
        
        // Add event to "Send Another Message" button
        const newMessageBtn = document.getElementById('new-message-btn');
        if (newMessageBtn) {
            newMessageBtn.addEventListener('click', function() {
                contactForm.style.display = 'block';
                contactForm.reset();
                successMessage.remove();
            });
        }
    }
    
    // File upload handling
    const fileInput = document.getElementById('file-upload');
    const fileLabel = document.querySelector('.file-upload-label');
    
    if (fileInput && fileLabel) {
        fileInput.addEventListener('change', function() {
            if (this.files && this.files.length > 0) {
                const fileName = this.files[0].name;
                fileLabel.textContent = fileName;
            } else {
                fileLabel.textContent = 'Choose a file or drag it here';
            }
        });
    }
    
    // Budget range slider
    const budgetRange = document.getElementById('budget-range');
    const budgetInput = document.getElementById('budget');
    
    if (budgetRange && budgetInput) {
        budgetRange.addEventListener('input', function() {
            budgetInput.value = this.value;
        });
        
        budgetInput.addEventListener('input', function() {
            budgetRange.value = this.value;
        });
    }
    
    // Initialize map if it exists
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
        // This would normally initialize a Google Map
        // For this example, we'll just show a placeholder
        mapContainer.innerHTML = `
            <div class="map-placeholder">
                <div class="map-placeholder__content">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#003B73"/>
                    </svg>
                    <h3>Our Location</h3>
                    <p>123 Tech Avenue, Lagos, Nigeria</p>
                    <a href="https://maps.google.com/?q=123+Tech+Avenue,+Lagos,+Nigeria" target="_blank" rel="noopener noreferrer" class="btn btn--primary">
                        View on Google Maps
                    </a>
                </div>
            </div>
        `;
    }
});