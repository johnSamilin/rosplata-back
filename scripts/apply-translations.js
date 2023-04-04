const { JSDOM } = require('jsdom');
const fs = require('fs');
const langs = require('./langs');
const { applyTranslation } = require('./utils');

langs.forEach((lang) => {
  const template = fs.readFileSync('./rosplata/_index.html');
  const page = new JSDOM(template);

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
      applyTranslation(node, langs[0], id);
    });
    tpl.innerHTML = template.window.document.querySelector('*').innerHTML;
  });

  fs.writeFileSync(
    `./rosplata/translations/generated/${lang}.html`,
    page.window.document.querySelector('html').innerHTML,
  );
});
