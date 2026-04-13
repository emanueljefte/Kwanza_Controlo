import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export const exportToPDF = async (
  transactions: any[],
  stats: { totalIncome: number; totalExpense: number },
  chartBase64: string, // Recebe a imagem capturada
) => {
  const tableRows = transactions
    .map(
      (t) => `
    <tr>
      <td>${new Date(t.date!).toLocaleDateString("pt-AO")}</td>
      <td>${t.description || "Sem descrição"}</td>
      <td>${t.walletName || "N/A"}</td>
      <td style="color: ${t.type === "income" ? "#2ecc71" : "#e74c3c"}; font-weight: bold;">
        ${t.type === "income" ? "+" : "-"} ${Number(t.amount).toFixed(2)}
      </td>
      <td>${t.category}</td>
    </tr>
  `,
    )
    .join("");

  const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: 'Helvetica', sans-serif; padding: 20px; color: #333; }
          .header { text-align: center; border-bottom: 2px solid #f97316; padding-bottom: 10px; }
          .chart-container { text-align: center; margin: 30px 0; }
          .chart-img { width: 300px; height: auto; }
          table { width: 100%; border-collapse: collapse; }
          th { background-color: #f97316; color: white; padding: 10px; font-size: 12px; }
          td { border-bottom: 1px solid #ddd; padding: 10px; font-size: 10px; }
          .summary { display: flex; justify-content: space-around; background: #f8f9fa; padding: 15px; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Relatório de Atividades</h1>
          <p>Gerado Offline em: ${new Date().toLocaleString("pt-AO")}</p>
        </div>

        <div class="chart-container">
          <img src="${chartBase64}" class="chart-img" />
        </div>

        <div class="summary">
           <div><strong>Receitas:</strong> <span style="color: #2ecc71">AOA ${stats.totalIncome.toFixed(2)}</span></div>
           <div><strong>Despesas:</strong> <span style="color: #e74c3c">AOA ${stats.totalExpense.toFixed(2)}</span></div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Carteira</th>
              <th>Valor</th>
              <th>Categoria</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </body>
    </html>
  `;

  try {
    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    await Sharing.shareAsync(uri);
  } catch (error) {
    console.error("Erro ao gerar PDF offline:", error);
  }
};
