document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const passwordInput = document.getElementById('password');
    const capsLockWarning = document.querySelector('.caps-lock-warning');
    
    // Caps Lock kontrolü
    document.addEventListener('keydown', (e) => {
        if (document.activeElement === passwordInput) {
            if (e.getModifierState('CapsLock')) {
                capsLockWarning.classList.add('visible');
            } else {
                capsLockWarning.classList.remove('visible');
            }
        }
    });

    // Şifre alanından çıkıldığında uyarıyı gizle
    passwordInput.addEventListener('blur', () => {
        capsLockWarning.classList.remove('visible');
    });
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = passwordInput.value;
        
        // Basit bir doğrulama (gerçek uygulamada sunucu tarafında yapılmalı)
        if (username && password) {
            window.location.href = 'dashboard.html';
        }
    });

    // Input alanları için animasyon efekti
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });
});
