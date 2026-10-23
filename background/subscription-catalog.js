



(function initializeSubscriptionCatalog(global) {
  'use strict';



  const XBOX_SHEET =
    'https://docs.google.com/spreadsheets/d/1kspw-4paT-eE5-mrCrc4R9tg70lH2ZTFrJOUmOtOytg/edit?gid=1511487110#gid=1511487110';

  const PLAYSTATION_SHEET =
    'https://docs.google.com/spreadsheets/d/19RorxFhWc2lHocg4c9zrVssSwZq1u2nPcpTsAvzdJQw/edit?gid=992212554#gid=992212554';

  const XBOX_GENERAL_TAB_NAME =
    'Master List';

  const XBOX_PREMIUM_TAB_NAME =
    'Game Pass Premium';

  const XBOX_PC_TAB_NAME =
    'PC';

  const PLAYSTATION_EXTRA_TAB_NAME =
    'Extra';

  const PLAYSTATION_PREMIUM_TAB_NAME =
    'Premium';


  const XBOX_MASTER_STATUS_COLUMN_INDEX = 17;

  const XBOX_MASTER_STATUS_COLUMN_LETTER = 'R';




  const CACHE_VERSION = 5;

  const CACHE_KEY =
    'subscription_catalog_cache_v5';

  const OLD_CACHE_KEYS = Object.freeze([
    'subscription_catalog_cache_v1',
    'subscription_catalog_cache_v2',
    'subscription_catalog_cache_v3',
    'subscription_catalog_cache_v4'
  ]);



  const GOOGLE_SHEET_SOURCES = Object.freeze([
    {
      id: 'xbox-general',
      type: 'xbox-general',
      spreadsheet: XBOX_SHEET,
      tabName: XBOX_GENERAL_TAB_NAME,
      label: 'Xbox Master List',


      statusColumnIndex:
        XBOX_MASTER_STATUS_COLUMN_INDEX,

      statusColumnLetter:
        XBOX_MASTER_STATUS_COLUMN_LETTER
    },

    {
      id: 'xbox-premium',
      type: 'catalog',
      family: 'xbox',
      spreadsheet: XBOX_SHEET,
      tabName: XBOX_PREMIUM_TAB_NAME,
      label: 'Xbox Game Pass Premium'
    },

    {
      id: 'xbox-pc',
      type: 'catalog',
      family: 'pc',
      spreadsheet: XBOX_SHEET,
      tabName: XBOX_PC_TAB_NAME,
      label: 'Xbox PC'
    },

    {
      id: 'playstation-extra',
      type: 'catalog',
      family: 'playstation',
      spreadsheet: PLAYSTATION_SHEET,
      tabName: PLAYSTATION_EXTRA_TAB_NAME,
      label: 'PlayStation Plus Extra'
    },

    {
      id: 'playstation-premium',
      type: 'catalog',
      family: 'playstation',
      spreadsheet: PLAYSTATION_SHEET,
      tabName: PLAYSTATION_PREMIUM_TAB_NAME,
      label: 'PlayStation Plus Premium'
    }
  ]);



  const SEARCHABLE_CATALOGS = Object.freeze([
    {
      id: 'xbox-ultimate',
      family: 'xbox',
      label: 'Xbox Ultimate',
      tabName: 'Ultimate',
      virtual: true
    },

    {
      id: 'xbox-premium',
      family: 'xbox',
      label: 'Xbox Game Pass Premium',
      tabName: XBOX_PREMIUM_TAB_NAME,
      virtual: false
    },

    {
      id: 'xbox-pc',
      family: 'pc',
      label: 'Xbox PC',
      tabName: XBOX_PC_TAB_NAME,
      virtual: false
    },

    {
      id: 'playstation-extra',
      family: 'playstation',
      label: 'PlayStation Plus Extra',
      tabName: PLAYSTATION_EXTRA_TAB_NAME,
      virtual: false
    },

    {
      id: 'playstation-premium',
      family: 'playstation',
      label: 'PlayStation Plus Premium',
      tabName: PLAYSTATION_PREMIUM_TAB_NAME,
      virtual: false
    }
  ]);



  const GAME_TITLE_COLUMN_NAMES = Object.freeze([
    'game',
    'game name',
    'games',
    'title',
    'name',
    'product',
    'product name',
    'game title'
  ]);


  const STATUS_COLUMN_NAMES = Object.freeze([
    'status',
    'game status',
    'subscription status',
    'availability status'
  ]);

  const ULTIMATE_STATUS_VALUES = Object.freeze([
    'tbd'
  ]);



  const extensionApi =
    typeof browser !== 'undefined'
      ? browser
      : typeof chrome !== 'undefined'
        ? chrome
        : null;

  if (!extensionApi) {
    throw new Error(
      'SubscriptionCatalog: browser/chrome API is unavailable.'
    );
  }



  let memoryCache = null;
  let cacheLoadingPromise = null;
  let refreshPromise = null;



  function stringValue(value) {
    if (value == null) {
      return '';
    }

    if (typeof value === 'object') {
      if (value.name != null) {
        return String(value.name);
      }

      if (value.title != null) {
        return String(value.title);
      }

      if (value.platform != null) {
        return String(value.platform);
      }
    }

    return String(value);
  }

  function normalizeSpaces(value) {
    return stringValue(value)
      .replace(/\u00a0/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function normalizeHeader(value) {
    return normalizeSpaces(value)
      .toLowerCase()
      .replace(/[‐‑‒–—−]/g, '-')
      .replace(/[^a-z0-9]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function normalizeStatus(value) {
    return normalizeSpaces(value)
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }

  function normalizeForDetection(value) {
    return normalizeSpaces(value)
      .toLowerCase()
      .replace(/[‐‑‒–—−]/g, '-')
      .replace(/[|_,;/\\()[\]{}]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function removePlatformWords(value) {
    return value
      .replace(/\bplay\s*station\b/gi, ' ')
      .replace(/\bplaystation\b/gi, ' ')
      .replace(/\bps\s*[1-5]\b/gi, ' ')
      .replace(/\bpsvita\b/gi, ' ')
      .replace(/\bps\s*vita\b/gi, ' ')
      .replace(/\bx\s*box\b/gi, ' ')
      .replace(/\bxbox\b/gi, ' ')
      .replace(/\bxbox\s*series\s*[xs]\b/gi, ' ')
      .replace(/\bseries\s*[xs]\b/gi, ' ')
      .replace(/\bxbox\s*one\b/gi, ' ')
      .replace(/\bxbox\s*360\b/gi, ' ')
      .replace(/\bxbsx\b/gi, ' ')
      .replace(/\bxbone\b/gi, ' ')
      .replace(/\bwindows\s*(?:10|11)?\b/gi, ' ')
      .replace(/\bwin\s*(?:10|11)\b/gi, ' ')
      .replace(/\bpc\b/gi, ' ');
  }

  function normalizeGameTitle(value) {
    let text = normalizeSpaces(value)
      .toLowerCase()
      .replace(/[‐‑‒–—−]/g, '-');

    text = text
      .replace(/\bfull\s*game\b/gi, ' ')
      .replace(/\bfullgame\b/gi, ' ')
      .replace(/\bbase\s*game\b/gi, ' ')
      .replace(/\bgame\s*only\b/gi, ' ');

    text = removePlatformWords(text);

    text = text
      .replace(/&/g, ' and ')
      .replace(/['’`´]/g, '')
      .replace(
        /[^a-z0-9\u00c0-\u024f]+/g,
        ' '
      )
      .replace(/\s+/g, ' ')
      .trim();

    return text;
  }

  function compactGameTitle(value) {
    return normalizeGameTitle(value)
      .replace(/\s+/g, '');
  }

  function uniqueStrings(values) {
    return [
      ...new Set(
        values
          .map((value) => normalizeSpaces(value))
          .filter(Boolean)
      )
    ];
  }

  function getCurrentMonthKey() {
    const now = new Date();

    const year =
      now.getUTCFullYear();

    const month = String(
      now.getUTCMonth() + 1
    ).padStart(2, '0');

    return `${year}-${month}`;
  }

  function isCacheStructureValid(cache) {
    return Boolean(
      cache &&
      cache.version === CACHE_VERSION &&
      cache.catalogs &&
      typeof cache.catalogs === 'object'
    );
  }

  function isCacheCurrent(cache) {
    return Boolean(
      isCacheStructureValid(cache) &&
      cache.month === getCurrentMonthKey()
    );
  }



  function storageGet(key) {
    if (typeof browser !== 'undefined') {
      return browser.storage.local.get(key);
    }

    return new Promise((resolve, reject) => {
      chrome.storage.local.get(
        key,
        (result) => {
          const error =
            chrome.runtime.lastError;

          if (error) {
            reject(
              new Error(error.message)
            );
            return;
          }

          resolve(result);
        }
      );
    });
  }

  function storageSet(data) {
    if (typeof browser !== 'undefined') {
      return browser.storage.local.set(data);
    }

    return new Promise((resolve, reject) => {
      chrome.storage.local.set(
        data,
        () => {
          const error =
            chrome.runtime.lastError;

          if (error) {
            reject(
              new Error(error.message)
            );
            return;
          }

          resolve();
        }
      );
    });
  }

  function storageRemove(keys) {
    if (typeof browser !== 'undefined') {
      return browser.storage.local.remove(keys);
    }

    return new Promise((resolve, reject) => {
      chrome.storage.local.remove(
        keys,
        () => {
          const error =
            chrome.runtime.lastError;

          if (error) {
            reject(
              new Error(error.message)
            );
            return;
          }

          resolve();
        }
      );
    });
  }

  async function readStoredCache() {
    if (memoryCache) {
      return memoryCache;
    }

    if (cacheLoadingPromise) {
      return cacheLoadingPromise;
    }

    cacheLoadingPromise = (async () => {
      try {
        const result =
          await storageGet(CACHE_KEY);

        const storedCache =
          result?.[CACHE_KEY] || null;

        if (
          isCacheStructureValid(storedCache)
        ) {
          memoryCache = storedCache;
          return storedCache;
        }

        return null;
      } finally {
        cacheLoadingPromise = null;
      }
    })();

    return cacheLoadingPromise;
  }

  async function saveCache(cache) {
    memoryCache = cache;

    await storageSet({
      [CACHE_KEY]: cache
    });

    return cache;
  }



  function extractSpreadsheetId(value) {
    const text =
      normalizeSpaces(value);

    if (!text) {
      return '';
    }

    const urlMatch = text.match(
      /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/
    );

    if (urlMatch) {
      return urlMatch[1];
    }

    if (/^[a-zA-Z0-9-_]+$/.test(text)) {
      return text;
    }

    return '';
  }

  function validateConfiguration() {
    const xboxId =
      extractSpreadsheetId(XBOX_SHEET);

    const playStationId =
      extractSpreadsheetId(
        PLAYSTATION_SHEET
      );

    if (!xboxId) {
      throw new Error(
        'XBOX_SHEET does not contain a valid Google Sheets URL or spreadsheet ID.'
      );
    }

    if (!playStationId) {
      throw new Error(
        'PLAYSTATION_SHEET does not contain a valid Google Sheets URL or spreadsheet ID.'
      );
    }

    if (
      !normalizeSpaces(
        XBOX_GENERAL_TAB_NAME
      )
    ) {
      throw new Error(
        'XBOX_GENERAL_TAB_NAME is empty.'
      );
    }

    if (
      !normalizeSpaces(
        XBOX_PREMIUM_TAB_NAME
      )
    ) {
      throw new Error(
        'XBOX_PREMIUM_TAB_NAME is empty.'
      );
    }

    if (
      !Number.isInteger(
        XBOX_MASTER_STATUS_COLUMN_INDEX
      ) ||
      XBOX_MASTER_STATUS_COLUMN_INDEX < 0
    ) {
      throw new Error(
        'XBOX_MASTER_STATUS_COLUMN_INDEX must be a non-negative integer.'
      );
    }
  }

  function createCsvUrl(source) {
    const spreadsheetId =
      extractSpreadsheetId(
        source.spreadsheet
      );

    if (!spreadsheetId) {
      throw new Error(
        `Spreadsheet ID is invalid for "${source.id}".`
      );
    }

    return (
      'https://docs.google.com/spreadsheets/d/' +
      `${encodeURIComponent(spreadsheetId)}/gviz/tq` +
      '?tqx=out:csv' +
      `&sheet=${encodeURIComponent(source.tabName)}`
    );
  }



  function parseCsv(text) {
    const rows = [];

    let row = [];
    let cell = '';
    let insideQuotes = false;

    const input = String(text || '')
      .replace(/^\uFEFF/, '');

    for (
      let index = 0;
      index < input.length;
      index += 1
    ) {
      const character =
        input[index];

      if (insideQuotes) {
        if (character === '"') {
          if (input[index + 1] === '"') {
            cell += '"';
            index += 1;
          } else {
            insideQuotes = false;
          }
        } else {
          cell += character;
        }

        continue;
      }

      if (character === '"') {
        insideQuotes = true;
        continue;
      }

      if (character === ',') {
        row.push(cell);
        cell = '';
        continue;
      }

      if (character === '\n') {
        row.push(cell);
        rows.push(row);

        row = [];
        cell = '';
        continue;
      }

      if (character === '\r') {
        if (input[index + 1] === '\n') {
          continue;
        }

        row.push(cell);
        rows.push(row);

        row = [];
        cell = '';
        continue;
      }

      cell += character;
    }

    row.push(cell);

    if (
      row.length > 1 ||
      normalizeSpaces(row[0]).length > 0
    ) {
      rows.push(row);
    }

    return rows.filter(
      (currentRow) =>
        currentRow.some(
          (currentCell) =>
            normalizeSpaces(
              currentCell
            ).length > 0
        )
    );
  }



  function columnIndexToLetter(index) {
    if (
      !Number.isInteger(index) ||
      index < 0
    ) {
      return '';
    }

    let value = index + 1;
    let result = '';

    while (value > 0) {
      const remainder =
        (value - 1) % 26;

      result =
        String.fromCharCode(
          65 + remainder
        ) + result;

      value = Math.floor(
        (value - 1) / 26
      );
    }

    return result;
  }

  function findNamedColumnIndex(
    headers,
    possibleNames
  ) {
    const normalizedHeaders =
      headers.map(normalizeHeader);

    for (
      let index = 0;
      index < normalizedHeaders.length;
      index += 1
    ) {
      if (
        possibleNames.includes(
          normalizedHeaders[index]
        )
      ) {
        return index;
      }
    }

    return -1;
  }

  function findTitleColumnIndex(rows) {
    if (!rows.length) {
      return -1;
    }

    const exactIndex =
      findNamedColumnIndex(
        rows[0],
        GAME_TITLE_COLUMN_NAMES
      );

    if (exactIndex >= 0) {
      return exactIndex;
    }

    const headers =
      rows[0].map(normalizeHeader);

    for (
      let index = 0;
      index < headers.length;
      index += 1
    ) {
      const header =
        headers[index];

      if (
        header.includes('game') ||
        header.includes('title') ||
        header.includes('name') ||
        header.includes('product')
      ) {
        return index;
      }
    }

    const maximumColumns = Math.max(
      0,
      ...rows.map(
        (row) => row.length
      )
    );

    if (maximumColumns === 0) {
      return -1;
    }

    let selectedColumn = 0;
    let selectedScore = -1;

    for (
      let columnIndex = 0;
      columnIndex < maximumColumns;
      columnIndex += 1
    ) {
      let score = 0;

      for (
        let rowIndex = 1;
        rowIndex < rows.length;
        rowIndex += 1
      ) {
        const value =
          normalizeSpaces(
            rows[rowIndex]?.[
              columnIndex
            ]
          );

        if (
          value &&
          !/^\d+$/.test(value) &&
          normalizeGameTitle(value)
            .length >= 2
        ) {
          score += 1;
        }
      }

      if (score > selectedScore) {
        selectedScore = score;
        selectedColumn = columnIndex;
      }
    }

    return selectedColumn;
  }

  function findStatusColumnIndex(rows) {
    if (!rows.length) {
      return -1;
    }

    const exactIndex =
      findNamedColumnIndex(
        rows[0],
        STATUS_COLUMN_NAMES
      );

    if (exactIndex >= 0) {
      return exactIndex;
    }

    const headers =
      rows[0].map(normalizeHeader);

    for (
      let index = 0;
      index < headers.length;
      index += 1
    ) {
      if (
        headers[index].includes(
          'status'
        )
      ) {
        return index;
      }
    }

    return -1;
  }

  function resolveStatusColumnIndex(
    rows,
    options = {}
  ) {

    if (
      Number.isInteger(
        options.statusColumnIndex
      ) &&
      options.statusColumnIndex >= 0
    ) {
      return options.statusColumnIndex;
    }

    return findStatusColumnIndex(rows);
  }



  function rowsToGameEntries(
    rows,
    options = {}
  ) {
    if (!rows.length) {
      return [];
    }

    const titleColumnIndex =
      Number.isInteger(
        options.titleColumnIndex
      )
        ? options.titleColumnIndex
        : findTitleColumnIndex(rows);

    const statusColumnIndex =
      resolveStatusColumnIndex(
        rows,
        options
      );

    if (titleColumnIndex < 0) {
      throw new Error(
        `Game title column was not found in sheet "${options.tabName || ''}".`
      );
    }

    if (
      options.requireStatus === true &&
      statusColumnIndex < 0
    ) {
      throw new Error(
        `Status column was not found in sheet "${options.tabName || ''}".`
      );
    }

    if (
      options.requireStatus === true &&
      Number.isInteger(
        options.statusColumnIndex
      ) &&
      rows[0].length <=
        options.statusColumnIndex
    ) {
      throw new Error(
        `Sheet "${options.tabName || ''}" does not contain column ` +
        `${columnIndexToLetter(options.statusColumnIndex)} ` +
        `(zero-based index ${options.statusColumnIndex}). ` +
        `CSV column count: ${rows[0].length}.`
      );
    }

    const entries = [];
    const duplicateKeys =
      new Set();

    for (
      let rowIndex = 1;
      rowIndex < rows.length;
      rowIndex += 1
    ) {
      const row =
        rows[rowIndex];

      const title =
        normalizeSpaces(
          row?.[titleColumnIndex]
        );

      if (!title) {
        continue;
      }

      const normalizedTitle =
        normalizeGameTitle(title);

      const compactTitle =
        compactGameTitle(title);

      if (
        !normalizedTitle ||
        normalizedTitle.length < 2
      ) {
        continue;
      }

      const status =
        statusColumnIndex >= 0
          ? normalizeSpaces(
              row?.[statusColumnIndex]
            )
          : '';

      const normalizedStatus =
        normalizeStatus(status);

      const duplicateKey =
        `${compactTitle}::${normalizedStatus}`;

      if (
        duplicateKeys.has(
          duplicateKey
        )
      ) {
        continue;
      }

      duplicateKeys.add(
        duplicateKey
      );

      entries.push({
        title,
        normalizedTitle,
        compactTitle,

        status,
        normalizedStatus,

        sourceRow:
          rowIndex + 1,

        titleColumnIndex,
        statusColumnIndex,

        titleColumnLetter:
          columnIndexToLetter(
            titleColumnIndex
          ),

        statusColumnLetter:
          statusColumnIndex >= 0
            ? columnIndexToLetter(
                statusColumnIndex
              )
            : null
      });
    }

    return entries;
  }



  async function downloadSource(source) {
    const url =
      createCsvUrl(source);

    const response =
      await fetch(url, {
        method: 'GET',
        cache: 'no-store',
        credentials: 'omit',
        redirect: 'follow'
      });

    if (!response.ok) {
      throw new Error(
        `Failed to download "${source.label}": HTTP ${response.status}.`
      );
    }

    const csvText =
      await response.text();

    if (!csvText.trim()) {
      throw new Error(
        `Sheet "${source.tabName}" returned an empty CSV response.`
      );
    }

    const rows =
      parseCsv(csvText);

    if (!rows.length) {
      throw new Error(
        `No rows were found in sheet "${source.tabName}".`
      );
    }

    const titleColumnIndex =
      findTitleColumnIndex(rows);

    const statusColumnIndex =
      resolveStatusColumnIndex(
        rows,
        {
          statusColumnIndex:
            source.statusColumnIndex
        }
      );

    const entries =
      rowsToGameEntries(
        rows,
        {
          tabName:
            source.tabName,

          titleColumnIndex,

          statusColumnIndex:
            source.statusColumnIndex,

          requireStatus:
            source.type ===
            'xbox-general'
        }
      );

    return {
      id: source.id,
      type: source.type,
      family:
        source.family || null,

      label: source.label,
      tabName: source.tabName,
      url,

      headers:
        rows[0] || [],

      csvColumnCount:
        rows[0]?.length || 0,

      titleColumnIndex,

      titleColumnLetter:
        titleColumnIndex >= 0
          ? columnIndexToLetter(
              titleColumnIndex
            )
          : null,

      titleColumnHeader:
        titleColumnIndex >= 0
          ? normalizeSpaces(
              rows[0]?.[
                titleColumnIndex
              ]
            )
          : '',

      statusColumnIndex,

      statusColumnLetter:
        statusColumnIndex >= 0
          ? columnIndexToLetter(
              statusColumnIndex
            )
          : null,

      statusColumnHeader:
        statusColumnIndex >= 0
          ? normalizeSpaces(
              rows[0]?.[
                statusColumnIndex
              ]
            )
          : '',

      fixedStatusColumn:
        Number.isInteger(
          source.statusColumnIndex
        ),

      count:
        entries.length,

      entries
    };
  }



  function isUltimateStatus(status) {
    const normalized =
      normalizeStatus(status);

    return (
      ULTIMATE_STATUS_VALUES
        .includes(normalized)
    );
  }

  function buildUltimateCatalog(
    generalSource
  ) {
    if (
      !generalSource ||
      !Array.isArray(
        generalSource.entries
      )
    ) {
      throw new Error(
        'Xbox Master List data is unavailable.'
      );
    }

    if (
      generalSource.statusColumnIndex !==
      XBOX_MASTER_STATUS_COLUMN_INDEX
    ) {
      throw new Error(
        `Xbox Ultimate must use column ${XBOX_MASTER_STATUS_COLUMN_LETTER} ` +
        `(index ${XBOX_MASTER_STATUS_COLUMN_INDEX}), but the resolved ` +
        `index was ${generalSource.statusColumnIndex}.`
      );
    }

    const entries = [];
    const duplicateTitles =
      new Set();

    for (
      const game
      of generalSource.entries
    ) {
      if (
        !isUltimateStatus(
          game.normalizedStatus
        )
      ) {
        continue;
      }

      if (
        duplicateTitles.has(
          game.compactTitle
        )
      ) {
        continue;
      }

      duplicateTitles.add(
        game.compactTitle
      );

      entries.push({
        title:
          game.title,

        normalizedTitle:
          game.normalizedTitle,

        compactTitle:
          game.compactTitle,

        status:
          game.status,

        normalizedStatus:
          game.normalizedStatus,

        sourceRow:
          game.sourceRow,

        statusColumnIndex:
          XBOX_MASTER_STATUS_COLUMN_INDEX,

        statusColumnLetter:
          XBOX_MASTER_STATUS_COLUMN_LETTER,

        sourceCatalogId:
          'xbox-general',

        generatedBy:
          'master-list-column-r-status-tbd'
      });
    }

    return {
      id:
        'xbox-ultimate',

      family:
        'xbox',

      label:
        'Xbox Ultimate',

      tabName:
        'Ultimate',

      virtual:
        true,

      sourceCatalogId:
        'xbox-general',

      sourceTabName:
        generalSource.tabName,

      statusColumnIndex:
        XBOX_MASTER_STATUS_COLUMN_INDEX,

      statusColumnLetter:
        XBOX_MASTER_STATUS_COLUMN_LETTER,

      filter:
        'Column R status equals TBD',

      count:
        entries.length,

      entries
    };
  }

  function buildNormalCatalog(
    sourceData,
    catalogDefinition
  ) {
    return {
      id:
        catalogDefinition.id,

      family:
        catalogDefinition.family,

      label:
        catalogDefinition.label,

      tabName:
        catalogDefinition.tabName,

      virtual:
        false,

      sourceCatalogId:
        sourceData.id,

      sourceTabName:
        sourceData.tabName,

      count:
        sourceData.entries.length,

      entries:
        sourceData.entries.map(
          (game) => ({
            title:
              game.title,

            normalizedTitle:
              game.normalizedTitle,

            compactTitle:
              game.compactTitle,

            status:
              game.status || '',

            normalizedStatus:
              game.normalizedStatus || '',

            sourceRow:
              game.sourceRow,

            sourceCatalogId:
              sourceData.id
          })
        )
    };
  }

  function buildCatalogs(
    downloadedSources
  ) {
    const sourceMap = {};

    for (
      const source
      of downloadedSources
    ) {
      sourceMap[source.id] =
        source;
    }

    const generalSource =
      sourceMap['xbox-general'];

    if (!generalSource) {
      throw new Error(
        'The Xbox Master List source was not downloaded.'
      );
    }

    const catalogs = {};

    catalogs['xbox-ultimate'] =
      buildUltimateCatalog(
        generalSource
      );

    for (
      const definition
      of SEARCHABLE_CATALOGS
    ) {
      if (
        definition.id ===
        'xbox-ultimate'
      ) {
        continue;
      }

      const sourceData =
        sourceMap[definition.id];

      if (!sourceData) {
        throw new Error(
          `Source "${definition.id}" was not downloaded.`
        );
      }

      catalogs[definition.id] =
        buildNormalCatalog(
          sourceData,
          definition
        );
    }

    return {
      sourceMap,
      catalogs
    };
  }



  async function refresh(
    options = {}
  ) {
    const force =
      options.force === true;

    if (refreshPromise) {
      return refreshPromise;
    }

    refreshPromise = (async () => {
      const existingCache =
        await readStoredCache();

      try {
        if (
          !force &&
          isCacheCurrent(
            existingCache
          )
        ) {
          return existingCache;
        }

        validateConfiguration();


        const downloadedSources =
          await Promise.all(
            GOOGLE_SHEET_SOURCES.map(
              downloadSource
            )
          );

        const built =
          buildCatalogs(
            downloadedSources
          );

        const newCache = {
          version:
            CACHE_VERSION,

          month:
            getCurrentMonthKey(),

          cachedAt:
            new Date().toISOString(),

          stale:
            false,

          fallbackUsed:
            false,

          refreshError:
            null,

          sources:
            built.sourceMap,

          catalogs:
            built.catalogs
        };

        await saveCache(
          newCache
        );

        return newCache;
      } catch (error) {

        if (
          isCacheStructureValid(
            existingCache
          )
        ) {
          const fallbackCache = {
            ...existingCache,

            stale:
              true,

            fallbackUsed:
              true,

            refreshError:
              error?.message ||
              String(error)
          };

          memoryCache =
            fallbackCache;

          return fallbackCache;
        }


        throw error;
      } finally {
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  }

  async function ensureCache(
    options = {}
  ) {
    if (
      options.forceRefresh === true
    ) {
      return refresh({
        force: true
      });
    }

    const cache =
      await readStoredCache();

    if (
      isCacheCurrent(cache)
    ) {
      return cache;
    }

    return refresh({
      force: false
    });
  }



  function toPlatformArray(
    platforms
  ) {
    if (platforms == null) {
      return [];
    }

    const input =
      Array.isArray(platforms)
        ? platforms.flat(Infinity)
        : [platforms];

    const result = [];

    for (const item of input) {
      const text =
        stringValue(item);

      const parts = text
        .split(/[,;/|]+/)
        .map(
          (part) =>
            normalizeSpaces(part)
        )
        .filter(Boolean);

      result.push(...parts);
    }

    return result;
  }

  function detectPlatformFamilies(
    platforms,
    gameName = ''
  ) {
    const explicitPlatforms =
      toPlatformArray(platforms);

    const values =
      explicitPlatforms.length > 0
        ? explicitPlatforms
        : [gameName];

    const families = {
      playstation: false,
      xbox: false,
      pc: false
    };

    for (const value of values) {
      const text =
        normalizeForDetection(
          value
        );

      if (
        /\bplay\s*station\b/.test(text) ||
        /\bplaystation\b/.test(text) ||
        /\bps\s*[1-5]\b/.test(text) ||
        /\bpsvita\b/.test(text) ||
        /\bps\s*vita\b/.test(text)
      ) {
        families.playstation =
          true;
      }

      if (
        /\bx\s*box\b/.test(text) ||
        /\bxbox\b/.test(text) ||
        /\bseries\s*[xs]\b/.test(text) ||
        /\bxbox\s*one\b/.test(text) ||
        /\bxbox\s*360\b/.test(text) ||
        /\bxbsx\b/.test(text) ||
        /\bxbone\b/.test(text)
      ) {
        families.xbox = true;
      }

      if (
        /\bpc\b/.test(text) ||
        /\bwindows\b/.test(text) ||
        /\bwin\s*(?:10|11)\b/.test(text)
      ) {
        families.pc = true;
      }
    }

    return {
      explicitPlatforms,
      families
    };
  }

  function getAllowedCatalogs(
    gameName,
    platforms
  ) {
    const detection =
      detectPlatformFamilies(
        platforms,
        gameName
      );

    const allowedIds =
      new Set();

    if (
      detection.families.playstation
    ) {
      allowedIds.add(
        'playstation-extra'
      );

      allowedIds.add(
        'playstation-premium'
      );
    }

    if (
      detection.families.xbox
    ) {
      allowedIds.add(
        'xbox-ultimate'
      );

      allowedIds.add(
        'xbox-premium'
      );
    }

    if (
      detection.families.pc
    ) {
      allowedIds.add(
        'xbox-pc'
      );
    }

    return {
      explicitPlatforms:
        detection.explicitPlatforms,

      families:
        detection.families,

      allowedIds,

      allowedCatalogs:
        SEARCHABLE_CATALOGS.filter(
          (catalog) =>
            allowedIds.has(
              catalog.id
            )
        )
    };
  }



  function compareGameNames(
    requestedName,
    catalogTitle
  ) {
    const requestedNormalized =
      normalizeGameTitle(
        requestedName
      );

    const catalogNormalized =
      normalizeGameTitle(
        catalogTitle
      );

    if (
      !requestedNormalized ||
      !catalogNormalized
    ) {
      return {
        matched: false,
        type: null
      };
    }

    if (
      requestedNormalized ===
      catalogNormalized
    ) {
      return {
        matched: true,
        type: 'normalized-exact'
      };
    }

    const requestedCompact =
      compactGameTitle(
        requestedName
      );

    const catalogCompact =
      compactGameTitle(
        catalogTitle
      );

    if (
      requestedCompact &&
      requestedCompact ===
        catalogCompact
    ) {
      return {
        matched: true,
        type: 'compact-exact'
      };
    }

    return {
      matched: false,
      type: null
    };
  }



  function createEmptyLookupResult(
    gameName,
    platforms,
    routing,
    reason
  ) {
    return {
      gameName:
        normalizeSpaces(
          gameName
        ),

      requestedPlatforms:
        toPlatformArray(
          platforms
        ),

      detectedFamilies: {
        playstation:
          routing.families
            .playstation,

        xbox:
          routing.families.xbox,

        pc:
          routing.families.pc
      },

      included:
        false,

      includedIn:
        [],

      matches:
        [],

      searchedCatalogs:
        routing.allowedCatalogs.map(
          (catalog) => ({
            id:
              catalog.id,

            label:
              catalog.label,

            family:
              catalog.family,

            tabName:
              catalog.tabName,

            virtual:
              catalog.virtual === true
          })
        ),

      reason
    };
  }

  async function lookup(
    gameName,
    platforms,
    options = {}
  ) {
    const requestedName =
      normalizeSpaces(
        gameName
      );

    const routing =
      getAllowedCatalogs(
        requestedName,
        platforms
      );

    if (!requestedName) {
      return createEmptyLookupResult(
        requestedName,
        platforms,
        routing,
        'empty-game-name'
      );
    }

    if (
      routing.allowedIds.size === 0
    ) {
      return createEmptyLookupResult(
        requestedName,
        platforms,
        routing,
        'unknown-platform'
      );
    }

    const cache =
      await ensureCache({
        forceRefresh:
          options.forceRefresh ===
          true
      });

    const matches = [];
    const searchedCatalogs = [];

    for (
      const catalogDefinition
      of routing.allowedCatalogs
    ) {
      const catalog =
        cache.catalogs?.[
          catalogDefinition.id
        ];

      searchedCatalogs.push({
        id:
          catalogDefinition.id,

        label:
          catalogDefinition.label,

        family:
          catalogDefinition.family,

        tabName:
          catalogDefinition.tabName,

        virtual:
          catalogDefinition.virtual ===
          true,

        count:
          catalog?.entries?.length ||
          0
      });

      if (
        !catalog ||
        !Array.isArray(
          catalog.entries
        )
      ) {
        continue;
      }

      for (
        const entry
        of catalog.entries
      ) {
        const comparison =
          compareGameNames(
            requestedName,
            entry.title
          );

        if (
          !comparison.matched
        ) {
          continue;
        }

        matches.push({
          catalogId:
            catalogDefinition.id,

          catalogLabel:
            catalogDefinition.label,

          family:
            catalogDefinition.family,

          tabName:
            catalogDefinition.tabName,

          virtual:
            catalogDefinition.virtual ===
            true,

          requestedName,

          matchedTitle:
            entry.title,

          matchType:
            comparison.type,

          status:
            entry.status || '',

          sourceRow:
            entry.sourceRow || null,

          statusColumnIndex:
            entry.statusColumnIndex ??
            null,

          statusColumnLetter:
            entry.statusColumnLetter ??
            null,

          generatedBy:
            entry.generatedBy || null
        });
      }
    }

    const includedIn =
      uniqueStrings(
        matches.map(
          (match) =>
            match.catalogLabel
        )
      );

    return {
      gameName:
        requestedName,

      requestedPlatforms:
        toPlatformArray(
          platforms
        ),

      detectedFamilies: {
        playstation:
          routing.families
            .playstation,

        xbox:
          routing.families.xbox,

        pc:
          routing.families.pc
      },

      included:
        matches.length > 0,

      includedIn,

      matches,

      searchedCatalogs,

      cache: {
        version:
          cache.version || null,

        month:
          cache.month || null,

        cachedAt:
          cache.cachedAt || null,

        stale:
          cache.stale === true,

        fallbackUsed:
          cache.fallbackUsed ===
          true,

        refreshError:
          cache.refreshError || null
      },

      reason:
        matches.length > 0
          ? 'found'
          : 'not-found'
    };
  }

  async function lookupMany(
    items,
    options = {}
  ) {
    if (!Array.isArray(items)) {
      throw new TypeError(
        'SubscriptionCatalog.lookupMany: items must be an array.'
      );
    }

    const results = [];

    for (const item of items) {
      if (
        typeof item === 'string'
      ) {
        results.push(
          await lookup(
            item,
            options.platforms,
            options
          )
        );

        continue;
      }

      const name =
        item?.name ??
        item?.gameName ??
        item?.title ??
        '';

      const platforms =
        item?.platforms ??
        item?.platform ??
        item?.consoles ??
        item?.console ??
        [];

      results.push(
        await lookup(
          name,
          platforms,
          {
            ...options,
            ...(item?.options || {})
          }
        )
      );
    }

    return results;
  }



  async function getCatalog(
    catalogId,
    options = {}
  ) {
    const cache =
      await ensureCache({
        forceRefresh:
          options.forceRefresh ===
          true
      });

    return (
      cache.catalogs?.[
        catalogId
      ] || null
    );
  }

  async function getAllCatalogs(
    options = {}
  ) {
    const cache =
      await ensureCache({
        forceRefresh:
          options.forceRefresh ===
          true
      });

    return cache.catalogs;
  }



  async function getMeta() {
    const cache =
      await readStoredCache();

    if (!cache) {
      return {
        cached: false,
        current: false,
        stale: false,
        fallbackUsed: false,
        version: CACHE_VERSION,
        month: null,
        cachedAt: null,
        refreshError: null,
        catalogs: []
      };
    }

    const catalogs =
      SEARCHABLE_CATALOGS.map(
        (definition) => {
          const catalog =
            cache.catalogs?.[
              definition.id
            ];

          return {
            id:
              definition.id,

            family:
              definition.family,

            label:
              definition.label,

            tabName:
              definition.tabName,

            virtual:
              definition.virtual ===
              true,

            count:
              catalog?.entries
                ?.length || 0
          };
        }
      );

    return {
      cached:
        true,

      current:
        isCacheCurrent(cache),

      stale:
        cache.stale === true,

      fallbackUsed:
        cache.fallbackUsed ===
        true,

      version:
        cache.version,

      month:
        cache.month || null,

      cachedAt:
        cache.cachedAt || null,

      refreshError:
        cache.refreshError || null,

      catalogs
    };
  }



  async function clearCache() {
    memoryCache = null;
    cacheLoadingPromise = null;
    refreshPromise = null;

    const allCacheKeys = [
      CACHE_KEY,
      ...OLD_CACHE_KEYS
    ];

    await storageRemove(
      allCacheKeys
    );

    return {
      cleared: true,
      removedKeys:
        allCacheKeys
    };
  }

  async function clearAndRefresh() {
    await clearCache();

    return refresh({
      force: true
    });
  }



  async function debugHeaders() {
    validateConfiguration();

    const results = [];

    for (
      const source
      of GOOGLE_SHEET_SOURCES
    ) {
      const url =
        createCsvUrl(source);

      try {
        const response =
          await fetch(url, {
            method: 'GET',
            cache: 'no-store',
            credentials: 'omit',
            redirect: 'follow'
          });

        if (!response.ok) {
          results.push({
            id:
              source.id,

            label:
              source.label,

            tabName:
              source.tabName,

            ok:
              false,

            httpStatus:
              response.status,

            error:
              `HTTP ${response.status}`
          });

          continue;
        }

        const csvText =
          await response.text();

        const rows =
          parseCsv(csvText);

        const titleColumnIndex =
          findTitleColumnIndex(
            rows
          );

        const detectedStatusColumnIndex =
          findStatusColumnIndex(
            rows
          );

        const resolvedStatusColumnIndex =
          resolveStatusColumnIndex(
            rows,
            {
              statusColumnIndex:
                source.statusColumnIndex
            }
          );

        results.push({
          id:
            source.id,

          label:
            source.label,

          tabName:
            source.tabName,

          ok:
            true,

          httpStatus:
            response.status,

          headers:
            rows[0] || [],

          csvColumnCount:
            rows[0]?.length || 0,

          titleColumnIndex,

          titleColumnLetter:
            titleColumnIndex >= 0
              ? columnIndexToLetter(
                  titleColumnIndex
                )
              : null,

          titleColumnHeader:
            titleColumnIndex >= 0
              ? normalizeSpaces(
                  rows[0]?.[
                    titleColumnIndex
                  ]
                )
              : '',

          detectedStatusColumnIndex,

          detectedStatusColumnLetter:
            detectedStatusColumnIndex >= 0
              ? columnIndexToLetter(
                  detectedStatusColumnIndex
                )
              : null,

          resolvedStatusColumnIndex,

          resolvedStatusColumnLetter:
            resolvedStatusColumnIndex >= 0
              ? columnIndexToLetter(
                  resolvedStatusColumnIndex
                )
              : null,

          resolvedStatusColumnHeader:
            resolvedStatusColumnIndex >= 0
              ? normalizeSpaces(
                  rows[0]?.[
                    resolvedStatusColumnIndex
                  ]
                )
              : '',

          fixedStatusColumn:
            Number.isInteger(
              source.statusColumnIndex
            ),

          statusRequired:
            source.type ===
            'xbox-general',

          dataRowCount:
            Math.max(
              0,
              rows.length - 1
            )
        });
      } catch (error) {
        results.push({
          id:
            source.id,

          label:
            source.label,

          tabName:
            source.tabName,

          ok:
            false,

          httpStatus:
            null,

          error:
            error?.message ||
            String(error)
        });
      }
    }

    return results;
  }

  async function debugMasterList() {
    validateConfiguration();

    const source =
      GOOGLE_SHEET_SOURCES.find(
        (item) =>
          item.id ===
          'xbox-general'
      );

    if (!source) {
      throw new Error(
        'The Xbox Master List source is missing.'
      );
    }

    const sourceData =
      await downloadSource(
        source
      );

    const statusSummary = {};

    for (
      const entry
      of sourceData.entries
    ) {
      const key =
        entry.normalizedStatus ||
        '(empty)';

      statusSummary[key] =
        (statusSummary[key] || 0) +
        1;
    }

    return {
      id:
        sourceData.id,

      tabName:
        sourceData.tabName,

      headers:
        sourceData.headers,

      csvColumnCount:
        sourceData.csvColumnCount,

      titleColumnIndex:
        sourceData.titleColumnIndex,

      titleColumnLetter:
        sourceData.titleColumnLetter,

      titleColumnHeader:
        sourceData.titleColumnHeader,

      statusColumnIndex:
        sourceData.statusColumnIndex,

      statusColumnLetter:
        sourceData.statusColumnLetter,

      statusColumnHeader:
        sourceData.statusColumnHeader,

      fixedStatusColumn:
        sourceData.fixedStatusColumn,

      totalEntries:
        sourceData.entries.length,

      ultimateEntries:
        sourceData.entries.filter(
          (entry) =>
            isUltimateStatus(
              entry.normalizedStatus
            )
        ).length,

      statusSummary,

      sample:
        sourceData.entries
          .slice(0, 20)
          .map(
            (entry) => ({
              title:
                entry.title,

              status:
                entry.status,

              sourceRow:
                entry.sourceRow,

              statusColumnIndex:
                entry.statusColumnIndex,

              statusColumnLetter:
                entry.statusColumnLetter
            })
          )
    };
  }



  function getRouting(
    gameName,
    platforms
  ) {
    const routing =
      getAllowedCatalogs(
        gameName,
        platforms
      );

    return {
      gameName:
        normalizeSpaces(
          gameName
        ),

      requestedPlatforms:
        toPlatformArray(
          platforms
        ),

      families: {
        playstation:
          routing.families
            .playstation,

        xbox:
          routing.families.xbox,

        pc:
          routing.families.pc
      },

      catalogIds:
        [...routing.allowedIds],

      catalogs:
        routing.allowedCatalogs.map(
          (catalog) => ({
            id:
              catalog.id,

            label:
              catalog.label,

            family:
              catalog.family,

            tabName:
              catalog.tabName,

            virtual:
              catalog.virtual === true
          })
        )
    };
  }



  async function printAllCatalogs(
    options = {}
  ) {
    const cache =
      await ensureCache({
        forceRefresh:
          options.forceRefresh ===
          true
      });

    for (
      const definition
      of SEARCHABLE_CATALOGS
    ) {
      const catalog =
        cache.catalogs?.[
          definition.id
        ];



      if (!catalog) {



        continue;
      }




    }



    return cache.catalogs;
  }

  async function printUltimate(
    options = {}
  ) {
    const catalog =
      await getCatalog(
        'xbox-ultimate',
        options
      );

    if (!catalog) {


      return null;
    }



    return catalog;
  }



  const publicApi =
    Object.freeze({
      lookup,
      lookupMany,

      getCatalog,
      getAllCatalogs,

      refresh,
      ensureCache,

      getMeta,
      clearCache,
      clearAndRefresh,

      debugHeaders,
      debugMasterList,
      getRouting,

      printAllCatalogs,
      printUltimate,

      normalizeGameTitle,
      normalizeStatus,
      detectPlatformFamilies,

      version:
        CACHE_VERSION,

      masterListStatusColumn: {
        index:
          XBOX_MASTER_STATUS_COLUMN_INDEX,

        letter:
          XBOX_MASTER_STATUS_COLUMN_LETTER
      }
    });

  global.SubscriptionCatalog =
    publicApi;
})(globalThis);

