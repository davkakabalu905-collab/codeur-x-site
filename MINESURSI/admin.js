// Initialize admin page
document.addEventListener('DOMContentLoaded', function () {
    initializeAdminCards();
    updateStats();
});

// ========== ADMIN CARD INITIALIZATION ==========
function initializeAdminCards() {
    const adminCards = document.querySelectorAll('.admin-card');

    adminCards.forEach(card => {
        card.addEventListener('click', function (e) {
            e.preventDefault();
            const platformName = this.getAttribute('data-platform');
            showCommentsModal(platformName);
        });
    });
}

// ========== SHOW COMMENTS MODAL ==========
function showCommentsModal(platformName) {
    const modal = document.getElementById('commentsModal');
    const modalTitle = document.getElementById('commentsModalTitle');
    const commentsCount = document.getElementById('commentsCount');
    const commentsContainer = document.getElementById('commentsContainer');

    // Get comments for this platform
    const comments = getCommentsByPlatform(platformName);

    // Update modal title
    modalTitle.innerText = platformName.toUpperCase();
    commentsCount.innerText = comments.length + ' commentaire(s)';

    // Display comments
    if (comments.length === 0) {
        commentsContainer.innerHTML = '<div class="no-comments">Aucun commentaire pour cette plateforme</div>';
    } else {
        commentsContainer.innerHTML = comments.map((comment, index) => `
            <div class="comment-item">
                <div class="comment-name">
                    <i class="fa-solid fa-user-circle mr-2" style="color: #007FFF;"></i>${comment.name}
                </div>
                <div class="comment-email">
                    <i class="fa-solid fa-envelope mr-1"></i>${comment.email}
                </div>
                <div class="comment-text">${comment.comment}</div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div class="comment-date">
                        <i class="fa-solid fa-clock mr-1"></i>${comment.date}
                    </div>
                    <button onclick="deleteCommentIndex(${index})" class="btn btn-xs btn-error" title="Supprimer">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ========== DELETE COMMENT ==========
function deleteCommentIndex(index) {
    let comments = JSON.parse(localStorage.getItem('comments')) || [];
    if (confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
        comments.splice(index, 1);
        localStorage.setItem('comments', JSON.stringify(comments));
        
        // Refresh the modal
        const platformName = document.getElementById('commentsModalTitle').innerText.replace(/COMMENTAIRES:?\s*/i, '').trim();
        showCommentsModal(platformName);
        updateStats();
    }
}

// ========== CLOSE MODAL ==========
document.addEventListener('DOMContentLoaded', function () {
    const commentsModal = document.getElementById('commentsModal');
    const closeBtn = document.getElementById('closeCommentsModal');

    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            commentsModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }

    if (commentsModal) {
        commentsModal.addEventListener('click', function (e) {
            if (e.target === this) {
                commentsModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
});

// ========== UPDATE STATISTICS ==========
function updateStats() {
    const allComments = getAllComments();
    document.getElementById('totalComments').innerText = allComments.length;

    // Get unique platforms with comments
    const platformsSet = new Set(allComments.map(c => c.platform));
    document.getElementById('totalPlatforms').innerText = platformsSet.size;

    // Update comment counts for each card
    const adminCards = document.querySelectorAll('.admin-card');
    adminCards.forEach(card => {
        const platformName = card.getAttribute('data-platform');
        const platformComments = getCommentsByPlatform(platformName);
        const countSpan = card.querySelector('.comment-count');
        if (countSpan) {
            countSpan.innerText = platformComments.length;
        }
    });
}

// ========== CLEAR ALL COMMENTS ==========
function clearAllComments() {
    if (confirm('Êtes-vous sûr de vouloir supprimer TOUS les commentaires ? Cette action est irréversible.')) {
        localStorage.removeItem('comments');
        updateStats();
        alert('Tous les commentaires ont été supprimés');
    }
}

// ========== LOCALSTORAGE FUNCTIONS ==========
function getCommentsByPlatform(platformName) {
    let comments = JSON.parse(localStorage.getItem('comments')) || [];
    return comments.filter(c => c.platform === platformName);
}

function getAllComments() {
    return JSON.parse(localStorage.getItem('comments')) || [];
}

// Refresh stats when page is shown (in case comments were added on main page)
window.addEventListener('focus', function () {
    updateStats();
});
