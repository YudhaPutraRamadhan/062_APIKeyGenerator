document.addEventListener('DOMContentLoaded', () => {
    
    const generateBtn = document.getElementById('generateBtn');
    const saveBtn = document.getElementById('saveBtn');
    const userForm = document.getElementById('userForm');
    
    const apiKeyInput = document.getElementById('apiKey');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');

    const API_URL = 'http://localhost:5000';

    generateBtn.addEventListener('click', async () => {
        try {
            const response = await fetch(`${API_URL}/api/user/generate-key`);
            if (!response.ok) {
                throw new Error('Gagal mengambil API key');
            }
            const data = await response.json();
            apiKeyInput.value = data.apiKey;
        } catch (error) {
            console.error(error);
            alert('Error: ' + error.message);
        }
    });

    userForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const userData = {
            firstName: firstNameInput.value,
            lastName: lastNameInput.value,
            email: emailInput.value,
            apiKey: apiKeyInput.value
        };

        if (!userData.firstName || !userData.lastName || !userData.email || !userData.apiKey) {
            alert('Harap lengkapi semua data, termasuk generate API key!');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/user/save-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Gagal menyimpan data');
            }

            alert('Sukses! Data user dan API key berhasil disimpan.');
            userForm.reset();

        } catch (error) {
            console.error(error);
            alert('Error: ' + error.message);
        }
    });

});