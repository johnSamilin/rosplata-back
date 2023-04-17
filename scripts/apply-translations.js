const { JSDOM } = require('jsdom');
const fs = require('fs');
const { langs, rtlLangs } = require('./langs');
const { applyTranslation } = require('./utils');

const template = fs.readFileSync('./rosplata/_index.html');
langs.forEach((lang) => {
  const page = new JSDOM(template);
  if (rtlLangs.includes(lang)) {
    page.window.document.querySelector('html').setAttribute('dir', 'rtl');
  }
  page.window.document.querySelector('html').setAttribute('lang', lang);

  const topNodesToTranslate = page.window.document.querySelectorAll(
    '[data-translate-id]',
  );
  topNodesToTranslate.forEach((node) => {
    const id = node.getAttribute('data-translate-id');
    applyTranslation(node, lang, id);
  });

  const templates = page.window.document.querySelectorAll('template');
  templates.forEach((tpl) => {
    const template = new JSDOM(tpl.innerHTML);
    const templateNodesToTranslate = template.window.document.querySelectorAll(
      '[data-translate-id]',
    );
    templateNodesToTranslate.forEach((node) => {
      const id = node.getAttribute('data-translate-id');
      applyTranslation(node, lang, id);
    });
    tpl.innerHTML = template.window.document.querySelector('*').innerHTML;
  });

  fs.writeFileSync(
    `./rosplata/translations/generated/${lang}.html`,
    page.window.document.querySelector('html').outerHTML,
  );
});
