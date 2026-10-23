

const PSN_CONFIG = { region: "US", locale: "en-us" };

const STEAM_REGIONS = Object.freeze({
  AE: { name: 'United Arab Emirates', currency: 'USD', locale: 'en-AE' },
  AL: { name: 'Albania', currency: 'USD', locale: 'en-AL' },
  AM: { name: 'Armenia', currency: 'USD', locale: 'en-AM' },
  AO: { name: 'Angola', currency: 'USD', locale: 'en-AO' },
  AR: { name: 'Argentina', currency: 'USD', locale: 'es-AR' },
  AT: { name: 'Austria', currency: 'EUR', locale: 'de-AT' },
  AU: { name: 'Australia', currency: 'AUD', locale: 'en-AU' },
  AZ: { name: 'Azerbaijan', currency: 'USD', locale: 'en-AZ' },

  BA: { name: 'Bosnia and Herzegovina', currency: 'USD', locale: 'en-BA' },
  BD: { name: 'Bangladesh', currency: 'USD', locale: 'en-BD' },
  BE: { name: 'Belgium', currency: 'EUR', locale: 'nl-BE' },
  BG: { name: 'Bulgaria', currency: 'EUR', locale: 'bg-BG' },
  BH: { name: 'Bahrain', currency: 'USD', locale: 'en-BH' },
  BO: { name: 'Bolivia', currency: 'USD', locale: 'es-BO' },
  BR: { name: 'Brazil', currency: 'BRL', locale: 'pt-BR' },
  BS: { name: 'Bahamas', currency: 'USD', locale: 'en-BS' },
  BY: { name: 'Belarus', currency: 'USD', locale: 'ru-BY' },

  CA: { name: 'Canada', currency: 'CAD', locale: 'en-CA' },
  CH: { name: 'Switzerland', currency: 'CHF', locale: 'de-CH' },
  CL: { name: 'Chile', currency: 'CLP', locale: 'es-CL' },
  CN: { name: 'China', currency: 'CNY', locale: 'zh-CN' },
  CO: { name: 'Colombia', currency: 'COP', locale: 'es-CO' },
  CR: { name: 'Costa Rica', currency: 'CRC', locale: 'es-CR' },
  CY: { name: 'Cyprus', currency: 'EUR', locale: 'el-CY' },
  CZ: { name: 'Czechia', currency: 'EUR', locale: 'cs-CZ' },

  DE: { name: 'Germany', currency: 'EUR', locale: 'de-DE' },
  DK: { name: 'Denmark', currency: 'EUR', locale: 'da-DK' },
  DO: { name: 'Dominican Republic', currency: 'USD', locale: 'es-DO' },
  DZ: { name: 'Algeria', currency: 'USD', locale: 'fr-DZ' },

  EC: { name: 'Ecuador', currency: 'USD', locale: 'es-EC' },
  EE: { name: 'Estonia', currency: 'EUR', locale: 'et-EE' },
  EG: { name: 'Egypt', currency: 'USD', locale: 'ar-EG' },
  ES: { name: 'Spain', currency: 'EUR', locale: 'es-ES' },

  FI: { name: 'Finland', currency: 'EUR', locale: 'fi-FI' },
  FR: { name: 'France', currency: 'EUR', locale: 'fr-FR' },

  GB: { name: 'United Kingdom', currency: 'GBP', locale: 'en-GB' },
  GE: { name: 'Georgia', currency: 'USD', locale: 'en-GE' },
  GH: { name: 'Ghana', currency: 'USD', locale: 'en-GH' },
  GR: { name: 'Greece', currency: 'EUR', locale: 'el-GR' },
  GT: { name: 'Guatemala', currency: 'USD', locale: 'es-GT' },

  HK: { name: 'Hong Kong', currency: 'HKD', locale: 'zh-HK' },
  HN: { name: 'Honduras', currency: 'USD', locale: 'es-HN' },
  HR: { name: 'Croatia', currency: 'EUR', locale: 'hr-HR' },
  HU: { name: 'Hungary', currency: 'EUR', locale: 'hu-HU' },

  ID: { name: 'Indonesia', currency: 'IDR', locale: 'id-ID' },
  IE: { name: 'Ireland', currency: 'EUR', locale: 'en-IE' },
  IL: { name: 'Israel', currency: 'ILS', locale: 'he-IL' },
  IN: { name: 'India', currency: 'INR', locale: 'en-IN' },
  IQ: { name: 'Iraq', currency: 'USD', locale: 'ar-IQ' },
  IS: { name: 'Iceland', currency: 'EUR', locale: 'is-IS' },
  IT: { name: 'Italy', currency: 'EUR', locale: 'it-IT' },

  JM: { name: 'Jamaica', currency: 'USD', locale: 'en-JM' },
  JO: { name: 'Jordan', currency: 'USD', locale: 'ar-JO' },
  JP: { name: 'Japan', currency: 'JPY', locale: 'ja-JP' },

  KE: { name: 'Kenya', currency: 'USD', locale: 'en-KE' },
  KG: { name: 'Kyrgyzstan', currency: 'USD', locale: 'ru-KG' },
  KH: { name: 'Cambodia', currency: 'USD', locale: 'en-KH' },
  KR: { name: 'South Korea', currency: 'KRW', locale: 'ko-KR' },
  KW: { name: 'Kuwait', currency: 'KWD', locale: 'en-KW' },
  KZ: { name: 'Kazakhstan', currency: 'KZT', locale: 'ru-KZ' },

  LA: { name: 'Laos', currency: 'USD', locale: 'en-LA' },
  LB: { name: 'Lebanon', currency: 'USD', locale: 'en-LB' },
  LK: { name: 'Sri Lanka', currency: 'USD', locale: 'en-LK' },
  LT: { name: 'Lithuania', currency: 'EUR', locale: 'lt-LT' },
  LU: { name: 'Luxembourg', currency: 'EUR', locale: 'fr-LU' },
  LV: { name: 'Latvia', currency: 'EUR', locale: 'lv-LV' },

  MA: { name: 'Morocco', currency: 'USD', locale: 'fr-MA' },
  MD: { name: 'Moldova', currency: 'USD', locale: 'ro-MD' },
  ME: { name: 'Montenegro', currency: 'EUR', locale: 'en-ME' },
  MK: { name: 'North Macedonia', currency: 'USD', locale: 'mk-MK' },
  MM: { name: 'Myanmar', currency: 'USD', locale: 'en-MM' },
  MN: { name: 'Mongolia', currency: 'USD', locale: 'en-MN' },
  MO: { name: 'Macao', currency: 'USD', locale: 'zh-MO' },
  MT: { name: 'Malta', currency: 'EUR', locale: 'en-MT' },
  MU: { name: 'Mauritius', currency: 'USD', locale: 'en-MU' },
  MX: { name: 'Mexico', currency: 'MXN', locale: 'es-MX' },
  MY: { name: 'Malaysia', currency: 'MYR', locale: 'en-MY' },

  NG: { name: 'Nigeria', currency: 'USD', locale: 'en-NG' },
  NI: { name: 'Nicaragua', currency: 'USD', locale: 'es-NI' },
  NL: { name: 'Netherlands', currency: 'EUR', locale: 'nl-NL' },
  NO: { name: 'Norway', currency: 'EUR', locale: 'nb-NO' },
  NP: { name: 'Nepal', currency: 'USD', locale: 'en-NP' },
  NZ: { name: 'New Zealand', currency: 'NZD', locale: 'en-NZ' },

  OM: { name: 'Oman', currency: 'USD', locale: 'en-OM' },

  PA: { name: 'Panama', currency: 'USD', locale: 'es-PA' },
  PE: { name: 'Peru', currency: 'PEN', locale: 'es-PE' },
  PH: { name: 'Philippines', currency: 'PHP', locale: 'en-PH' },
  PK: { name: 'Pakistan', currency: 'USD', locale: 'en-PK' },
  PL: { name: 'Poland', currency: 'PLN', locale: 'pl-PL' },
  PR: { name: 'Puerto Rico', currency: 'USD', locale: 'es-PR' },
  PT: { name: 'Portugal', currency: 'EUR', locale: 'pt-PT' },
  PY: { name: 'Paraguay', currency: 'USD', locale: 'es-PY' },

  QA: { name: 'Qatar', currency: 'QAR', locale: 'en-QA' },

  RO: { name: 'Romania', currency: 'EUR', locale: 'ro-RO' },
  RS: { name: 'Serbia', currency: 'USD', locale: 'sr-RS' },
  RU: { name: 'Russia', currency: 'RUB', locale: 'ru-RU' },

  SA: { name: 'Saudi Arabia', currency: 'SAR', locale: 'ar-SA' },
  SE: { name: 'Sweden', currency: 'EUR', locale: 'sv-SE' },
  SG: { name: 'Singapore', currency: 'SGD', locale: 'en-SG' },
  SI: { name: 'Slovenia', currency: 'EUR', locale: 'sl-SI' },
  SK: { name: 'Slovakia', currency: 'EUR', locale: 'sk-SK' },
  SV: { name: 'El Salvador', currency: 'USD', locale: 'es-SV' },

  TH: { name: 'Thailand', currency: 'THB', locale: 'th-TH' },
  TJ: { name: 'Tajikistan', currency: 'USD', locale: 'ru-TJ' },
  TN: { name: 'Tunisia', currency: 'USD', locale: 'fr-TN' },
  TR: { name: 'Türkiye', currency: 'USD', locale: 'tr-TR' },
  TT: { name: 'Trinidad and Tobago', currency: 'USD', locale: 'en-TT' },
  TW: { name: 'Taiwan', currency: 'TWD', locale: 'zh-TW' },

  UA: { name: 'Ukraine', currency: 'UAH', locale: 'uk-UA' },
  US: { name: 'United States', currency: 'USD', locale: 'en-US' },
  UY: { name: 'Uruguay', currency: 'UYU', locale: 'es-UY' },
  UZ: { name: 'Uzbekistan', currency: 'USD', locale: 'ru-UZ' },

  VE: { name: 'Venezuela', currency: 'USD', locale: 'es-VE' },
  VN: { name: 'Vietnam', currency: 'VND', locale: 'vi-VN' },

  ZA: { name: 'South Africa', currency: 'ZAR', locale: 'en-ZA' },
  ZM: { name: 'Zambia', currency: 'USD', locale: 'en-ZM' },
  ZW: { name: 'Zimbabwe', currency: 'USD', locale: 'en-ZW' }
});

const STEAM_LANGUAGES = Object.freeze({
  ar: 'arabic', bg: 'bulgarian', cs: 'czech', da: 'danish', de: 'german',
  el: 'greek', en: 'english', es: 'spanish', fi: 'finnish', fr: 'french',
  hu: 'hungarian', id: 'indonesian', it: 'italian', ja: 'japanese',
  ko: 'koreana', nl: 'dutch', no: 'norwegian', pl: 'polish',
  pt: 'portuguese', ro: 'romanian', ru: 'russian', sv: 'swedish',
  th: 'thai', tr: 'turkish', uk: 'ukrainian', vi: 'vietnamese', zh: 'schinese'
});

