import axios from "axios";
import minimist from "minimist";
import config from "./config.js";

// This should work if Rapid API got fixed and many languages could be sent simultaneously

// const toLocaleParams = (locales) => {
//   try {
//     return locales
//       .split(",")
//       .reduce(
//         (toLocales, locale) =>
//           locale ? [...toLocales, `to=${locale}`] : toLocales,
//         []
//       )
//       .join("&");
//   } catch (e) {
//     return [];
//   }
// };

const translate = async (text, locales) => {
  const localeArray = locales.split(",");

  if (!localeArray.length) {
    return console.error(
      "Please, add locales in comma separated value format (e.g. -o es,pt,it)"
    );
  }

  localeArray.forEach(async (locale) => {
    const response = await getTranslation(text, locale);
    console.log(`${locale}: `, response?.data?.[0]?.translations?.[0]?.text);
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
    console.log("There was an error requesting your translation:: ", error);
  }
};

function init() {
  const { w: text, o: locales } = minimist(process.argv.slice(2));

  if (!text || !locales) {
    return console.error(
      "Please provide a text to translate (-w) and at least a locale (-o) for translating"
    );
  }

  translate(text, locales);
}

init();
