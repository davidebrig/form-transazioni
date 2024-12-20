const transactionForm = document.getElementById('transaction-form');
const dateInput = document.getElementById('date');
const descriptionInput = document.getElementById('description');
const suggestionsContainer = document.getElementById('suggestions');
const subcategorySelect = document.getElementById('subcategory');
const successMessage = document.getElementById('success-message');
const errorMessage = document.getElementById('error-message');
const submitButton = document.querySelector('button[type="submit"]');
const clearSuggestionButton = document.querySelector('.autocomplete-clear');
const scriptURL = 'https://script.google.com/macros/s/AKfycbzRHAOluu-ffgBi93wjZyQDXkRzGJbnipPT-JBeVBysuBIczAhSNDBj2rvKC0WqBN4b/exec';
const suggestionsList = ["satispay","sigarette","merenda","benzina","iperal","cookiebot","conto deposito","apericena","aperitivo","asparagi","brioche","caffè","caffè e pizzetta","cibo autogrill","cibo cinema","colazione","frittella","focaccia","gelato","granita","hamburger","kebab","merenda","panini","pasticcini","pasticceria sirmione","piada","piadine","pizza","pizze","pizzetta","pizza asporto","pizza lavoro","polpetteria","pranzo","pranzo lavoro","pranzo castione","ristorante s agata","sushi","the limone","tiramisù giginio","toast","accessori albero","aceto bicarbonato","brita","filtri brita","cilindro graduato","coperchi silicone","coprimarer","cose casa amazon","fermaporta magnetico","filtro cucina amazon","lavatrice","materasso","materasso cose","pennarelli","portaposate","prese","spazzola piatti","striscia led","tubo","vogels tv + oneblade","calliope","crema corpo","decathlon","estetista","jeans","l'oreal x elena","l'oreal x me","maglione","mutande","oneblade papa","pantaloni tuta","panta","parrucchiere","pedicure","profumo","sciarpa inter","scarpe ua forge 96","abbonamento microsoft","amazon accessori","amazon adattatori","amazon cable","amazon epilatore","amazon joystick","anello","antistress","braccio monitor","cavo dp usbc","cavo lan","chatgpt","coil svapo amazon","cookiebot","dominio sg davide","grip dualsense amazon","icloud","imac molteni","mousepad gio","mouse iulian","netflix","now tv","paramount","ps essential","ps plus","ps plus rimborso","repcount app","soundbar sonos","spotify","termometro amazon","vesa tv 400x200","webcam logitech","assicurazione auto","benzina","benza","benzina gio","bollo auto","bollo titoli","carta credito","kart","lavaggio auto","lavaggio toyota","parcheggio","parcheggio aeroporto","parchegg","rata auto","ricarica tim","telepass","trenord","coni orecchio","farmaci","fatmaco gio","integratori","maalox","oki","psicologa","rinnovo patente","visita patente","vitamina d","biliardo","cinema","cristo velato sansevero","discovery","django gioco","film","film noleggio","film donnie darko","giochi scatola","lamborghini test drive","museo cinema","noleggio film","oppenheimer bd","accessori fuji","anagrafe","biglietti treno","bilancia cover","cilindro graduato","electraline","felpa","fiori","gatto","grata","gratta e perdi","gratta vinci","hype","impermeabili","molla","natale","pata","pile","regalo chiara compleanno","regalo iulian","regalo loreto","regalo papa","regalo s valentino","regali natale","regali vacanze","souvenir","spiderman","siringhe svapo","velcro adesivo","agenzia","affitto","affitto cauzione","affitto gio luglio","affitto agosto","affitto ottobre","affitto dicembre","affitto rimborso","conto deposito","cont dep","enel luce","enel luce mag-giu","nen luce luglio","nen luce agosto","nen luce ottobre","nen luce novembre","nen luce dicembre","nen gas ottobre","nen gas novembre","nen gas dicembre","nen gas settembre","gas enel","gas enel lug-ago","tim casa","tim casa giugno","tim casa luglio","tim casa agosto","tim casa settembre","tim casa novembre","tim casa dicembre","tari casa","abbruzzese","aliexpress intimo","bnb napoli booking","booking napoli","booking vacanze","bottega verde","china","cinesi","coin","esselunga","garden","ikea","iperal","italmark","jd","leroy","mc","mc drive","mc merenda","mr dick","pepco","sisal","tiger","tigota","unes","wipstore 1","acconto 1 paolo dieta 360 ai","assegno","btc bitcoin vendita","caos","caparra","cod","cod 6","colazine","diplomatico","discovery","drinks","eremo","giovanni","giovanni mese + landing","giovanni mese giugno + luglio","hype","mamma","mamma bonifico","soldi mamma in conto deposito","mornati","nonni regalo","pagamento","pareo gio","posallo trattoria","prelievi","prolunga","rimborso gio","rimborso deliveroo","rimborso casa gio","rimborso l'oreal","risparmio","risparmio conto deposito","sig e perdi","sigarette","sigarette emotion","sizze","sizze e gr","spesina","stipendio","stipendio novembre","stipendio settembre","svapo","svapo pod","svapoebasta liquid","volo budapest","volo napoli","zio pizza","13esima","pizzette","biglietti treno","pita"];


