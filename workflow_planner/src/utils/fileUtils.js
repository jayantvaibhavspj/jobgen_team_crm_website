export const MAX_FILE_SIZE_BYTES = 2.5 * 1024 * 1024; // 2.5 MB

export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const readFileAsDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      reject(new Error(`File "${file.name}" is too large (max 2.5MB). Please select a smaller file.`));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        dataUrl: reader.result,
        uploadedAt: Date.now()
      });
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
};

export const downloadAttachment = (attachment) => {
  if (!attachment || !attachment.dataUrl) return;
  const a = document.createElement('a');
  a.href = attachment.dataUrl;
  a.download = attachment.name || 'download';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

