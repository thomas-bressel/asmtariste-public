// import { writeFileSync } from 'fs';

// const routes = [
//   { url: '/', priority: 1.0, changefreq: 'daily' },
//   { url: '/about', priority: 0.8, changefreq: 'monthly' },
//   { url: '/contact', priority: 0.8, changefreq: 'monthly' },
//   { url: '/blog', priority: 0.9, changefreq: 'weekly' },
//   { url: '/mentions-legales', priority: 0.3, changefreq: 'yearly' },
//   { url: '/politique-confidentialite', priority: 0.3, changefreq: 'yearly' }
// ];

// const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
// <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
// ${routes.map(route => `
//   <url>
//     <loc>https://asmtariste.fr${route.url}</loc>
//     <changefreq>${route.changefreq}</changefreq>
//     <priority>${route.priority}</priority>
//     <lastmod>${new Date().toISOString()}</lastmod>
//   </url>
// `).join('')}
// </urlset>`;

// writeFileSync('dist/public/sitemap.xml', sitemap);
// console.log('✅ Sitemap généré !');