dateInput.value = new Date().toISOString().split('T')[0];

async function fetchSubcategories() {
    try {
        const response = await fetch(`${scriptURL}?action=getSubcategories`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        data.subcategories.forEach(subcategory => {
            const option = document.createElement('option');
            option.value = subcategory;
            option.textContent = subcategory;
            subcategorySelect.appendChild(option);
        });
    } catch (error) {
        errorMessage.textContent = `Errore nel recupero sottocategorie: ${error.message}`;
        errorMessage.style.display = 'block';
        console.error("Failed to fetch subcategories:", error);
    }
}

function showSuggestions(value) {
    suggestionsContainer.innerHTML = '';
    if (!value) {
        suggestionsContainer.style.display = 'none';
        return;
    }

    const filteredSuggestions = suggestionsList.filter(suggestion =>
        suggestion.toLowerCase().startsWith(value.toLowerCase())
    ).slice(0, 5);


    filteredSuggestions.forEach(suggestion => {
        const suggestionElement = document.createElement('div');
        suggestionElement.textContent = suggestion;
        suggestionElement.className = 'autocomplete-suggestion';
        suggestionElement.onclick = () => {
            descriptionInput.value = suggestion;
            suggestionsContainer.innerHTML = '';
            suggestionsContainer.style.display = 'none';
        };
        suggestionsContainer.appendChild(suggestionElement);
    });
    suggestionsContainer.style.display = filteredSuggestions.length ? 'block' : 'none';
}

function handleFormSubmit(event) {
    event.preventDefault();
    submitButton.disabled = true;
    submitButton.textContent = 'Caricamento...';

    const formData = new FormData(transactionForm);
    const data = Object.fromEntries(formData);

    fetch(scriptURL, {
        method: 'POST',
        body: new URLSearchParams(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            successMessage.style.display = 'block';
            errorMessage.style.display = 'none';
            transactionForm.reset();
            setTimeout(() => {
              successMessage.style.display = 'none';
            }, 3000);
        } else {
            errorMessage.textContent = result.message;
            errorMessage.style.display = 'block';
        }
    })
    .catch(error => {
        errorMessage.textContent = `Si è verificato un errore durante l'invio: ${error.message}`;
        errorMessage.style.display = 'block';
        console.error("Form submission failed:", error);
    })
    .finally(() => {
        submitButton.disabled = false;
        submitButton.textContent = 'Registra transazione';
    });
}

function handleClickOutside(event) {
    if (!descriptionInput.contains(event.target) && !suggestionsContainer.contains(event.target) && event.target !== clearSuggestionButton) {
        suggestionsContainer.innerHTML = '';
        suggestionsContainer.style.display = 'none';
    }
}

function clearSuggestions(){
    suggestionsContainer.innerHTML = '';
    suggestionsContainer.style.display = 'none';
}

window.onload = fetchSubcategories;
descriptionInput.addEventListener('input', () => showSuggestions(descriptionInput.value));
transactionForm.addEventListener('submit', handleFormSubmit);
document.addEventListener('click', handleClickOutside);
clearSuggestionButton.addEventListener('click', clearSuggestions);
