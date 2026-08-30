/** @type {import('next').NextConfig} */
const nextConfig = {
  // @react-pdf/renderer (via pdfkit) charge ses polices standard dynamiquement au
  // runtime ; sans cette inclusion explicite, Vercel ne les embarque pas dans le
  // déploiement serverless et la génération PDF échoue avec MODULE_NOT_FOUND.
  outputFileTracingIncludes: {
    '/api/pdf/[id]': ['./node_modules/pdfkit/js/**/*'],
  },
};

module.exports = nextConfig;