const PSN_REGIONS = Object.freeze({
  AR: { name: 'Argentina', currency: 'USD', locale: 'es-AR' },
  AU: { name: 'Australia', currency: 'AUD', locale: 'en-AU' },
  AT: { name: 'Austria', currency: 'EUR', locale: 'de-AT' },
  BH: { name: 'Bahrain', currency: 'USD', locale: 'en-BH' },
  BE: { name: 'Belgium', currency: 'EUR', locale: 'nl-BE' },
  BO: { name: 'Bolivia', currency: 'USD', locale: 'es-BO' },
  BR: { name: 'Brazil', currency: 'BRL', locale: 'pt-BR' },
  BG: { name: 'Bulgaria', currency: 'EUR', locale: 'bg-BG' },
  CA: { name: 'Canada', currency: 'CAD', locale: 'en-CA' },
  CL: { name: 'Chile', currency: 'CLP', locale: 'es-CL' },
  CN: { name: 'China', currency: 'CNY', locale: 'zh-CN' },
  CO: { name: 'Colombia', currency: 'COP', locale: 'es-CO' },
  CR: { name: 'Costa Rica', currency: 'USD', locale: 'es-CR' },
  HR: { name: 'Croatia', currency: 'EUR', locale: 'hr-HR' },
  CY: { name: 'Cyprus', currency: 'EUR', locale: 'el-CY' },
  CZ: { name: 'Czechia', currency: 'CZK', locale: 'cs-CZ' },
  DK: { name: 'Denmark', currency: 'DKK', locale: 'da-DK' },
  EC: { name: 'Ecuador', currency: 'USD', locale: 'es-EC' },
  SV: { name: 'El Salvador', currency: 'USD', locale: 'es-SV' },
  FI: { name: 'Finland', currency: 'EUR', locale: 'fi-FI' },
  FR: { name: 'France', currency: 'EUR', locale: 'fr-FR' },
  DE: { name: 'Germany', currency: 'EUR', locale: 'de-DE' },
  GR: { name: 'Greece', currency: 'EUR', locale: 'el-GR' },
  GT: { name: 'Guatemala', currency: 'USD', locale: 'es-GT' },
  HN: { name: 'Honduras', currency: 'USD', locale: 'es-HN' },
  HK: { name: 'Hong Kong', currency: 'HKD', locale: 'zh-HK' },
  HU: { name: 'Hungary', currency: 'HUF', locale: 'hu-HU' },
  IS: { name: 'Iceland', currency: 'ISK', locale: 'is-IS' },
  IN: { name: 'India', currency: 'INR', locale: 'en-IN' },
  ID: { name: 'Indonesia', currency: 'IDR', locale: 'id-ID' },
  IE: { name: 'Ireland', currency: 'EUR', locale: 'en-IE' },
  IL: { name: 'Israel', currency: 'ILS', locale: 'he-IL' },
  IT: { name: 'Italy', currency: 'EUR', locale: 'it-IT' },
  JP: { name: 'Japan', currency: 'JPY', locale: 'ja-JP' },
  KR: { name: 'South Korea', currency: 'KRW', locale: 'ko-KR' },
  KW: { name: 'Kuwait', currency: 'KWD', locale: 'ar-KW' },
  LB: { name: 'Lebanon', currency: 'USD', locale: 'ar-LB' },
  LU: { name: 'Luxembourg', currency: 'EUR', locale: 'fr-LU' },
  MY: { name: 'Malaysia', currency: 'MYR', locale: 'en-MY' },
  MT: { name: 'Malta', currency: 'EUR', locale: 'en-MT' },
  MX: { name: 'Mexico', currency: 'MXN', locale: 'es-MX' },
  NL: { name: 'Netherlands', currency: 'EUR', locale: 'nl-NL' },
  NZ: { name: 'New Zealand', currency: 'NZD', locale: 'en-NZ' },
  NI: { name: 'Nicaragua', currency: 'USD', locale: 'es-NI' },
  NO: { name: 'Norway', currency: 'NOK', locale: 'nb-NO' },
  OM: { name: 'Oman', currency: 'OMR', locale: 'ar-OM' },
  PA: { name: 'Panama', currency: 'USD', locale: 'es-PA' },
  PY: { name: 'Paraguay', currency: 'USD', locale: 'es-PY' },
  PE: { name: 'Peru', currency: 'PEN', locale: 'es-PE' },
  PH: { name: 'Philippines', currency: 'PHP', locale: 'en-PH' },
  PL: { name: 'Poland', currency: 'PLN', locale: 'pl-PL' },
  PT: { name: 'Portugal', currency: 'EUR', locale: 'pt-PT' },
  QA: { name: 'Qatar', currency: 'QAR', locale: 'ar-QA' },
  RO: { name: 'Romania', currency: 'RON', locale: 'ro-RO' },
  RU: { name: 'Russia', currency: 'RUB', locale: 'ru-RU' },
  SA: { name: 'Saudi Arabia', currency: 'SAR', locale: 'ar-SA' },
  RS: { name: 'Serbia', currency: 'RSD', locale: 'sr-RS' },
  SG: { name: 'Singapore', currency: 'SGD', locale: 'en-SG' },
  SK: { name: 'Slovakia', currency: 'EUR', locale: 'sk-SK' },
  SI: { name: 'Slovenia', currency: 'EUR', locale: 'sl-SI' },
  ZA: { name: 'South Africa', currency: 'ZAR', locale: 'en-ZA' },
  ES: { name: 'Spain', currency: 'EUR', locale: 'es-ES' },
  SE: { name: 'Sweden', currency: 'SEK', locale: 'sv-SE' },
  CH: { name: 'Switzerland', currency: 'CHF', locale: 'de-CH' },
  TW: { name: 'Taiwan', currency: 'TWD', locale: 'zh-TW' },
  TH: { name: 'Thailand', currency: 'THB', locale: 'th-TH' },
  TR: { name: 'Turkey', currency: 'TRY', locale: 'tr-TR' },
  UA: { name: 'Ukraine', currency: 'UAH', locale: 'uk-UA' },
  AE: { name: 'United Arab Emirates', currency: 'AED', locale: 'ar-AE' },
  GB: { name: 'United Kingdom', currency: 'GBP', locale: 'en-GB' },
  US: { name: 'United States', currency: 'USD', locale: 'en-US' },
  UY: { name: 'Uruguay', currency: 'USD', locale: 'es-UY' },
  VN: { name: 'Vietnam', currency: 'VND', locale: 'vi-VN' }
});
const XBOX_REGIONS = Object.freeze({
  AL: { name: 'Albania', currency: 'USD', locale: 'sq-AL' },
  DZ: { name: 'Algeria', currency: 'USD', locale: 'ar-DZ' },
  AR: { name: 'Argentina', currency: 'ARS', locale: 'es-AR' },
  AU: { name: 'Australia', currency: 'AUD', locale: 'en-AU' },
  AT: { name: 'Austria', currency: 'EUR', locale: 'de-AT' },
  BH: { name: 'Bahrain', currency: 'USD', locale: 'ar-BH' },
  BE: { name: 'Belgium', currency: 'EUR', locale: 'nl-BE' },
  BO: { name: 'Bolivia', currency: 'USD', locale: 'es-BO' },
  BA: { name: 'Bosnia & Herzegovina', currency: 'USD', locale: 'bs-BA' },
  BR: { name: 'Brazil', currency: 'BRL', locale: 'pt-BR' },
  BG: { name: 'Bulgaria', currency: 'EUR', locale: 'bg-BG' },
  CA: { name: 'Canada', currency: 'CAD', locale: 'en-CA' },
  CL: { name: 'Chile', currency: 'CLP', locale: 'es-CL' },
  CN: { name: 'China', currency: 'CNY', locale: 'zh-CN' },
  CO: { name: 'Colombia', currency: 'COP', locale: 'es-CO' },
  CR: { name: 'Costa Rica', currency: 'USD', locale: 'es-CR' },
  HR: { name: 'Croatia', currency: 'EUR', locale: 'hr-HR' },
  CY: { name: 'Cyprus', currency: 'EUR', locale: 'el-CY' },
  CZ: { name: 'Czechia', currency: 'CZK', locale: 'cs-CZ' },
  DK: { name: 'Denmark', currency: 'DKK', locale: 'da-DK' },
  EC: { name: 'Ecuador', currency: 'USD', locale: 'es-EC' },
  EG: { name: 'Egypt', currency: 'USD', locale: 'ar-EG' },
  SV: { name: 'El Salvador', currency: 'USD', locale: 'es-SV' },
  EE: { name: 'Estonia', currency: 'EUR', locale: 'et-EE' },
  FI: { name: 'Finland', currency: 'EUR', locale: 'fi-FI' },
  FR: { name: 'France', currency: 'EUR', locale: 'fr-FR' },
  GE: { name: 'Georgia', currency: 'USD', locale: 'ka-GE' },
  DE: { name: 'Germany', currency: 'EUR', locale: 'de-DE' },
  GR: { name: 'Greece', currency: 'EUR', locale: 'el-GR' },
  GT: { name: 'Guatemala', currency: 'USD', locale: 'es-GT' },
  HN: { name: 'Honduras', currency: 'USD', locale: 'es-HN' },
  HK: { name: 'Hong Kong', currency: 'HKD', locale: 'zh-HK' },
  HU: { name: 'Hungary', currency: 'HUF', locale: 'hu-HU' },
  IS: { name: 'Iceland', currency: 'USD', locale: 'is-IS' },
  IN: { name: 'India', currency: 'INR', locale: 'en-IN' },
  ID: { name: 'Indonesia', currency: 'IDR', locale: 'id-ID' },
  IE: { name: 'Ireland', currency: 'EUR', locale: 'en-IE' },
  IL: { name: 'Israel', currency: 'ILS', locale: 'he-IL' },
  IT: { name: 'Italy', currency: 'EUR', locale: 'it-IT' },
  JP: { name: 'Japan', currency: 'JPY', locale: 'ja-JP' },
  KR: { name: 'South Korea', currency: 'KRW', locale: 'ko-KR' },
  KW: { name: 'Kuwait', currency: 'KWD', locale: 'ar-KW' },
  LV: { name: 'Latvia', currency: 'EUR', locale: 'lv-LV' },
  LY: { name: 'Libya', currency: 'USD', locale: 'ar-LY' },
  LI: { name: 'Liechtenstein', currency: 'CHF', locale: 'de-LI' },
  LT: { name: 'Lithuania', currency: 'EUR', locale: 'lt-LT' },
  LU: { name: 'Luxembourg', currency: 'EUR', locale: 'fr-LU' },
  MY: { name: 'Malaysia', currency: 'MYR', locale: 'ms-MY' },
  MT: { name: 'Malta', currency: 'EUR', locale: 'en-MT' },
  MX: { name: 'Mexico', currency: 'MXN', locale: 'es-MX' },
  MD: { name: 'Moldova', currency: 'USD', locale: 'ro-MD' },
  ME: { name: 'Montenegro', currency: 'EUR', locale: 'sr-ME' },
  MA: { name: 'Morocco', currency: 'USD', locale: 'ar-MA' },
  NL: { name: 'Netherlands', currency: 'EUR', locale: 'nl-NL' },
  NZ: { name: 'New Zealand', currency: 'NZD', locale: 'en-NZ' },
  NI: { name: 'Nicaragua', currency: 'USD', locale: 'es-NI' },
  MK: { name: 'North Macedonia', currency: 'USD', locale: 'mk-MK' },
  NO: { name: 'Norway', currency: 'NOK', locale: 'nb-NO' },
  OM: { name: 'Oman', currency: 'OMR', locale: 'ar-OM' },
  PA: { name: 'Panama', currency: 'USD', locale: 'es-PA' },
  PY: { name: 'Paraguay', currency: 'USD', locale: 'es-PY' },
  PE: { name: 'Peru', currency: 'PEN', locale: 'es-PE' },
  PH: { name: 'Philippines', currency: 'PHP', locale: 'en-PH' },
  PL: { name: 'Poland', currency: 'PLN', locale: 'pl-PL' },
  PT: { name: 'Portugal', currency: 'EUR', locale: 'pt-PT' },
  QA: { name: 'Qatar', currency: 'QAR', locale: 'ar-QA' },
  RO: { name: 'Romania', currency: 'RON', locale: 'ro-RO' },
  RU: { name: 'Russia', currency: 'RUB', locale: 'ru-RU' },
  SA: { name: 'Saudi Arabia', currency: 'SAR', locale: 'ar-SA' },
  RS: { name: 'Serbia', currency: 'RSD', locale: 'sr-RS' },
  SG: { name: 'Singapore', currency: 'SGD', locale: 'en-SG' },
  SK: { name: 'Slovakia', currency: 'EUR', locale: 'sk-SK' },
  SI: { name: 'Slovenia', currency: 'EUR', locale: 'sl-SI' },
  ZA: { name: 'South Africa', currency: 'ZAR', locale: 'en-ZA' },
  ES: { name: 'Spain', currency: 'EUR', locale: 'es-ES' },
  SE: { name: 'Sweden', currency: 'SEK', locale: 'sv-SE' },
  CH: { name: 'Switzerland', currency: 'CHF', locale: 'de-CH' },
  TW: { name: 'Taiwan', currency: 'TWD', locale: 'zh-TW' },
  TH: { name: 'Thailand', currency: 'THB', locale: 'th-TH' },
  TN: { name: 'Tunisia', currency: 'USD', locale: 'ar-TN' },
  TR: { name: 'Turkey', currency: 'TRY', locale: 'tr-TR' },
  UA: { name: 'Ukraine', currency: 'UAH', locale: 'uk-UA' },
  AE: { name: 'United Arab Emirates', currency: 'AED', locale: 'ar-AE' },
  GB: { name: 'United Kingdom', currency: 'GBP', locale: 'en-GB' },
  US: { name: 'United States', currency: 'USD', locale: 'en-US' },
  UY: { name: 'Uruguay', currency: 'USD', locale: 'es-UY' },
  VN: { name: 'Vietnam', currency: 'VND', locale: 'vi-VN' }
});

function resolveStoreRegion(table, code) {
  const key = String(code || '').trim().toUpperCase();
  return table[key] ? key : 'US';
}

const PLAYSTATION_OPERATION_NAME = "getSearchResults";

const PLAYSTATION_OPERATION_HASH =
  "4df6284f982e57bec70f23c77e2c219dc792eb19af7fb3d3a81767aa3f1958aa";

const STORE_ROMAN_TO_ARABIC = {
  II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8, IX: 9,
  X: 10, XI: 11, XII: 12, XIII: 13, XIV: 14, XV: 15, XVI: 16
};
const STORE_ARABIC_TO_ROMAN = Object.fromEntries(
  Object.entries(STORE_ROMAN_TO_ARABIC).map(([roman, arabic]) => [arabic, roman])
);

function storeQueryWithArabicNumerals(query) {
  return String(query || '').replace(/\b([IVX]{1,6})\b/g, (match) => {
    const arabic = STORE_ROMAN_TO_ARABIC[match.toUpperCase()];
    return arabic ? String(arabic) : match;
  });
}

function storeQueryWithRomanNumerals(query) {
  return String(query || '').replace(/\b(\d{1,2})\b/g, (match, digits) => {
    const roman = STORE_ARABIC_TO_ROMAN[Number(digits)];
    return roman || match;
  });
}

function storeGenerateNumeralVariants(query) {
  const variants = [query, storeQueryWithArabicNumerals(query), storeQueryWithRomanNumerals(query)];
  return [...new Set(variants.filter(Boolean))];
}

