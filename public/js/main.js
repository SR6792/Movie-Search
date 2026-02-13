// Mobile menu toggle
const mobileToggle = document.getElementById('mobileToggle');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        mobileToggle.classList.toggle('active');
    });
}

// Password visibility toggle
document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        const input = document.getElementById(target);
        if (input) {
            if (input.type === 'password') {
                input.type = 'text';
                btn.style.color = 'var(--accent-2)';
            } else {
                input.type = 'password';
                btn.style.color = '';
            }
        }
    });
});

// Search input auto-focus animation
const searchInput = document.querySelector('.search-input');
if (searchInput) {
    searchInput.addEventListener('focus', () => {
        searchInput.closest('.search-box')?.classList.add('focused');
    });
    searchInput.addEventListener('blur', () => {
        searchInput.closest('.search-box')?.classList.remove('focused');
    });
}
