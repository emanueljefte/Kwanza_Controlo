import { TransactionType } from "@/types";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export const exportToPDF = async (
  transactions: TransactionType[],
  stats: any,
) => {
  // Gerar as linhas da tabela dinamicamente
  const tableRows = transactions
    .map(
      (t) => `
    <tr>
      <td>${new Date(t.date!).toLocaleDateString()}</td>
      <td>${t.description}</td>
      <td style="color: ${t.type === "income" ? "#2ecc71" : "#e74c3c"}">
        ${t.type === "income" ? "+" : "-"} ${Number(t.amount).toFixed(2)}
      </td>
      <td>${t.category}</td>
    </tr>
  `,
    )
    .join("");

  // URL do Gráfico (Google Charts para gráfico de pizza simples)
  // Nota: Você pode mapear seus dados reais aqui
  const chartUrl = `https://chart.googleapis.com/chart?cht=p3&chs=500x250&chd=t:60,40&chl=Renda|Despesa&chco=2ecc71|e74c3c`;

  const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: 'Helvetica', sans-serif; padding: 20px; color: #333; }
          .header { text-align: center; margin-bottom: 30px; }
          .chart-container { text-align: center; margin: 20px 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #f97316; color: white; padding: 12px; text-align: left; }
          td { border-bottom: 1px solid #ddd; padding: 12px; font-size: 12px; }
          .summary { display: flex; justify-content: space-around; background: #f8f9fa; padding: 15px; border-radius: 8px; }
          .summary-item { text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Relatório de Finanças</h1>
          <p>Gerado em: ${new Date().toLocaleString()}</p>
        </div>

        <div class="chart-container">
          <img src="${chartUrl}" />
        </div>

        <div class="summary">
           <div class="summary-item">
            <strong>Total Receitas</strong>
            <p style="color: #2ecc71">AOA ${stats.totalIncome.toFixed(2)}</p>
           </div>
           <div class="summary-item">
            <strong>Total Despesas</strong>
            <p style="color: #e74c3c">AOA ${stats.totalExpense.toFixed(2)}</p>
           </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
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
    await Sharing.shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
  }
};