function normalizeText(value = "") {
  return String(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’‘`]/g, "'")
    .replace(/[®™©:–—_\-]/g, " ")
    .replace(/[^a-z0-9' ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const STORE_JUNK_TITLE_PATTERNS = [
  /\bdigital comic\b/, /\bcomic book\b/, /\bart ?book\b/,
  /\bsoundtrack\b/, /\btheme\b/, /\bavatar\b/, /\bwallpaper\b/,
  /\bseason pass\b/, /\bexpansion pass\b/, /\bupgrade\b/,
  /\bdlc\b/, /\bcostume\b/, /\bvehicle pack\b/, /\bdemo\b/,

  /\bfree trial\b/, /\btrial\b/
];

function calculateTitleScore(title, searchTerm) {

  return Math.max(...storeGenerateNumeralVariants(searchTerm).map((variant) => calculateTitleScoreForVariant(title, variant)));
}

function calculateTitleScoreForVariant(title, searchTerm) {
  const normalizedTitle = normalizeText(title);
  const normalizedSearch = normalizeText(searchTerm);

  if (!normalizedTitle || !normalizedSearch) {
    return 0;
  }

  let score;

  if (normalizedTitle === normalizedSearch) {
    score = 1000;
  } else if (normalizedTitle.startsWith(normalizedSearch)) {
    score = 800;

    const remainder = normalizedTitle.slice(normalizedSearch.length).trim();
    if (remainder && /^[-–—]/.test(remainder)) {
      score = 400;
    }
  } else if (normalizedTitle.includes(normalizedSearch)) {
    score = 600;
  } else if (

    normalizedTitle.replace(/ /g, "").startsWith(normalizedSearch.replace(/ /g, ""))
  ) {
    score = 700;
  } else {
    const searchWords = normalizedSearch
      .split(" ")
      .filter(word => word.length > 1);

    if (searchWords.length === 0) {
      return 0;
    }

    const matchedWords = searchWords.filter(word =>
      normalizedTitle.includes(word)
    );

    const wordScore = matchedWords.length * 10;
    const coverageScore =
      (matchedWords.length / searchWords.length) * 100;

    score = wordScore + coverageScore;
  }

  const isJunk = STORE_JUNK_TITLE_PATTERNS.some(pattern => pattern.test(normalizedTitle));
  const queryAskedForJunk = STORE_JUNK_TITLE_PATTERNS.some(pattern => pattern.test(normalizedSearch));

  if (isJunk && !queryAskedForJunk) {
    score -= 500;
  }

  return score;
}

function parsePrice(value) {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    value === "Unavailable"
  ) {
    return null;
  }

  const cleanedValue = String(value)
    .replace(/,/g, "")
    .replace(/[^\d.-]/g, "");

  if (!cleanedValue) {
    return null;
  }

  const number = Number(cleanedValue);

  return Number.isFinite(number) ? number : null;
}

function parseDiscountPercent(discountText, basePrice, currentPrice) {
  if (discountText) {
    const match = String(discountText).match(/-?\s*(\d+(?:\.\d+)?)\s*%/);

    if (match?.[1]) {
      return Number(match[1]);
    }
  }

  if (
    Number.isFinite(basePrice) &&
    Number.isFinite(currentPrice) &&
    basePrice > 0 &&
    currentPrice < basePrice
  ) {
    return Math.round(
      ((basePrice - currentPrice) / basePrice) * 100
    );
  }

  return 0;
}

function getCurrencyCode(formattedPrice) {
  const value = String(formattedPrice || "");

  if (value.includes("$")) {
    return "USD";
  }

  if (value.includes("€")) {
    return "EUR";
  }

  if (value.includes("£")) {
    return "GBP";
  }

  if (value.includes("¥")) {
    return "JPY";
  }

  return null;
}

function isPlayStationGameProduct(product) {
  if (!product || product.__typename !== "Product") {
    return false;
  }

  const classification = String(
    product.storeDisplayClassification ||
    product.localizedStoreDisplayClassification ||
    ""
  )
    .toUpperCase()
    .replace(/\s+/g, "_");

  return (
    classification === "FULL_GAME" ||
    classification === "GAME_BUNDLE" ||

    classification === "PREMIUM_EDITION"
  );
}

function hasUsablePlayStationPrice(product) {
  const price = product?.price;

  if (!price) {
    return false;
  }

  if (price.isFree === true) {
    return true;
  }

  const basePrice = parsePrice(price.basePrice);
  const discountedPrice = parsePrice(price.discountedPrice);

  return (
    Number.isFinite(discountedPrice) ||
    Number.isFinite(basePrice)
  );
}

function getPlayStationClassificationPriority(product) {
  const classification = String(
    product?.storeDisplayClassification || ""
  ).toUpperCase();

  if (classification === "FULL_GAME") {
    return 2;
  }

  if (classification === "GAME_BUNDLE") {
    return 1;
  }

  if (classification === "PREMIUM_EDITION") {
    return 1;
  }

  return 0;
}

function getPlayStationImage(product) {
  const media = Array.isArray(product?.media)
    ? product.media
    : [];

  const preferredRoles = [
    "MASTER",
    "GAMEHUB_COVER_ART",
    "PORTRAIT_BANNER",
    "EDITION_KEY_ART",
    "FOUR_BY_THREE_BANNER"
  ];

  for (const role of preferredRoles) {
    const item = media.find(mediaItem => {
      return (
        mediaItem?.type === "IMAGE" &&
        mediaItem?.role === role &&
        mediaItem?.url
      );
    });

    if (item) {
      return item.url;
    }
  }

  const firstImage = media.find(mediaItem => {
    return mediaItem?.type === "IMAGE" && mediaItem?.url;
  });

  return firstImage?.url || null;
}

function normalizeSubscriptionBrand(value) {
  return String(value || "")
    .trim()
    .toUpperCase();
}

function getPlayStationSubscriptionInfo(price, product) {
  const serviceBranding = Array.isArray(price?.serviceBranding)
    ? price.serviceBranding.map(normalizeSubscriptionBrand)
    : [];

  const upsellServiceBranding = Array.isArray(
    price?.upsellServiceBranding
  )
    ? price.upsellServiceBranding.map(
        normalizeSubscriptionBrand
      )
    : [];

  const hasDirectPlusBranding =
    serviceBranding.includes("PS_PLUS");

  const hasPlusUpsell =
    upsellServiceBranding.includes("PS_PLUS");

  const isTiedToSubscription =
    price?.isTiedToSubscription === true;

  const rawUpsellText =
    price?.upsellText?.trim() || null;

  const subscriptionTier =
    rawUpsellText;

  const lowerUpsellText =
    String(rawUpsellText || "")
      .toLowerCase()
      .trim();

  const isDiscountText =
    /%/.test(lowerUpsellText) ||
    /\b(save|savings|saving|discount|risparmio|sconto|rabatt|remise|ahorro|desconto|korting|économisez|spare)\b/.test(lowerUpsellText);

  let psPlusTier = null;
  let isTrialOffer = false;

  if (hasPlusUpsell && lowerUpsellText) {
    if (isDiscountText) {
      psPlusTier = 'discount';
    } else if (lowerUpsellText === 'extra' || lowerUpsellText.includes('extra')) {
      psPlusTier = 'extra';
    } else if (lowerUpsellText.includes('trial')) {

      psPlusTier = 'trial';
      isTrialOffer = true;
    } else if (lowerUpsellText === 'premium' || lowerUpsellText.includes('premium')) {

      const skuCount = Array.isArray(product?.skus) ? product.skus.length : 0;
      const nameLower = String(product?.name || "").toLowerCase();
      const hasTrialInName = /\btrial\b/.test(nameLower) || /prova/.test(nameLower) || /testversion/.test(nameLower);

      if (hasTrialInName || skuCount > 1) {

        const basePriceNum = parsePrice(price?.basePrice);
        const isFullPriceNewRelease = Number.isFinite(basePriceNum) && basePriceNum >= 50;
        if (isFullPriceNewRelease || hasTrialInName) {
          psPlusTier = 'trial';
          isTrialOffer = true;
        } else {
          psPlusTier = 'premium';
        }
      } else {
        psPlusTier = 'premium';
      }
    }
  }

  let includedWithSubscription = false;
  if (hasPlusUpsell && !isDiscountText && !isTrialOffer) {

    includedWithSubscription = true;
  } else if (isTiedToSubscription || hasDirectPlusBranding) {
    includedWithSubscription = true;
  }

  const hasSubscriptionOffer =
    hasPlusUpsell || includedWithSubscription;

  let subscriptionName = null;

  if (hasSubscriptionOffer) {
    if (psPlusTier === 'extra') {
      subscriptionName = 'PlayStation Plus Extra';
    } else if (psPlusTier === 'premium') {
      subscriptionName = 'PlayStation Plus Premium';
    } else if (psPlusTier === 'trial') {
      subscriptionName = 'Trial on Premium';
    } else if (psPlusTier === 'discount') {
      subscriptionName = rawUpsellText;
    } else {
      subscriptionName = subscriptionTier
        ? `PlayStation Plus ${subscriptionTier}`
        : 'PlayStation Plus';
    }
  }

  return {
    includedWithSubscription,
    hasSubscriptionOffer,
    isTiedToSubscription,
    hasDirectPlusBranding,
    hasPlusUpsell,
    subscriptionName,
    subscriptionTier,
    psPlusTier,
    isDiscountOffer: isDiscountText,
    isTrialOffer,
    serviceBranding,
    upsellServiceBranding,
    upsellText: price?.upsellText || null,
    rawUpsellText
  };
}

function formatPlayStationProduct(product, searchTerm) {
  const price = product?.price || {};

  const basePrice = price.isFree
    ? 0
    : parsePrice(price.basePrice);

  const currentPrice = price.isFree
    ? 0
    : (
        parsePrice(price.discountedPrice) ??
        parsePrice(price.basePrice)
      );

  const discountPercent = parseDiscountPercent(
    price.discountText,
    basePrice,
    currentPrice
  );

  const subscription =
    getPlayStationSubscriptionInfo(price, product);

  const formattedBasePrice =
    price.basePrice || null;

  const formattedCurrentPrice =
    price.isFree
      ? "Free"
      : (
          price.discountedPrice ||
          price.basePrice ||
          null
        );

  const classification =
    product.storeDisplayClassification ||
    product.localizedStoreDisplayClassification ||
    null;

  return {
    platform: "PlayStation",
    title: product.name || null,
    productId: product.id || null,
    skuId: price.skuId || null,
    npTitleId: product.npTitleId || null,

    platforms: Array.isArray(product.platforms)
      ? product.platforms
      : [],

    classification,
    skuType: product?.skus?.[0]?.type || null,

    basePrice,
    currentPrice,
    formattedBasePrice,
    formattedPrice: formattedCurrentPrice,
    currency: getCurrencyCode(
      formattedCurrentPrice || formattedBasePrice
    ),

    discountText: price.discountText || null,
    discountPercent,
    isDiscounted:
      Number.isFinite(basePrice) &&
      Number.isFinite(currentPrice) &&
      currentPrice < basePrice,

    isFree: price.isFree === true,
    isAvailable: hasUsablePlayStationPrice(product),
    includesBundleOffer:
      price.includesBundleOffer === true,
    isExclusive: price.isExclusive === true,

    includedWithSubscription:
      subscription.includedWithSubscription,

    hasSubscriptionOffer:
      subscription.hasSubscriptionOffer,

    subscriptionName:
      subscription.subscriptionName,

    subscriptionTier:
      subscription.subscriptionTier,

    isTiedToSubscription:
      subscription.isTiedToSubscription,

    hasDirectPlusBranding:
      subscription.hasDirectPlusBranding,

    hasPlusUpsell:
      subscription.hasPlusUpsell,

    serviceBranding:
      subscription.serviceBranding,

    upsellServiceBranding:
      subscription.upsellServiceBranding,

    upsellText:
      subscription.upsellText,

    psPlusTier:
      subscription.psPlusTier || null,

    isTrialOffer:
      subscription.isTrialOffer || false,

    isDiscountOffer:
      subscription.isDiscountOffer || false,

    rawUpsellText:
      subscription.rawUpsellText || null,

    image: getPlayStationImage(product),

    url: product.id
      ? `https://store.playstation.com/${PSN_CONFIG.locale}/product/${product.id}`
      : null,

    titleScore: calculateTitleScore(
      product.name,
      searchTerm
    ),

    raw: product
  };
}

function sortPlayStationResults(results) {
  return [...results].sort((a, b) => {

    if (b.titleScore !== a.titleScore) {
      return b.titleScore - a.titleScore;
    }

    if (a.isAvailable !== b.isAvailable) {
      return a.isAvailable ? -1 : 1;
    }

    const classificationDifference =
      getPlayStationClassificationPriority(b.raw) -
      getPlayStationClassificationPriority(a.raw);

    if (classificationDifference !== 0) {
      return classificationDifference;
    }

    if (
      a.includedWithSubscription !==
      b.includedWithSubscription
    ) {
      return a.includedWithSubscription ? 1 : -1;
    }

    const aPrice = Number.isFinite(a.currentPrice)
      ? a.currentPrice
      : Number.POSITIVE_INFINITY;

    const bPrice = Number.isFinite(b.currentPrice)
      ? b.currentPrice
      : Number.POSITIVE_INFINITY;

    if (aPrice !== bPrice) {
      return aPrice - bPrice;
    }

    return b.platforms.length - a.platforms.length;
  });
}

