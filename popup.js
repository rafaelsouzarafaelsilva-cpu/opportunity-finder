document.getElementById("scan").addEventListener("click", async () => {

    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    chrome.tabs.sendMessage(
        tab.id,
        { action: "extract" },
        (data) => {

            if (!data) {

                document.getElementById("results").innerHTML =
                    "<b>Erro ao capturar dados.</b>";

                return;
            }

            chrome.storage.local.get(
                ["history"],
                (result) => {

                    let history = result.history || [];

                    const exists =
                        history.find(
                            item => item.url === data.url
                        );

                    if (!exists) {

                        history.push(data);

                        chrome.storage.local.set({
                            history: history
                        });

                    }

                }
            );

            let level = "🔴 Baixa";

            if (data.score >= 70) {
                level = "🟢 Alta";
            } else if (data.score >= 40) {
                level = "🟡 Média";
            }

            document.getElementById("results").innerHTML = `

                <b>Score:</b><br>
                ${data.score}/100<br><br>

                <b>Oportunidade:</b><br>
                ${level}<br><br>

                <b>Título:</b><br>
                ${data.title}<br><br>

                <b>URL:</b><br>
                ${data.url}<br><br>

                <b>Site:</b><br>
                ${data.website || "Nenhum"}<br><br>

                <b>E-mails:</b><br>
                ${data.emails.length ? data.emails.join("<br>") : "Nenhum"}<br><br>

                <b>Telefones:</b><br>
                ${data.phones.length ? data.phones.join("<br>") : "Nenhum"}<br><br>

                <b>WhatsApp:</b><br>
                ${data.whatsapp.length ? data.whatsapp.join("<br>") : "Nenhum"}

            `;
        }
    );

});

document.getElementById("dashboard").addEventListener("click", () => {

    chrome.tabs.create({
        url: chrome.runtime.getURL("dashboard.html")
    });

});