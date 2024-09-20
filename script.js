document.getElementById('transactionForm').onsubmit = async function (e) {
    e.preventDefault();
    
    const formData = {
        date: document.getElementById('date').value,
        amount: document.getElementById('amount').value,
        description: document.getElementById('description').value,
        category: document.getElementById('category').value
    };

    try {
        const response = await fetch(CONFIG.APPS_SCRIPT_WEB_APP_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.text();
        document.getElementById('response').innerText = result;
        document.getElementById('transactionForm').reset();
    } catch (error) {
        console.error('Errore durante l\'invio del form:', error);
        document.getElementById('response').innerText = 'Errore durante l\'invio del form';
    }
};