async function searchPlayStation(gameName, regionCode) {

  PSN_CONFIG.region = resolveStoreRegion(PSN_REGIONS, regionCode);

  PSN_CONFIG.locale =
    (PSN_REGIONS[PSN_CONFIG.region]?.locale || 'en-US').toLowerCase();

  const variables = {
    countryCode: PSN_CONFIG.region,
    languageCode: "en",
    nextCursor: "",
    pageOffset: 0,
    pageSize: 24,
    searchTerm: gameName
  };

  const extensions = {
    persistedQuery: {
      version: 1,
      sha256Hash: PLAYSTATION_OPERATION_HASH
    }
  };

  const url = new URL(
    "https://web.np.playstation.com/api/graphql/v1//op"
  );

  url.searchParams.set(
    "operationName",
    PLAYSTATION_OPERATION_NAME
  );

  url.searchParams.set(
    "variables",
    JSON.stringify(variables)
  );

  url.searchParams.set(
    "extensions",
    JSON.stringify(extensions)
  );

const requestHeaders = {
  Accept: "application/json",
  "x-apollo-operation-name": PLAYSTATION_OPERATION_NAME,
  "x-psn-store-locale-override": PSN_CONFIG.locale
};

const response = await fetch(url.href, {
  method: "GET",
  headers: requestHeaders,
  cache: "default",
  credentials: "omit"
});

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `PlayStation HTTP ${response.status}: ` +
      responseText.slice(0, 1000)
    );
  }

  let data;

  try {
    data = JSON.parse(responseText);
  } catch (error) {
    throw new Error(
      "PlayStation returned invalid JSON: " +
      responseText.slice(0, 1000)
    );
  }

  if (Array.isArray(data?.errors) && data.errors.length > 0) {

    throw new Error(
      "PlayStation GraphQL error: " +
      JSON.stringify(data.errors)
    );
  }

  const universalSearch =
    data?.data?.universalSearch || null;

  const rawResults = Array.isArray(
    universalSearch?.results
  )
    ? universalSearch.results
    : [];

  const gameProducts = rawResults.filter(
    isPlayStationGameProduct
  );

  const conceptProducts = rawResults.filter(product => {
    if (!product || product.__typename !== "Concept") return false;
    const titleScore = calculateTitleScore(product.name || "", gameName);
    return titleScore >= 800;
  });

  log(
    '[PS price] search:', gameName, `(region ${PSN_CONFIG.region})`, '->',
    rawResults.length, 'raw result(s):',
    rawResults.map((r) => `"${r?.name || '?'}" [${r?.__typename || '?'}${r?.__typename === 'Product' ? '/' + (r?.storeDisplayClassification || r?.localizedStoreDisplayClassification || '?') : ''}]`)
  );
  log(
    '[PS price]', gameName, '->', gameProducts.length, 'passed FULL_GAME/GAME_BUNDLE filter,',
    conceptProducts.length, 'Concept fallback(s) (titleScore>=800)'
  );

  const formattedResults = [
    ...gameProducts.map(product =>
      formatPlayStationProduct(product, gameName)
    ),
    ...conceptProducts.map(concept => {

      const titleScore = calculateTitleScore(concept.name || "", gameName);
      return {
        platform: "PlayStation",
        title: concept.name || "",
        productId: concept.id || "",
        name: concept.name || "",
        raw: concept,
        isConcept: true,
        titleScore,
        isAvailable: false,
        basePrice: null,
        currentPrice: null,
        currency: null,
        formattedBasePrice: null,
        formattedPrice: null,
        isFree: false,
        isDiscounted: false,
        discountPercent: 0,
        discountText: null,
        includedWithSubscription: false,
        hasSubscriptionOffer: false,
        isTiedToSubscription: false,
        hasDirectPlusBranding: false,
        hasPlusUpsell: false,
        subscriptionName: null,
        subscriptionTier: null,
        psPlusTier: null,
        isTrialOffer: false,
        isDiscountOffer: false,
        upsellText: null,
        rawUpsellText: null,
        image: getPlayStationImage(concept),
        url: concept.id ? `https://store.playstation.com/en-us/concept/${concept.id}` : null,
        platforms: [],
        classification: "CONCEPT"
      };
    })
  ];

  const sortedResults =
    sortPlayStationResults(formattedResults);

  log(
    '[PS price]', gameName, '-> sorted candidates:',
    sortedResults.map((r) => `"${r.title}" score=${r.titleScore} [${r.classification || (r.isConcept ? 'CONCEPT' : '?')}] available=${r.isAvailable} price=${r.formattedPrice || 'none'}`)
  );

  const availableResults = sortedResults.filter(
    item => item.isAvailable
  );

  const bestMatch =
    sortedResults[0] ||
    null;

  const bestPurchaseMatch =
    availableResults[0] ||
    null;

  if (bestPurchaseMatch) {
    log(
      '[PS price]', gameName, '-> picked:', `"${bestPurchaseMatch.title}"`,
      bestPurchaseMatch.formattedPrice, `(productId ${bestPurchaseMatch.productId}, titleScore ${bestPurchaseMatch.titleScore})`
    );
  } else if (sortedResults.length) {
    logError(
      '[PS price]', gameName, '-> NO purchasable match:', sortedResults.length,
      'candidate(s) found but none had a usable price. Best title match was',
      bestMatch ? `"${bestMatch.title}" (score ${bestMatch.titleScore}, [${bestMatch.classification || (bestMatch.isConcept ? 'CONCEPT' : '?')}])` : 'none'
    );
  } else {
    logError('[PS price]', gameName, '-> NO candidates at all (0 raw results passed any filter)');
  }

  return {
    platform: "PlayStation",
    gameName,
    region: PSN_CONFIG.region,
    locale: PSN_CONFIG.locale,
    operationName: PLAYSTATION_OPERATION_NAME,
    resultCount: rawResults.length,
    gameProductCount: gameProducts.length,
    nextCursor: universalSearch?.next || null,
    pageInfo: universalSearch?.pageInfo || null,
    results: sortedResults,
    bestMatch,
    bestPurchaseMatch,
    rawResults,
    rawData: data
  };
}

const XBOX_CONFIG = {
  region: "US",
  language: "en-US",
  storeLocale: "en-us",
  clientId: "7F27B536-CF6B-4C65-8638-A0F8CBDFCA65",
  maxSearchResults: 15
};

const XBOX_SUBSCRIPTION_PRODUCTS = {
  CFQ7TTC0K5DJ: {
    productId: "CFQ7TTC0K5DJ",
    catalogName: "Xbox Game Pass Essential",
    normalizedName: "Game Pass Essential",
    eligibleTiers: ["Game Pass Essential", "Game Pass Premium", "Game Pass Ultimate"]
  },
  CFQ7TTC0P85B: {
    productId: "CFQ7TTC0P85B",
    catalogName: "Xbox Game Pass Premium",
    normalizedName: "Game Pass Premium",
    eligibleTiers: ["Game Pass Premium", "Game Pass Ultimate"]
  },
  CFQ7TTC0KGQ8: {
    productId: "CFQ7TTC0KGQ8",
    catalogName: "PC Game Pass",
    normalizedName: "PC Game Pass",
    eligibleTiers: ["PC Game Pass", "Game Pass Ultimate"]
  },
  CFQ7TTC0KHS0: {
    productId: "CFQ7TTC0KHS0",
    catalogName: "Xbox Game Pass Ultimate",
    normalizedName: "Game Pass Ultimate",
    eligibleTiers: ["Game Pass Ultimate"]
  },
  CFQ7TTC0K5DH: {
    productId: "CFQ7TTC0K5DH",
    catalogName: "EA Play",
    normalizedName: "EA Play",
    eligibleTiers: ["PC Game Pass", "Game Pass Ultimate"]
  },
  CFQ7TTC0KHS8: {
    productId: "CFQ7TTC0KHS8",
    catalogName: "EA Play Pro",
    normalizedName: "EA Play Pro",
    eligibleTiers: ["PC Game Pass", "Game Pass Ultimate"]
  }
};

const XBOX_GAME_PASS_TIER_INHERITANCE = {
  "Game Pass Essential": [
    "Game Pass Essential",
    "Game Pass Premium",
    "Game Pass Ultimate"
  ],

  "Game Pass Premium": [
    "Game Pass Premium",
    "Game Pass Ultimate"
  ],

  "PC Game Pass": [
    "PC Game Pass",
    "Game Pass Ultimate"
  ],

  "Game Pass Ultimate": [
    "Game Pass Ultimate"
  ],

  "Game Pass Standard": [
    "Game Pass Standard",
    "Game Pass Ultimate"
  ],

  "Game Pass Core": [
    "Game Pass Core",
    "Game Pass Ultimate"
  ]
};

const XBOX_GAME_PASS_TIER_ORDER = [
  "Game Pass Essential",
  "Game Pass Core",
  "Game Pass Standard",
  "Game Pass Premium",
  "PC Game Pass",
  "Game Pass Ultimate"
];

function normalizeXboxText(value = "") {
  return String(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’‘`]/g, "'")
    .replace(/[®™©:–—_\-]/g, " ")
    .replace(/[^a-z0-9' ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseXboxNumber(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  if (typeof value === "number") {
    return Number.isFinite(value)
      ? value
      : null;
  }

  const normalized = String(value)
    .replace(/,/g, "")
    .replace(/[^\d.-]/g, "");

  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized);

  return Number.isFinite(parsed)
    ? parsed
    : null;
}

function roundXboxMoney(value) {
  if (!Number.isFinite(value)) {
    return null;
  }

  return Math.round(
    (value + Number.EPSILON) * 100
  ) / 100;
}

function formatXboxPrice(
  amount,
  currency = "USD"
) {
  if (!Number.isFinite(amount)) {
    return null;
  }

  if (amount === 0) {
    return "Free";
  }

  try {
    return new Intl.NumberFormat(
      XBOX_CONFIG.language,
      {
        style: "currency",
        currency
      }
    ).format(amount);
  } catch {
    return `${amount} ${currency}`.trim();
  }
}

function calculateXboxDiscountPercent(
  basePrice,
  currentPrice
) {
  if (
    !Number.isFinite(basePrice) ||
    !Number.isFinite(currentPrice) ||
    basePrice <= 0 ||
    currentPrice >= basePrice
  ) {
    return 0;
  }

  return Math.round(
    (
      (basePrice - currentPrice) /
      basePrice
    ) * 100
  );
}

function makeAbsoluteMicrosoftUrl(value) {
  if (!value) {
    return null;
  }

  const text = String(value);

  if (text.startsWith("//")) {
    return `https:${text}`;
  }

  if (text.startsWith("/")) {
    return `https://www.microsoft.com${text}`;
  }

  return text;
}

function calculateXboxTitleScore(
  title,
  searchTerm
) {

  return Math.max(...storeGenerateNumeralVariants(searchTerm).map((variant) => calculateXboxTitleScoreForVariant(title, variant)));
}

function calculateXboxTitleScoreForVariant(
  title,
  searchTerm
) {
  const normalizedTitle =
    normalizeXboxText(title);

  const normalizedSearch =
    normalizeXboxText(searchTerm);

  if (
    !normalizedTitle ||
    !normalizedSearch
  ) {
    return 0;
  }

  let score;

  if (normalizedTitle === normalizedSearch) {
    score = 1000;
  } else {
    const editionWords = [
      "standard edition",
      "premium edition",
      "deluxe edition",
      "ultimate edition",
      "complete edition",
      "game of the year edition"
    ];

    let editionMatch = null;

    for (const editionWord of editionWords) {
      if (
        normalizedTitle ===
        `${normalizedSearch} ${editionWord}`
      ) {
        editionMatch = 850;
        break;
      }
    }

    if (editionMatch !== null) {
      score = editionMatch;
    } else if (
      normalizedTitle.startsWith(
        normalizedSearch
      )
    ) {
      score = 800;
    } else if (
      normalizedTitle.includes(
        normalizedSearch
      )
    ) {
      score = 600;
    } else {
      const searchWords = normalizedSearch
        .split(" ")
        .filter(word => word.length > 1);

      if (searchWords.length === 0) {
        return 0;
      }

      const matchedWords =
        searchWords.filter(word =>
          normalizedTitle.includes(word)
        );

      const coverage =
        matchedWords.length /
        searchWords.length;

      score = Math.round(
        matchedWords.length * 10 +
        coverage * 100
      );
    }
  }

  const isJunk = STORE_JUNK_TITLE_PATTERNS.some(pattern => pattern.test(normalizedTitle));
  const queryAskedForJunk = STORE_JUNK_TITLE_PATTERNS.some(pattern => pattern.test(normalizedSearch));

  if (isJunk && !queryAskedForJunk) {
    score -= 500;
  }

  return score;
}

function uniqueXboxStrings(values) {
  return [
    ...new Set(
      values
        .map(value =>
          String(value || "").trim()
        )
        .filter(Boolean)
    )
  ];
}

function sortXboxGamePassTiers(tiers) {
  const uniqueTiers = uniqueXboxStrings(tiers);
  return uniqueTiers.sort((a, b) => {
    const aIndex = XBOX_GAME_PASS_TIER_ORDER.indexOf(a);
    const bIndex = XBOX_GAME_PASS_TIER_ORDER.indexOf(b);

    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
}

function expandXboxGamePassTiers(tiers) {
  const expanded = [];

  for (const tier of tiers) {
    const inherited =
      XBOX_GAME_PASS_TIER_INHERITANCE[tier];

    if (Array.isArray(inherited)) {
      expanded.push(...inherited);
    } else if (tier) {
      expanded.push(tier);
    }
  }

  return sortXboxGamePassTiers(expanded);
}

function getXboxMetaValue(
  suggestion,
  key
) {
  const metas =
    Array.isArray(suggestion?.Metas)
      ? suggestion.Metas
      : [];

  const normalizedKey =
    String(key || "").toLowerCase();

  const meta = metas.find(item => {
    return (
      String(item?.Key || "")
        .toLowerCase() ===
      normalizedKey
    );
  });

  return meta?.Value ?? null;
}

function isExcludedXboxTitle(title) {
  const normalized =
    normalizeXboxText(title);

  const excludedPatterns = [
    /\bpremium upgrade\b/,
    /\bupgrade\b/,
    /\bseason pass\b/,
    /\bexpansion pass\b/,
    /\bexpansion\b/,
    /\badd on\b/,
    /\baddon\b/,
    /\bdlc\b/,
    /\bcurrency\b/,
    /\bcredits\b/,
    /\bcoins\b/,
    /\bpoints\b/,
    /\bvip\b/,
    /\bcar pass\b/,
    /\bcharacter pack\b/,
    /\bskin pack\b/,
    /\bcostume pack\b/,
    /\bmusic pack\b/,
    /\bstarter pack\b/,
    /\bpre order bonus\b/,
    /\bpreorder bonus\b/,
    /\bsoundtrack\b/,
    /\bdemo\b/,
    /\btrial\b/
  ];

  return excludedPatterns.some(pattern =>
    pattern.test(normalized)
  );
}

function isValidXboxGameSuggestion(
  suggestion
) {
  const productId =
    getXboxMetaValue(
      suggestion,
      "BigCatalogId"
    );

  const source = String(
    suggestion?.Source || ""
  ).toLowerCase();

  const productType = String(
    getXboxMetaValue(
      suggestion,
      "ProductType"
    ) || ""
  ).toLowerCase();

  if (!productId) {
    return false;
  }

  if (source !== "game") {
    return false;
  }

  if (
    productType &&
    productType !== "game"
  ) {
    return false;
  }

  if (
    isExcludedXboxTitle(
      suggestion?.Title
    )
  ) {
    return false;
  }

  return true;
}

const XBOX_IGNORED_METADATA_KEYS =
  new Set([
    "description",
    "productdescription",
    "shortdescription",
    "developerdescription",
    "features",
    "feature",
    "whatsnew",
    "legaltext",
    "copyright",
    "supporturi",
    "privacyuri",
    "websiteurl"
  ]);

function collectXboxMetadataEntries(
  value,
  path = "",
  output = [],
  visited = new WeakSet()
) {
  if (
    value === null ||
    value === undefined
  ) {
    return output;
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    output.push({
      path,
      value: String(value)
    });

    return output;
  }

  if (typeof value !== "object") {
    return output;
  }

  if (visited.has(value)) {
    return output;
  }

  visited.add(value);

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      collectXboxMetadataEntries(
        item,
        `${path}[${index}]`,
        output,
        visited
      );
    });

    return output;
  }

  for (
    const [key, item]
    of Object.entries(value)
  ) {
    const normalizedKey =
      String(key).toLowerCase();

    if (
      XBOX_IGNORED_METADATA_KEYS.has(
        normalizedKey
      )
    ) {
      continue;
    }

    const nextPath = path
      ? `${path}.${key}`
      : key;

    collectXboxMetadataEntries(
      item,
      nextPath,
      output,
      visited
    );
  }

  return output;
}

