const SitemapGenerator = require('sitemap-generator');

module.exports = () => {
  // create generator
  const generator = SitemapGenerator('https://www.planagroimoveis.com.br', {
    stripQuerystring: false,
    filepath: './app/public/sitemap.xml',
  });

  generator.on('done', (resul) => {
    console.log('Sitemap atualizado.')
  });

  generator.start();
};