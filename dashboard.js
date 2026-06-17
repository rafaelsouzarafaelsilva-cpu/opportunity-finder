chrome.storage.local.get(
["history"],
(result)=>{

const history =
result.history || [];

document.getElementById(
"totalLeads"
).innerText = history.length;

let html = "";

history.forEach(item=>{

html += `
<tr>
<td>${item.title || item.name}</td>
<td>${item.score || 0}</td>
<td>${item.phones?.[0] || "-"}</td>
<td>${item.website || "-"}</td>
<td>${item.rating || "-"}</td>
<td>${item.reviews || "-"}</td>
<td>${item.source || "-"}</td>
<td>${item.capturedAt || "-"}</td>
</tr>
`;

});

document.getElementById(
"tableData"
).innerHTML = html;

});

const search =
document.getElementById("search");

search.addEventListener(
"keyup",
()=>{

const filter =
search.value.toLowerCase();

const rows =
document.querySelectorAll(
"#tableData tr"
);

rows.forEach(row=>{

row.style.display =
row.innerText
.toLowerCase()
.includes(filter)
? ""
: "none";

});

});
document.getElementById("exportCsv")
.addEventListener("click", () => {

    chrome.storage.local.get(
        ["history"],
        (result) => {

            const history =
                result.history || [];

            let csv =
                "Empresa,Score,Telefone,Site,Avaliacao,Avaliacoes,Fonte,Data\n";

            history.forEach(item => {

                csv += `"${item.title || ""}",`;
                csv += `"${item.score || ""}",`;
                csv += `"${item.phones?.[0] || ""}",`;
                csv += `"${item.website || ""}",`;
                csv += `"${item.rating || ""}",`;
                csv += `"${item.reviews || ""}",`;
                csv += `"${item.source || ""}",`;
                csv += `"${item.capturedAt || ""}"\n`;

            });

            const blob =
                new Blob([csv], {
                    type: "text/csv"
                });

            const url =
                URL.createObjectURL(blob);

            const a =
                document.createElement("a");

            a.href = url;
            a.download = "leads.csv";
            a.click();

            URL.revokeObjectURL(url);

        }
    );

});