function getXboxMetadataText(value) {
  return collectXboxMetadataEntries(value)
    .map(entry => entry.value)
    .filter(Boolean)
    .join(" ");
}

function extractXboxCatalogProductIds(value, productId) {
  const ids = new Set();
  const normalizedProductId = productId ? String(productId).toUpperCase() : null;

  if (value && value.LicensingData && Array.isArray(value.LicensingData.SatisfyingEntitlementKeys)) {
    for (const sat of value.LicensingData.SatisfyingEntitlementKeys) {
      const keys = Array.isArray(sat?.EntitlementKeys) ? sat.EntitlementKeys : [];
      const keysUpper = keys.join(' ').toUpperCase();

      if (normalizedProductId && !keysUpper.includes(normalizedProductId)) {
        continue;
      }
      for (const k of keys) {
        const m = String(k).toUpperCase().match(/\bCFQ[A-Z0-9]{9}\b/);
        if (m) ids.add(m[0]);
      }
    }

  }

  const entries =
    collectXboxMetadataEntries(value);

  for (const entry of entries) {
    const path = String(entry?.path || "");
    const text = String(entry?.value || "");

    if (normalizedProductId && path.toUpperCase().includes('LICENSINGDATA') && value && value.LicensingData) {
      continue;
    }
    const combined = `${path} ${text}`.toUpperCase();
    const matches = combined.match(/\bCFQ[A-Z0-9]{9}\b/g) || [];
    for (const match of matches) {
      ids.add(match.toUpperCase());
    }
    const normalizedValue = text.trim().toUpperCase();
    if (/^CFQ[A-Z0-9]{9}$/.test(normalizedValue)) {
      ids.add(normalizedValue);
    }
  }

  return [...ids];
}

function getXboxKnownSubscriptionProducts(productIds) {
  const products = [];
  const normalizedIds = productIds
    .map(id => String(id || "").trim().toUpperCase())
    .filter(Boolean);

  const hasNewPremium = normalizedIds.includes("CFQ7TTC0P85B");

  for (const productId of productIds) {
    const normalizedId = String(productId || "").trim().toUpperCase();

    if (normalizedId === "CFQ7TTC0K6L8" && hasNewPremium) {
      continue;
    }

    const subscription = XBOX_SUBSCRIPTION_PRODUCTS[normalizedId];
    if (subscription) {
      products.push(subscription);
    }
  }

  return products;
}
function getXboxSubscriptionTiersFromIds(productIds) {
  const subscriptions = getXboxKnownSubscriptionProducts(productIds);
  const tiers = subscriptions.flatMap(subscription => subscription.eligibleTiers || []);
  return sortXboxGamePassTiers(tiers);
}

function getXboxPrimarySubscriptionTiersFromIds(productIds) {
  const subscriptions = getXboxKnownSubscriptionProducts(productIds);
  const tiers = subscriptions
    .filter(subscription => !subscription.hideFromDisplay)
    .map(subscription => subscription.normalizedName);
  return sortXboxGamePassTiers(tiers);
}

function detectXboxGamePassDirectTiers(text) {
  const normalized =
    normalizeXboxText(text);

  const directTiers = [];

  if (
    normalized.includes(
      "game pass essential"
    ) ||
    normalized.includes(
      "gamepass essential"
    )
  ) {
    directTiers.push(
      "Game Pass Essential"
    );
  }

  if (
    normalized.includes(
      "game pass ultimate"
    ) ||
    normalized.includes(
      "gamepass ultimate"
    )
  ) {
    directTiers.push(
      "Game Pass Ultimate"
    );
  }

  if (
    normalized.includes("pc game pass") ||
    normalized.includes("game pass pc")
  ) {
    directTiers.push("PC Game Pass");
  }

  if (
    normalized.includes(
      "game pass premium"
    )
  ) {
    directTiers.push(
      "Game Pass Premium"
    );
  }

  if (
    normalized.includes(
      "game pass for console"
    )
  ) {
    directTiers.push(
      "Game Pass Premium"
    );
  }

  if (
    normalized.includes(
      "game pass standard"
    )
  ) {
    directTiers.push(
      "Game Pass Standard"
    );
  }

  if (
    normalized.includes(
      "game pass core"
    )
  ) {
    directTiers.push(
      "Game Pass Core"
    );
  }

  return sortXboxGamePassTiers(
    directTiers
  );
}

function detectXboxGamePassTier(text) {
  return expandXboxGamePassTiers(
    detectXboxGamePassDirectTiers(text)
  );
}

function analyzeXboxMembershipText(text) {
  const normalized =
    normalizeXboxText(text);

  const hasGamePassText =
    normalized.includes("game pass") ||
    normalized.includes("gamepass");

  const hasMembershipText =
    normalized.includes("membership") ||
    normalized.includes("member price") ||
    normalized.includes(
      "with your membership"
    ) ||
    normalized.includes(
      "with game pass"
    ) ||
    normalized.includes(
      "subscription"
    );

  const hasTrialText =
    /\btrial\b/.test(normalized) ||
    normalized.includes(
      "free play days"
    );

  const hasRentalText =
    /\brental\b/.test(normalized) ||
    /\brent\b/.test(normalized);

  const hasOnlineOnlyText =
    normalized.includes(
      "online console multiplayer requires"
    ) ||
    normalized.includes(
      "online multiplayer requires"
    ) ||
    normalized.includes(
      "console multiplayer requires"
    );

  return {
    hasGamePassText,
    hasMembershipText,
    hasTrialText,
    hasRentalText,
    hasOnlineOnlyText,
    gamePassTiers:
      detectXboxGamePassTier(text),

    primaryGamePassTiers:
      detectXboxGamePassDirectTiers(text)
  };
}

function getXboxLocalizedProperties(product) {
  const localizedProperties =
    product?.LocalizedProperties;

  if (
    !Array.isArray(
      localizedProperties
    )
  ) {
    return {};
  }

  return localizedProperties[0] || {};
}

function getXboxProductTitle(product) {
  const localized =
    getXboxLocalizedProperties(product);

  return (
    localized?.ProductTitle ||
    localized?.ShortTitle ||
    product?.ProductTitle ||
    product?.Title ||
    null
  );
}

function getXboxProductImage(product) {
  const localized =
    getXboxLocalizedProperties(product);

  const images =
    Array.isArray(localized?.Images)
      ? localized.Images
      : [];

  const preferredPurposes = [
    "Poster",
    "BoxArt",
    "BrandedKeyArt",
    "SuperHeroArt",
    "ImageGallery"
  ];

  for (
    const purpose
    of preferredPurposes
  ) {
    const image = images.find(item => {
      const imagePurpose = String(
        item?.ImagePurpose ||
        item?.Purpose ||
        ""
      ).toLowerCase();

      return (
        imagePurpose ===
          purpose.toLowerCase() &&
        item?.Uri
      );
    });

    if (image?.Uri) {
      return makeAbsoluteMicrosoftUrl(
        image.Uri
      );
    }
  }

  const firstImage =
    images.find(item =>
      Boolean(item?.Uri)
    );

  return firstImage?.Uri
    ? makeAbsoluteMicrosoftUrl(
        firstImage.Uri
      )
    : null;
}

function detectXboxPlatforms(product) {
  const platforms = new Set();

  const metadataEntries =
    collectXboxMetadataEntries(product);

  for (const entry of metadataEntries) {
    const path =
      normalizeXboxText(entry.path);

    const value =
      normalizeXboxText(entry.value);

    const combined =
      `${path} ${value}`;

    if (
      combined.includes(
        "xbox scarlett"
      ) ||
      combined.includes(
        "consolegen9"
      ) ||
      combined.includes(
        "console gen 9"
      ) ||
      combined.includes(
        "xbox series x"
      ) ||
      combined.includes(
        "xbox series s"
      ) ||
      combined.includes(
        "xbox series"
      )
    ) {
      platforms.add(
        "Xbox Series X|S"
      );
    }

    if (
      combined.includes(
        "xbox one"
      ) ||
      combined.includes(
        "consolegen8"
      ) ||
      combined.includes(
        "console gen 8"
      ) ||
      combined.includes(
        "xbox durango"
      )
    ) {
      platforms.add("Xbox One");
    }

    if (
      combined.includes(
        "windows desktop"
      ) ||
      combined.includes(
        "windows universal"
      ) ||
      combined.includes(
        "pcgame"
      ) ||
      combined.includes(
        "pc game"
      ) ||
      combined.includes(
        "windows 10"
      ) ||
      combined.includes(
        "windows 11"
      )
    ) {
      platforms.add("PC");
    }

    if (
      combined.includes("xcloud") ||
      combined.includes(
        "cloud gaming"
      ) ||
      combined.includes(
        "cloudgaming"
      )
    ) {
      platforms.add("Cloud");
    }
  }

  return [...platforms];
}

function getXboxActionText(availability) {
  const actions =
    availability?.Actions;

  if (!actions) {
    return "";
  }

  return getXboxMetadataText(actions);
}

function getXboxAvailabilityPrice(
  availability
) {
  const orderData =
    availability?.OrderManagementData ||
    {};

  const price =
    orderData?.Price || {};

  const basePrice =
    parseXboxNumber(price?.MSRP) ??
    parseXboxNumber(
      price?.BasePrice
    ) ??
    parseXboxNumber(
      price?.RetailPrice
    ) ??
    parseXboxNumber(
      price?.ListPrice
    );

  const currentPrice =
    parseXboxNumber(price?.Price) ??
    parseXboxNumber(
      price?.ListPrice
    ) ??
    basePrice;

  const currency =
    price?.CurrencyCode ||
    orderData?.CurrencyCode ||
    "USD";

  return {
    basePrice:
      roundXboxMoney(basePrice),

    currentPrice:
      roundXboxMoney(currentPrice),

    currency
  };
}

function getXboxOfferRequirementMetadata(
  availability
) {
  return {
    RemediationRequired:
      availability?.RemediationRequired,

    Remediations:
      availability?.Remediations,

    Conditions:
      availability?.Conditions,

    Properties:
      availability?.Properties,

    Actions:
      availability?.Actions,

    LicensingData:
      availability?.LicensingData,

    PIFilter:
      availability
        ?.OrderManagementData
        ?.PIFilter
  };
}

