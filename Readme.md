# Node JS translator for MS Translate API 🌎

This script is using [Rapid API's Azure Microsoft Translation implementation](https://rapidapi.com/microsoft-azure-org-microsoft-cognitive-services/api/microsoft-translator-text/)

## Usage

1. Add your Rapid Api Key into `config.js` (See `config.js.dist` for reference)

2. Run

```sh
npm i
```

3.

```sh
npm run translate -- -w <textToTranslate> -o <language1,language2>
```

Where

`--w` Specifies the text to translate

`--o` A comma separated list of the expected languages in which the text will be translated to

A simple text list will be displayed with the requested results

## To be done:

- Rapid API doesn't seem to support requesting multiple languages at once, so i'm discovering a way to avoid a single request per language

- Turn this to an executable

- Handle more exceptions and edge cases

- Add unit tests
