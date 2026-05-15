/**
 * Utilitário para Exportação e Importação de Dados
 * Suporta JSON (Backup Completo) e CSV (Edição em Massa)
 */

export const exportToJSON = (data: any, fileName: string) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToCSV = (data: any[], fileName: string) => {
  if (!data || data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => {
        const val = row[header] ?? '';
        // Escape quotes and handle commas
        const stringVal = val.toString().replace(/"/g, '""');
        return `"${stringVal}"`;
      }).join(',')
    )
  ];

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const parseCSV = (csvText: string): any[] => {
  const lines = csvText.split('\n').filter(line => line.trim() !== '');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim());
  
  return lines.slice(1).map(line => {
    // Regex for handling quoted commas
    const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
    const obj: any = {};
    headers.forEach((header, i) => {
      let val = values[i] || '';
      val = val.replace(/^"|"$/g, '').replace(/""/g, '"').trim();
      obj[header] = val;
    });
    return obj;
  });
};