function classifyXboxOffer({
  displaySku,
  sku,
  availability,
  skuIndex,
  availabilityIndex,
  productId
}) {
  const {
    basePrice,
    currentPrice,
    currency
  } = getXboxAvailabilityPrice(
    availability
  );

  const skuId =
    sku?.SkuId ||
    displaySku?.SkuId ||
    null;

  const availabilityId =
    availability?.AvailabilityId ||
    null;

  const skuTitle =
    sku?.LocalizedProperties?.[0]
      ?.SkuTitle ||
    sku?.LocalizedProperties?.[0]
      ?.SkuDescription ||
    sku?.Title ||
    null;

  const requirementMetadata =
    getXboxOfferRequirementMetadata(
      availability
    );

  const requirementProductIds =
    extractXboxCatalogProductIds(
      requirementMetadata,
      productId
    );

  const knownSubscriptionProducts =
    getXboxKnownSubscriptionProducts(
      requirementProductIds
    );

  const knownSubscriptionProductIds =
    knownSubscriptionProducts.map(
      subscription =>
        subscription.productId
    );

  const idBasedGamePassTiers =
    getXboxSubscriptionTiersFromIds(
      requirementProductIds
    );

  const idBasedPrimaryGamePassTiers =
    getXboxPrimarySubscriptionTiersFromIds(
      requirementProductIds
    );

  const offerMetadata = {
    sku: {
      SkuId:
        sku?.SkuId,

      SkuTitle:
        skuTitle,

      SkuASchema:
        sku?.SkuASchema,

      SkuBSchema:
        sku?.SkuBSchema,

      SkuType:
        sku?.SkuType,

      Properties:
        sku?.Properties,

      RecurrencePolicy:
        sku?.RecurrencePolicy
    },

    availability: {
      AvailabilityId:
        availability?.AvailabilityId,

      AvailabilityASchema:
        availability
          ?.AvailabilityASchema,

      AvailabilityBSchema:
        availability
          ?.AvailabilityBSchema,

      Actions:
        availability?.Actions,

      Properties:
        availability?.Properties,

      Conditions:
        availability?.Conditions,

      RemediationRequired:
        availability
          ?.RemediationRequired,

      Remediations:
        availability?.Remediations,

      LicensingData:
        availability?.LicensingData,

      OrderManagementData: {
        GrantedEntitlementKeys:
          availability
            ?.OrderManagementData
            ?.GrantedEntitlementKeys,

        PIFilter:
          availability
            ?.OrderManagementData
            ?.PIFilter,

        Price:
          availability
            ?.OrderManagementData
            ?.Price
      }
    }
  };

  const offerText =
    getXboxMetadataText(
      offerMetadata
    );

  const requirementText =
    getXboxMetadataText(
      requirementMetadata
    );

  const actionText =
    getXboxActionText(
      availability
    );

  const normalizedActionText =
    normalizeXboxText(actionText);

  const membership =
    analyzeXboxMembershipText(
      `${skuTitle || ""} ${requirementText}`
    );

  const textBasedGamePassTiers =
    membership.gamePassTiers;

  const gamePassTiers =
    sortXboxGamePassTiers([
      ...idBasedGamePassTiers,
      ...textBasedGamePassTiers
    ]);

  const primaryGamePassTiers =
    sortXboxGamePassTiers([
      ...idBasedPrimaryGamePassTiers,
      ...membership.primaryGamePassTiers
    ]);

  const hasKnownSubscriptionRequirement =
    knownSubscriptionProducts.length > 0;

  const hasSubscriptionEvidence =
    hasKnownSubscriptionRequirement ||
    membership.hasGamePassText ||
    membership.hasMembershipText;

  const isOnlineOnlyRequirement =
    membership.hasOnlineOnlyText &&
    !hasKnownSubscriptionRequirement;

  const hasPurchaseAction =
    normalizedActionText.includes(
      "purchase"
    ) ||
    normalizedActionText.includes(
      "buy"
    ) ||
    normalizedActionText.includes(
      "preorder"
    ) ||
    normalizedActionText.includes(
      "pre order"
    );

  const hasInstallAction =
    normalizedActionText.includes(
      "install"
    );

  const hasPositivePrice =
    Number.isFinite(currentPrice) &&
    currentPrice > 0;

  const hasZeroPrice =
    currentPrice === 0;

  const hasKnownRequirement =
    requirementProductIds.length > 0;

  const isTrialOffer =
    membership.hasTrialText;

  const isRentalOffer =
    membership.hasRentalText;

  const skuFeatures = Array.isArray(sku?.LocalizedProperties?.[0]?.Features) ? sku.LocalizedProperties[0].Features : [];
  const isFreeToPlayFeature = skuFeatures.some(f => /free\s*to\s*play/i.test(String(f)));
  const isPreOrderSku = sku?.Properties?.IsPreOrder === true || sku?.Properties?.IsPreOrder === true;
  const origDateStr = availability?.Properties?.OriginalReleaseDate || sku?.Properties?.OriginalReleaseDate || displaySku?.Sku?.Properties?.OriginalReleaseDate || null;
  let isFutureRelease = false;
  try {
    if (origDateStr) {
      const d = new Date(origDateStr);
      if (!isNaN(d.getTime())) {

        isFutureRelease = d.getTime() > (Date.now() + 24*60*60*1000);
      }
    }
  } catch(_) {}

  const firstAvail = sku?.MarketProperties?.[0]?.FirstAvailableDate || null;
  let isFirstAvailFuture = false;
  try {
    if (firstAvail) {
      const d2 = new Date(firstAvail);
      if (!isNaN(d2.getTime())) {
        isFirstAvailFuture = d2.getTime() > (Date.now() + 24*60*60*1000);
      }
    }
  } catch(_) {}
  const isUnreleasedWithoutFree = (isPreOrderSku || isFutureRelease || isFirstAvailFuture) && !isFreeToPlayFeature;

  const isSubscriptionOffer =
    hasSubscriptionEvidence &&
    !isOnlineOnlyRequirement &&
    !isTrialOffer &&
    !isRentalOffer;

  const isGamePassOffer =
    isSubscriptionOffer &&
    gamePassTiers.length > 0;

  const isGamePassAccessOffer =
    isGamePassOffer &&
    hasZeroPrice;

  const isGamePassMemberPriceOffer =
    isGamePassOffer &&
    hasPositivePrice;

  const isUnidentifiedConditionalFreeOffer =
    (hasZeroPrice && hasKnownRequirement && !hasKnownSubscriptionRequirement) || (hasZeroPrice && isUnreleasedWithoutFree);

  const isPublicPurchaseOffer =
    !isSubscriptionOffer &&
    !isTrialOffer &&
    !isRentalOffer &&
    !hasKnownSubscriptionRequirement &&
    !isUnidentifiedConditionalFreeOffer &&
    !isUnreleasedWithoutFree &&
    (
      hasPurchaseAction ||
      (Number.isFinite(currentPrice) && currentPrice > 0) ||
      (hasZeroPrice && isFreeToPlayFeature)
    );

  const discountPercent =
    calculateXboxDiscountPercent(
      basePrice,
      currentPrice
    );

  let offerType = "unknown";

  if (isTrialOffer) {
    offerType = "trial";
  } else if (isRentalOffer) {
    offerType = "rental";
  } else if (
    isGamePassAccessOffer
  ) {
    offerType =
      "game-pass-access";
  } else if (
    isGamePassMemberPriceOffer
  ) {
    offerType =
      "game-pass-member-price";
  } else if (
    isSubscriptionOffer &&
    hasZeroPrice
  ) {
    offerType =
      "subscription-access";
  } else if (
    isSubscriptionOffer &&
    hasPositivePrice
  ) {
    offerType =
      "member-price";
  } else if (
    isPublicPurchaseOffer &&
    hasPositivePrice
  ) {
    offerType =
      "public-purchase";
  } else if (
    isPublicPurchaseOffer &&
    hasZeroPrice
  ) {
    offerType =
      "public-free";
  } else if (
    hasInstallAction &&
    hasZeroPrice &&
    !hasKnownRequirement
  ) {
    offerType =
      "install-entitlement";
  } else if (
    hasKnownRequirement
  ) {
    offerType =
      "conditional-offer";
  }

  return {
    skuIndex,
    availabilityIndex,

    skuId,
    availabilityId,
    skuTitle,

    basePrice,
    currentPrice,
    currency,

    formattedBasePrice:
      formatXboxPrice(
        basePrice,
        currency
      ),

    formattedPrice:
      formatXboxPrice(
        currentPrice,
        currency
      ),

    discountPercent,

    discountText:
      discountPercent > 0
        ? `-${discountPercent}%`
        : null,

    isDiscounted:
      discountPercent > 0,

    hasPurchaseAction,
    hasInstallAction,
    hasPositivePrice,
    hasZeroPrice,

    hasKnownRequirement,
    hasKnownSubscriptionRequirement,
    hasSubscriptionEvidence,
    isOnlineOnlyRequirement,

    isPublicPurchaseOffer,
    isSubscriptionOffer,
    isGamePassOffer,
    isGamePassAccessOffer,
    isGamePassMemberPriceOffer,
    isTrialOffer,
    isRentalOffer,
    isUnreleasedWithoutFree,
    isFreeToPlayFeature,

    requirementProductIds,
    knownSubscriptionProductIds,

    knownSubscriptionNames:
      knownSubscriptionProducts.map(
        subscription =>
          subscription.normalizedName
      ),

    gamePassTiers,
    primaryGamePassTiers,

    offerType,
    offerText,
    requirementText,

    rawSku: sku,
    rawAvailability: availability
  };
}

function collectXboxOffers(product) {
  const offers = [];
  const productId = product?.ProductId || product?.BigId || null;
  const displaySkuAvailabilities =
    Array.isArray(
      product?.DisplaySkuAvailabilities
    )
      ? product.DisplaySkuAvailabilities
      : [];

  displaySkuAvailabilities.forEach(
    (displaySku, skuIndex) => {
      const sku =
        displaySku?.Sku || {};

      const availabilityItems =
        Array.isArray(
          displaySku?.Availabilities
        )
          ? displaySku.Availabilities
          : [];

      availabilityItems.forEach(
        (
          availabilityItem,
          availabilityIndex
        ) => {
          const availability =
            availabilityItem
              ?.Availability ||
            availabilityItem ||
            {};

          offers.push(
            classifyXboxOffer({
              displaySku,
              sku,
              availability,
              skuIndex,
              availabilityIndex,
              productId
            })
          );
        }
      );
    }
  );

  return offers;
}

function chooseXboxPublicPurchaseOffer(
  offers
) {
  const candidates =
    offers.filter(offer => {
      return (
        offer.isPublicPurchaseOffer &&
        !offer.isUnreleasedWithoutFree &&
        Number.isFinite(
          offer.currentPrice
        ) &&
        offer.currentPrice >= 0
      );
    });

  candidates.sort((a, b) => {

    if (
      a.hasPurchaseAction !==
      b.hasPurchaseAction
    ) {
      return a.hasPurchaseAction
        ? -1
        : 1;
    }

    if (
      a.isDiscounted !==
      b.isDiscounted
    ) {
      return a.isDiscounted
        ? -1
        : 1;
    }

    if (
      a.hasPositivePrice !==
      b.hasPositivePrice
    ) {
      return a.hasPositivePrice
        ? -1
        : 1;
    }

    return (
      a.currentPrice -
      b.currentPrice
    );
  });

  return candidates[0] || null;
}

function chooseXboxGamePassOffer(
  offers
) {
  const candidates =
    offers.filter(offer => {
      return (
        offer.isGamePassAccessOffer &&
        offer.hasZeroPrice
      );
    });

  candidates.sort((a, b) => {
    const aTierCount =
      a.gamePassTiers.length;

    const bTierCount =
      b.gamePassTiers.length;

    if (aTierCount !== bTierCount) {
      return bTierCount - aTierCount;
    }

    return (
      a.availabilityIndex -
      b.availabilityIndex
    );
  });

  return candidates[0] || null;
}

function chooseXboxMemberPriceOffer(
  offers,
  publicOffer
) {
  const candidates =
    offers.filter(offer => {
      return (
        offer
          .isGamePassMemberPriceOffer &&
        Number.isFinite(
          offer.currentPrice
        ) &&
        offer.currentPrice > 0
      );
    });

  const validCandidates =
    candidates.filter(offer => {
      if (
        !publicOffer ||
        !Number.isFinite(
          publicOffer.currentPrice
        )
      ) {
        return true;
      }

      return (
        offer.currentPrice <
        publicOffer.currentPrice
      );
    });

  validCandidates.sort((a, b) => {
    if (
      a.currentPrice !==
      b.currentPrice
    ) {
      return (
        a.currentPrice -
        b.currentPrice
      );
    }

    return (
      b.gamePassTiers.length -
      a.gamePassTiers.length
    );
  });

  return validCandidates[0] || null;
}

async function searchMicrosoftStoreSuggestions(
  gameName
) {
  const url = new URL(
    "https://www.microsoft.com/msstoreapiprod/api/autosuggest"
  );

  url.searchParams.set(
    "market",
    XBOX_CONFIG.storeLocale
  );

  url.searchParams.set(
    "clientId",
    XBOX_CONFIG.clientId
  );

  url.searchParams.set(
    "sources",
    "xSearch-Products,Microsoft-Terms"
  );

  url.searchParams.set(
    "counts",
    `${XBOX_CONFIG.maxSearchResults},5`
  );

  url.searchParams.set(
    "query",
    gameName
  );

  const response = await fetch(
    url.href,
    {
      method: "GET",
      headers: {
        Accept: "application/json"
      },
      credentials: "omit",
      cache: "default"
    }
  );

  const responseText =
    await response.text();

  if (!response.ok) {
    throw new Error(
      `Xbox search failed with HTTP ${response.status}: ` +
      responseText.slice(0, 2000)
    );
  }

  let data;

  try {
    data = JSON.parse(responseText);
  } catch {
    throw new Error(
      "Xbox search returned invalid JSON: " +
      responseText.slice(0, 2000)
    );
  }

  const resultSets =
    Array.isArray(data?.ResultSets)
      ? data.ResultSets
      : [];

  const productResultSet =
    resultSets.find(resultSet => {
      return (
        String(resultSet?.Type || "")
          .toLowerCase() ===
        "product"
      );
    });

  const rawSuggestions =
    Array.isArray(
      productResultSet?.Suggests
    )
      ? productResultSet.Suggests
      : [];

  const suggestions =
    rawSuggestions.map(suggestion => {
      const productId =
        getXboxMetaValue(
          suggestion,
          "BigCatalogId"
        );

      const valid =
        isValidXboxGameSuggestion(
          suggestion
        );

      return {
        title:
          suggestion?.Title || null,

        productId,

        source:
          suggestion?.Source || null,

        productType:
          getXboxMetaValue(
            suggestion,
            "ProductType"
          ),

        publisher:
          getXboxMetaValue(
            suggestion,
            "PublisherName"
          ),

        image:
          makeAbsoluteMicrosoftUrl(
            getXboxMetaValue(
              suggestion,
              "Icon"
            )
          ) ||
          makeAbsoluteMicrosoftUrl(
            suggestion?.ImageUrl
          ),

        url:
          makeAbsoluteMicrosoftUrl(
            suggestion?.Url
          ),

        titleScore:
          calculateXboxTitleScore(
            suggestion?.Title,
            gameName
          ),

        valid,
        excluded: !valid,
        raw: suggestion
      };
    });

  const validSuggestions =
    suggestions
      .filter(item => item.valid)
      .sort(
        (a, b) =>
          b.titleScore -
          a.titleScore
      );

  return {
    query: gameName,
    suggestions,
    validSuggestions,
    raw: data
  };
}

async function getXboxCatalogProducts(
  productIds
) {
  const uniqueProductIds = [
    ...new Set(
      productIds
        .map(value =>
          String(value || "")
            .trim()
            .toUpperCase()
        )
        .filter(Boolean)
    )
  ];

  if (
    uniqueProductIds.length === 0
  ) {
    return [];
  }

  const url = new URL(
    "https://displaycatalog.mp.microsoft.com/v7.0/products"
  );

  url.searchParams.set(
    "bigIds",
    uniqueProductIds.join(",")
  );

  url.searchParams.set(
    "market",
    XBOX_CONFIG.region
  );

  url.searchParams.set(
    "languages",
    XBOX_CONFIG.language
  );

  url.searchParams.set(
    "MS-CV",
    `XboxStoreSearch.${Date.now()}`
  );

  const response = await fetch(
    url.href,
    {
      method: "GET",
      headers: {
        Accept: "application/json"
      },
      credentials: "omit",
      cache: "default"
    }
  );

  const responseText =
    await response.text();

  if (!response.ok) {
    throw new Error(
      `Xbox catalog failed with HTTP ${response.status}: ` +
      responseText.slice(0, 2000)
    );
  }

  let data;

  try {
    data = JSON.parse(responseText);
  } catch {
    throw new Error(
      "Xbox catalog returned invalid JSON: " +
      responseText.slice(0, 2000)
    );
  }

  const products =
    Array.isArray(data?.Products)
      ? data.Products
      : [];

  return products;
}

