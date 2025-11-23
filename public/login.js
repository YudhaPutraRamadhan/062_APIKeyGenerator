document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Login gagal');
        }

        localStorage.setItem('adminToken', result.token);

        window.location.href = 'dashboard.html';

    } catch (error) {
        console.error('Error login:', error);
        alert(error.message);
    }
});