document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('pr-form');
    const outputDiv = document.getElementById('output');
    const copyButton = document.getElementById('copy-button');
    const linterSuggestionsDiv = document.getElementById('linter-suggestions');

    // --- LINTER RULES ---
    const BUZZWORDS = ['synergy', 'disruptive', 'paradigm shift', 'game-changer', 'bleeding-edge', 'next-generation', 'revolutionary'];
    const HEADLINE_MAX_LENGTH = 100;

    function runLinter(data) {
        const suggestions = [];

        // Rule 1: Check headline length
        if (data.headline.length > HEADLINE_MAX_LENGTH) {
            suggestions.push(`<li><strong>Headline Length:</strong> Your headline is ${data.headline.length} characters long. Try to keep it under ${HEADLINE_MAX_LENGTH} for better impact.</li>`);
        }

        // Rule 2: Check for buzzwords in the announcement
        const foundBuzzwords = [];
        for (const word of BUZZWORDS) {
            if (data.announcement.toLowerCase().includes(word)) {
                foundBuzzwords.push(word);
            }
        }
        if (foundBuzzwords.length > 0) {
            suggestions.push(`<li><strong>Buzzwords Found:</strong> Consider replacing these words with more direct language: <strong>${foundBuzzwords.join(', ')}</strong>.</li>`);
        }
        
        // Rule 3: Check for placeholder text
        if (data.boilerplate.toLowerCase().includes('your standard, reusable paragraph')) {
            suggestions.push(`<li><strong>Boilerplate:</strong> Don't forget to replace the placeholder boilerplate text.</li>`);
        }

        return suggestions;
    }

    function displayLinterSuggestions(suggestions) {
        if (suggestions.length === 0) {
            linterSuggestionsDiv.innerHTML = ''; // Clear previous suggestions
            linterSuggestionsDiv.style.display = 'none';
            return;
        }

        let html = '<h3>Linter Suggestions</h3><ul>';
        html += suggestions.join('');
        html += '</ul>';
        
        linterSuggestionsDiv.innerHTML = html;
        linterSuggestionsDiv.style.display = 'block';
    }


    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = {
            headline: document.getElementById('headline').value,
            city: document.getElementById('city').value,
            companyName: document.getElementById('companyName').value,
            announcement: document.getElementById('announcement').value,
            ceoQuote: document.getElementById('ceoQuote').value,
            ceoName: document.getElementById('ceoName').value,
            boilerplate: document.getElementById('boilerplate').value,
            mediaContact: document.getElementById('mediaContact').value,
            mediaEmail: document.getElementById('mediaEmail').value,
        };
        
        // --- RUN LINTER ---
        const linterResults = runLinter(formData);
        displayLinterSuggestions(linterResults);
        
        const today = new Date();
        const dateString = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

        const pressReleaseText = `
FOR IMMEDIATE RELEASE

## ${formData.headline}

**${formData.city} – ${dateString} –** ${formData.companyName}, today announced ${formData.announcement}.

"${formData.ceoQuote}," said ${formData.ceoName}.

### About ${formData.companyName}
${formData.boilerplate}

### Media Contact
${formData.mediaContact}
${formData.mediaEmail}

###
        `;

        outputDiv.innerText = pressReleaseText;
        copyButton.style.display = 'block';
    });

    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(outputDiv.innerText)
            .then(() => {
                copyButton.innerText = 'Copied!';
                setTimeout(() => {
                    copyButton.innerText = 'Copy to Clipboard';
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
    });
});