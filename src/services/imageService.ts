const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzJgxWtRGDCsqp-5b66YCjHkE0sH96QT89xXKIHg299PiCyy07oVVcKKRPiKMHgEHWd/exec';

export const uploadImageToDrive = async (base64Image: string, fileName: string, folder: string = 'Geral'): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    // Usamos o fetch de forma que o navegador não considere uma ameaça de segurança (Simple Request)
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        image: base64Image,
        name: fileName,
        folder: folder
      }),
    });

    // O Google Apps Script redireciona a resposta. O fetch com 'cors' lida com isso.
    const result = await response.json();
    
    // Se o script retornar apenas o ID, convertemos para uma URL direta amigável
    if (result.success && result.url && !result.url.startsWith('http')) {
      result.url = `https://lh3.googleusercontent.com/d/${result.url}`;
    }
    
    return result;
  } catch (error) {
    console.error('Error uploading image:', error);
    return { 
      success: false, 
      error: "Ocorreu um erro de conexão com o Google Drive. Verifique se o Script está publicado como 'Qualquer pessoa' no Google Apps Script." 
    };
  }
};
