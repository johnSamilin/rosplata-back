const fs = require('fs');
const tokenize = require('css-tokenize');
const through = require('through2');
const { Readable } = require('stream');

let currentRule;
let currentAtRule;
let currentAtDeclaration = [];
let currentRuleDeclaration = [];
const criticalDeclarations = [];
const needleRuleNames = [
  'margin',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  'padding',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'position',
  'top',
  'left',
  'right',
  'bottom',
  'width',
  'height',
  'max-width',
  'max-height',
  'min-width',
  'min-height',
  'display',
  'flex-direction',
  'align-items',
  'justify-content',
  'text-align',
  'font-size',
  'flex-grow',
  'flex-shrink',
];

async function readFiles(path) {
  return new Promise((resolve) => {
    fs.readdirSync(path).forEach(async (file) => {
      const isDir = !file.includes('.');
      if (isDir) {
        await readFiles(`${path}/${file}`);
      } else {
        if (!file.includes('.css')) {
          return;
        }
        const content = fs.readFileSync(`${path}/${file}`);
        console.log(file);
        Readable.from(content)
          .pipe(tokenize())
          .pipe(
            through.obj((token, enc, next) => {
              const t = token[1].toString();
              switch (token[0]) {
                case 'rule_start':
                  currentRule = t;
                  // console.log(currentRule)
                  break;
                case 'atrule_start':
                  currentAtRule = t;
                  break;
                case 'atrule_end':
                  if (currentAtDeclaration.length > 0) {
                    criticalDeclarations.push(currentAtRule);
                    criticalDeclarations.push('\r\n');
                    criticalDeclarations.push(...currentAtDeclaration);
                    criticalDeclarations.push('\r\n}\r\n');
                  }
                  currentAtRule = null;
                  currentAtDeclaration = [];
                  break;
                case 'rule_end':
                  if (currentRuleDeclaration.length > 0) {
                    if (currentAtRule) {
                      currentAtDeclaration.push(currentRule);
                      currentAtDeclaration.push(...currentRuleDeclaration);
                      currentAtDeclaration.push('\r\n}\r\n');
                    } else {
                      criticalDeclarations.push(currentRule);
                      criticalDeclarations.push(...currentRuleDeclaration);
                      criticalDeclarations.push('\r\n}\r\n');
                    }
                  }
                  currentRule = null;
                  currentRuleDeclaration = [];
                  break;
                case 'rule':
                  const rules = t.split(';');
                  rules.forEach((rule) => {
                    const ruleName = rule.split(':')[0].replace('\r\n', '').trim();
                    // console.log({t})
                    if (ruleName && needleRuleNames.includes(ruleName)) {
                      currentRuleDeclaration.push(`${rule};`);
                    }
                  });
                  break;
              }
              next();
            }),
          );
      }
    });
    resolve();
  });
}

readFiles('./rosplata/src').then(() => {
  fs.writeFileSync(
    './rosplata/styles/generated/sizes.css',
    criticalDeclarations.join(''),
  );
});
