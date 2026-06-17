function calculateScore(title, emails, phones, website) {

    let score = 0;

    if (emails.length > 0) score += 20;
    if (phones.length > 0) score += 30;
    if (website) score += 20;

    const keywords = [
        "oficina",
        "mecânica",
        "dentista",
        "advogado",
        "restaurante",
        "clínica",
        "frete",
        "transportadora",
        "empresa"
    ];

    keywords.forEach(word => {

        if (
            title.toLowerCase().includes(
                word.toLowerCase()
            )
        ) {
            score += 5;
        }

    });

    return Math.min(score, 100);

}

function extractData() {

    const pageText = document.body.innerText;

    const emails =
        pageText.match(
            /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi
        ) || [];

    const phones =
        pageText.match(
            /\(?\d{2}\)?\s?\d{4,5}-?\d{4}/g
        ) || [];

    const whatsappLinks = [];

    document.querySelectorAll("a").forEach(link => {

        const href = link.href || "";

        if (
            href.includes("wa.me") ||
            href.includes("whatsapp")
        ) {
            whatsappLinks.push(href);
        }

    });

    let website = "";

    document.querySelectorAll("a").forEach(link => {

        const href = link.href || "";

        if (
            href.startsWith("http") &&
            !href.includes("google.com") &&
            !href.includes("maps")
        ) {

            if (!website) {
                website = href;
            }

        }

    });

    let rating = "";
    let reviews = "";

    const ratingMatch =
        pageText.match(/\b([0-5],[0-9])\b/);

    if (ratingMatch) {
        rating = ratingMatch[1];
    }

    const reviewsMatch =
        pageText.match(/\((\d+)\)/);

    if (reviewsMatch) {
        reviews = reviewsMatch[1];
    }

    return {
        name: document.title,
        title: document.title,
        url: location.href,
        emails: [...new Set(emails)],
        phones: [...new Set(phones)],
        whatsapp: [...new Set(whatsappLinks)],
        website: website,
        rating: rating,
        reviews: reviews,
        source: window.location.hostname,
        capturedAt: new Date().toLocaleString(),
        score: calculateScore(
            document.title,
            emails,
            phones,
            website
        )
    };

}

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {

        if (request.action === "extract") {

            sendResponse(
                extractData()
            );

        }

    }
);