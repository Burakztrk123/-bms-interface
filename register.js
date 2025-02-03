document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Şifre kontrolü
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        // Form verilerini konsola yazdır (test için)
        console.log('Register attempt:', {
            firstName,
            lastName,
            email,
            password
        });
        
        // Başarılı kayıt sonrası login sayfasına yönlendir
        // window.location.href = 'index.html';
    });

    // Input alanları için animasyon efekti
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
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
