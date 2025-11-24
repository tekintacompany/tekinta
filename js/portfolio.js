document.addEventListener('DOMContentLoaded', function() {
    // Load portfolio data from JSON
    loadJSON('data/portfolio.json').then(data => {
        if (data && data.portfolioItems) {
            renderPortfolioItems(data.portfolioItems);
        }
    });
    
    // Function to render portfolio items
    function renderPortfolioItems(items) {
        const portfolioGrid = document.querySelector('.portfolio__grid');
        if (!portfolioGrid) return;
        
        portfolioGrid.innerHTML = '';
        
        items.forEach(item => {
            const portfolioItem = document.createElement('div');
            portfolioItem.className = 'portfolio-item';
            portfolioItem.innerHTML = `
                <div class="portfolio-item__image">
                    <img src="${item.image}" alt="${item.title}" loading="lazy">
                </div>
                <div class="portfolio-item__content">
                    <h3 class="portfolio-item__title">${item.title}</h3>
                    <p class="portfolio-item__category">${item.category}</p>
                    <p class="portfolio-item__description">${item.description}</p>
                    <button class="portfolio-item__view-btn" data-id="${item.id}">View Details</button>
                </div>
            `;
            
            portfolioGrid.appendChild(portfolioItem);
            
            // Add click event to view details button
            const viewBtn = portfolioItem.querySelector('.portfolio-item__view-btn');
            viewBtn.addEventListener('click', function() {
                showPortfolioModal(item);
            });
        });
    }
    
    // Function to show portfolio modal
    function showPortfolioModal(item) {
        // Create modal if it doesn't exist
        let modal = document.getElementById('portfolio-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'portfolio-modal';
            modal.className = 'modal';
            document.body.appendChild(modal);
        }
        
        // Populate modal content
        modal.innerHTML = `
            <div class="modal__content">
                <button class="modal__close" aria-label="Close modal">&times;</button>
                <div class="portfolio-modal__inner">
                    <div class="portfolio-modal__image">
                        <img src="${item.image}" alt="${item.title}">
                    </div>
                    <div class="portfolio-modal__content">
                        <h2 class="portfolio-modal__title">${item.title}</h2>
                        <div class="portfolio-modal__meta">
                            <span class="portfolio-modal__category">${item.category}</span>
                            <span class="portfolio-modal__date">${item.date}</span>
                        </div>
                        <div class="portfolio-modal__description">
                            <p>${item.fullDescription || item.description}</p>
                        </div>
                        ${item.beforeAfter ? `
                            <div class="portfolio-modal__before-after">
                                <h3>Before & After</h3>
                                <div class="portfolio-modal__comparison">
                                    <div class="portfolio-modal__before">
                                        <img src="${item.beforeAfter.before}" alt="Before">
                                        <p>Before</p>
                                    </div>
                                    <div class="portfolio-modal__after">
                                        <img src="${item.beforeAfter.after}" alt="After">
                                        <p>After</p>
                                    </div>
                                </div>
                            </div>
                        ` : ''}
                        ${item.technologies ? `
                            <div class="portfolio-modal__technologies">
                                <h3>Technologies Used</h3>
                                <div class="portfolio-modal__tech-list">
                                    ${item.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                                </div>
                            </div>
                        ` : ''}
                        ${item.results ? `
                            <div class="portfolio-modal__results">
                                <h3>Results</h3>
                                <ul>
                                    ${item.results.map(result => `<li>${result}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}
                        <div class="portfolio-modal__actions">
                            <a href="${item.link || '#'}" class="btn btn--primary" target="_blank" rel="noopener noreferrer">View Live Project</a>
                            <a href="contact.html" class="btn btn--outline">Get Similar Solution</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Show modal
        showModal('portfolio-modal');
        
        // Add close button event
        const closeBtn = modal.querySelector('.modal__close');
        closeBtn.addEventListener('click', function() {
            closeModal('portfolio-modal');
        });
    }
    
    // Portfolio filtering
    const filterButtons = document.querySelectorAll('.portfolio-filter__btn');
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                
                // Load and filter portfolio items
                loadJSON('data/portfolio.json').then(data => {
                    if (data && data.portfolioItems) {
                        let filteredItems = data.portfolioItems;
                        
                        if (filter !== 'all') {
                            filteredItems = data.portfolioItems.filter(item => 
                                item.category.toLowerCase() === filter.toLowerCase()
                            );
                        }
                        
                        renderPortfolioItems(filteredItems);
                    }
                });
            });
        });
    }
});