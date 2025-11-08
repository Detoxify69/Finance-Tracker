// src/utils/csv.js
export function exportToCSV(transactions, filename = "transactions.csv") {
    if (!transactions || transactions.length === 0) return;
    const keys = ["id", "text", "amount", "type"];
    const rows = transactions.map(tx =>
      keys.map(k => {
        const v = tx[k] ?? "";
        // escape double quotes for CSV safety
        return `"${String(v).replace(/"/g, '""')}"`;
      }).join(",")
    );
    const csv = [keys.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  