document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            document.body.classList.toggle('nav-open'); // block scroll when menu open
        });

        // Close menu when a nav link is clicked (mobile)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    document.body.classList.remove('nav-open');
                }
            });
        });
    }

    // Home button behavior (floating)
    const homeButton = document.getElementById('home-button');
    if (homeButton) {
        homeButton.addEventListener('click', (e) => {
            e.preventDefault();
            // If on homepage, scroll to top, otherwise navigate to homepage
            const currentPath = window.location.pathname.split('/').pop();
            if (!currentPath || currentPath === '' || currentPath === 'index.html') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                window.location.href = 'index.html';
            }
        });
    }

    // "Back to Top" Button Logic
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });

        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Scroll Animations Logic
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe static elements that need animation
    const staticAnimatedElements = document.querySelectorAll('.feature-item');
    staticAnimatedElements.forEach(el => observer.observe(el));

    // --- TESTIMONIALS LOGIC ---
    const testimonialsListAdmin = document.getElementById('testimonials-list');
    const publicTestimonialsList = document.getElementById('public-testimonials-list');
    const addTestimonialForm = document.getElementById('add-testimonial-form');
    
    // Function to get testimonials from localStorage
    const getTestimonials = () => {
        return JSON.parse(localStorage.getItem('testimonials')) || [];
    };

    // Function to save testimonials to localStorage
    const saveTestimonials = (testimonials) => {
        localStorage.setItem('testimonials', JSON.stringify(testimonials));
    };

    // Function to render testimonials for the admin page
    const renderAdminTestimonials = () => {
        if (!testimonialsListAdmin) return;
        testimonialsListAdmin.innerHTML = '';
        const testimonials = getTestimonials();
        if (testimonials.length === 0) {
            testimonialsListAdmin.innerHTML = '<p>No testimonials yet.</p>';
            return;
        }
        testimonials.forEach((testimonial, index) => {
            const item = document.createElement('div');
            item.className = 'testimonial-item-admin';
            item.innerHTML = `
                <div>
                    <strong>${testimonial.name} (${testimonial.rating}/10 Stars)</strong>
                    <p>"${testimonial.quote}"</p>
                </div>
                <button class="delete-btn" data-index="${index}">Delete</button>
            `;
            testimonialsListAdmin.appendChild(item);
        });
    };

    // Function to render testimonials for the public page
    const renderPublicTestimonials = () => {
        if (!publicTestimonialsList) return;
        publicTestimonialsList.innerHTML = '';
        const testimonials = getTestimonials();
        if (testimonials.length === 0) {
            publicTestimonialsList.innerHTML = '<p>No testimonials yet. Be the first to leave a review!</p>';
            return;
        }
        testimonials.forEach(testimonial => {
            const card = document.createElement('div');
            card.className = 'testimonial-card';
            
            let starsHTML = '';
            for (let i = 0; i < testimonial.rating; i++) {
                starsHTML += '<i class="fas fa-star"></i>';
            }
            // Add empty stars for the remainder up to 10
            for (let i = testimonial.rating; i < 10; i++) {
                starsHTML += '<i class="far fa-star" style="color: #ccc;"></i>';
            }

            card.innerHTML = `
                <div class="testimonial-rating">${starsHTML}</div>
                <p>"${testimonial.quote}"</p>
                <cite>- ${testimonial.name}</cite>
            `;
            publicTestimonialsList.appendChild(card);
        });
    };

    // Handle adding a new testimonial
    if (addTestimonialForm) {
        addTestimonialForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('testimonial-name').value;
            const quote = document.getElementById('testimonial-quote').value;
            const rating = parseInt(document.getElementById('testimonial-rating').value, 10);
            
            const testimonials = getTestimonials();
            testimonials.push({ name, quote, rating });
            saveTestimonials(testimonials);
            
            addTestimonialForm.reset();
            renderAdminTestimonials();
        });
    }

    // Handle deleting a testimonial
    if (testimonialsListAdmin) {
        testimonialsListAdmin.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) {
                const index = e.target.dataset.index;
                const testimonials = getTestimonials();
                testimonials.splice(index, 1);
                saveTestimonials(testimonials);
                renderAdminTestimonials();
            }
        });
    }
    
    // Admin page password protection
    if (document.body.id === 'admin-page') {
        const password = 'admin123'; // You can change this password
        const enteredPassword = prompt('Please enter the admin password:');
        
        if (enteredPassword === password) {
            document.getElementById('admin-content').style.display = 'block';
            renderAdminTestimonials();
        } else {
            alert('Incorrect password. Access denied.');
            document.body.innerHTML = '<h1>Access Denied</h1>';
        }
    }

    // Initial render for public testimonials page
    renderPublicTestimonials();


    // --- ORIGINAL PRODUCT LOGIC ---
    const products = [
        {
            name: 'Makki kaa atta',
            description: 'Coarse corn flour, essential for making Makki di Roti. मक्की की रोटी बनाने के लिए आवश्यक मोटा मकई का आटा।',
            price: '₹60 / kg',
            imageUrl: 'https://placehold.co/400x300/F4D03F/000000?text=Makki+Kaa+Atta',
            bestFor: 'Makki di Roti',
            category: 'gluten-free'
        },
        {
            name: 'Bajra kaa atta',
            description: 'A nutritious and gluten-free flour, great for making bhakris. भाकरी बनाने के लिए एक पौष्टिक और लस मुक्त आटा।',
            price: '₹60 / kg',
            imageUrl: 'https://placehold.co/400x300/D5DBDB/000000?text=Bajra+Atta',
            bestFor: 'Bhakri & Rotla',
            category: 'gluten-free'
        },
        {
            name: 'Chana kaa atta',
            description: 'Made from high-quality chickpeas, ideal for snacks. उच्च गुणवत्ता वाले चने से बना, स्नैक्स के लिए आदर्श।',
            price: '₹120 / kg',
            imageUrl: 'https://placehold.co/400x300/F9E79F/000000?text=Chana+Atta',
            bestFor: 'Pakoras & Laddoos',
            category: 'gluten-free'
        },
        {
            name: 'Jwar kaa atta',
            description: 'Healthy and wholesome flour, packed with fiber. फाइबर से भरपूर, स्वस्थ और पौष्टिक आटा।',
            price: '₹70 / kg',
            imageUrl: 'https://placehold.co/400x300/EBDEF0/000000?text=Jwar+Atta',
            bestFor: 'Bhakri & Dosa',
            category: 'gluten-free'
        },
        {
            name: 'Joo kaa atta',
            description: 'A nutritious flour made from barley, rich in fiber. जौ से बना एक पौष्टिक आटा, फाइबर से भरपूर।',
            price: '₹80 / kg',
            imageUrl: 'https://placehold.co/400x300/D2B48C/000000?text=Joo+Atta',
            bestFor: 'Rotis & Sattu',
            category: 'wheat-based'
        },
        {
            name: 'Multi-grain Atta',
            description: 'A blend of multiple grains for a power-packed meal. एक शक्ति-पैक भोजन के लिए कई अनाजों का मिश्रण।',
            price: '₹80 / kg',
            imageUrl: 'https://placehold.co/400x300/E59866/000000?text=Multi-grain',
            bestFor: 'Healthy Rotis',
            category: 'wheat-based'
        },
        {
            name: 'Raagi kaa atta',
            description: 'A highly nutritious millet flour, rich in calcium. रागी का आटा, कैल्शियम से भरपूर एक पौष्टिक आटा।',
            price: '₹120 / kg',
            imageUrl: 'https://placehold.co/400x300/8D6E63/FFFFFF?text=Raagi+Atta',
            bestFor: 'Rotis & Porridge',
            category: 'gluten-free'
        },
        {
            name: 'Chawal kaa atta',
            description: 'Finely ground rice flour, perfect for making dosas and sweets. डोसा और मिठाई बनाने के लिए बारीक पिसा हुआ चावल का आटा।',
            price: '₹70 / kg',
            imageUrl: 'https://placehold.co/400x300/F5F5F5/000000?text=Chawal+Atta',
            bestFor: 'Dosas & Sweets',
            category: 'gluten-free'
        },
        {
            name: 'Bedmi poori kaa atta',
            description: 'A special blend for making delicious and crispy Bedmi Pooris. स्वादिष्ट और कुरकुरी बेडमी पूरी बनाने के लिए एक विशेष मिश्रण।',
            price: '₹60 / kg',
            imageUrl: 'https://placehold.co/400x300/FAD7A0/000000?text=Bedmi+Poori+Atta',
            bestFor: 'Bedmi Pooris',
            category: 'wheat-based'
        },
        {
            name: 'Special Besan',
            description: 'Premium quality gram flour, perfect for sweets and snacks. मिठाई और स्नैक्स के लिए उत्तम गुणवत्ता वाला बेसन।',
            price: '₹120 / kg',
            imageUrl: 'https://placehold.co/400x300/FDEBD0/000000?text=Special+Besan',
            bestFor: 'Sweets & Snacks',
            category: 'gluten-free'
        },
        {
            name: 'Mp sharbati gehun kaa atta',
            description: 'Premium Sharbati wheat flour, known for its sweet taste and soft texture. प्रीमियम शरबती गेहूं का आटा, जो अपने मीठे स्वाद के लिए जाना जाता है।',
            price: '₹65 / 60 / 55 per kg',
            imageUrl: 'https://placehold.co/400x300/EAD3A2/000000?text=Sharbati+Atta',
            bestFor: 'Soft Rotis',
            category: 'wheat-based'
        },
        {
            name: 'Mp gehun kaa atta',
            description: 'High-quality MP wheat flour, perfect for everyday soft rotis. रोज़ की नरम रोटियों के लिए उत्तम गुणवत्ता वाला एमपी गेहूं का आटा।',
            price: '₹50 / kg',
            imageUrl: 'https://placehold.co/400x300/F5DEB3/000000?text=MP+Gehun+Atta',
            bestFor: 'Everyday Rotis',
            category: 'wheat-based'
        }
    ];

    const catalogContainer = document.getElementById('product-catalog');
    const searchInput = document.getElementById('product-search');
    const filterContainer = document.getElementById('filter-container');

    // Function to render products to the page
    function renderProducts(productsToRender) {
        if (!catalogContainer) return;
        catalogContainer.innerHTML = ''; // Clear existing products

        productsToRender.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';

            card.innerHTML = `
                <img src="${product.imageUrl}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="description">${product.description}</p>
                    <div class="product-footer">
                        <span class="price">${product.price}</span>
                        <span class="best-for">${product.bestFor}</span>
                    </div>
                </div>
            `;

            catalogContainer.appendChild(card);
            // Observe dynamically added product cards
            observer.observe(card);
        });
    }

    // Initial render of all products
    renderProducts(products);

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredProducts = products.filter(product => 
                product.name.toLowerCase().includes(searchTerm) || 
                product.description.toLowerCase().includes(searchTerm)
            );
            renderProducts(filteredProducts);
        });
    }

    // Filter functionality
    if (filterContainer) {
        filterContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                // Remove active class from all buttons
                filterContainer.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                e.target.classList.add('active');

                const category = e.target.dataset.category;
                const filteredProducts = category === 'all' 
                    ? products 
                    : products.filter(product => product.category === category);
                
                renderProducts(filteredProducts);
                searchInput.value = ''; // Clear search when filtering
            }
        });
    }
});
