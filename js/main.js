// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.nav--mobile');
    
    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            mobileNav.classList.toggle('is-open');
        });
    }
    
    // Testimonials Carousel
    const testimonialsTrack = document.querySelector('.testimonials__track');
    const testimonialsPrev = document.querySelector('.testimonials__nav--prev');
    const testimonialsNext = document.querySelector('.testimonials__nav--next');
    
    if (testimonialsTrack && testimonialsPrev && testimonialsNext) {
        let currentTestimonial = 0;
        const testimonials = document.querySelectorAll('.testimonial-card');
        const totalTestimonials = testimonials.length;
        
        function updateTestimonialPosition() {
            const translateX = -currentTestimonial * 100;
            testimonialsTrack.style.transform = `translateX(${translateX}%)`;
        }
        
        testimonialsPrev.addEventListener('click', function() {
            currentTestimonial = (currentTestimonial - 1 + totalTestimonials) % totalTestimonials;
            updateTestimonialPosition();
        });
        
        testimonialsNext.addEventListener('click', function() {
            currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
            updateTestimonialPosition();
        });
        
        // Auto-rotate testimonials
        setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
            updateTestimonialPosition();
        }, 5000);
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Lazy loading images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Form validation (for contact forms)
    const forms = document.querySelectorAll('.contact-form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('error');
                    isValid = false;
                } else {
                    field.classList.remove('error');
                }
            });
            
            // Email validation
            const emailFields = form.querySelectorAll('[type="email"]');
            emailFields.forEach(field => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (field.value.trim() && !emailRegex.test(field.value.trim())) {
                    field.classList.add('error');
                    isValid = false;
                }
            });
            
            if (isValid) {
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'form-success-message';
                successMessage.textContent = 'Thank you for your message! We will get back to you soon.';
                form.parentNode.insertBefore(successMessage, form.nextSibling);
                
                // Reset form
                form.reset();
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
                
                // Here you would normally send the form data to a server
                console.log('Form submitted successfully');
            }
        });
        
        // Remove error class on input
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                this.classList.remove('error');
            });
        });
    });
    
    // WhatsApp button click tracking
    const whatsappButtons = document.querySelectorAll('a[href^="https://wa.me/"]');
    whatsappButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Push to dataLayer for analytics
            if (typeof dataLayer !== 'undefined') {
                dataLayer.push({
                    'event': 'whatsapp_click',
                    'button_text': this.textContent.trim()
                });
            }
            
            // Facebook Pixel tracking
            if (typeof fbq !== 'undefined') {
                fbq('track', 'Contact');
            }
        });
    });
    
    // CTA button click tracking
    const ctaButtons = document.querySelectorAll('.btn--primary');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Push to dataLayer for analytics
            if (typeof dataLayer !== 'undefined') {
                dataLayer.push({
                    'event': 'cta_click',
                    'button_text': this.textContent.trim(),
                    'destination': this.getAttribute('href')
                });
            }
            
            // Facebook Pixel tracking
            if (typeof fbq !== 'undefined') {
                fbq('track', 'Lead');
            }
        });
    });
    
    // Add animation on scroll
    const animatedElements = document.querySelectorAll('.service-card, .pricing-card, .trust__item');
    
    if ('IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    animationObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        animatedElements.forEach(element => {
            animationObserver.observe(element);
        });
    }
});

// Helper function to load JSON data
async function loadJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading JSON:', error);
        return null;
    }
}

// Function to generate WhatsApp link with pre-filled message
function generateWhatsAppLink(phoneNumber, message) {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}

// Function to show modal
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Close modal when clicking outside of it
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal(modalId);
            }
        });
    }
}

// Function to close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Function to generate a simple invoice/receipt
function generateInvoice(data) {
    const invoiceHtml = `
        <div class="invoice">
            <div class="invoice-header">
                <h2>TEKINTA Digital Solutions</h2>
                <p>Invoice #${data.invoiceNumber}</p>
                <p>Date: ${data.date}</p>
            </div>
            <div class="invoice-body">
                <h3>Bill To:</h3>
                <p>${data.customerName}</p>
                <p>${data.customerEmail}</p>
                <p>${data.customerPhone}</p>
                
                <h3>Service Details:</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.items.map(item => `
                            <tr>
                                <td>${item.description}</td>
                                <td>${item.quantity}</td>
                                <td>₦${item.price.toLocaleString()}</td>
                                <td>₦${(item.quantity * item.price).toLocaleString()}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3">Subtotal</td>
                            <td>₦${data.subtotal.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td colspan="3">VAT (7.5%)</td>
                            <td>₦${data.vat.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td colspan="3"><strong>Total</strong></td>
                            <td><strong>₦${data.total.toLocaleString()}</strong></td>
                        </tr>
                    </tfoot>
                </table>
                
                <div class="invoice-payment">
                    <h3>Payment Information:</h3>
                    <p>Bank: TEKINTA Digital Solutions</p>
                    <p>Account Number: 1234567890</p>
                    <p>Bank: Zenith Bank</p>
                    <p>Payment Terms: 70% upfront, 30% on delivery</p>
                </div>
            </div>
            <div class="invoice-footer">
                <p>Thank you for your business!</p>
                <p>For questions, contact us at info@tekinta.com or +234 123 456 7890</p>
            </div>
        </div>
    `;
    
    return invoiceHtml;
}

// Function to print invoice
function printInvoice(invoiceHtml) {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Invoice - TEKINTA Digital Solutions</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .invoice-header {
                    border-bottom: 1px solid #ddd;
                    padding-bottom: 20px;
                    margin-bottom: 20px;
                }
                .invoice-header h2 {
                    margin: 0;
                    color: #003B73;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 12px;
                    text-align: left;
                }
                th {
                    background-color: #f5f5f5;
                }
                tfoot td {
                    font-weight: bold;
                }
                .invoice-payment {
                    margin-top: 30px;
                    padding: 15px;
                    background-color: #f9f9f9;
                    border-radius: 5px;
                }
                .invoice-footer {
                    margin-top: 30px;
                    text-align: center;
                    font-size: 14px;
                    color: #666;
                }
                @media print {
                    body {
                        max-width: none;
                        margin: 0;
                        padding: 15px;
                    }
                }
            </style>
        </head>
        <body>
            ${invoiceHtml}
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}