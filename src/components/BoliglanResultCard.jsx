import html2pdf from 'html2pdf.js';

export default function BoliglanResultCard({ data }) {
  const handleDownload = () => {
    const element = document.getElementById('boliglan-summary');
    html2pdf().from(element).save('boliglan-beregning.pdf');
  };

  const redirectToBank = () => {
    const url = `https://www.nordea.no/privat/lan/boliglan/`;
    window.open(url, '_blank');
  };

  return (
    <div className="mt-8 w-full max-w-2xl bg-white text-black p-6 rounded-xl shadow space-y-6 text-center">
      <h2 className="text-2xl font-semibold">Beregning: Boliglån</h2>

      <div id="boliglan-summary" className="space-y-2">
        <p>📌 Lån: <strong>{data.loan.toLocaleString()} kr</strong></p>
        <p>📈 Rente: <strong>{data.rate}%</strong></p>
        <p>🕒 Løpetid: <strong>{data.years} år</strong></p>
        <p>💳 Terminbeløp: <strong>{data.installment.toLocaleString()} kr</strong></p>
        <p>💸 Totalt tilbakebetalt: <strong>{data.total.toLocaleString()} kr</strong></p>
        <p>📉 Renter totalt: <strong>{data.interest.toLocaleString()} kr</strong></p>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
        <button
          onClick={handleDownload}
          className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition"
        >
          📄 Last ned PDF
        </button>

        <button
          onClick={redirectToBank}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          🏦 Les mer om boliglån
        </button>
      </div>
    </div>
  );
}
