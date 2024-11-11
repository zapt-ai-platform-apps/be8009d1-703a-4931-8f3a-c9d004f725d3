import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.VITE_PUBLIC_SENTRY_DSN,
  environment: process.env.VITE_PUBLIC_APP_ENV,
  initialScope: {
    tags: {
      type: 'backend',
      projectId: process.env.PROJECT_ID
    }
  }
});

// Placeholder for OCR processing function
export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    // Extract image blob from request
    const { image } = req.body;

    // Process OCR using external API
    const ocrText = await processOCR(image);

    res.status(200).json({ text: ocrText });
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error processing OCR:', error);
    res.status(500).json({ error: 'Error processing OCR' });
  }
}