function formatXboxCatalogProduct(
  product,
  suggestion,
  searchTerm
) {
  const title =
    getXboxProductTitle(product) ||
    suggestion?.title ||
    null;

  const productId =
    product?.ProductId ||
    product?.BigId ||
    suggestion?.productId ||
    null;

  const offers =
    collectXboxOffers(product);

  const publicPurchaseOffer =
    chooseXboxPublicPurchaseOffer(
      offers
    );

  const gamePassAccessOffers =
    offers.filter(offer =>
      offer.isGamePassAccessOffer
    );

  const gamePassOffer =
    chooseXboxGamePassOffer(
      offers
    );

  const memberPriceOffer =
    chooseXboxMemberPriceOffer(
      offers,
      publicPurchaseOffer
    );

  const gamePassTiers =
    sortXboxGamePassTiers(
      gamePassAccessOffers.flatMap(
        offer =>
          Array.isArray(
            offer.gamePassTiers
          )
            ? offer.gamePassTiers
            : []
      )
    );

  const gamePassPrimaryTiers =
    sortXboxGamePassTiers(
      gamePassAccessOffers.flatMap(
        offer =>
          Array.isArray(offer.primaryGamePassTiers) &&
          offer.primaryGamePassTiers.length
            ? offer.primaryGamePassTiers
            : (Array.isArray(offer.gamePassTiers) ? offer.gamePassTiers : [])
      )
    );

  const includedWithGamePass =
    gamePassAccessOffers.some(
      offer =>
        offer.hasZeroPrice &&
        offer.isGamePassAccessOffer
    );

  const memberDiscountOffers =
    offers.filter(offer =>
      offer.isGamePassMemberPriceOffer
    );

  const memberDiscountTiers =
    sortXboxGamePassTiers(
      (
        memberPriceOffer
          ? [memberPriceOffer]
          : memberDiscountOffers
      ).flatMap(offer =>
        Array.isArray(
          offer.gamePassTiers
        )
          ? offer.gamePassTiers
          : []
      )
    );

  const memberDiscountPrimaryTiers =
    sortXboxGamePassTiers(
      (
        memberPriceOffer
          ? [memberPriceOffer]
          : memberDiscountOffers
      ).flatMap(offer =>
        Array.isArray(offer.primaryGamePassTiers) &&
        offer.primaryGamePassTiers.length
          ? offer.primaryGamePassTiers
          : (Array.isArray(offer.gamePassTiers) ? offer.gamePassTiers : [])
      )
    );

  const hasGamePassMemberDiscount =
    Boolean(memberPriceOffer);

  const basePrice =
    publicPurchaseOffer?.basePrice ??
    publicPurchaseOffer
      ?.currentPrice ??
    null;

  const currentPrice =
    publicPurchaseOffer
      ?.currentPrice ??
    null;

  const currency =
    publicPurchaseOffer?.currency ||
    memberPriceOffer?.currency ||
    gamePassOffer?.currency ||
    "USD";

  const discountPercent =
    publicPurchaseOffer
      ?.discountPercent || 0;

  const memberPrice =
    memberPriceOffer
      ?.currentPrice ??
    null;

  let memberDiscountPercent = 0;

  if (
    Number.isFinite(currentPrice) &&
    currentPrice > 0 &&
    Number.isFinite(memberPrice) &&
    memberPrice < currentPrice
  ) {
    memberDiscountPercent =
      Math.round(
        (
          (
            currentPrice -
            memberPrice
          ) /
          currentPrice
        ) * 100
      );
  } else if (
    memberPriceOffer &&
    Number.isFinite(
      memberPriceOffer.basePrice
    ) &&
    memberPriceOffer.basePrice > 0 &&
    Number.isFinite(memberPrice) &&
    memberPrice <
      memberPriceOffer.basePrice
  ) {
    memberDiscountPercent =
      calculateXboxDiscountPercent(
        memberPriceOffer.basePrice,
        memberPrice
      );
  }

  const isPubliclyFree =
    Boolean(
      publicPurchaseOffer &&
      publicPurchaseOffer.offerType ===
        "public-free" &&
      currentPrice === 0 &&
      !publicPurchaseOffer.isUnreleasedWithoutFree
    );

  const subscriptionProductIds =
    uniqueXboxStrings(
      offers.flatMap(offer =>
        offer
          .knownSubscriptionProductIds ||
        []
      )
    );

  const accessSubscriptionProductIds =
    uniqueXboxStrings(
      gamePassAccessOffers.flatMap(
        offer =>
          offer
            .knownSubscriptionProductIds ||
          []
      )
    );

  const memberDiscountSubscriptionProductIds =
    uniqueXboxStrings(
      memberDiscountOffers.flatMap(
        offer =>
          offer
            .knownSubscriptionProductIds ||
          []
      )
    );

  return {
    platform: "Xbox",

    title,
    productId,

    publisher:
      suggestion?.publisher ||
      getXboxLocalizedProperties(
        product
      )?.PublisherName ||
      null,

    platforms:
      detectXboxPlatforms(product),

    titleScore:
      calculateXboxTitleScore(
        title,
        searchTerm
      ),

    isAvailableForPurchase:
      Boolean(publicPurchaseOffer),

    basePrice,
    currentPrice,
    currency,

    formattedBasePrice:
      formatXboxPrice(
        basePrice,
        currency
      ),

    formattedPrice:
      formatXboxPrice(
        currentPrice,
        currency
      ),

    isDiscounted:
      discountPercent > 0,

    discountPercent,

    discountText:
      discountPercent > 0
        ? `-${discountPercent}%`
        : null,

    isFree:
      isPubliclyFree,

    includedWithGamePass,

    hasGamePassOffer:
      includedWithGamePass,

    gamePassTiers,

    gamePassPrimaryTiers,

    gamePassName:
      gamePassTiers.length > 0
        ? gamePassTiers.join(", ")
        : null,

    gamePassOfferType:
      gamePassOffer?.offerType ||
      null,

    hasGamePassMemberDiscount,

    memberDiscountTiers,

    memberDiscountPrimaryTiers,

    memberDiscountName:
      memberDiscountTiers.length > 0
        ? memberDiscountTiers.join(", ")
        : null,

    gamePassMemberPrice:
      memberPrice,

    formattedGamePassMemberPrice:
      formatXboxPrice(
        memberPrice,
        memberPriceOffer?.currency ||
        currency
      ),

    gamePassMemberDiscountPercent:
      memberDiscountPercent,

    gamePassMemberDiscountText:
      memberDiscountPercent > 0
        ? `Save ${memberDiscountPercent}%`
        : null,

    subscriptionProductIds,

    accessSubscriptionProductIds,

    memberDiscountSubscriptionProductIds,

    skuId:
      publicPurchaseOffer?.skuId ||
      gamePassOffer?.skuId ||
      memberPriceOffer?.skuId ||
      null,

    availabilityId:
      publicPurchaseOffer
        ?.availabilityId ||
      gamePassOffer
        ?.availabilityId ||
      memberPriceOffer
        ?.availabilityId ||
      null,

    publicPurchaseSkuId:
      publicPurchaseOffer?.skuId ||
      null,

    publicPurchaseAvailabilityId:
      publicPurchaseOffer
        ?.availabilityId ||
      null,

    gamePassSkuId:
      gamePassOffer?.skuId ||
      null,

    gamePassAvailabilityId:
      gamePassOffer
        ?.availabilityId ||
      null,

    memberPriceSkuId:
      memberPriceOffer?.skuId ||
      null,

    memberPriceAvailabilityId:
      memberPriceOffer
        ?.availabilityId ||
      null,

    image:
      getXboxProductImage(product) ||
      suggestion?.image ||
      null,

    url:
      suggestion?.url ||
      (
        productId
          ? `https://www.microsoft.com/${XBOX_CONFIG.storeLocale}/store/p/${String(productId).toLowerCase()}`
          : null
      ),

    publicPurchaseOffer,
    gamePassOffer,
    gamePassAccessOffers,
    memberPriceOffer,
    memberDiscountOffers,
    offers,

    raw: product,
    searchSuggestion:
      suggestion || null
  };
}

