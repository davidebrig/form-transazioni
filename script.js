document.getElementById('transactionForm').onsubmit = function(e) {
  e.preventDefault();
  
  var data = {
    date: document.getElementById('date').value,
    amount: document.getElementById('amount').value,
    description: document.getElementById('description').value,
    category: document.getElementById('category').value
  };

  fetch('https://script.google.com/macros/s/AKfycbypP331jlXBlkOrT1o1I0iS9pWtqzIFlCu5ZRMTmUceuIQLrRTqpHqIeXFZgmCRcUuS/exec', {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(response => {
    document.getElementById('response').innerText = 'Transazione registrata con successo!';
  }).catch(error => {
    document.getElementById('response').innerText = 'Errore durante la registrazione della transazione';
    console.error('Error:', error);
  });
};
