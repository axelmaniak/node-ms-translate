import axios from "axios";
import minimist from "minimist";
import config from "./config.js";
import sys from 'sys';
import child from 'child_process';

const translate = async (text, locales, key, afterKey, rootPath) => {
  const defaultLocales = ['en', 'es', 'fr', 'hi', 'it', 'ko', 'pt', 'ru', 'tr', 'vi', 'zh-Hans'];
  const localeArray = locales ? locales.split(",") : defaultLocales;
  let translations = localeArray.reduce((acc, curr) => Object.assign(acc, { [curr]: '' }), {});

  if (!locales) {
    console.warn(
      "No locales defined, using default: " + defaultLocales.join(' ,')
    );
  }

  localeArray.forEach(async (locale) => {
    let translation, q = "'";
    const standardLocale = locale === 'zh-Hans' ? 'zh' : locale;
    if (locale === 'en') {
      translation = text;
    } else { 
      const response = await getTranslation(text, locale); 
      translation = response?.data?.[0]?.translations?.[0]?.text;
    }
    if (translation.includes("'")) {
      q = '"'
    }
    if (key) {
      translation = `${key}: ${q}${translation}${q},`;
      translations[standardLocale] = translation;
    } else {
      translations[standardLocale] = translation;
    } 
    if (afterKey && rootPath) { // Replace in translation files
      child.exec(`sed -i '' -e "s/.*${afterKey.replace(/[\\$'"\[\]]/g, "\\$&")}.*/\ \ ${translation.replace(/[\\$'"\[\]]/g, "\\$&")}\\n&/" "${rootPath}/${standardLocale}.js"`, console.log);
    }
    console.log(translations);
  });
};

const getTranslation = async (Text, to) => {
  const { params, headers, baseUrl } = config;

  try {
    return await axios.post(baseUrl, [{ Text }], {
      params: { ...params, to },
      headers,
    });
  } catch (error) {
    console.log("There was an error requesting your translation:: ", error.message);
  }
};

function init() {
  const { w: text, o: locales, k: key, a: afterKey, p: rootPath } = minimist(process.argv.slice(2));

  if (!text) {
    return console.error(
      "Please provide a text to translate (-w) for translating"
    );
  }

  translate(text, locales, key, afterKey, rootPath);
}

init();
