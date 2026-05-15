export const getGoogleDriveDirectLink = (url: string): string => {
  if (!url) return url;
  const cleanUrl = url.trim();
  
  // Se for um ID bruto (não é URL, mas tem o formato de ID do Drive)
  // IDs do Drive costumam ter entre 25 e 40 caracteres e são alfanuméricos
  if (!url.includes('/') && url.length > 20) {
    const fileId = url.trim();
    return `https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=https://drive.google.com/uc?id=${fileId}`;
  }

  // Se já for um link direto (lh3), retorna original
  if (cleanUrl.includes('lh3.googleusercontent.com')) return cleanUrl;

  // Se for um link de imagem comum (jpg, png, etc), retorna original
  if (/\.(jpg|jpeg|png|webp|gif|svg)$/i.test(cleanUrl)) return cleanUrl;

  // Se não for do Google Drive clássico, retorna original
  if (!cleanUrl.includes('drive.google.com')) return cleanUrl;

  try {
    let fileId = '';

    // Caso 1: drive.google.com/file/d/FILE_ID/view
    if (cleanUrl.includes('/file/d/')) {
      const parts = cleanUrl.split('/file/d/');
      fileId = parts[1].split('/')[0].split('?')[0].split('#')[0];
    }
    // Caso 2/3: drive.google.com/uc?id=FILE_ID ou open?id=...
    else {
      const urlObj = new URL(cleanUrl);
      fileId = urlObj.searchParams.get('id') || '';
    }

    if (fileId) {
      // Usar o proxy de imagens do Google que resolve 99% dos problemas de visualização em mobile
      return `https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=https://drive.google.com/uc?id=${fileId}`;
    }
  } catch (e) {
    console.error('Erro ao processar URL do Drive:', e);
  }

  return url;
};
