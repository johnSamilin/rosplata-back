const fs = require('fs');
const { langs } = require('./langs');
const { getAllNodesToTranslate } = require('./utils');

const translation = {};
const { nodesToTranslate } = getAllNodesToTranslate();

nodesToTranslate.forEach((node) => {
  const id = node.getAttribute('data-translate-id');
  const prop = node.getAttribute('data-translate-prop') || 'text';
  let defaultValue = '';
  if (prop === 'text') {
    defaultValue = node.textContent;
  } else {
    defaultValue = node.getAttribute(prop);
  }

  translation[id] = {
    value: '',
    prop,
    defaultValue: defaultValue.trim(),
  };
});

langs.forEach((lang) => {
  const path = `./rosplata/translations/${lang}.json`;
  try {
    const existing = fs.readFileSync(path);
    if (existing) {
      const existingTranslation = JSON.parse(existing);
      Object.keys(translation).forEach((id) => {
        if (id in existingTranslation) {
          translation[id] = existingTranslation[id];
        }
      });
    }
  } catch (er) {}
  fs.writeFileSync(path, JSON.stringify(translation, null, 4));
});
