document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('pr-form');
    const outputDiv = document.getElementById('output');
    const copyButton = document.getElementById('copy-button');
    const linterSuggestionsDiv = document.getElementById('linter-suggestions');

    const BUZZWORDS = [
        'synergy', 'disruptive', 'paradigm shift', 'game-changer',
        'bleeding-edge', 'next-generation', 'revolutionary', 'impactful',
        'cutting-edge', 'world-class', 'innovative', 'groundbreaking'
    ];

    const FORBIDDEN_ADJECTIVES = [
        'very', 'extremely', 'amazingly', 'unbelievably', 'huge', 'big', 'incredible'
    ];

    const HEADLINE_MAX_LENGTH = 70;
    const SENTENCE_MAX_LENGTH = 25; // Words

    function runLinter() {
        const data = {
            headline: document.getElementById('headline').value,
            announcement: document.getElementById('announcement').value,
            boilerplate: document.getElementById('boilerplate').value,
        };

        const suggestions = [];

        // Rule 1: Headline Precision
        if (data.headline.trim().length > HEADLINE_MAX_LENGTH) {
            suggestions.push(`<li><strong>Headline Precision:</strong> Your headline is a bit long (${data.headline.length} chars). Aim for under ${HEADLINE_MAX_LENGTH} for maximum newsroom impact.</li>`);
        }
        if (data.headline && !/^[A-Z]/.test(data.headline)) {
            suggestions.push(`<li><strong>Formatting:</strong> Always capitalize the first word of your headline.</li>`);
        }

        // Rule 2: Buzzword Detection
        const foundBuzzwords = BUZZWORDS.filter(word => data.announcement.toLowerCase().includes(word));
        if (foundBuzzwords.length > 0) {
            suggestions.push(`<li><strong>Journalistic Tone:</strong> Reporters hate fluff. Consider cutting these buzzwords: <strong>${foundBuzzwords.join(', ')}</strong>.</li>`);
        }

        // Rule 3: Adjective Density
        const foundAdjectives = FORBIDDEN_ADJECTIVES.filter(word => data.announcement.toLowerCase().includes(word));
        if (foundAdjectives.length > 0) {
            suggestions.push(`<li><strong>Clarity:</strong> Minimize use of intensifiers like <strong>${foundAdjectives.join(', ')}</strong>. Let the facts speak for themselves.</li>`);
        }

        // Rule 4: Sentence Length
        const sentences = data.announcement.split(/[.!?]/);
        const longSentences = sentences.filter(s => s.trim().split(/\s+/).length > SENTENCE_MAX_LENGTH);
        if (longSentences.length > 0) {
            suggestions.push(`<li><strong>Readability:</strong> One of your sentences is over ${SENTENCE_MAX_LENGTH} words. Break it down for better flow.</li>`);
        }

        // Rule 5: Placeholder Check
        if (data.boilerplate.toLowerCase().includes('your standard, reusable')) {
            suggestions.push(`<li><strong>Identification:</strong> Update your boilerplate to reflect Mwithiga Labs.</li>`);
        }

        displayLinterSuggestions(suggestions);
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


    // Live Linting
    form.addEventListener('input', runLinter);

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

        const today = new Date();
        const dateString = today.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        }).toUpperCase();

        const pressReleaseText = `
FOR IMMEDIATE RELEASE

${formData.headline.toUpperCase()}

${formData.city.toUpperCase()} — ${dateString} — ${formData.companyName} today announced ${formData.announcement}.

"${formData.ceoQuote}," said ${formData.ceoName}.

###

ABOUT ${formData.companyName.toUpperCase()}
${formData.boilerplate}

MEDIA CONTACT
${formData.mediaContact}
${formData.mediaEmail}

# # #
        `;

        outputDiv.innerText = pressReleaseText.trim();
        copyButton.style.display = 'block';
        outputDiv.scrollIntoView({ behavior: 'smooth' });
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