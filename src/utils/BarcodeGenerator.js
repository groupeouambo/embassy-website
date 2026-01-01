import JsBarcode from 'jsbarcode';

// Generate a unique tracking number
export const generateTrackingNumber = (applicationType) => {
  const prefix = {
    visa: 'VIS',
    birth: 'BIR',
    marriage: 'MAR',
    travel: 'TRV'
  }[applicationType] || 'APP';

  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();

  return `${prefix}-${timestamp}-${random}`;
};

// Generate barcode image as data URL
export const generateBarcodeImage = (trackingNumber) => {
  try {
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, trackingNumber, {
      format: 'CODE128',
      width: 2,
      height: 60,
      displayValue: true,
      fontSize: 14,
      margin: 10,
      background: '#ffffff',
      lineColor: '#000000'
    });
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Barcode generation failed:', error);
    return null;
  }
};

// Download barcode as image
export const downloadBarcode = (trackingNumber, fileName = 'barcode') => {
  const barcodeImage = generateBarcodeImage(trackingNumber);
  if (!barcodeImage) return;

  const link = document.createElement('a');
  link.href = barcodeImage;
  link.download = `${fileName}-${trackingNumber}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
