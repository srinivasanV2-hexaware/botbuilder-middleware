var got = require('got');
var querystring=require('querystring');
    async function translate(text, options) {
  try {
    if (typeof options !== 'object') options = {};
    text = String(text);

    // Check if a lanugage is in supported; if not, throw an error object.
    let error;
    [ options.from, options.to ].forEach((lang) => {
      if (lang && !isSupported(lang)) {
        error = new Error();
        error.code = 400;
        error.message = `The language '${lang}' is not supported.`;
      }
    });
    if (error) throw error;

    // If options object doesn't have 'from' language, set it to 'auto'.
    if (!options.hasOwnProperty('from')) options.from = 'auto';
    // If options object doesn't have 'to' language, set it to 'en'.
    if (!options.hasOwnProperty('to')) options.to = 'en';
    // If options object has a 'raw' property evaluating to true, set it to true.
    options.raw = Boolean(options.raw);

    // Get ISO 639-1 codes for the languages.
    options.from = getISOCode(options.from);
    options.to = getISOCode(options.to);

    // Generate Google Translate token for the text to be translated.
    let token = await generate(text);

    // URL & query string required by Google Translate.
    let url = 'https://translate.google.com/translate_a/single';
    let data = {
      client: 'gtx',
      sl: options.from,
      tl: options.to,
      hl: options.to,
      dt: [ 'at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't' ],
      ie: 'UTF-8',
      oe: 'UTF-8',
      otf: 1,
      ssel: 0,
      tsel: 0,
      kc: 7,
      q: text,
      [token.name]: token.value
    };

    // Append query string to the request URL.
    url = `${url}?${querystring.stringify(data)}`;

    let requestOptions;
    // If request URL is greater than 2048 characters, use POST method.
    if (url.length > 2048) {
      delete data.q;
      requestOptions = [
        `${url}?${querystring.stringify(data)}`,
        {
          method: 'POST',
          body: {
            q: text
          }
        }
      ];
      requestOptions[1] = JSON.stringify(requestOptions[1]);
    }
    else {
      requestOptions = [ url ];
    }

    // Request translation from Google Translate.
    let response = await got(...requestOptions);

    let result = {
      text: '',
      from: {
        language: {
          didYouMean: false,
          iso: ''
        },
        text: {
          autoCorrected: false,
          value: '',
          didYouMean: false
        }
      },
      raw: ''
    };

    // If user requested a raw output, add the raw response to the result
    if (options.raw) {
      result.raw = response.body;
    }

    // Parse string body to JSON and add it to result object.

    let body = JSON.parse(response.body);
    body[0].forEach((obj) => {
      if (obj[0]) {
        result.text += obj[0];
      }
    });

    if (body[2] === body[8][0][0]) {
      result.from.language.iso = body[2];
    }
    else {
      result.from.language.didYouMean = true;
      result.from.language.iso = body[8][0][0];
    }

    if (body[7] && body[7][0]) {
      let str = body[7][0];

      str = str.replace(/<b><i>/g, '[');
      str = str.replace(/<\/i><\/b>/g, ']');

      result.from.text.value = str;

      if (body[7][5] === true) {
        result.from.text.autoCorrected = true;
      }
      else {
        result.from.text.didYouMean = true;
      }
    }

    return result;
  }
  catch (e) {
    if (e.name === 'HTTPError') {
      let error = new Error();
      error.name = e.name;
      error.statusCode = e.statusCode;
      error.statusMessage = e.statusMessage;
      throw error;
    }
    throw e;
  }


//module.exports = translate;
//module.exports.languages = languages;
/**
 * Generated from https://translate.google.com
 *
 * The languages that Google Translate supports (as of 2/11/2018) alongside
 * their ISO 639-1 codes
 * See https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
 */



/**
 * Returns the ISO 639-1 code of the desiredLang – if it is supported by
 * Google Translate
 * @param {string} language The name or the code of the desired language
 * @returns {string|boolean} The ISO 639-1 code of the language or null if the
 * language is not supported
 */
function getISOCode(language) {
  if (!language) return false;
  language = language.toLowerCase();
  if (language in languages) return language;

  let keys = Object.keys(languages).filter((key) => {
    if (typeof languages[key] !== 'string') return false;

    return languages[key].toLowerCase() === language;
  });

  return keys[0] || null;
}

/**
 * Returns true if the desiredLang is supported by Google Translate and false otherwise
 * @param {String} language The ISO 639-1 code or the name of the desired language.
 * @returns {boolean} If the language is supported or not.
 */
function isSupported(language) {
  return Boolean(getISOCode(language));
}

  function zr(a) {
    let b;
    if (null !== yr) b = yr;
    else {
      b = wr(String.fromCharCode(84));
      let c = wr(String.fromCharCode(75));
      b = [ b(), b() ];
      b[1] = c();
      b = (yr = window[b.join(c())] || '') || '';
    }
    let d = wr(String.fromCharCode(116));
    let c = wr(String.fromCharCode(107));
    d = [ d(), d() ];
    d[1] = c();
    c = '&' + d.join('') + '=';
    d = b.split('.');
    b = Number(d[0]) || 0;
    // eslint-disable-next-line no-var
    for (var e = [], f = 0, g = 0; g < a.length; g++) {
      let l = a.charCodeAt(g);
      128 > l ? e[f++] = l : (2048 > l ? e[f++] = l >> 6 | 192 : ((l & 64512) == 55296 && g + 1 < a.length && (a.charCodeAt(g + 1) & 64512) == 56320 ? (l = 65536 + ((l & 1023) << 10) + (a.charCodeAt(++g) & 1023), e[f++] = l >> 18 | 240, e[f++] = l >> 12 & 63 | 128) : e[f++] = l >> 12 | 224, e[f++] = l >> 6 & 63 | 128), e[f++] = l & 63 | 128);
    }
    a = b;
    for (let f = 0; f < e.length; f++) a += e[f], a = xr(a, '+-a^+6');
    a = xr(a, '+-3^+b+-f');
    a ^= Number(d[1]) || 0;
    0 > a && (a = (a & 2147483647) + 2147483648);
    a %= 1E6;
    return c + (a.toString() + '.' + (a ^ b));
  }
  
  let yr = null;
  let wr = function(a) {
    return function() {
      return a;
    };
  };
  let xr = function(a, b) {
    for (let c = 0; c < b.length - 2; c += 3) {
      let d = b.charAt(c + 2);
      d = d >= 'a' ? d.charCodeAt(0) - 87 : Number(d);
      d = b.charAt(c + 1) == '+' ? a >>> d : a << d;
      a = b.charAt(c) == '+' ? a + d & 4294967295 : a ^ d;
    }
    return a;
  };
  // END
  /* eslint-enable */
  
  const config = new Map();
  
  const window = {
    TKK: config.get('TKK') || '0'
  };
  
  // eslint-disable-next-line require-jsdoc
  function updateTKK() {
    return new Promise(async (resolve, reject) => {
      try {
        let now = Math.floor(Date.now() / 3600000);
  
        if (Number(window.TKK.split('.')[0]) === now) {
          resolve();
        }
        else {
          let res = await got('https://translate.google.com');
  
          const code = res.body.match(/TKK=(.*?)\(\)\)'\);/g);
  
          if (code) {
            eval(code[0]);
            /* eslint-disable no-undef */
            if (typeof TKK !== 'undefined') {
              window.TKK = TKK;
              config.set('TKK', TKK);
            }
            /* eslint-enable no-undef */
          }
  
          /**
          * Note: If the regex or the eval fail, there is no need to worry. The
          * server will accept relatively old seeds.
          */
  
          resolve();
        }
      }
      catch (e) {
        if (e.name === 'HTTPError') {
          let error = new Error();
          error.name = e.name;
          error.statusCode = e.statusCode;
          error.statusMessage = e.statusMessage;
          reject(error);
        }
        reject(e);
      }
    });
  }
  
  // eslint-disable-next-line require-jsdoc
  async function generate(text) {
    try {
      await updateTKK();
  
      let tk = zr(text);
      tk = tk.replace('&tk=', '');
      return { name: 'tk', value: tk };
    }
    catch (error) {
      return error;
    }
  }
}
let languages = {
  'auto': 'Automatic',
  'af': 'Afrikaans',
  'sq': 'Albanian',
  'am': 'Amharic',
  'ar': 'Arabic',
  'hy': 'Armenian',
  'az': 'Azerbaijani',
  'eu': 'Basque',
  'be': 'Belarusian',
  'bn': 'Bengali',
  'bs': 'Bosnian',
  'bg': 'Bulgarian',
  'ca': 'Catalan',
  'ceb': 'Cebuano',
  'ny': 'Chichewa',
  'zh-cn': 'Chinese Simplified',
  'zh-tw': 'Chinese Traditional',
  'co': 'Corsican',
  'hr': 'Croatian',
  'cs': 'Czech',
  'da': 'Danish',
  'nl': 'Dutch',
  'en': 'English',
  'eo': 'Esperanto',
  'et': 'Estonian',
  'tl': 'Filipino',
  'fi': 'Finnish',
  'fr': 'French',
  'fy': 'Frisian',
  'gl': 'Galician',
  'ka': 'Georgian',
  'de': 'German',
  'el': 'Greek',
  'gu': 'Gujarati',
  'ht': 'Haitian Creole',
  'ha': 'Hausa',
  'haw': 'Hawaiian',
  'iw': 'Hebrew',
  'hi': 'Hindi',
  'hmn': 'Hmong',
  'hu': 'Hungarian',
  'is': 'Icelandic',
  'ig': 'Igbo',
  'id': 'Indonesian',
  'ga': 'Irish',
  'it': 'Italian',
  'ja': 'Japanese',
  'jw': 'Javanese',
  'kn': 'Kannada',
  'kk': 'Kazakh',
  'km': 'Khmer',
  'ko': 'Korean',
  'ku': 'Kurdish (Kurmanji)',
  'ky': 'Kyrgyz',
  'lo': 'Lao',
  'la': 'Latin',
  'lv': 'Latvian',
  'lt': 'Lithuanian',
  'lb': 'Luxembourgish',
  'mk': 'Macedonian',
  'mg': 'Malagasy',
  'ms': 'Malay',
  'ml': 'Malayalam',
  'mt': 'Maltese',
  'mi': 'Maori',
  'mr': 'Marathi',
  'mn': 'Mongolian',
  'my': 'Myanmar (Burmese)',
  'ne': 'Nepali',
  'no': 'Norwegian',
  'ps': 'Pashto',
  'fa': 'Persian',
  'pl': 'Polish',
  'pt': 'Portuguese',
  'pa': 'Punjabi',
  'ro': 'Romanian',
  'ru': 'Russian',
  'sm': 'Samoan',
  'gd': 'Scots Gaelic',
  'sr': 'Serbian',
  'st': 'Sesotho',
  'sn': 'Shona',
  'sd': 'Sindhi',
  'si': 'Sinhala',
  'sk': 'Slovak',
  'sl': 'Slovenian',
  'so': 'Somali',
  'es': 'Spanish',
  'su': 'Sundanese',
  'sw': 'Swahili',
  'sv': 'Swedish',
  'tg': 'Tajik',
  'ta': 'Tamil',
  'te': 'Telugu',
  'th': 'Thai',
  'tr': 'Turkish',
  'uk': 'Ukrainian',
  'ur': 'Urdu',
  'uz': 'Uzbek',
  'vi': 'Vietnamese',
  'cy': 'Welsh',
  'xh': 'Xhosa',
  'yi': 'Yiddish',
  'yo': 'Yoruba',
  'zu': 'Zulu'
};
module.exports.languages = languages;  
//module.exports.translateGoogle = translateGoogle;
module.exports.translate = translate;