document.addEventListener('DOMContentLoaded', () => {
    
    const token = localStorage.getItem('adminToken');
    const tableBody = document.getElementById('data-table-body');
    const logoutBtn = document.getElementById('logoutBtn');

    if (!token) {
        alert('Anda harus login terlebih dahulu!');
        window.location.href = 'login.html';
        return;
    }

    async function fetchDashboardData() {
        try {
            const response = await fetch('/api/admin/dashboard', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                localStorage.removeItem('adminToken');
                alert('Sesi Anda telah habis, silakan login kembali.');
                window.location.href = 'login.html';
                return;
            }

            const data = await response.json();
            renderTable(data);
        } catch (error) {
            console.error('Error fetching data:', error);
            tableBody.innerHTML = '<tr><td colspan="7">Gagal memuat data.</td></tr>';
        }
    }

    function renderTable(users) {
        tableBody.innerHTML = '';

        if (users.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7">Belum ada data user.</td></tr>';
            return;
        }

        users.forEach(user => {
            if (user.apiKeys.length === 0) {
                tableBody.innerHTML += `
                    <tr>
                        <td>${user.userId}</td>
                        <td>${user.firstName} ${user.lastName}</td>
                        <td>${user.email}</td>
                        <td colspan="4">(Belum ada API key)</td>
                    </tr>
                `;
            } else {
                user.apiKeys.forEach(key => {
                    const statusClass = key.status === 'Valid' ? 'status-valid' : 'status-invalid';
                    tableBody.innerHTML += `
                        <tr>
                            <td>${user.userId}</td>
                            <td>${user.firstName} ${user.lastName}</td>
                            <td>${user.email}</td>
                            <td>${key.apiKey}</td>
                            <td>${new Date(key.createdAt).toLocaleString('id-ID')}</td>
                            <td class="${statusClass}">${key.status}</td>
                            <td>
                                <button class="editBtn" data-id="${key.id}">Edit</button>
                            </td>
                        </tr>
                    `;
                });
            }
        });
    }

    async function updateApiKey(keyId) {
        const newApiKey = prompt("Masukkan API key baru:");
        if (!newApiKey || newApiKey.trim() === '') {
            return;
        }

        try {
            const response = await fetch(`/api/admin/keys/${keyId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ newApiKey: newApiKey })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Gagal mengupdate key');
            }

            alert('API key berhasil diupdate!');
            fetchDashboardData();

        } catch (error) {
            console.error('Error updating key:', error);
            alert(error.message);
        }
    }

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('adminToken');
        alert('Anda telah logout.');
        window.location.href = 'login.html';
    });

    tableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('editBtn')) {
            const keyId = e.target.dataset.id;
            updateApiKey(keyId);
        }
    });


    fetchDashboardData();
});