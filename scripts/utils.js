const { JSDOM } = require('jsdom');
const fs = require('fs');

const translations = {};

module.exports = {
  getAllNodesToTranslate: function getAllNodesToTranslate() {
    const template = fs.readFileSync('./rosplata/_index.html');
    const page = new JSDOM(template);
    const nodesToTranslate = [];

    const topNodesToTranslate = page.window.document.querySelectorAll(
      '[data-translate-id]',
    );
    topNodesToTranslate.forEach((node) => {
      nodesToTranslate.push(node);
    });

    const templates = page.window.document.querySelectorAll('template');
    templates.forEach((tpl) => {
      const template = new JSDOM(tpl.innerHTML);
      const templateNodesToTranslate =
        template.window.document.querySelectorAll('[data-translate-id]');
      templateNodesToTranslate.forEach((node) => {
        nodesToTranslate.push(node);
      });
    });

    return {
      nodesToTranslate,
      page,
    };
  },
  applyTranslation: function applyTranslation(node, lang, messageId) {
    try {
      if (!(lang in translations)) {
        translations[lang] = JSON.parse(
          fs.readFileSync(`./rosplata/translations/${lang}.json`),
        );
        console.log(lang);
      }
      switch (translations[lang][messageId].prop) {
        case 'text':
          node.textContent = translations[lang][messageId].value;
          break;
        case 'content':
          node.setAttribute('content', translations[lang][messageId].value);
          break;
        case 'placeholder':
          node.setAttribute('placeholder', translations[lang][messageId].value);
          break;
        default:
          throw new Error(
            'Unknown translation prop',
            translations[lang][messageId].prop,
          );
      }

      return translations[lang][messageId].value;
    } catch (er) {
      console.error('Error with translation', lang, messageId, er);
    }
  },
};
