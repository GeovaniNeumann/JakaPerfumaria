
        // Menu Mobile Toggle
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });

        // Fechar menu ao clicar em um link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });

        // Header scroll effect
        window.addEventListener('scroll', () => {
            const header = document.getElementById('header');
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        // Carousel Functionality
        const carouselInner = document.querySelector('.carousel-inner');
        const carouselItems = document.querySelectorAll('.carousel-item');
        const prevButton = document.querySelector('.carousel-control.prev');
        const nextButton = document.querySelector('.carousel-control.next');
        const indicators = document.querySelectorAll('.carousel-indicator');
        
        let currentIndex = 0;
        const totalItems = carouselItems.length;
        
        function updateCarousel() {
            carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Update indicators
            indicators.forEach((indicator, index) => {
                if (index === currentIndex) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
        }
        
        function nextSlide() {
            currentIndex = (currentIndex + 1) % totalItems;
            updateCarousel();
        }
        
        function prevSlide() {
            currentIndex = (currentIndex - 1 + totalItems) % totalItems;
            updateCarousel();
        }
        
        // Event listeners
        nextButton.addEventListener('click', nextSlide);
        prevButton.addEventListener('click', prevSlide);
        
        // Indicator click events
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
        });
        
        // Auto slide
        let slideInterval = setInterval(nextSlide, 5000);
        
        // Pause auto slide on hover
        const carousel = document.querySelector('.carousel');
        carousel.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        carousel.addEventListener('mouseleave', () => {
            slideInterval = setInterval(nextSlide, 5000);
        });

        // Newsletter System
        const newsletterForm = document.getElementById('newsletterForm');
        const newsletterSubmit = document.getElementById('newsletterSubmit');
        const submitText = document.getElementById('submitText');
        const loading = document.getElementById('loading');
        const emailInput = document.getElementById('emailInput');
        const newsletterModal = document.getElementById('newsletterModal');
        const closeModal = document.getElementById('closeModal');
        const closeModalBtn = document.getElementById('closeModalBtn');
        const whatsappBtn = document.getElementById('whatsappBtn');
        const modalTitle = document.getElementById('modalTitle');
        const modalMessage = document.getElementById('modalMessage');
        const modalIcon = document.getElementById('modalIcon');

        // Array para armazenar os emails localmente
        let leads = JSON.parse(localStorage.getItem('diegomoreira_leads')) || [];

        newsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = emailInput.value.trim();
            
            if (!isValidEmail(email)) {
                showModal('E-mail Inválido', 'Por favor, insira um endereço de e-mail válido.', 'error');
                return;
            }
            
            // Verificar se email já existe
            if (leads.includes(email)) {
                showModal('E-mail Já Cadastrado', 'Este e-mail já está em nossa lista. Obrigado!', 'info');
                newsletterForm.reset();
                return;
            }
            
            // Show loading state
            submitText.style.display = 'none';
            loading.style.display = 'inline-block';
            newsletterSubmit.disabled = true;
            
            try {
                // Simular processamento
                await processLead(email);
                
                // Adicionar ao array local
                leads.push(email);
                localStorage.setItem('diegomoreira_leads', JSON.stringify(leads));
                
                // Mostrar modal de sucesso
                showModal(
                    'Cadastro Realizado!', 
                    `O e-mail <strong>${email}</strong> foi cadastrado com sucesso! Em breve você receberá nossas melhores ofertas.`,
                    'success'
                );
                
                newsletterForm.reset();
                
            } catch (error) {
                showModal('Erro no Cadastro', 'Houve um problema ao cadastrar seu e-mail. Tente novamente.', 'error');
            } finally {
                submitText.style.display = 'inline-block';
                loading.style.display = 'none';
                newsletterSubmit.disabled = false;
            }
        });

        // Função para validar email
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        // Função para processar lead
        function processLead(email) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    // Simula processamento bem-sucedido
                    const success = Math.random() > 0.1; // 90% de sucesso
                    if (success) {
                        resolve();
                    } else {
                        reject(new Error('Falha no processamento'));
                    }
                }, 1500);
            });
        }

        // Função para mostrar modal
        function showModal(title, message, type = 'success') {
            modalTitle.textContent = title;
            modalMessage.innerHTML = message;
            
            // Alterar ícone baseado no tipo
            const iconElement = modalIcon.querySelector('i');
            if (type === 'error') {
                iconElement.className = 'fas fa-exclamation-circle';
                iconElement.style.color = '#e74c3c';
            } else if (type === 'info') {
                iconElement.className = 'fas fa-info-circle';
                iconElement.style.color = '#3498db';
            } else {
                iconElement.className = 'fas fa-check-circle';
                iconElement.style.color = '#d4af37';
            }
            
            newsletterModal.classList.add('active');
        }

        // Fechar modal
        function closeNewsletterModal() {
            newsletterModal.classList.remove('active');
        }

        // Event listeners para fechar modal
        closeModal.addEventListener('click', closeNewsletterModal);
        closeModalBtn.addEventListener('click', closeNewsletterModal);
        
        // Fechar modal clicando fora
        newsletterModal.addEventListener('click', (e) => {
            if (e.target === newsletterModal) {
                closeNewsletterModal();
            }
        });

        // Botão do WhatsApp no modal
        whatsappBtn.addEventListener('click', () => {
            const email = emailInput.value.trim() || 'Não informado';
            const message = `📧 NOVO CADASTRO NO SITE 📧\n\nE-mail: ${email}\nData: ${new Date().toLocaleString('pt-BR')}\n\nCliente quer receber novidades e promoções!`;
            const whatsappUrl = `https://wa.me/5542998618040?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
            closeNewsletterModal();
        });

        // Lazy loading for images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }

        // Mostrar modal automaticamente após alguns segundos (opcional)
        setTimeout(() => {
            const hasSeenModal = localStorage.getItem('diegomoreira_modal_seen');
            if (!hasSeenModal && leads.length === 0) {
                showModal(
                    'Receba Ofertas Exclusivas!',
                    'Cadastre seu e-mail e seja o primeiro a saber sobre novidades e promoções especiais dos produtos Diego Moreira.',
                    'info'
                );
                localStorage.setItem('diegomoreira_modal_seen', 'true');
            }
        }, 10000); // Após 10 segundos
