document.addEventListener('DOMContentLoaded', function() {
    // [ 1. INITIALISATION AOS ]
    if (typeof AOS !== 'undefined') {
        AOS.init();
    }

    // [ 2. GESTION DES MENUS (MEGA MENU) ]
    const allDesktopMenus = document.querySelectorAll('.navbar-center .menu-horizontal > li > details');
    
    allDesktopMenus.forEach(menu => {
        menu.addEventListener('toggle', function() {
            if (this.open) {
                allDesktopMenus.forEach(otherMenu => {
                    if (otherMenu !== this && otherMenu.open) {
                        otherMenu.open = false;
                    }
                });
            }
        });
    });

    document.addEventListener('click', function(event) {
        const isClickInsideMenu = event.target.closest('.navbar-center .menu-horizontal > li > details');
        if (!isClickInsideMenu) {
            allDesktopMenus.forEach(menu => {
                if (menu.open) menu.open = false;
            });
        }
    });

    // [ 3. GESTION DE LA MODAL DE MESSAGERIE (PORTAIL) ]
    const modal = document.getElementById('msgModal');
    const closeModal = document.getElementById('closeModal');
    const mainTitle = document.getElementById('modalMainTitle');
    const msgForm = document.getElementById('msgForm');
    const platformCards = document.querySelectorAll('.rdc-card');

    if (modal && platformCards.length > 0) {
        platformCards.forEach(card => {
            card.addEventListener('click', function(e) {
                e.preventDefault();
                const platformName = this.dataset.platform || this.querySelector('.rdc-card-title').innerText.trim();
                
                if (mainTitle) {
                    mainTitle.innerText = platformName.toUpperCase();
                }
                
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // [ 4. SAUVEGARDE DES MESSAGES (LOCAL STORAGE) ]
    if (msgForm) {
        msgForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const platform = mainTitle ? mainTitle.innerText : 'Inconnu';
            
            const newMessage = {
                id: Date.now(),
                platform: platform,
                name: formData.get('name'),
                email: formData.get('email'),
                comment: formData.get('comment'),
                date: new Date().toLocaleString('fr-FR')
            };

            // Récupérer les messages existants
            let messages = JSON.parse(localStorage.getItem('minesursi_messages') || '[]');
            messages.push(newMessage);
            localStorage.setItem('minesursi_messages', JSON.stringify(messages));

            alert('Merci ! Votre message pour ' + platform + ' a été envoyé.');
            
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
            msgForm.reset();
        });
    }

    // [ 5. LOGIQUE SPÉCIFIQUE À LA PAGE ADMIN ]
    // Cette partie ne s'exécute que si on est sur admin.html (identifié par un élément spécifique)
    const isAdminPage = document.body.dataset.page === 'admin';
    if (isAdminPage) {
        const adminModal = document.getElementById('adminModal');
        const adminClose = document.getElementById('adminClose');
        const adminTitle = document.getElementById('adminTitle');
        const commentContainer = document.getElementById('commentContainer');

        platformCards.forEach(card => {
            card.addEventListener('click', function(e) {
                e.preventDefault();
                const platformName = (this.dataset.platform || this.querySelector('.rdc-card-title').innerText.trim()).toUpperCase();
                
                adminTitle.innerText = "MESSAGES : " + platformName;
                
                // Charger les messages depuis localStorage
                const allMessages = JSON.parse(localStorage.getItem('minesursi_messages') || '[]');
                const filteredMessages = allMessages.filter(m => m.platform === platformName);

                // Afficher les messages
                if (filteredMessages.length > 0) {
                    commentContainer.innerHTML = filteredMessages.map(m => `
                        <div class="comment-item">
                            <div class="flex justify-between items-start mb-2">
                                <div>
                                    <h4 class="font-bold text-slate-800">${m.name}</h4>
                                    <p class="text-xs text-blue-600">${m.email}</p>
                                </div>
                                <span class="text-[10px] text-slate-400 bg-slate-100 px-2 py-1 rounded">${m.date}</span>
                            </div>
                            <p class="text-sm text-slate-600 italic">"${m.comment}"</p>
                        </div>
                    `).join('');
                } else {
                    commentContainer.innerHTML = '<div class="p-8 text-center text-slate-400">Aucun message pour cette plateforme.</div>';
                }

                adminModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        if (adminClose) {
            adminClose.addEventListener('click', () => {
                adminModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }
    }
});