async function searchXbox(gameName, regionCode) {

  const resolvedRegion = resolveStoreRegion(XBOX_REGIONS, regionCode);

  XBOX_CONFIG.region = resolvedRegion;
  XBOX_CONFIG.language = 'en-US';
XBOX_CONFIG.storeLocale = (XBOX_REGIONS[resolvedRegion]?.locale || 'en-US').toLowerCase();

  const searchResult =
    await searchMicrosoftStoreSuggestions(
      gameName
    );

  let validSuggestions =
    searchResult.validSuggestions;
  let loggedSuggestions = searchResult.suggestions;

  if (validSuggestions.length === 0) {
    const variants = storeGenerateNumeralVariants(gameName).filter((v) => v !== gameName);
    for (const variant of variants) {
      const retryResult = await searchMicrosoftStoreSuggestions(variant);
      if (retryResult.validSuggestions.length > 0) {
        log('[Xbox price] numeral-variant retry: "' + gameName + '" -> "' + variant + '" found', retryResult.validSuggestions.length, 'suggestion(s)');
        validSuggestions = retryResult.validSuggestions;
        loggedSuggestions = retryResult.suggestions;
        break;
      }
    }
  }

  log(
    '[Xbox price] search:', gameName, '->',
    loggedSuggestions.length, 'raw suggestion(s):',
    loggedSuggestions.map((s) => `"${s.title || '?'}" [${s.excluded ? 'EXCLUDED' : 'valid'}, score=${s.titleScore}]`)
  );

  if (
    validSuggestions.length === 0
  ) {

    return {
      platform: "Xbox",
      gameName,
      region:
        XBOX_CONFIG.region,
      locale:
        XBOX_CONFIG.language,
      resultCount: 0,
      results: [],
      bestMatch: null,
      bestPurchaseMatch: null,
      searchResult
    };
  }

  const productIds =
    validSuggestions
      .map(item => item.productId)
      .filter(Boolean);

  const catalogProducts =
    await getXboxCatalogProducts(
      productIds
    );

  const suggestionMap =
    new Map(
      validSuggestions.map(item => [
        String(item.productId)
          .toUpperCase(),
        item
      ])
    );

  const results =
    catalogProducts.map(product => {
      const productId = String(
        product?.ProductId ||
        product?.BigId ||
        ""
      ).toUpperCase();

      return formatXboxCatalogProduct(
        product,
        suggestionMap.get(productId) ||
          null,
        gameName
      );
    });

  results.sort((a, b) => {
    if (
      b.titleScore !==
      a.titleScore
    ) {
      return (
        b.titleScore -
        a.titleScore
      );
    }

    if (
      a.isAvailableForPurchase !==
      b.isAvailableForPurchase
    ) {
      return a.isAvailableForPurchase
        ? -1
        : 1;
    }

    if (
      a.includedWithGamePass !==
      b.includedWithGamePass
    ) {
      return a.includedWithGamePass
        ? 1
        : -1;
    }

    const aPrice =
      Number.isFinite(
        a.currentPrice
      )
        ? a.currentPrice
        : Infinity;

    const bPrice =
      Number.isFinite(
        b.currentPrice
      )
        ? b.currentPrice
        : Infinity;

    return aPrice - bPrice;
  });

  log(
    '[Xbox price]', gameName, '-> sorted candidates:',
    results.map((r) => `"${r.title}" score=${r.titleScore} purchasable=${r.isAvailableForPurchase} gamePass=${r.includedWithGamePass} price=${r.formattedPrice || 'none'}`)
  );

  function getXboxBaseTitleForGrouping(title) {
    let base = normalizeXboxText(title);

    base = base.replace(/\b(standard|deluxe|premium|ultimate|complete|definitive|gold|goty|game of the year|day one|launch|deluxe edition|standard edition|premium edition|ultimate edition|complete edition|definitive edition)\b.*$/g, '').trim();
    base = base.replace(/\s+/g, ' ').trim();
    return base;
  }

  const xboxTitleGroups = new Map();
  const xboxBaseTitleGroups = new Map();

  for (const item of results) {
    const key = normalizeXboxText(item.title);
    if (!key) continue;

    if (!xboxTitleGroups.has(key)) {
      xboxTitleGroups.set(key, []);
    }
    xboxTitleGroups.get(key).push(item);

    const baseKey = getXboxBaseTitleForGrouping(item.title);
    if (!baseKey) continue;
    if (!xboxBaseTitleGroups.has(baseKey)) {
      xboxBaseTitleGroups.set(baseKey, []);
    }
    xboxBaseTitleGroups.get(baseKey).push(item);
  }

  for (const group of xboxTitleGroups.values()) {
    if (group.length < 2) continue;

    const unionGamePassTiers =
      sortXboxGamePassTiers(
        uniqueXboxStrings(
          group.flatMap(item => item.gamePassTiers || [])
        )
      );

    const unionGamePassPrimaryTiers =
      sortXboxGamePassTiers(
        uniqueXboxStrings(
          group.flatMap(item =>
            (item.gamePassPrimaryTiers && item.gamePassPrimaryTiers.length)
              ? item.gamePassPrimaryTiers
              : (item.gamePassTiers || [])
          )
        )
      );

    const unionMemberDiscountTiers =
      sortXboxGamePassTiers(
        uniqueXboxStrings(
          group.flatMap(item => item.memberDiscountTiers || [])
        )
      );

    const unionMemberDiscountPrimaryTiers =
      sortXboxGamePassTiers(
        uniqueXboxStrings(
          group.flatMap(item =>
            (item.memberDiscountPrimaryTiers && item.memberDiscountPrimaryTiers.length)
              ? item.memberDiscountPrimaryTiers
              : (item.memberDiscountTiers || [])
          )
        )
      );

    const unionIncludedWithGamePass =
      group.some(item => item.includedWithGamePass);

    const unionHasGamePassMemberDiscount =
      group.some(item => item.hasGamePassMemberDiscount);

    for (const item of group) {
      if (unionGamePassTiers.length) item.gamePassTiers = unionGamePassTiers;
      if (unionGamePassPrimaryTiers.length) item.gamePassPrimaryTiers = unionGamePassPrimaryTiers;
      if (unionMemberDiscountTiers.length) item.memberDiscountTiers = unionMemberDiscountTiers;
      if (unionMemberDiscountPrimaryTiers.length) item.memberDiscountPrimaryTiers = unionMemberDiscountPrimaryTiers;
      item.includedWithGamePass = item.includedWithGamePass || unionIncludedWithGamePass;
      item.hasGamePassMemberDiscount = item.hasGamePassMemberDiscount || unionHasGamePassMemberDiscount;
    }
  }

  for (const group of xboxBaseTitleGroups.values()) {
    if (group.length < 2) continue;

    const unionGamePassTiers =
      sortXboxGamePassTiers(
        uniqueXboxStrings(
          group.flatMap(item => item.gamePassTiers || [])
        )
      );

    const unionGamePassPrimaryTiers =
      sortXboxGamePassTiers(
        uniqueXboxStrings(
          group.flatMap(item =>
            (item.gamePassPrimaryTiers && item.gamePassPrimaryTiers.length)
              ? item.gamePassPrimaryTiers
              : (item.gamePassTiers || [])
          )
        )
      );

    const unionMemberDiscountTiers =
      sortXboxGamePassTiers(
        uniqueXboxStrings(
          group.flatMap(item => item.memberDiscountTiers || [])
        )
      );

    const unionMemberDiscountPrimaryTiers =
      sortXboxGamePassTiers(
        uniqueXboxStrings(
          group.flatMap(item =>
            (item.memberDiscountPrimaryTiers && item.memberDiscountPrimaryTiers.length)
              ? item.memberDiscountPrimaryTiers
              : (item.memberDiscountTiers || [])
          )
        )
      );

    const unionIncludedWithGamePass =
      group.some(item => item.includedWithGamePass);

    const unionHasGamePassMemberDiscount =
      group.some(item => item.hasGamePassMemberDiscount);

    const purchasableInGroup = group
      .filter(item => item.isAvailableForPurchase && Number.isFinite(item.currentPrice) && item.currentPrice > 0)
      .sort((a, b) => a.currentPrice - b.currentPrice);

    const cheapestPurchasable = purchasableInGroup[0] || null;

    for (const item of group) {
      if (unionGamePassTiers.length) item.gamePassTiers = unionGamePassTiers;
      if (unionGamePassPrimaryTiers.length) item.gamePassPrimaryTiers = unionGamePassPrimaryTiers;
      if (unionMemberDiscountTiers.length) item.memberDiscountTiers = unionMemberDiscountTiers;
      if (unionMemberDiscountPrimaryTiers.length) item.memberDiscountPrimaryTiers = unionMemberDiscountPrimaryTiers;
      item.includedWithGamePass = item.includedWithGamePass || unionIncludedWithGamePass;
      item.hasGamePassMemberDiscount = item.hasGamePassMemberDiscount || unionHasGamePassMemberDiscount;

      if (
        cheapestPurchasable &&
        (!Number.isFinite(item.currentPrice) || item.currentPrice === 0) &&
        !item.isAvailableForPurchase
      ) {

        item._fallbackPurchasePrice = cheapestPurchasable.currentPrice;
        item._fallbackPurchaseCurrency = cheapestPurchasable.currency;
        item._fallbackPurchaseFormatted = cheapestPurchasable.formattedPrice;
        item._fallbackPurchaseBase = cheapestPurchasable.basePrice;
      }
    }
  }

  const strongXboxMatches =
    results.filter(item => item.titleScore >= 800);

  const strongBaseGroups = [];
  for (const [baseKey, group] of xboxBaseTitleGroups.entries()) {
    const maxScore = Math.max(...group.map(g => g.titleScore || 0));
    if (maxScore >= 800) {
      strongBaseGroups.push({ baseKey, group, maxScore });
    }
  }
  strongBaseGroups.sort((a, b) => b.maxScore - a.maxScore);

  let bestMatch = null;
  let bestPurchaseMatch = null;

  for (const baseGroup of strongBaseGroups) {

    const isBundleGroup = baseGroup.group.some(item => /\bbundle\b/i.test(item.title));
    if (isBundleGroup && strongBaseGroups.length > 1) {

      const hasNonBundle = strongBaseGroups.some(g => !g.group.some(i => /\bbundle\b/i.test(i.title)));
      if (hasNonBundle) continue;
    }

    const purchasableInGroup = baseGroup.group
      .filter(item => {
        if (!item.isAvailableForPurchase || !Number.isFinite(item.currentPrice)) return false;

        if (/\bbundle\b/i.test(item.title)) return false;
        return true;
      })
      .sort((a, b) => {

        const aPos = a.currentPrice > 0 ? 0 : 1;
        const bPos = b.currentPrice > 0 ? 0 : 1;
        if (aPos !== bPos) return aPos - bPos;
        return a.currentPrice - b.currentPrice;
      });

    const positivePrice = purchasableInGroup.find(item => item.currentPrice > 0);
    if (positivePrice) {
      bestMatch = positivePrice;
      bestPurchaseMatch = positivePrice;
      break;
    }
    if (purchasableInGroup.length) {
      bestMatch = purchasableInGroup[0];
      bestPurchaseMatch = purchasableInGroup[0];
      break;
    }
  }

  if (!bestMatch) {
    const nonBundleStrong = strongXboxMatches.filter(item => !/\bbundle\b/i.test(item.title));
    bestMatch =
      (nonBundleStrong.find(item => item.isAvailableForPurchase) || strongXboxMatches.find(item => item.isAvailableForPurchase)) ||
      (nonBundleStrong.find(item => item.includedWithGamePass) || strongXboxMatches.find(item => item.includedWithGamePass)) ||
      results.find(item => item.titleScore >= 600 && !/\bbundle\b/i.test(item.title)) ||
      results.find(item => item.titleScore >= 600) ||
      results.find(item => !/\bbundle\b/i.test(item.title)) ||
      results[0] ||
      null;
  }

  if (!bestPurchaseMatch) {
    bestPurchaseMatch =
      results.find(item => {
        return (
          item.titleScore >= 600 &&
          item.isAvailableForPurchase &&
          !/\bbundle\b/i.test(item.title) &&
          Number.isFinite(item.currentPrice)
        );
      }) ||
      results.find(item => {
        return (
          item.titleScore >= 600 &&
          item.isAvailableForPurchase &&
          Number.isFinite(item.currentPrice)
        );
      }) ||
      results.find(item => {
        return (
          item.isAvailableForPurchase &&
          !/\bbundle\b/i.test(item.title) &&
          Number.isFinite(item.currentPrice)
        );
      }) ||
      results.find(item => {
        return (
          item.isAvailableForPurchase &&
          Number.isFinite(item.currentPrice)
        );
      }) ||
      null;
  }

  if (bestMatch && !bestMatch.isAvailableForPurchase && bestMatch.includedWithGamePass) {
    const baseKey = getXboxBaseTitleForGrouping(bestMatch.title);
    const baseGroup = xboxBaseTitleGroups.get(baseKey);
    if (baseGroup) {
      const purchasableInBase = baseGroup
        .filter(item => item.isAvailableForPurchase && Number.isFinite(item.currentPrice) && item.currentPrice > 0)
        .sort((a, b) => a.currentPrice - b.currentPrice);
      if (purchasableInBase.length) {
        if (!bestPurchaseMatch) bestPurchaseMatch = purchasableInBase[0];

        bestMatch._fallbackPurchaseFormatted = purchasableInBase[0].formattedPrice;
        bestMatch._fallbackPurchaseBase = purchasableInBase[0].formattedBasePrice;
        bestMatch._fallbackCurrentPrice = purchasableInBase[0].currentPrice;
      }
    }
  }

  if (bestMatch) {
  }

  if (bestPurchaseMatch) {
    log(
      '[Xbox price]', gameName, '-> picked:', `"${bestPurchaseMatch.title}"`,
      bestPurchaseMatch.formattedPrice, `(productId ${bestPurchaseMatch.productId}, titleScore ${bestPurchaseMatch.titleScore}, gamePass=${bestPurchaseMatch.includedWithGamePass})`
    );
  } else if (results.length) {
    logError(
      '[Xbox price]', gameName, '-> NO purchasable match:', results.length,
      'candidate(s) found but none had a usable purchase price. Best title match was',
      bestMatch ? `"${bestMatch.title}" (score ${bestMatch.titleScore}, gamePass=${bestMatch.includedWithGamePass})` : 'none'
    );
  } else {
    logError('[Xbox price]', gameName, '-> NO candidates at all (0 catalog products resolved)');
  }

  return {
    platform: "Xbox",
    gameName,

    region:
      XBOX_CONFIG.region,

    locale:
      XBOX_CONFIG.language,

    resultCount:
      results.length,

    results,
    bestMatch,
    bestPurchaseMatch,
    searchResult,

    rawCatalogProducts:
      catalogProducts
  };
}

async function handleGamesGetStorePrices(gameName, wantsPlayStation, wantsXbox, wantsSteam, ratingOnly) {
  try {

    const settings = await getGamesSettings();

    const [playstationResult, xboxResult, steamAppId] = await Promise.all([
      wantsPlayStation
        ? searchPlayStation(gameName, settings.gamesPlayStationRegion).catch((error) => {
            logError('store-prices: PlayStation search failed ->', error && error.message ? error.message : error);
            return null;
          })
        : null,
      wantsXbox
        ? searchXbox(gameName, settings.gamesXboxRegion).catch((error) => {
            logError('store-prices: Xbox search failed ->', error && error.message ? error.message : error);
            return null;
          })
        : null,
      wantsSteam

        ? searchSteamAppId(gameName, settings.gamesSteamRegion).catch((error) => {
            logError('store-prices: Steam app-id search failed ->', error && error.message ? error.message : error);
            return null;
          })
        : null
    ]);

    let steamData = null;
    if (wantsSteam && steamAppId) {
      const steamUrl = `https://store.steampowered.com/app/${steamAppId}/`;
      const wantsSteamPrice = !ratingOnly && !!settings.gamesFieldSteamPrice;
      const wantsSteamRequirements = !ratingOnly && !!settings.gamesFieldSystemRequirements;
      const wantsSteamTags = !ratingOnly && !!settings.gamesFieldSteamTags;

      const [steamRating, steamPriceAndRequirements] = await Promise.all([
        settings.gamesShowSteamRating
          ? gamesGetSteamRating(steamAppId, steamUrl).catch((error) => {
              logError('store-prices: Steam rating failed ->', error && error.message ? error.message : error);
              return null;
            })
          : Promise.resolve(null),
        (wantsSteamPrice || wantsSteamRequirements || wantsSteamTags)
          ? gamesGetSteamPriceAndRequirements(steamAppId, {
              wantsPrice: wantsSteamPrice,
              wantsRequirements: wantsSteamRequirements,
              wantsTags: wantsSteamTags,
              regionCode: settings.gamesSteamRegion
            }).catch((error) => {
              logError('store-prices: Steam price/requirements failed ->', error && error.message ? error.message : error);
              return { price: null, requirements: null, tags: null, metacriticScore: null };
            })
          : Promise.resolve({ price: null, requirements: null, tags: null, metacriticScore: null })
      ]);

      steamData = {
        appId: steamAppId,
        url: steamUrl,
        rating: steamRating || null,
        price: steamPriceAndRequirements ? steamPriceAndRequirements.price : null,
        requirements: steamPriceAndRequirements ? steamPriceAndRequirements.requirements : null,
        tags: steamPriceAndRequirements ? steamPriceAndRequirements.tags : null,
        metacriticScore: steamPriceAndRequirements ? steamPriceAndRequirements.metacriticScore : null
      };
    }

    let mergedXbox = null;
    if (xboxResult) {
      const purchase = xboxResult.bestPurchaseMatch || null;
      const match = xboxResult.bestMatch || null;
      const candidate = purchase || match || null;

      let unionTiers = [];
      let unionPrimary = [];
      let unionIncluded = false;
      let unionHasDiscount = false;
      try {
        const baseKey = typeof getXboxBaseTitleForGrouping === 'function' ? getXboxBaseTitleForGrouping(candidate ? candidate.title : '') : null;
        if (baseKey && xboxResult.results && xboxResult.results.length) {
          const baseGroup = xboxResult.results.filter(r => {
            try { return typeof getXboxBaseTitleForGrouping === 'function' ? getXboxBaseTitleForGrouping(r.title) === baseKey : false; } catch(_) { return false; }
          });
          if (baseGroup.length) {
            const allTiers = baseGroup.flatMap(r => r.gamePassTiers || []);
            const allPrimary = baseGroup.flatMap(r => r.gamePassPrimaryTiers || r.gamePassTiers || []);
            unionTiers = [...new Set(allTiers)];
            unionPrimary = [...new Set(allPrimary)];
            unionIncluded = baseGroup.some(r => r.includedWithGamePass);
            unionHasDiscount = baseGroup.some(r => r.hasGamePassMemberDiscount);
          }
        }
      } catch(_) {}

      if (purchase && match && purchase.productId !== match.productId) {
        mergedXbox = {
          ...purchase,
          gamePassTiers: unionTiers.length ? unionTiers : (match.gamePassTiers || purchase.gamePassTiers || []),
          gamePassPrimaryTiers: unionPrimary.length ? unionPrimary : (match.gamePassPrimaryTiers || purchase.gamePassPrimaryTiers || []),
          includedWithGamePass: !!(match.includedWithGamePass || purchase.includedWithGamePass || unionTiers.length || unionIncluded),
          hasGamePassMemberDiscount: !!(match.hasGamePassMemberDiscount || purchase.hasGamePassMemberDiscount || unionHasDiscount),
          memberDiscountTiers: match.memberDiscountTiers || purchase.memberDiscountTiers,
          memberDiscountPrimaryTiers: match.memberDiscountPrimaryTiers || purchase.memberDiscountPrimaryTiers,
          url: purchase.url || match.url || null
        };
      } else {
        mergedXbox = (xboxResult.bestPurchaseMatch || xboxResult.bestMatch) || null;
        if (mergedXbox) {

          if (unionTiers.length || unionIncluded) {
            mergedXbox = {
              ...mergedXbox,
              gamePassTiers: unionTiers.length ? unionTiers : mergedXbox.gamePassTiers,
              gamePassPrimaryTiers: unionPrimary.length ? unionPrimary : mergedXbox.gamePassPrimaryTiers,
              includedWithGamePass: mergedXbox.includedWithGamePass || unionIncluded || unionTiers.length > 0,
              hasGamePassMemberDiscount: mergedXbox.hasGamePassMemberDiscount || unionHasDiscount
            };
          }
          if ((!mergedXbox.formattedPrice || mergedXbox.isFree) && mergedXbox._fallbackPurchaseFormatted) {
            mergedXbox = {
              ...mergedXbox,
              formattedPrice: mergedXbox._fallbackPurchaseFormatted,
              currentPrice: mergedXbox._fallbackCurrentPrice || mergedXbox.currentPrice,
              isFree: false,
              isAvailableForPurchase: true
            };
          }
        }
      }
    }

  return {
      ok: true,
      data: {
        playstation: (playstationResult && playstationResult.bestMatch) || null,
        xbox: mergedXbox,
        steam: steamData
      }
    };
  } catch (error) {
    logError('handleGamesGetStorePrices: failed for', gameName, '->', error && error.message ? error.message : error);
    return { ok: false, reason: 'error', error: String(error && error.message ? error.message : error) };
  }
}

