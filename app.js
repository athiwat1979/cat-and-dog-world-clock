/* Storage categories are shared by the clock app and manual language selector. */
const DEFAULT_CITY_ID = document.body.dataset.defaultCity || '';
const STORAGE_PREFIX = DEFAULT_CITY_ID
  ? 'worldclock.city.' + DEFAULT_CITY_ID + '.settings'
  : 'worldclock.settings';
const STORAGE_KEYS = {
  cities: STORAGE_PREFIX + '.cities.v1',
  alarms: STORAGE_PREFIX + '.alarms.v1',
  language: 'worldclock.settings.language.v1',
  visits: 'worldclock.new.visits.v1'
};
const LEGACY_STORAGE_KEYS = DEFAULT_CITY_ID
  ? []
  : ['worldclock.alarm.v4', 'worldclock.alarm.v2', 'worldclock.alarm.v1'];
const LEGACY_LANGUAGE_KEY = 'worldClockManualLanguage';

/* World clock application: configuration, state, and clock interactions. */
(() => {
  // City and pet catalogs
  const CITIES = [
    { id: 'bangkok', name: 'Bangkok', zone: 'Asia/Bangkok', region: 'Asia & Middle East' },
    { id: 'singapore', name: 'Singapore', zone: 'Asia/Singapore', region: 'Asia & Middle East' },
    { id: 'kuala-lumpur', name: 'Kuala Lumpur', zone: 'Asia/Kuala_Lumpur', region: 'Asia & Middle East' },
    { id: 'jakarta', name: 'Jakarta', zone: 'Asia/Jakarta', region: 'Asia & Middle East' },
    { id: 'manila', name: 'Manila', zone: 'Asia/Manila', region: 'Asia & Middle East' },
    { id: 'hanoi', name: 'Hanoi', zone: 'Asia/Ho_Chi_Minh', region: 'Asia & Middle East' },
    { id: 'ho-chi-minh-city', name: 'Ho Chi Minh City', zone: 'Asia/Ho_Chi_Minh', region: 'Asia & Middle East' },
    { id: 'hong-kong', name: 'Hong Kong', zone: 'Asia/Hong_Kong', region: 'Asia & Middle East' },
    { id: 'taipei', name: 'Taipei', zone: 'Asia/Taipei', region: 'Asia & Middle East' },
    { id: 'shanghai', name: 'Shanghai', zone: 'Asia/Shanghai', region: 'Asia & Middle East' },
    { id: 'beijing', name: 'Beijing', zone: 'Asia/Shanghai', region: 'Asia & Middle East' },
    { id: 'tokyo', name: 'Tokyo', zone: 'Asia/Tokyo', region: 'Asia & Middle East' },
    { id: 'osaka', name: 'Osaka', zone: 'Asia/Tokyo', region: 'Asia & Middle East' },
    { id: 'seoul', name: 'Seoul', zone: 'Asia/Seoul', region: 'Asia & Middle East' },
    { id: 'new-delhi', name: 'New Delhi', zone: 'Asia/Kolkata', region: 'Asia & Middle East' },
    { id: 'mumbai', name: 'Mumbai', zone: 'Asia/Kolkata', region: 'Asia & Middle East' },
    { id: 'dubai', name: 'Dubai', zone: 'Asia/Dubai', region: 'Asia & Middle East' },
    { id: 'riyadh', name: 'Riyadh', zone: 'Asia/Riyadh', region: 'Asia & Middle East' },
    { id: 'dhaka', name: 'Dhaka', zone: 'Asia/Dhaka', region: 'Asia & Middle East' },
    { id: 'karachi', name: 'Karachi', zone: 'Asia/Karachi', region: 'Asia & Middle East' },
    { id: 'lahore', name: 'Lahore', zone: 'Asia/Karachi', region: 'Asia & Middle East' },
    { id: 'kathmandu', name: 'Kathmandu', zone: 'Asia/Kathmandu', region: 'Asia & Middle East' },
    { id: 'colombo', name: 'Colombo', zone: 'Asia/Colombo', region: 'Asia & Middle East' },
    { id: 'yangon', name: 'Yangon', zone: 'Asia/Yangon', region: 'Asia & Middle East' },
    { id: 'phnom-penh', name: 'Phnom Penh', zone: 'Asia/Phnom_Penh', region: 'Asia & Middle East' },
    { id: 'vientiane', name: 'Vientiane', zone: 'Asia/Vientiane', region: 'Asia & Middle East' },
    { id: 'ulaanbaatar', name: 'Ulaanbaatar', zone: 'Asia/Ulaanbaatar', region: 'Asia & Middle East' },
    { id: 'almaty', name: 'Almaty', zone: 'Asia/Almaty', region: 'Asia & Middle East' },
    { id: 'astana', name: 'Astana', zone: 'Asia/Almaty', region: 'Asia & Middle East' },
    { id: 'tashkent', name: 'Tashkent', zone: 'Asia/Tashkent', region: 'Asia & Middle East' },
    { id: 'tehran', name: 'Tehran', zone: 'Asia/Tehran', region: 'Asia & Middle East' },
    { id: 'baghdad', name: 'Baghdad', zone: 'Asia/Baghdad', region: 'Asia & Middle East' },
    { id: 'jerusalem', name: 'Jerusalem', zone: 'Asia/Jerusalem', region: 'Asia & Middle East' },
    { id: 'doha', name: 'Doha', zone: 'Asia/Qatar', region: 'Asia & Middle East' },
    { id: 'kuwait-city', name: 'Kuwait City', zone: 'Asia/Kuwait', region: 'Asia & Middle East' },
    { id: 'muscat', name: 'Muscat', zone: 'Asia/Muscat', region: 'Asia & Middle East' },
    { id: 'abu-dhabi', name: 'Abu Dhabi', zone: 'Asia/Dubai', region: 'Asia & Middle East' },
    { id: 'jeddah', name: 'Jeddah', zone: 'Asia/Riyadh', region: 'Asia & Middle East' },
    { id: 'kabul', name: 'Kabul', zone: 'Asia/Kabul', region: 'Asia & Middle East' },
    { id: 'bishkek', name: 'Bishkek', zone: 'Asia/Bishkek', region: 'Asia & Middle East' },
    { id: 'amman', name: 'Amman', zone: 'Asia/Amman', region: 'Asia & Middle East' },
    { id: 'beirut', name: 'Beirut', zone: 'Asia/Beirut', region: 'Asia & Middle East' },
    { id: 'yerevan', name: 'Yerevan', zone: 'Asia/Yerevan', region: 'Asia & Middle East' },
    { id: 'baku', name: 'Baku', zone: 'Asia/Baku', region: 'Asia & Middle East' },
    { id: 'tbilisi', name: 'Tbilisi', zone: 'Asia/Tbilisi', region: 'Asia & Middle East' },
    { id: 'london', name: 'London', zone: 'Europe/London', region: 'Europe' },
    { id: 'greenwich', name: 'Greenwich', zone: 'Europe/London', region: 'Europe' },
    { id: 'paris', name: 'Paris', zone: 'Europe/Paris', region: 'Europe' },
    { id: 'berlin', name: 'Berlin', zone: 'Europe/Berlin', region: 'Europe' },
    { id: 'frankfurt', name: 'Frankfurt', zone: 'Europe/Berlin', region: 'Europe' },
    { id: 'amsterdam', name: 'Amsterdam', zone: 'Europe/Amsterdam', region: 'Europe' },
    { id: 'brussels', name: 'Brussels', zone: 'Europe/Brussels', region: 'Europe' },
    { id: 'zurich', name: 'Zurich', zone: 'Europe/Zurich', region: 'Europe' },
    { id: 'madrid', name: 'Madrid', zone: 'Europe/Madrid', region: 'Europe' },
    { id: 'barcelona', name: 'Barcelona', zone: 'Europe/Madrid', region: 'Europe' },
    { id: 'rome', name: 'Rome', zone: 'Europe/Rome', region: 'Europe' },
    { id: 'milan', name: 'Milan', zone: 'Europe/Rome', region: 'Europe' },
    { id: 'vienna', name: 'Vienna', zone: 'Europe/Vienna', region: 'Europe' },
    { id: 'stockholm', name: 'Stockholm', zone: 'Europe/Stockholm', region: 'Europe' },
    { id: 'istanbul', name: 'Istanbul', zone: 'Europe/Istanbul', region: 'Europe' },
    { id: 'dublin', name: 'Dublin', zone: 'Europe/Dublin', region: 'Europe' },
    { id: 'manchester', name: 'Manchester', zone: 'Europe/London', region: 'Europe' },
    { id: 'edinburgh', name: 'Edinburgh', zone: 'Europe/London', region: 'Europe' },
    { id: 'lisbon', name: 'Lisbon', zone: 'Europe/Lisbon', region: 'Europe' },
    { id: 'porto', name: 'Porto', zone: 'Europe/Lisbon', region: 'Europe' },
    { id: 'copenhagen', name: 'Copenhagen', zone: 'Europe/Copenhagen', region: 'Europe' },
    { id: 'oslo', name: 'Oslo', zone: 'Europe/Oslo', region: 'Europe' },
    { id: 'helsinki', name: 'Helsinki', zone: 'Europe/Helsinki', region: 'Europe' },
    { id: 'warsaw', name: 'Warsaw', zone: 'Europe/Warsaw', region: 'Europe' },
    { id: 'prague', name: 'Prague', zone: 'Europe/Prague', region: 'Europe' },
    { id: 'budapest', name: 'Budapest', zone: 'Europe/Budapest', region: 'Europe' },
    { id: 'athens', name: 'Athens', zone: 'Europe/Athens', region: 'Europe' },
    { id: 'bucharest', name: 'Bucharest', zone: 'Europe/Bucharest', region: 'Europe' },
    { id: 'kyiv', name: 'Kyiv', zone: 'Europe/Kyiv', region: 'Europe' },
    { id: 'moscow', name: 'Moscow', zone: 'Europe/Moscow', region: 'Europe' },
    { id: 'st-petersburg', name: 'St. Petersburg', zone: 'Europe/Moscow', region: 'Europe' },
    { id: 'belgrade', name: 'Belgrade', zone: 'Europe/Belgrade', region: 'Europe' },
    { id: 'sofia', name: 'Sofia', zone: 'Europe/Sofia', region: 'Europe' },
    { id: 'tallinn', name: 'Tallinn', zone: 'Europe/Tallinn', region: 'Europe' },
    { id: 'riga', name: 'Riga', zone: 'Europe/Riga', region: 'Europe' },
    { id: 'vilnius', name: 'Vilnius', zone: 'Europe/Vilnius', region: 'Europe' },
    { id: 'minsk', name: 'Minsk', zone: 'Europe/Minsk', region: 'Europe' },
    { id: 'new-york', name: 'New York', zone: 'America/New_York', region: 'North America' },
    { id: 'washington-dc', name: 'Washington, D.C.', zone: 'America/New_York', region: 'North America' },
    { id: 'boston', name: 'Boston', zone: 'America/New_York', region: 'North America' },
    { id: 'miami', name: 'Miami', zone: 'America/New_York', region: 'North America' },
    { id: 'atlanta', name: 'Atlanta', zone: 'America/New_York', region: 'North America' },
    { id: 'chicago', name: 'Chicago', zone: 'America/Chicago', region: 'North America' },
    { id: 'dallas', name: 'Dallas', zone: 'America/Chicago', region: 'North America' },
    { id: 'austin', name: 'Austin', zone: 'America/Chicago', region: 'North America' },
    { id: 'houston', name: 'Houston', zone: 'America/Chicago', region: 'North America' },
    { id: 'denver', name: 'Denver', zone: 'America/Denver', region: 'North America' },
    { id: 'phoenix', name: 'Phoenix', zone: 'America/Phoenix', region: 'North America' },
    { id: 'los-angeles', name: 'Los Angeles', zone: 'America/Los_Angeles', region: 'North America' },
    { id: 'san-francisco', name: 'San Francisco', zone: 'America/Los_Angeles', region: 'North America' },
    { id: 'san-diego', name: 'San Diego', zone: 'America/Los_Angeles', region: 'North America' },
    { id: 'seattle', name: 'Seattle', zone: 'America/Los_Angeles', region: 'North America' },
    { id: 'anchorage', name: 'Anchorage', zone: 'America/Anchorage', region: 'North America' },
    { id: 'honolulu', name: 'Honolulu', zone: 'Pacific/Honolulu', region: 'North America' },
    { id: 'toronto', name: 'Toronto', zone: 'America/Toronto', region: 'North America' },
    { id: 'montreal', name: 'Montreal', zone: 'America/Toronto', region: 'North America' },
    { id: 'ottawa', name: 'Ottawa', zone: 'America/Toronto', region: 'North America' },
    { id: 'vancouver', name: 'Vancouver', zone: 'America/Vancouver', region: 'North America' },
    { id: 'calgary', name: 'Calgary', zone: 'America/Edmonton', region: 'North America' },
    { id: 'mexico-city', name: 'Mexico City', zone: 'America/Mexico_City', region: 'North America' },
    { id: 'guadalajara', name: 'Guadalajara', zone: 'America/Mexico_City', region: 'North America' },
    { id: 'monterrey', name: 'Monterrey', zone: 'America/Monterrey', region: 'North America' },
    { id: 'tijuana', name: 'Tijuana', zone: 'America/Tijuana', region: 'North America' },
    { id: 'havana', name: 'Havana', zone: 'America/Havana', region: 'North America' },
    { id: 'panama-city', name: 'Panama City', zone: 'America/Panama', region: 'North America' },
    { id: 'bogota', name: 'Bogotá', zone: 'America/Bogota', region: 'South America' },
    { id: 'lima', name: 'Lima', zone: 'America/Lima', region: 'South America' },
    { id: 'quito', name: 'Quito', zone: 'America/Guayaquil', region: 'South America' },
    { id: 'santiago', name: 'Santiago', zone: 'America/Santiago', region: 'South America' },
    { id: 'buenos-aires', name: 'Buenos Aires', zone: 'America/Argentina/Buenos_Aires', region: 'South America' },
    { id: 'sao-paulo', name: 'São Paulo', zone: 'America/Sao_Paulo', region: 'South America' },
    { id: 'rio-de-janeiro', name: 'Rio de Janeiro', zone: 'America/Sao_Paulo', region: 'South America' },
    { id: 'brasilia', name: 'Brasília', zone: 'America/Sao_Paulo', region: 'South America' },
    { id: 'montevideo', name: 'Montevideo', zone: 'America/Montevideo', region: 'South America' },
    { id: 'caracas', name: 'Caracas', zone: 'America/Caracas', region: 'South America' },
    { id: 'la-paz', name: 'La Paz', zone: 'America/La_Paz', region: 'South America' },
    { id: 'sydney', name: 'Sydney', zone: 'Australia/Sydney', region: 'Oceania' },
    { id: 'melbourne', name: 'Melbourne', zone: 'Australia/Melbourne', region: 'Oceania' },
    { id: 'perth', name: 'Perth', zone: 'Australia/Perth', region: 'Oceania' },
    { id: 'brisbane', name: 'Brisbane', zone: 'Australia/Brisbane', region: 'Oceania' },
    { id: 'adelaide', name: 'Adelaide', zone: 'Australia/Adelaide', region: 'Oceania' },
    { id: 'darwin', name: 'Darwin', zone: 'Australia/Darwin', region: 'Oceania' },
    { id: 'auckland', name: 'Auckland', zone: 'Pacific/Auckland', region: 'Oceania' },
    { id: 'wellington', name: 'Wellington', zone: 'Pacific/Auckland', region: 'Oceania' },
    { id: 'port-moresby', name: 'Port Moresby', zone: 'Pacific/Port_Moresby', region: 'Oceania' },
    { id: 'suva', name: 'Suva', zone: 'Pacific/Fiji', region: 'Oceania' },
    { id: 'cairo', name: 'Cairo', zone: 'Africa/Cairo', region: 'Africa' },
    { id: 'johannesburg', name: 'Johannesburg', zone: 'Africa/Johannesburg', region: 'Africa' },
    { id: 'lagos', name: 'Lagos', zone: 'Africa/Lagos', region: 'Africa' },
    { id: 'nairobi', name: 'Nairobi', zone: 'Africa/Nairobi', region: 'Africa' },
    { id: 'addis-ababa', name: 'Addis Ababa', zone: 'Africa/Addis_Ababa', region: 'Africa' },
    { id: 'accra', name: 'Accra', zone: 'Africa/Accra', region: 'Africa' },
    { id: 'casablanca', name: 'Casablanca', zone: 'Africa/Casablanca', region: 'Africa' },
    { id: 'tunis', name: 'Tunis', zone: 'Africa/Tunis', region: 'Africa' },
    { id: 'algiers', name: 'Algiers', zone: 'Africa/Algiers', region: 'Africa' },
    { id: 'dakar', name: 'Dakar', zone: 'Africa/Dakar', region: 'Africa' },
    { id: 'dar-es-salaam', name: 'Dar es Salaam', zone: 'Africa/Dar_es_Salaam', region: 'Africa' },
    { id: 'kampala', name: 'Kampala', zone: 'Africa/Kampala', region: 'Africa' },
    { id: 'kinshasa', name: 'Kinshasa', zone: 'Africa/Kinshasa', region: 'Africa' },
    { id: 'luanda', name: 'Luanda', zone: 'Africa/Luanda', region: 'Africa' },
    { id: 'maputo', name: 'Maputo', zone: 'Africa/Maputo', region: 'Africa' },
    { id: 'lusaka', name: 'Lusaka', zone: 'Africa/Lusaka', region: 'Africa' },
    { id: 'kigali', name: 'Kigali', zone: 'Africa/Kigali', region: 'Africa' },
    { id: 'mcmurdo', name: 'McMurdo Station', zone: 'Antarctica/McMurdo', region: 'Antarctica' }
  ];
  const ALARM_TIME_RE = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
  const PET_INTERVAL_MS = 20000;
  const PET_CLIP_DURATION_MS = 8000;
  const BRAND_PET_INTERVAL_MS = PET_CLIP_DURATION_MS;
  const CLOCK_PERIOD_COLORS = {
    night: '#000000',
    morning: '#FFB07C',
    afternoon: '#A7D8FF',
    evening: '#0F2027'
  };
  const PET_CATALOG = {
    cat: [
      { id: 'cat-peek', name: 'Scottish', src: 'Picture/cat-peek-transparent.png', headerSrc: 'Picture/cat-peek-transparent.png', headerTransparent: true, transparent: true, alarmSound: 'Alarm/cat-alarm.wav' },
      { id: 'cat-persian', name: 'Persian', src: 'Picture/Persian-transparent.webp', alarmSound: 'Alarm/Persian-voice.wav', reveal: 'bottom-up', transparent: true },
      { id: 'cat-ragdoll', name: 'Ragdoll', src: 'Picture/Ragdoll-transparent.webp', alarmSound: 'Alarm/Ragdollvoice.wav', transparent: true, earSafe: true },
      { id: 'cat-siamese', name: 'Siamese', src: 'Picture/siamese-transparent.webp', alarmSound: 'Alarm/siamese voice.wav', transparent: true, earSafe: true }
    ],
    dog: [
      { id: 'dog-01', name: 'Pom', src: 'Picture/pom-transparent.webp', alarmSound: 'Alarm/pom-alarm.wav', reveal: 'bottom-up', transparent: true },
      { id: 'dog-02', name: 'Bulldog', src: 'Picture/bulldog-transparent.webp', alarmSound: 'Alarm/bulldog-alarm.wav', reveal: 'bottom-up', transparent: true },
      { id: 'dog-03', name: 'Golden', src: 'Picture/dog-03-clean-transparent.png', alarmSound: 'Alarm/golden-alarm.wav', size: 'small', transparent: true },
      { id: 'dog-04', name: 'Siberian Husky', src: 'Picture/Siberian Husky-transparent.webp', alarmSound: 'Alarm/siberian-husky-alarm.wav', reveal: 'bottom-up', transparent: true }
    ]
  };
  const DIAL_PALETTES = [
    { id: 'porcelain', name: 'Porcelain', face: '#f8fafc', rim: '#252a31', ink: '#111827', hand: '#111827', accent: '#e04b3f', colors: ['#9de2ed', '#f4a8ba', '#f6d46b'] },
    { id: 'ocean', name: 'Ocean', face: '#b8e9f2', rim: '#274b59', ink: '#132d38', hand: '#132d38', accent: '#ef765c', colors: ['#63c6df', '#8ca8dc', '#e7f2ef'] },
    { id: 'rose', name: 'Rose', face: '#f7d8e5', rim: '#634653', ink: '#352b36', hand: '#352b36', accent: '#dd547b', colors: ['#f5a5bb', '#c4a4e7', '#f7df90'] },
    { id: 'mint', name: 'Mint', face: '#d8f0e5', rim: '#37665b', ink: '#183a34', hand: '#183a34', accent: '#e77455', colors: ['#79d7c2', '#8bc8e8', '#e5d47a'] },
    { id: 'midnight', name: 'Midnight', face: '#272936', rim: '#111318', ink: '#f5e7bd', hand: '#f5e7bd', accent: '#e5b967', colors: ['#39435f', '#71547b', '#a0794d'] }
  ];
  const DIAL_MOTIFS = [
    { id: 'classic', name: 'Classic', pattern: 'solid' },
    { id: 'color-wheel', name: 'Color wheel', pattern: 'quarters' },
    { id: 'rainbow', name: 'Rainbow rings', pattern: 'rings' },
    { id: 'sunrise', name: 'Sunrise', pattern: 'gradient' },
    { id: 'checkered', name: 'Checkered', pattern: 'checker' },
    { id: 'pinstripe', name: 'Pinstripe', pattern: 'stripes' },
    { id: 'confetti', name: 'Confetti', pattern: 'confetti' },
    { id: 'two-tone', name: 'Two tone', pattern: 'halves' },
    { id: 'polka-dot', name: 'Polka dot', pattern: 'dots' }
  ];
  // Clock faces explicitly removed by name.
  const REMOVED_DIAL_STYLE_IDS = new Set([
    'color-wheel-porcelain',
    'two-tone-porcelain',
    'color-wheel-ocean',
    'two-tone-ocean',
    'color-wheel-rose',
    'color-wheel-mint',
    'two-tone-rose',
    'two-tone-mint',
    'sunrise-midnight',
    'checkered-midnight',
    'pinstripe-midnight',
    'confetti-midnight',
    'two-tone-midnight',
    'polka-dot-midnight',
    'classic-midnight',
    'color-wheel-midnight',
    'rainbow-midnight'
  ]);
  const usedDialStyleSignatures = new Set();
  const DIAL_STYLES = DIAL_PALETTES.flatMap((palette, row) => DIAL_MOTIFS
    .map((motif, column) => {
      const replaceMidnightPolkaDots = motif.id === 'polka-dot' && palette.id === 'midnight';
      return {
        ...palette,
        ...(replaceMidnightPolkaDots ? {
          name: 'Pixel clock · Sky blue',
          pattern: 'pixel',
          face: '#57b9df',
          rim: '#080d12',
          ink: '#071018',
          hand: '#f5f5ef',
          accent: '#e73c43',
          colors: ['#57b9df', '#ffd73d', '#e73c43', '#3288cf']
        } : {
          name: motif.name + ' · ' + palette.name,
          pattern: motif.pattern
        }),
        id: motif.id + '-' + palette.id,
        referencePosition: row * DIAL_MOTIFS.length + column
      };
    })
    .filter((style) => !REMOVED_DIAL_STYLE_IDS.has(style.id)))
    .filter((style) => {
      const signature = [
        style.pattern, style.face, style.rim, style.ink, style.hand, style.accent, ...style.colors
      ].join('|');
      if (usedDialStyleSignatures.has(signature)) return false;
      usedDialStyleSignatures.add(signature);
      return true;
    });
  const DEFAULT_DIAL_STYLE = 'classic-porcelain';
  // Settled-frame contact ratios align each pet's paws with the title edge.
  const HEADER_PET_LAYOUTS = {
    'dog-01': { aspectRatio: 16 / 9, tableLine: 524 / 720 },
    'dog-02': { aspectRatio: 16 / 9, tableLine: 600 / 720 },
    'dog-03': { aspectRatio: 9 / 16, tableLine: 272 / 320 },
    'dog-04': { aspectRatio: 16 / 9, tableLine: 676 / 720 },
    'cat-peek': { aspectRatio: 9 / 16, tableLine: 300 / 480 },
    'cat-persian': { aspectRatio: 16 / 9, tableLine: 716 / 720 },
    'cat-ragdoll': { aspectRatio: 16 / 9, tableLine: 708 / 720 },
    'cat-siamese': { aspectRatio: 16 / 9, tableLine: 492 / 720 }
  };
  const PET_POSITIONS = ['top', 'upper-right', 'lower-right', 'bottom', 'lower-left', 'upper-left'];
  const isMini = new URLSearchParams(location.search).get('mini') === '1';
  const miniHiddenClockIds = new Set();
  const baseUrl = location.href.split('?')[0].split('#')[0];
  const grid = document.getElementById('clockGrid');
  const emptyMessage = document.getElementById('emptyMessage');
  const viewCount = document.getElementById('viewCount');
  const dialog = document.getElementById('addDialog');
  const alarmDialog = document.getElementById('alarmDialog');
  const alarmDialogMessage = document.getElementById('alarmDialogMessage');
  const citySelect = document.getElementById('citySelect');
  const citySearch = document.getElementById('citySearch');
  const citySearchEmpty = document.getElementById('citySearchEmpty');
  const searchCityGuide = document.getElementById('searchCityGuide');
  const confirmAddButton = document.getElementById('confirmAdd');
  const confirmAddStep = document.getElementById('confirmAddStep');
  const confirmAddHand = document.getElementById('confirmAddHand');
  let citySelectionMade = false;
  const clockCustomizeDialog = document.getElementById('clockCustomizeDialog');
  const clockCustomizeForm = document.getElementById('clockCustomizeForm');
  const clockCustomizeTitle = document.getElementById('clockCustomizeTitle');
  const dialStyleDialog = document.getElementById('dialStyleDialog');
  const dialStyleTitle = document.getElementById('dialStyleTitle');
  const dialStyleGrid = document.getElementById('dialStyleGrid');
  let dialStyleTarget = null;
  const customCityField = document.getElementById('customCityField');
  const customCityNameInput = document.getElementById('customCityName');
  const offsetSignInput = document.getElementById('offsetSign');
  const offsetHoursInput = document.getElementById('offsetHours');
  const offsetMinutesInput = document.getElementById('offsetMinutes');
  const clockCustomizeError = document.getElementById('clockCustomizeError');
  const saveClockCustomizeButton = document.getElementById('saveClockCustomize');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const headerPetStage = document.getElementById('brandPetStage');
  const headerPetSlot = document.getElementById('brandPetSlot');
  const headerPetImage = document.getElementById('brandPetImage');
  const headerPetVideo = document.getElementById('brandPetVideo');
  const headerPetHeading = headerPetStage.nextElementSibling;
  const headerPetItems = [];
  for (let index = 0; index < Math.max(PET_CATALOG.cat.length, PET_CATALOG.dog.length); index++) {
    const dog = PET_CATALOG.dog[index];
    const cat = PET_CATALOG.cat[index];
    if (dog) headerPetItems.push({ id: dog.id, type: 'dog', name: dog.name, src: dog.src, poster: dog.poster, video: /\.mp4$/i.test(dog.src), transparent: dog.transparent === true });
    if (cat) {
      const source = cat.headerSrc || cat.src;
      headerPetItems.push({
        id: cat.id,
        type: 'cat',
        name: cat.name,
        src: source,
        poster: cat.poster,
        video: /\.mp4$/i.test(source),
        transparent: cat.headerTransparent === true || cat.transparent === true
      });
    }
  }
  let headerPetIndex = 0;
  let headerPetPlaybackToken = 0;
  let cards = [];
  let offsetTarget = null;
  const activeAlarms = new Map();
  let alarmAudioContext = null;
  let alarmChannel = null;
  const windowId = (typeof crypto?.randomUUID === 'function'
    ? crypto.randomUUID()
    : Date.now().toString(36) + '-' + Math.random().toString(36).slice(2));
  let mainWindowSeenAt = 0;
  let mainWindowPresent = false;
  try {
    alarmChannel = new BroadcastChannel('worldclock-alarm:' + (DEFAULT_CITY_ID || 'home'));
  } catch (error) {
    alarmChannel = null;
  }

  function activateAlarmAudioContext() {
    const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextConstructor) return;
    try {
      if (!alarmAudioContext) alarmAudioContext = new AudioContextConstructor();
      if (alarmAudioContext.state === 'suspended') {
        alarmAudioContext.resume().catch((error) => {
          console.warn('Unable to activate Ragdoll alarm volume boost:', error);
        });
      }
    } catch (error) {
      console.warn('Unable to initialize Ragdoll alarm volume boost:', error);
    }
  }
  document.addEventListener('pointerdown', activateAlarmAudioContext, { capture: true, once: true });
  document.addEventListener('keydown', activateAlarmAudioContext, { capture: true, once: true });

  function stopHeaderPetVideo() {
    headerPetVideo.pause();
    headerPetVideo.hidden = true;
    headerPetVideo.removeAttribute('src');
    headerPetVideo.removeAttribute('poster');
    headerPetVideo.load();
  }

  function positionHeaderPet(pet) {
    const layout = HEADER_PET_LAYOUTS[pet.id];
    if (!layout) {
      console.error('Missing header pet table position:', pet.id);
      return;
    }
    const tableY = headerPetHeading.getBoundingClientRect().top - headerPetStage.getBoundingClientRect().top;
    const petScale = pet.id === 'cat-ragdoll' ? 0.7 : 1;
    const height = tableY / layout.tableLine * petScale;
    const width = height * layout.aspectRatio;
    const scaleToFit = Math.min(1, headerPetStage.clientWidth / width);
    const scaledWidth = width * scaleToFit;
    const scaledHeight = height * scaleToFit;
    headerPetSlot.style.width = scaledWidth + 'px';
    headerPetSlot.style.height = scaledHeight + 'px';
    headerPetSlot.style.top = tableY - scaledHeight * layout.tableLine + 'px';
    headerPetSlot.style.transformOrigin = '50% ' + layout.tableLine * 100 + '%';
  }

  headerPetSlot.dataset.petName = headerPetItems[headerPetIndex].name;
  positionHeaderPet(headerPetItems[headerPetIndex]);

  function showNextHeaderPet() {
    headerPetIndex = (headerPetIndex + 1) % headerPetItems.length;
    const pet = headerPetItems[headerPetIndex];
    const playbackToken = ++headerPetPlaybackToken;
    headerPetSlot.dataset.petName = pet.name;
    positionHeaderPet(pet);
    stopHeaderPetVideo();
    headerPetImage.hidden = pet.video;
    headerPetImage.classList.toggle('is-blended', !pet.transparent);
    if (pet.video) {
      headerPetVideo.hidden = false;
      headerPetVideo.classList.toggle('is-blended', !pet.transparent);
      headerPetVideo.poster = pet.poster || '';
      headerPetVideo.src = pet.src;
      headerPetVideo.load();
    } else {
      headerPetImage.src = pet.src;
      headerPetImage.alt = pet.name + (pet.type === 'cat' ? ' cat' : ' dog');
    }
    const slotWidth = headerPetSlot.getBoundingClientRect().width;
    const availableWidth = Math.max(0, headerPetStage.clientWidth - slotWidth);
    headerPetSlot.style.left = (slotWidth / 2 + Math.random() * availableWidth) + 'px';
    headerPetSlot.classList.remove('is-appearing');
    void headerPetSlot.offsetWidth;
    headerPetSlot.classList.add('is-appearing');
    if (pet.video) {
      headerPetVideo.play().catch((error) => {
        if (playbackToken !== headerPetPlaybackToken || error.name === 'AbortError') return;
        console.warn('Unable to play rotating header pet video:', error);
      });
    }
  }

  headerPetImage.addEventListener('error', () => {
    console.warn('Unable to load rotating header pet image:', headerPetImage.currentSrc);
  });
  headerPetVideo.addEventListener('error', () => {
    if (!headerPetVideo.hidden) {
      console.warn('Unable to load rotating header pet video:', headerPetVideo.currentSrc);
    }
  });
  if (!isMini) {
    window.setInterval(() => {
      if (!reduceMotion.matches) showNextHeaderPet();
    }, BRAND_PET_INTERVAL_MS);
  }
  window.addEventListener('resize', () => {
    positionHeaderPet(headerPetItems[headerPetIndex]);
    headerPetSlot.style.left = (headerPetStage.clientWidth / 2) + 'px';
  });

  function isValidOffsetMinutes(value) {
    return Number.isInteger(value) && value >= -720 && value <= 840;
  }

  function getCityForItem(item) {
    if (typeof item.id !== 'string') return null;
    const city = CITIES.find((entry) => entry.id === item.id);
    if (city) return city;
    if (typeof item.customName !== 'string' || !item.customName.trim() || !isValidOffsetMinutes(item.offsetMinutes)) return null;
    return { id: item.id, name: item.customName.trim().slice(0, 60), zone: 'UTC', region: 'Custom' };
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
  }

  function getDialStyle(styleId) {
    return DIAL_STYLES.find((style) => style.id === styleId) || DIAL_STYLES.find((style) => style.id === DEFAULT_DIAL_STYLE);
  }

  // Clock state and categorized local storage
  function getDefaultClockState() {
    const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const city = CITIES.find((entry) => entry.id === DEFAULT_CITY_ID) ||
      CITIES.find((entry) => entry.zone === localZone) ||
      CITIES.find((entry) => entry.id === 'bangkok');
    return [{
      id: city.id, animation: true, petType: 'cat', petId: 'cat-peek', dialStyle: DEFAULT_DIAL_STYLE,
      alarms: []
    }];
  }

  function loadState() {
    try {
      const currentState = localStorage.getItem(STORAGE_KEYS.cities);
      const storedState = currentState ??
        LEGACY_STORAGE_KEYS.map((key) => localStorage.getItem(key)).find((value) => value !== null) ??
        null;
      const saved = storedState === null ? null : JSON.parse(storedState);
      const storedAlarms = localStorage.getItem(STORAGE_KEYS.alarms);
      const alarmsByClock = storedAlarms === null ? [] : JSON.parse(storedAlarms);
      if (Array.isArray(saved)) {
        return saved.map((item, index) => ({ item, index })).filter(({ item }) => {
          if (!item || typeof item !== 'object') return false;
          if (CITIES.some((city) => city.id === item.id)) return true;
          return getCityForItem(item) !== null;
        }).map(({ item, index }) => {
            const petType = item.petType === 'dog' ? 'dog' : 'cat';
            const petId = PET_CATALOG[petType].some((pet) => pet.id === item.petId)
              ? item.petId
              : PET_CATALOG[petType][0].id;
            const savedAlarms = Array.isArray(alarmsByClock[index])
              ? alarmsByClock[index]
              : Array.isArray(item.alarms)
              ? item.alarms
              : item.alarmTime
                ? [{ time: item.alarmTime, enabled: item.alarmEnabled, lastAlarmDate: item.lastAlarmDate }]
                : [];
            const usedAlarmIds = new Set();
            const alarms = savedAlarms.filter((alarm) => alarm && typeof alarm === 'object').map((alarm, index) => {
              const time = typeof alarm.time === 'string' && ALARM_TIME_RE.test(alarm.time) ? alarm.time : '';
              let alarmId = typeof alarm.id === 'string' && alarm.id ? alarm.id : 'legacy-' + index + '-' + time;
              while (usedAlarmIds.has(alarmId)) alarmId = createAlarmId();
              usedAlarmIds.add(alarmId);
              return {
                id: alarmId,
                time,
                enabled: alarm.enabled === true && time !== '',
                lastAlarmDate: typeof alarm.lastAlarmDate === 'string' ? alarm.lastAlarmDate : null
              };
            });
            return {
              id: item.id,
              customName: typeof item.customName === 'string' ? item.customName.trim().slice(0, 60) : '',
              offsetMinutes: isValidOffsetMinutes(item.offsetMinutes) ? item.offsetMinutes : null,
              animation: item.animation !== false,
              petType,
              petId,
              dialStyle: getDialStyle(item.dialStyle).id,
              alarms
            };
          });
      }
    } catch (error) {
      console.warn('Unable to load saved clocks:', error);
    }
    return getDefaultClockState();
  }
  let state = loadState();

  function saveState(syncWindows = true) {
    try {
      const savedCities = state.map(({ alarms, ...city }) => city);
      const savedAlarms = state.map((city) => city.alarms);
      localStorage.setItem(STORAGE_KEYS.cities, JSON.stringify(savedCities));
      localStorage.setItem(STORAGE_KEYS.alarms, JSON.stringify(savedAlarms));
      if (syncWindows && alarmChannel) {
        alarmChannel.postMessage({
          type: 'state-updated',
          state,
          senderId: windowId
        });
      }
    } catch (error) {
      console.warn('Unable to save clocks:', error);
    }
  }

  try {
    if (localStorage.getItem(STORAGE_KEYS.cities) === null ||
      localStorage.getItem(STORAGE_KEYS.alarms) === null) saveState();
  } catch (error) {
    console.warn('Unable to initialize alarm settings:', error);
  }

  // Alarm controls, persistence, synchronization, and playback
  function syncAlarmControls(ref) {
    const alarmList = ref.card.querySelector('.alarm-list');
    alarmList.replaceChildren();
    ref.item.alarms.forEach((alarm) => {
      const row = document.createElement('div');
      row.className = 'alarm-row';
      const timeInput = document.createElement('input');
      timeInput.className = 'alarm-time';
      timeInput.type = 'time';
      timeInput.value = alarm.time;
      timeInput.dataset.alarmId = alarm.id;
      timeInput.setAttribute('aria-label', 'Alarm time for ' + ref.city.name);
      timeInput.setAttribute('aria-invalid', 'false');
      timeInput.addEventListener('change', () => setAlarmTime(ref, alarm.id, timeInput.value));
      const toggleButton = document.createElement('button');
      toggleButton.className = 'alarm-row-toggle';
      toggleButton.type = 'button';
      toggleButton.textContent = alarm.enabled ? 'On' : 'Off';
      toggleButton.dataset.alarmId = alarm.id;
      toggleButton.setAttribute('aria-pressed', String(alarm.enabled));
      toggleButton.setAttribute('aria-label', (alarm.enabled ? 'Disable' : 'Enable') + ' alarm ' + (alarm.time || 'without a time'));
      toggleButton.addEventListener('click', () => setAlarmEnabled(ref, alarm.id, !alarm.enabled));
      const removeButton = document.createElement('button');
      removeButton.className = 'alarm-remove';
      removeButton.type = 'button';
      removeButton.textContent = '×';
      removeButton.dataset.alarmId = alarm.id;
      removeButton.setAttribute('aria-label', 'Remove alarm ' + (alarm.time || 'without a time'));
      removeButton.addEventListener('click', () => removeAlarm(ref, alarm.id));
      row.append(timeInput, toggleButton, removeButton);
      alarmList.appendChild(row);
    });
    const enabledCount = ref.item.alarms.filter((alarm) => alarm.enabled).length;
    const configuredCount = ref.item.alarms.filter((alarm) => alarm.time).length;
    const alarmToggle = ref.card.querySelector('.alarm-toggle');
    alarmToggle.classList.toggle('is-on', enabledCount > 0);
    alarmToggle.title = enabledCount ? enabledCount + ' alarm(s) on' : 'Set alarm';
    ref.card.querySelector('.alarm-status').textContent = configuredCount
      ? enabledCount + ' of ' + configuredCount + ' alarms on'
      : ref.item.alarms.length ? 'Choose a time' : 'No alarms set';
  }

  function getAlarmKey(ref, alarm) {
    return JSON.stringify([ref.city.id, alarm.id]);
  }

  function focusAlarmControl(ref, alarmId, selector) {
    Array.from(ref.card.querySelectorAll(selector))
      .find((control) => control.dataset.alarmId === alarmId)
      ?.focus();
  }

  function stopAlarmAudio(alarm) {
    if (alarm.audio) {
      alarm.audio.pause();
      alarm.audio.currentTime = 0;
    }
    if (alarm.sourceNode) {
      alarm.sourceNode.disconnect();
      alarm.sourceNode = null;
    }
    if (alarm.gainNode) {
      alarm.gainNode.disconnect();
      alarm.gainNode = null;
    }
  }

  function stopAlarmEntry(ref, alarm) {
    const key = getAlarmKey(ref, alarm);
    const activeAlarm = activeAlarms.get(key);
    if (activeAlarm) stopAlarmAudio(activeAlarm);
    activeAlarms.delete(key);
    if (activeAlarms.size === 0) {
      if (alarmDialog.open) alarmDialog.close();
    } else {
      updateAlarmMessage();
    }
  }

  function setAlarmTime(ref, alarmId, time) {
    const alarm = ref.item.alarms.find((entry) => entry.id === alarmId);
    if (!alarm) return;
    if (time && !ALARM_TIME_RE.test(time)) {
      const input = Array.from(ref.card.querySelectorAll('.alarm-time')).find((entry) => entry.dataset.alarmId === alarmId);
      if (input) input.setAttribute('aria-invalid', 'true');
      ref.card.querySelector('.alarm-status').textContent = 'Choose a valid time';
      return;
    }
    if (alarm.time !== time) {
      stopAlarmEntry(ref, alarm);
      alarm.time = time;
      alarm.lastAlarmDate = null;
    }
    if (!time) {
      alarm.enabled = false;
    }
    syncAlarmControls(ref);
    focusAlarmControl(ref, alarmId, '.alarm-time');
    saveState();
  }

  function setAlarmEnabled(ref, alarmId, enabled) {
    const alarm = ref.item.alarms.find((entry) => entry.id === alarmId);
    if (!alarm) return;
    if (enabled && !ALARM_TIME_RE.test(alarm.time)) {
      const input = Array.from(ref.card.querySelectorAll('.alarm-time')).find((entry) => entry.dataset.alarmId === alarmId);
      if (input) {
        input.setAttribute('aria-invalid', 'true');
        input.focus();
      }
      ref.card.querySelector('.alarm-status').textContent = 'Choose a time';
      return;
    }
    alarm.enabled = enabled;
    if (!enabled) stopAlarmEntry(ref, alarm);
    syncAlarmControls(ref);
    focusAlarmControl(ref, alarmId, '.alarm-row-toggle');
    saveState();
  }

  function addAlarm(ref) {
    let id = createAlarmId();
    while (state.some((item) => item.alarms.some((alarm) => alarm.id === id))) id = createAlarmId();
    const alarm = { id, time: '', enabled: false, lastAlarmDate: null };
    ref.item.alarms.push(alarm);
    syncAlarmControls(ref);
    saveState();
    Array.from(ref.card.querySelectorAll('.alarm-time')).find((input) => input.dataset.alarmId === alarm.id)?.focus();
  }

  function removeAlarm(ref, alarmId) {
    const alarm = ref.item.alarms.find((entry) => entry.id === alarmId);
    if (!alarm) return;
    stopAlarmEntry(ref, alarm);
    ref.item.alarms = ref.item.alarms.filter((entry) => entry.id !== alarmId);
    syncAlarmControls(ref);
    ref.card.querySelector('.alarm-add').focus();
    saveState();
  }

  function getAlarmPet(ref) {
    return PET_CATALOG[ref.item.petType].find((pet) => pet.id === ref.item.petId);
  }

  function updateAlarmMessage() {
    const alarms = Array.from(activeAlarms.values());
    const names = alarms.map((alarm) => alarm.name);
    const soundFailed = alarms.some((alarm) => alarm.soundFailed);
    const soundUnavailable = alarms.some((alarm) => alarm.soundUnavailable);
    alarmDialogMessage.textContent = names.length
      ? 'Alarm time for ' + names.join(', ') +
        (soundFailed ? '. Pet sound could not be played.' : '') +
        (soundUnavailable ? '. Pet alarm sound is not available yet.' : '')
      : '';
  }

  function startAlarm(ref, alarmEntry) {
    const pet = getAlarmPet(ref);
    if (!pet) {
      console.error('No alarm sound is configured for pet:', ref.item.petId);
      return;
    }
    const alarmKey = getAlarmKey(ref, alarmEntry);
    const alarm = {
      name: ref.city.name + ' ' + alarmEntry.time,
      cityId: ref.city.id,
      audio: null,
      sourceNode: null,
      gainNode: null,
      soundFailed: false,
      soundUnavailable: !pet.alarmSound
    };
    activeAlarms.set(alarmKey, alarm);
    updateAlarmMessage();
    if (!alarmDialog.open) alarmDialog.showModal();
    if (alarmChannel) {
      alarmChannel.postMessage({
        type: 'alarm-started',
        alarmKey,
        name: alarm.name,
        cityId: alarm.cityId,
        senderId: windowId
      });
    }
    if (!pet.alarmSound) return;
    const audio = new Audio(pet.alarmSound);
    audio.preload = 'auto';
    audio.loop = true;
    audio.volume = pet.id === 'cat-ragdoll' ? 0.65 * 1.5 : 0.65;
    alarm.audio = audio;
    if (pet.id === 'cat-ragdoll') {
      if (alarmAudioContext && alarmAudioContext.state === 'running') {
        try {
          alarm.sourceNode = alarmAudioContext.createMediaElementSource(audio);
          alarm.gainNode = alarmAudioContext.createGain();
          alarm.gainNode.gain.value = 1.3;
          alarm.sourceNode.connect(alarm.gainNode);
          alarm.gainNode.connect(alarmAudioContext.destination);
        } catch (error) {
          if (alarm.sourceNode) {
            alarm.sourceNode.disconnect();
            alarm.sourceNode.connect(alarmAudioContext.destination);
            alarm.sourceNode = null;
          }
          if (alarm.gainNode) {
            alarm.gainNode.disconnect();
            alarm.gainNode = null;
          }
          console.warn('Unable to amplify Ragdoll alarm sound:', error);
        }
      } else {
        audio.volume = 1;
        console.warn('Ragdoll alarm volume boost is unavailable because Web Audio is not active.');
      }
    }
    audio.play().catch((error) => {
      if (activeAlarms.get(alarmKey) === alarm) {
        console.warn('Unable to play pet alarm sound:', error);
        alarm.soundFailed = true;
        updateAlarmMessage();
      }
    });
  }

  function stopAlarmSound() {
    activeAlarms.forEach(stopAlarmAudio);
  }

  function stopAllAlarms(syncWindows = true) {
    stopAlarmSound();
    activeAlarms.clear();
    if (alarmDialog.open) alarmDialog.close();
    if (!syncWindows) return;
    if (alarmChannel) alarmChannel.postMessage({ type: 'stop-all-alarms' });
    try {
      localStorage.setItem('worldclock.stop-alarm', String(Date.now()) + '-' + Math.random());
    } catch (error) {
      console.warn('Unable to broadcast alarm stop:', error);
    }
  }

  if (alarmChannel) {
    alarmChannel.addEventListener('message', (event) => {
      const message = event.data;
      if (!message || message.senderId === windowId) return;
      if (message.type === 'stop-all-alarms') stopAllAlarms(false);
      if (message.type === 'state-updated' && Array.isArray(message.state)) {
        state = message.state;
        render();
      }
      if (message.type === 'presence') {
        if (!message.isMini) {
          mainWindowSeenAt = Date.now();
          mainWindowPresent = true;
        }
      }
      if (message.type === 'alarm-started') {
        if (!activeAlarms.has(message.alarmKey)) {
          activeAlarms.set(message.alarmKey, {
            name: message.name,
            cityId: message.cityId,
            audio: null,
            soundFailed: false,
            soundUnavailable: false
          });
        }
        updateAlarmMessage();
        if (!alarmDialog.open) alarmDialog.showModal();
      }
    });
  }
  window.addEventListener('storage', (event) => {
    if (event.key === 'worldclock.stop-alarm') stopAllAlarms(false);
    if (event.key === STORAGE_KEYS.cities || event.key === STORAGE_KEYS.alarms) {
      const syncedState = loadState();
      if (JSON.stringify(syncedState) !== JSON.stringify(state)) {
        state = syncedState;
        render();
      }
    }
  });

  function publishWindowPresence() {
    if (!alarmChannel) return;
    alarmChannel.postMessage({
      type: 'presence',
      isMini,
      senderId: windowId
    });
  }
  publishWindowPresence();
  window.setInterval(() => {
    publishWindowPresence();
    if (isMini && mainWindowPresent && Date.now() - mainWindowSeenAt >= 4000) {
      mainWindowPresent = false;
    }
  }, 1000);

  function stopAlarmForCity(cityId) {
    activeAlarms.forEach((activeAlarm, key) => {
      if (activeAlarm.cityId !== cityId) return;
      stopAlarmAudio(activeAlarm);
      activeAlarms.delete(key);
    });
    if (activeAlarms.size === 0) {
      stopAlarmSound();
      if (alarmDialog.open) alarmDialog.close();
    } else {
      updateAlarmMessage();
    }
  }

  function recordVisit() {
    try {
      const savedCount = localStorage.getItem(STORAGE_KEYS.visits);
      const previousCount = savedCount === null ? 0 : Number(savedCount);
      if (!Number.isSafeInteger(previousCount) || previousCount < 0 || previousCount === Number.MAX_SAFE_INTEGER) {
        throw new Error('Stored view count is invalid');
      }
      const count = previousCount + 1;
      localStorage.setItem(STORAGE_KEYS.visits, String(count));
      viewCount.textContent = 'View Count: ' + count;
    } catch (error) {
      console.warn('Unable to update view count:', error);
      viewCount.textContent = 'View Count unavailable';
    }
  }

  // Clock faces, pets, and rendering
  function petMediaMarkup(petType, petId) {
    const pets = PET_CATALOG[petType] || PET_CATALOG.cat;
    const selectedPet = pets.find((pet) => pet.id === petId) || pets[0];
    return PET_POSITIONS.map((position) => {
      const petClass = (petType === 'dog' ? ' pet-dog' : '') +
        (selectedPet.reveal === 'bottom-up' ? ' pet-reveal-bottom-up' : '') +
        (selectedPet.transparent ? ' pet-transparent' : '') +
        (selectedPet.earSafe ? ' pet-ear-safe' : '') +
        (selectedPet.id === 'cat-peek' ? ' pet-portrait' : '') +
        (selectedPet.id === 'cat-ragdoll' ? ' pet-ragdoll' : '') +
        (selectedPet.id === 'dog-03' ? ' pet-golden' : '') +
        (selectedPet.size === 'small' ? ' pet-dog-small' : '');
      if (selectedPet.transparent) {
        return '<img class="peek-cat peek-cat--' + position + petClass + '" data-src="' + selectedPet.src + '" alt="">';
      }
      const poster = selectedPet.poster ? ' poster="' + selectedPet.poster + '"' : '';
      return '<video class="peek-cat peek-cat--' + position + petClass + '" src="' + selectedPet.src + '"' + poster + ' muted playsinline preload="metadata"></video>';
    }).join('');
  }

  function peekWindowClass(petId) {
    if (petId === 'cat-ragdoll') return 'peek-window peek-window--ragdoll';
    if (petId === 'cat-siamese') return 'peek-window peek-window--wide';
    return 'peek-window';
  }

  function petChoiceMarkup(petType, petId, expandedPetType) {
    return ['cat', 'dog'].map((type) => {
      const choices = PET_CATALOG[type].map((pet) =>
        '<button class="pet-choice" type="button" data-pet-id="' + pet.id + '" aria-pressed="' +
        String(petType === type && pet.id === petId) + '">' + pet.name + '</button>'
      ).join('');
      return '<div class="pet-type-option"><button class="pet-type-button" type="button" data-pet-type="' + type +
        '" aria-pressed="' + String(petType === type) + '">' + (type === 'cat' ? 'Cat' : 'Dog') +
        '</button><div class="pet-choices" data-choices-for="' + type + '"' +
        (expandedPetType === type ? '' : ' hidden') + '>' + choices + '</div></div>';
    }).join('');
  }

  function dialFaceVariables(style) {
    return '--dial-ink:' + style.ink + ';--dial-tick:' + style.ink + ';--dial-hand:' + style.hand +
      ';--dial-accent:' + style.accent;
  }

  function dialBackgroundMarkup(style, id) {
    const patternId = id + '-pattern';
    const colors = style.colors;
    let definitions = '';
    let artwork = '';
    if (style.pattern === 'pixel') {
      const cellSize = 200 / 21;
      const pixels = [];
      for (let row = 0; row < 21; row++) {
        for (let column = 0; column < 21; column++) {
          const dx = column - 10;
          const dy = row - 10;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance > 10.5) continue;
          const fill = distance >= 9.7 ? style.rim : style.face;
          pixels.push('<rect x="' + (column * cellSize).toFixed(2) + '" y="' +
            (row * cellSize).toFixed(2) + '" width="' + (cellSize + .1).toFixed(2) +
            '" height="' + (cellSize + .1).toFixed(2) + '" fill="' + fill +
            '" shape-rendering="crispEdges"/>');
        }
      }
      artwork = pixels.join('');
    } else if (style.pattern === 'quarters') {
      artwork = '<circle class="dial-face" cx="100" cy="100" r="96" fill="' + style.face + '"/>' +
        '<path d="M100 100L100 4A96 96 0 0 0 4 100Z" fill="' + colors[0] + '"/>' +
        '<path d="M100 100L196 100A96 96 0 0 0 100 4Z" fill="' + colors[1] + '"/>' +
        '<path d="M100 100L100 196A96 96 0 0 0 196 100Z" fill="' + style.accent + '"/>' +
        '<path d="M100 100L4 100A96 96 0 0 0 100 196Z" fill="' + colors[2] + '"/>';
    } else if (style.pattern === 'rings') {
      artwork = '<circle class="dial-face" cx="100" cy="100" r="96" fill="' + style.face + '"/>' +
        [82, 68, 54, 40].map((radius, index) =>
          '<circle cx="100" cy="100" r="' + radius + '" fill="none" stroke="' +
          colors[index % colors.length] + '" stroke-width="7" opacity=".8"/>'
        ).join('');
    } else if (style.pattern === 'gradient') {
      definitions = '<linearGradient id="' + patternId + '" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0" stop-color="' + colors[0] + '"/><stop offset=".5" stop-color="' + style.face +
        '"/><stop offset="1" stop-color="' + style.accent + '"/></linearGradient>';
      artwork = '<circle class="dial-face" cx="100" cy="100" r="96" fill="url(#' + patternId + ')"/>';
    } else if (style.pattern === 'checker') {
      definitions = '<pattern id="' + patternId + '" width="20" height="20" patternUnits="userSpaceOnUse">' +
        '<rect width="20" height="20" fill="' + style.face + '"/><path d="M0 0H10V10H20V20H10V10H0Z" fill="' +
        colors[0] + '"/></pattern>';
      artwork = '<circle class="dial-face" cx="100" cy="100" r="96" fill="url(#' + patternId + ')"/>';
    } else if (style.pattern === 'stripes') {
      definitions = '<pattern id="' + patternId + '" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">' +
        '<rect width="14" height="14" fill="' + style.face + '"/><path d="M0 0V14" stroke="' + colors[0] +
        '" stroke-width="5"/></pattern>';
      artwork = '<circle class="dial-face" cx="100" cy="100" r="96" fill="url(#' + patternId + ')"/>';
    } else if (style.pattern === 'confetti') {
      definitions = '<pattern id="' + patternId + '" width="38" height="38" patternUnits="userSpaceOnUse">' +
        '<rect width="38" height="38" fill="' + style.face + '"/><circle cx="8" cy="9" r="3" fill="' + colors[0] +
        '"/><circle cx="27" cy="25" r="2.5" fill="' + style.accent + '"/><path d="M18 3l3 5-4 3-3-5z" fill="' +
        colors[1] + '"/><path d="M3 29l5-3 3 4-5 3z" fill="' + colors[2] + '"/></pattern>';
      artwork = '<circle class="dial-face" cx="100" cy="100" r="96" fill="url(#' + patternId + ')"/>';
    } else if (style.pattern === 'halves') {
      artwork = '<circle class="dial-face" cx="100" cy="100" r="96" fill="' + style.face + '"/>' +
        '<path d="M100 4A96 96 0 0 0 100 196Z" fill="' + colors[0] + '"/>' +
        '<path d="M100 4A96 96 0 0 1 100 196Z" fill="' + style.accent + '"/>';
    } else if (style.pattern === 'dots') {
      definitions = '<pattern id="' + patternId + '" width="18" height="18" patternUnits="userSpaceOnUse">' +
        '<rect width="18" height="18" fill="' + style.face + '"/><circle cx="5" cy="5" r="2.5" fill="' +
        colors[0] + '"/><circle cx="14" cy="14" r="2.5" fill="' + style.accent + '"/></pattern>';
      artwork = '<circle class="dial-face" cx="100" cy="100" r="96" fill="url(#' + patternId + ')"/>';
    } else {
      artwork = '<circle class="dial-face" cx="100" cy="100" r="96" fill="' + style.face + '"/>';
    }
    return '<defs>' + definitions + '</defs>' + artwork +
      '<circle cx="100" cy="100" r="91" fill="none" stroke="' + style.rim + '" stroke-width="1" opacity=".35"/>' +
      '<circle cx="100" cy="100" r="96" fill="none" stroke="' + style.rim + '" stroke-width="4"/>';
  }

  function dialDetailsMarkup(style) {
    if (style.pattern === 'pixel') {
      const numerals = Array.from({ length: 12 }, (_, i) => {
        const n = i + 1;
        const angle = n * Math.PI / 6;
        const x = (100 + 77 * Math.sin(angle)).toFixed(1);
        const y = (100 - 77 * Math.cos(angle)).toFixed(1);
        return '<text class="dial-number" x="' + x + '" y="' + y +
          '" text-anchor="middle" dominant-baseline="central" font-size="16" font-family="monospace" font-weight="900">' + n + '</text>';
      }).join('');
      return '<g>' + numerals + '</g>' +
        '<g class="hour-hand" shape-rendering="crispEdges"><line x1="100" y1="100" x2="100" y2="58" stroke="#080d12" stroke-width="9"/><line class="dial-hand" x1="100" y1="100" x2="100" y2="58" stroke-width="4"/></g>' +
        '<g class="minute-hand" shape-rendering="crispEdges"><line x1="100" y1="100" x2="139" y2="61" stroke="#080d12" stroke-width="9"/><line class="dial-hand" x1="100" y1="100" x2="139" y2="61" stroke-width="4"/></g>' +
        '<line class="dial-second second-hand" x1="100" y1="108" x2="100" y2="164" stroke-width="2"/>' +
        '<rect x="95" y="95" width="10" height="10" fill="#080d12"/>' +
        '<rect x="97" y="105" width="6" height="5" fill="' + style.colors[1] + '"/>' +
        '<rect x="97" y="110" width="6" height="5" fill="' + style.colors[2] + '"/>' +
        '<rect x="97" y="115" width="6" height="5" fill="' + style.colors[3] + '"/>';
    }
    const ticks = Array.from({ length: 60 }, (_, i) => {
      const major = i % 5 === 0;
      const angle = i * 6;
      return '<line class="dial-tick' + (major ? ' dial-tick-major' : '') + '" x1="100" y1="' +
        (major ? 11 : 14) + '" x2="100" y2="20" transform="rotate(' + angle +
        ' 100 100)" stroke-width="' + (major ? 2 : 1) + '" stroke-linecap="round"/>';
    }).join('');
    const numerals = Array.from({ length: 12 }, (_, i) => {
      const n = i + 1;
      const angle = n * Math.PI / 6;
      const x = (100 + 65 * Math.sin(angle)).toFixed(1);
      const y = (100 - 65 * Math.cos(angle)).toFixed(1);
      return '<text class="dial-number" x="' + x + '" y="' + y +
        '" text-anchor="middle" dominant-baseline="central" font-size="16" font-weight="700">' + n + '</text>';
    }).join('');
    return '<g>' + ticks + '</g><g>' + numerals + '</g>' +
      '<line class="dial-hand hour-hand" x1="100" y1="100" x2="100" y2="57" stroke-width="5" stroke-linecap="round"/>' +
      '<line class="dial-hand minute-hand" x1="100" y1="100" x2="100" y2="34" stroke-width="3" stroke-linecap="round"/>' +
      '<line class="dial-second second-hand" x1="100" y1="108" x2="100" y2="27" stroke-width="1.5" stroke-linecap="round"/>' +
      '<circle cx="100" cy="100" r="4" fill="var(--dial-accent)"/>';
  }

  function dialPreviewMarkup(style) {
    const uid = 'preview-' + style.id;
    return '<svg class="dial-style-preview" viewBox="0 0 200 200" aria-hidden="true" style="' +
      dialFaceVariables(style) + '">' + dialBackgroundMarkup(style, uid) +
      (style.pattern === 'pixel'
        ? dialDetailsMarkup(style)
        : '<line class="dial-hand" x1="100" y1="100" x2="100" y2="47" stroke-width="6" stroke-linecap="round"/>' +
          '<line class="dial-second" x1="100" y1="100" x2="145" y2="64" stroke-width="3" stroke-linecap="round"/>' +
          '<circle cx="100" cy="100" r="5" fill="var(--dial-accent)"/>') + '</svg>';
  }

  function clockMarkup(city, petType, petId, dialStyle, itemId) {
    const style = getDialStyle(dialStyle);
    const peekPets = petMediaMarkup(petType, petId);
    const faceRole = isMini ? 'img' : 'button';
    const faceLabel = isMini ? 'Analog clock for ' + escapeHtml(city.name) :
      'Change clock face style for ' + escapeHtml(city.name);
    const faceTabIndex = isMini ? '' : ' tabindex="0"';
    const styleId = 'clock-' + String(itemId).replace(/[^a-zA-Z0-9_-]/g, '-');
    return '<div class="face" role="' + faceRole + '" aria-label="' + faceLabel + '"' + faceTabIndex +
      ' data-dial-style="' + style.id + '" style="' + dialFaceVariables(style) + '">' +
      '<svg class="dial-bg" viewBox="0 0 200 200" aria-hidden="true">' +
      dialBackgroundMarkup(style, styleId) + '</svg>' +
      '<span class="' + peekWindowClass(petId) + '" aria-hidden="true">' + peekPets + '</span>' +
      '<svg class="dial-details" viewBox="0 0 200 200" aria-hidden="true">' +
      dialDetailsMarkup(style) + '</svg></div>';
  }

  function renderDialStyleOptions(ref) {
    dialStyleTitle.textContent = 'Choose a clock face for ' + ref.city.name;
    dialStyleGrid.replaceChildren(...DIAL_STYLES.map((style) => {
      const option = document.createElement('button');
      option.className = 'dial-style-option';
      option.type = 'button';
      option.setAttribute('aria-pressed', String(ref.item.dialStyle === style.id));
      option.innerHTML = dialPreviewMarkup(style);
      const label = document.createElement('span');
      label.textContent = style.name;
      option.appendChild(label);
      option.addEventListener('click', () => {
        if (isMini || !dialStyleTarget) return;
        const target = dialStyleTarget;
        target.item.dialStyle = style.id;
        applyDialStyle(target);
        saveState();
        dialStyleDialog.close();
        target.card.querySelector('.face').focus();
      });
      return option;
    }));
  }

  function openDialStyleDialog(ref) {
    if (isMini) return;
    dialStyleTarget = ref;
    renderDialStyleOptions(ref);
    if (!dialStyleDialog.open) dialStyleDialog.showModal();
  }

  function applyDialStyle(ref) {
    const style = getDialStyle(ref.item.dialStyle);
    const face = ref.card.querySelector('.face');
    const styleId = 'clock-' + String(ref.item.id).replace(/[^a-zA-Z0-9_-]/g, '-');
    face.dataset.dialStyle = style.id;
    face.setAttribute('style', dialFaceVariables(style));
    face.querySelector('.dial-bg').innerHTML = dialBackgroundMarkup(style, styleId);
    face.querySelector('.dial-details').innerHTML = dialDetailsMarkup(style);
    updateClock(ref, Date.now());
  }

  function render() {
    grid.replaceChildren();
    cards = [];
    const visibleState = isMini
      ? state.filter((item) => !miniHiddenClockIds.has(item.id))
      : state;
    emptyMessage.hidden = visibleState.length > 0;
    visibleState.forEach((item) => {
      const city = getCityForItem(item);
      if (!city) return;
      const card = document.createElement('article');
      card.className = 'clock-card';
      const hasCustomEdit = Boolean(item.customName && item.customName.trim());
      card.innerHTML = '<div class="card-tools"><button class="delete" type="button" aria-label="Remove clock">Delete</button>' +
        (hasCustomEdit ? '<button class="edit-clock" type="button"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z"/></svg></button>' : '') + '</div>' +
        '<div class="clock-content"><div class="city-row">' +
        '<aside class="alarm-side" aria-label="Alarm controls">' +
        '<button class="alarm-toggle" type="button" aria-label="Alarm" aria-expanded="false">Alarm Set</button>' +
        '<div class="alarm-settings" hidden><div class="alarm-list"></div>' +
        '<button class="alarm-add" type="button">+ Add alarm</button>' +
        '<span class="alarm-status" aria-live="polite">No alarms set</span></div></aside><h2 class="city"><span class="city-name"></span><span class="day-period"></span></h2></div>' +
        clockMarkup(city, item.petType, item.petId, item.dialStyle, item.id) +
        '<div class="pet-controls"><button class="animation-button" type="button" aria-pressed="' + String(item.animation) + '">Animation</button>' +
        '<div class="pet-type-switch" role="group" aria-label="Choose clock pet">' +
        petChoiceMarkup(item.petType, item.petId, null) + '</div></div></div>';
      card.querySelector('.city-name').textContent = city.name;
      card.querySelector('.delete').setAttribute('aria-label', 'Remove ' + city.name + ' clock');
      card.querySelector('.alarm-side').setAttribute('aria-label', 'Alarm for ' + city.name);
      const ref = {
        card, city, item, pet: [], activePetIndex: -1, activeStartAt: null,
        nextPeekAt: item.animation ? Date.now() : null, nextPositionIndex: 0, expandedPetType: null
      };
      syncAlarmControls(ref);
      bindPetMedia(ref);
      if (!isMini) {
        const face = card.querySelector('.face');
        face.addEventListener('click', () => openDialStyleDialog(ref));
        face.addEventListener('keydown', (event) => {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          event.preventDefault();
          openDialStyleDialog(ref);
        });
      }
      card.querySelector('.delete').addEventListener('click', () => {
        stopAlarmForCity(city.id);
        if (isMini) {
          miniHiddenClockIds.add(city.id);
        } else {
          state = state.filter((clock) => clock.id !== city.id);
          saveState();
        }
        render();
      });
      const editButton = card.querySelector('.edit-clock');
      if (editButton) {
        editButton.setAttribute('aria-label', 'Edit ' + city.name + ' clock');
        editButton.title = 'Edit ' + city.name + ' clock';
        editButton.addEventListener('click', () => openClockCustomizeDialog(ref));
      }
      card.querySelector('.animation-button').addEventListener('click', (event) => {
        item.animation = !item.animation;
        event.currentTarget.setAttribute('aria-pressed', String(item.animation));
        saveState();
        if (item.animation) startPetNow(ref, Date.now());
        else updatePet(ref, Date.now());
      });
      card.querySelectorAll('.pet-type-button').forEach((button) => {
        button.addEventListener('click', () => setPetType(ref, button.dataset.petType));
      });
      card.querySelectorAll('.pet-choice').forEach((button) => {
        button.addEventListener('click', () => setPetChoice(ref, button.dataset.petId));
      });
      card.querySelector('.alarm-toggle').addEventListener('click', (event) => {
        const button = event.currentTarget;
        const expanded = button.getAttribute('aria-expanded') === 'true';
        document.querySelectorAll('.alarm-side').forEach((side) => {
          if (side !== button.parentElement) {
            side.querySelector('.alarm-toggle').setAttribute('aria-expanded', 'false');
            side.querySelector('.alarm-settings').hidden = true;
            side.closest('.clock-card').classList.remove('alarm-open');
          }
        });
        button.setAttribute('aria-expanded', String(!expanded));
        card.querySelector('.alarm-settings').hidden = expanded;
        card.classList.toggle('alarm-open', !expanded);
      });
      card.querySelector('.alarm-add').addEventListener('click', () => addAlarm(ref));
      grid.appendChild(card);
      cards.push(ref);
    });
    updateAll(Date.now());
    fitMiniWindow();
    updateCityOptions();
  }

  function isPetVideo(petMedia) {
    return petMedia instanceof HTMLVideoElement;
  }

  function stopPetMedia(petMedia) {
    if (isPetVideo(petMedia)) {
      petMedia.pause();
      if (petMedia.readyState >= 1 && petMedia.currentTime > 0) petMedia.currentTime = 0;
    } else {
      petMedia.removeAttribute('src');
    }
  }

  function bindPetMedia(ref) {
    ref.pet = Array.from(ref.card.querySelectorAll('.peek-cat'));
    ref.pet.forEach((petMedia) => {
      const event = isPetVideo(petMedia) ? 'loadedmetadata' : 'load';
      petMedia.addEventListener(event, () => updatePet(ref, Date.now()), { once: true });
      petMedia.addEventListener('error', () => console.warn('Unable to load pet media:', petMedia.currentSrc || petMedia.src), { once: true });
    });
  }

  function setPetType(ref, petType) {
    if (!PET_CATALOG[petType]) return;
    ref.expandedPetType = petType;
    ref.card.querySelectorAll('.pet-choices').forEach((choices) => {
      choices.hidden = choices.dataset.choicesFor !== petType;
    });
    const changed = ref.item.petType !== petType;
    if (changed) {
      ref.item.petType = petType;
      ref.item.petId = PET_CATALOG[petType][0].id;
      replacePetMedia(ref);
    }
    ref.card.querySelectorAll('.pet-type-button').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.petType === petType));
    });
    ref.card.querySelectorAll('.pet-choice').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.petId === ref.item.petId));
    });
    ref.item.animation = true;
    ref.card.querySelector('.animation-button').setAttribute('aria-pressed', 'true');
    startPetNow(ref, Date.now());
    fitMiniWindow();
    saveState();
  }

  function setPetChoice(ref, petId) {
    if (!PET_CATALOG[ref.item.petType].some((pet) => pet.id === petId)) return;
    if (ref.item.petId !== petId) {
      ref.item.petId = petId;
      replacePetMedia(ref);
    }
    ref.expandedPetType = null;
    ref.card.querySelectorAll('.pet-choices').forEach((choices) => { choices.hidden = true; });
    ref.item.animation = true;
    ref.card.querySelector('.animation-button').setAttribute('aria-pressed', 'true');
    ref.card.querySelectorAll('.pet-choice').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.petId === petId));
    });
    startPetNow(ref, Date.now());
    fitMiniWindow();
    saveState();
  }

  function replacePetMedia(ref) {
    ref.pet.forEach(stopPetMedia);
    const peekWindow = ref.card.querySelector('.peek-window');
    peekWindow.className = peekWindowClass(ref.item.petId);
    peekWindow.innerHTML = petMediaMarkup(ref.item.petType, ref.item.petId);
    ref.activePetIndex = -1;
    ref.activeStartAt = null;
    bindPetMedia(ref);
  }

  function startPetNow(ref, now) {
    ref.item.animation = true;
    ref.activePetIndex = ref.nextPositionIndex % ref.pet.length;
    ref.nextPositionIndex += 1;
    ref.activeStartAt = now;
    ref.nextPeekAt = now + PET_INTERVAL_MS;
    ref.pet.forEach((video, index) => {
      stopPetMedia(video);
      video.classList.remove('is-peeking');
      video.dataset.playPending = 'false';
      video.dataset.playFailed = 'false';
    });
    updatePet(ref, now);
  }

  function getClockParts(zone, now) {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
    }).formatToParts(now);
    const values = {};
    parts.forEach((part) => { if (part.type !== 'literal') values[part.type] = Number(part.value); });
    return values;
  }

  function getClockPartsForRef(ref, now) {
    if (Number.isInteger(ref.item.offsetMinutes)) {
      const timestamp = now instanceof Date ? now.getTime() : now;
      return getClockParts('UTC', new Date(timestamp + ref.item.offsetMinutes * 60000));
    }
    return getClockParts(ref.city.zone, now);
  }

  function hexColorToRgb(hexColor) {
    return [1, 3, 5].map((start) => parseInt(hexColor.slice(start, start + 2), 16));
  }

  function blendHexColors(fromColor, toColor, progress) {
    const from = hexColorToRgb(fromColor);
    const to = hexColorToRgb(toColor);
    const amount = Math.min(1, Math.max(0, progress));
    const channels = from.map((channel, index) =>
      Math.round(channel + (to[index] - channel) * amount)
    );
    return '#' + channels.map((channel) => channel.toString(16).padStart(2, '0')).join('');
  }

  function getClockBackgroundColor(hour, minute, second) {
    let currentColor;
    let nextColor;
    if (hour >= 6 && hour < 12) {
      currentColor = CLOCK_PERIOD_COLORS.morning;
      if (hour === 11 && minute === 59) nextColor = CLOCK_PERIOD_COLORS.afternoon;
    } else if (hour >= 12 && hour < 18) {
      currentColor = CLOCK_PERIOD_COLORS.afternoon;
      if (hour === 17 && minute === 59) nextColor = CLOCK_PERIOD_COLORS.evening;
    } else if (hour >= 18 && hour < 24) {
      currentColor = CLOCK_PERIOD_COLORS.evening;
      if (hour === 23 && minute === 59) nextColor = CLOCK_PERIOD_COLORS.night;
    } else {
      currentColor = CLOCK_PERIOD_COLORS.night;
      if (hour === 5 && minute === 59) nextColor = CLOCK_PERIOD_COLORS.morning;
    }

    return nextColor
      ? blendHexColors(currentColor, nextColor, second / 60)
      : currentColor;
  }

  function getHexRelativeLuminance(hexColor) {
    const [red, green, blue] = hexColorToRgb(hexColor).map((channel) => {
      const value = channel / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  }

  function getZoneOffsetMinutes(zone, now) {
    const local = getClockParts(zone, now);
    const utc = getClockParts('UTC', now);
    const toUtcMillis = (parts) => Date.UTC(
      parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second
    );
    return Math.round((toUtcMillis(local) - toUtcMillis(utc)) / 60000);
  }

  function checkAlarm(ref, time) {
    const isAlarmOwner = !isMini || !mainWindowPresent;
    if (!isAlarmOwner) return;
    const currentTime = String(time.hour).padStart(2, '0') + ':' + String(time.minute).padStart(2, '0');
    const localDate = time.year + '-' + String(time.month).padStart(2, '0') + '-' + String(time.day).padStart(2, '0');
    let updated = false;
    ref.item.alarms.forEach((alarm) => {
      if (!alarm.enabled || alarm.time !== currentTime || alarm.lastAlarmDate === localDate) return;
      alarm.lastAlarmDate = localDate;
      updated = true;
      startAlarm(ref, alarm);
    });
    if (updated) saveState();
  }

  function updateClock(ref, now) {
    const time = getClockPartsForRef(ref, now);
    checkAlarm(ref, time);
    const hour = (time.hour % 12) * 30 + time.minute * .5;
    const minute = time.minute * 6 + time.second * .1;
    const second = time.second * 6;
    ref.card.querySelector('.hour-hand').setAttribute('transform', 'rotate(' + hour + ' 100 100)');
    ref.card.querySelector('.minute-hand').setAttribute('transform', 'rotate(' + minute + ' 100 100)');
    ref.card.querySelector('.second-hand').setAttribute('transform', 'rotate(' + second + ' 100 100)');
    const dayPeriod = ref.card.querySelector('.day-period');
    const isAm = time.hour < 12;
    dayPeriod.textContent = isAm ? 'AM' : 'PM';
    dayPeriod.classList.toggle('is-am', isAm);
    const backgroundColor = getClockBackgroundColor(time.hour, time.minute, time.second);
    ref.card.style.backgroundColor = backgroundColor;
    ref.card.classList.toggle('period-dark', getHexRelativeLuminance(backgroundColor) < 0.179);
    updatePet(ref, now);
  }

  function updatePet(ref, now) {
    const shouldAnimate = ref.item.animation && !reduceMotion.matches;
    if (!shouldAnimate) {
      ref.activePetIndex = -1;
      ref.activeStartAt = null;
      ref.nextPeekAt = null;
    } else if (ref.activePetIndex !== -1 && now - ref.activeStartAt >= PET_CLIP_DURATION_MS) {
      const activeVideo = ref.pet[ref.activePetIndex];
      stopPetMedia(activeVideo);
      activeVideo.classList.remove('is-peeking');
      activeVideo.dataset.playPending = 'false';
      activeVideo.dataset.playFailed = 'false';
      ref.activePetIndex = -1;
      ref.activeStartAt = null;
    } else if (ref.activePetIndex === -1 && ref.nextPeekAt !== null && now >= ref.nextPeekAt) {
      ref.activeIndex = ref.nextPositionIndex % ref.pet.length;
      ref.nextPositionIndex += 1;
      ref.activePetIndex = ref.activeIndex;
      ref.activeStartAt = now;
      ref.nextPeekAt = now + PET_INTERVAL_MS;
    }

    ref.pet.forEach((video, index) => {
      const active = index === ref.activePetIndex;
      if (!active) {
        stopPetMedia(video);
        video.classList.remove('is-peeking');
        video.dataset.playPending = 'false';
        video.dataset.playFailed = 'false';
        return;
      }
      if (video.dataset.activeStartAt !== String(ref.activeStartAt)) {
        video.dataset.activeStartAt = String(ref.activeStartAt);
        if (isPetVideo(video)) {
          if (video.readyState >= 1) video.currentTime = 0;
        } else {
          video.src = video.dataset.src;
        }
        video.classList.remove('is-peeking');
        void video.offsetWidth;
      }
      video.classList.add('is-peeking');
      if (!shouldAnimate) {
        stopPetMedia(video);
        return;
      }
      if (!isPetVideo(video)) return;
      if (video.paused && video.dataset.playPending !== 'true' && video.dataset.playFailed !== 'true') {
        video.dataset.playPending = 'true';
        video.play().then(() => {
          video.dataset.playPending = 'false';
          if (ref.pet[index] !== video || ref.activePetIndex !== index || !ref.item.animation || reduceMotion.matches) video.pause();
        }).catch((error) => {
          video.dataset.playPending = 'false';
          if (ref.pet[index] === video && ref.activePetIndex === index && ref.item.animation && !reduceMotion.matches) {
            video.dataset.playFailed = 'true';
            console.warn('Unable to play pet video:', error);
          }
        });
      }
    });
  }

  function updateAll(now) {
    cards.forEach((ref) => updateClock(ref, now));
  }

  function fitMiniWindow() {
    if (!isMini || !cards.length) return;
    const minWidth = Math.min(24, Math.max(1, innerWidth - 4));
    const trial = 200;
    document.body.style.setProperty('--mini-width', trial + 'px');
    const ratio = Math.max(...cards.map((ref) => ref.card.getBoundingClientRect().height)) / trial;
    const gap = 2;
    let best = 0;
    for (let columns = 1; columns <= cards.length; columns++) {
      const rows = Math.ceil(cards.length / columns);
      const byWidth = (innerWidth - 4 - gap * (columns - 1)) / columns;
      const byHeight = (innerHeight - 4 - gap * (rows - 1)) / rows / ratio;
      best = Math.max(best, Math.min(byWidth, byHeight));
    }
    let width = Math.max(minWidth, Math.floor(best) - 2);
    document.body.style.setProperty('--mini-width', width + 'px');
    for (let i = 0; i < 40 && width > minWidth &&
      (document.documentElement.scrollWidth > innerWidth + 1 ||
        document.documentElement.scrollHeight > innerHeight + 1); i++) {
      width = Math.max(minWidth, Math.floor(width * .95));
      document.body.style.setProperty('--mini-width', width + 'px');
    }
    cards.forEach((ref) => {
      const cityName = ref.card.querySelector('.city-name');
      cityName.style.fontSize = '';
      const availableWidth = Math.max(0, cityName.clientWidth - 8);
      const textWidth = cityName.scrollWidth;
      const fontSize = parseFloat(getComputedStyle(cityName).fontSize);
      if (textWidth > availableWidth && availableWidth > 0 && textWidth > 0) {
        cityName.style.fontSize = (fontSize * availableWidth / textWidth) + 'px';
      }
    });
  }

  function updateCityOptions(query = citySearch.value) {
    const searchTerm = query.trim().toLocaleLowerCase();
    const available = CITIES.filter((city) =>
      !state.some((item) => item.id === city.id) &&
      (!searchTerm || city.name.toLocaleLowerCase().includes(searchTerm))
    );
    const groups = [...new Set(available.map((city) => city.region))].map((region) => {
      const group = document.createElement('optgroup');
      group.label = region;
      const cities = available
        .filter((city) => city.region === region)
        .sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
      group.append(...cities.map((city) => {
        const option = document.createElement('option');
        option.value = city.id;
        option.textContent = city.name;
        return option;
      }));
      return group;
    });
    citySelect.replaceChildren(...groups);
    citySearchEmpty.hidden = available.length !== 0;
    citySelect.hidden = available.length === 0;
    confirmAddButton.disabled = available.length === 0;
    updateAddDialogSteps();
  }

  function updateAddDialogSteps() {
    const readyToAdd = !confirmAddButton.disabled &&
      (citySearch.value.trim().length > 0 || citySelectionMade);
    searchCityGuide.hidden = confirmAddButton.disabled || readyToAdd;
    confirmAddStep.hidden = !readyToAdd;
    confirmAddHand.hidden = !readyToAdd;
  }

  function openAddDialog() {
    citySearch.value = '';
    citySelectionMade = false;
    searchCityGuide.hidden = false;
    confirmAddStep.hidden = true;
    confirmAddHand.hidden = true;
    updateCityOptions();
    if (typeof dialog.showModal === 'function') dialog.showModal();
    citySearch.focus();
  }

  function setOffsetInputs(offsetMinutes) {
    const magnitude = Math.abs(offsetMinutes);
    offsetSignInput.value = offsetMinutes < 0 ? '-1' : '1';
    offsetHoursInput.value = String(Math.floor(magnitude / 60));
    offsetMinutesInput.value = String(magnitude % 60);
  }

  function openClockCustomizeDialog(ref = null) {
    offsetTarget = ref;
    const isOffsetEdit = ref !== null;
    const isCustomEdit = isOffsetEdit && Boolean(ref.item.customName);
    customCityField.hidden = isOffsetEdit && !isCustomEdit;
    clockCustomizeTitle.textContent = isCustomEdit ? 'Edit Clock' : isOffsetEdit ? 'Adjust Clock Time' : 'Clock Customize';
    saveClockCustomizeButton.textContent = isCustomEdit ? 'Save Changes' : isOffsetEdit ? 'Apply Offset' : 'Add Clock';
    customCityNameInput.value = isCustomEdit ? ref.item.customName : '';
    clockCustomizeError.hidden = true;
    clockCustomizeError.textContent = '';
    const currentOffset = isOffsetEdit
      ? (Number.isInteger(ref.item.offsetMinutes)
        ? ref.item.offsetMinutes
        : getZoneOffsetMinutes(ref.city.zone, Date.now()))
      : 0;
    setOffsetInputs(currentOffset);
    if (typeof clockCustomizeDialog.showModal === 'function') clockCustomizeDialog.showModal();
  }

  function readOffsetMinutes() {
    const sign = Number(offsetSignInput.value);
    const hours = offsetHoursInput.valueAsNumber;
    const minutes = offsetMinutesInput.valueAsNumber;
    if ((sign !== 1 && sign !== -1) || !Number.isInteger(hours) || !Number.isInteger(minutes) ||
      hours < 0 || hours > 14 || minutes < 0 || minutes > 59) {
      clockCustomizeError.textContent = 'Enter a valid GMT offset in hours and minutes.';
      clockCustomizeError.hidden = false;
      return null;
    }
    const offsetMinutes = sign * (hours * 60 + minutes);
    if (!isValidOffsetMinutes(offsetMinutes)) {
      clockCustomizeError.textContent = 'GMT offsets must be between −12:00 and +14:00.';
      clockCustomizeError.hidden = false;
      return null;
    }
    return offsetMinutes;
  }

  function createAlarmId() {
    return 'alarm-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
  }

  function createCustomClockId() {
    let id;
    do {
      id = 'custom-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
    } while (state.some((item) => item.id === id));
    return id;
  }

  function saveClockCustomization() {
    const offsetMinutes = readOffsetMinutes();
    if (offsetMinutes === null) return;
    if (offsetTarget) {
      const isCustomEdit = Boolean(offsetTarget.item.customName);
      const customName = customCityNameInput.value.trim();
      if (isCustomEdit && !customName) {
        clockCustomizeError.textContent = 'Enter a city name.';
        clockCustomizeError.hidden = false;
        customCityNameInput.focus();
        return;
      }
      if (isCustomEdit) {
        offsetTarget.item.customName = customName.slice(0, 60);
        offsetTarget.city.name = offsetTarget.item.customName;
        offsetTarget.card.querySelector('.city-name').textContent = offsetTarget.city.name;
        const editButton = offsetTarget.card.querySelector('.edit-clock');
        editButton.setAttribute('aria-label', 'Edit ' + offsetTarget.city.name + ' clock');
        editButton.title = 'Edit ' + offsetTarget.city.name + ' clock';
      }
      offsetTarget.item.offsetMinutes = offsetMinutes;
      offsetTarget.item.alarms.forEach((alarm) => { alarm.lastAlarmDate = null; });
      saveState();
      updateClock(offsetTarget, Date.now());
      clockCustomizeDialog.close();
      offsetTarget = null;
      return;
    }
    const customName = customCityNameInput.value.trim();
    if (!customName) {
      clockCustomizeError.textContent = 'Enter a city name.';
      clockCustomizeError.hidden = false;
      customCityNameInput.focus();
      return;
    }
    state.push({
      id: createCustomClockId(),
      customName: customName.slice(0, 60),
      offsetMinutes,
      animation: true,
      petType: 'cat',
      petId: 'cat-peek',
      dialStyle: DEFAULT_DIAL_STYLE,
      alarms: []
    });
    saveState();
    clockCustomizeDialog.close();
    offsetTarget = null;
    render();
  }

  function openOffsetDialog(ref) {
    openClockCustomizeDialog(ref);
  }

  // Dialog and page interaction wiring
  document.getElementById('addClock').addEventListener('click', openAddDialog);
  citySearch.addEventListener('input', () => {
    citySelectionMade = false;
    updateCityOptions();
  });
  citySelect.addEventListener('change', () => {
    citySelectionMade = true;
    updateAddDialogSteps();
  });
  document.getElementById('clockCustomize').addEventListener('click', () => openClockCustomizeDialog());
  document.getElementById('cancelClockCustomize').addEventListener('click', () => clockCustomizeDialog.close());
  clockCustomizeForm.addEventListener('submit', (event) => {
    event.preventDefault();
    saveClockCustomization();
  });
  clockCustomizeDialog.addEventListener('close', () => { offsetTarget = null; });
  saveClockCustomizeButton.addEventListener('click', saveClockCustomization);
  dialStyleDialog.addEventListener('close', () => { dialStyleTarget = null; });
  document.getElementById('closeDialStyles').addEventListener('click', () => dialStyleDialog.close());
  document.getElementById('confirmAdd').addEventListener('click', (event) => {
    event.preventDefault();
    if (!citySelect.value) return;
    state.push({
      id: citySelect.value, customName: '', offsetMinutes: null,
      animation: true, petType: 'cat', petId: 'cat-peek',
      dialStyle: DEFAULT_DIAL_STYLE,
      alarms: []
    });
    saveState();
    dialog.close();
    render();
  });
  let miniPopupMonitor = null;
  let miniPopupRestoreHidden = null;
  document.getElementById('openMini').addEventListener('click', async () => {
    let popup = null;
    if (document.fullscreenElement) {
      popup = window.open(
        'about:blank',
        'worldclock-mini-fullscreen-v2',
        'popup=yes,location=no,toolbar=no,menubar=no,status=no,scrollbars=yes,resizable=yes,width=340,height=420'
      );
      if (!popup) {
        alert('The pop-up was blocked. Exit Full Screen, allow pop-ups for this page, and try again.');
        return;
      }
      try {
        await document.exitFullscreen();
      } catch (_) {}
    }

    // Browser-level fullscreen has no standard API, so also detect screen-sized windows.
    const fullscreen = Boolean(document.fullscreenElement) || window.fullScreen === true ||
      (window.outerWidth >= window.screen.width - 1 && window.outerHeight >= window.screen.height - 1);
    const popupName = fullscreen ? 'worldclock-mini-fullscreen-v2': 'worldclock-mini-v2';
    if (!popup) {
      popup = window.open(
        baseUrl + '?mini=1',
        popupName,
        'popup=yes,location=no,toolbar=no,menubar=no,status=no,scrollbars=yes,resizable=yes,width=340,height=420'
      );
    } else {
      popup.location.href = baseUrl + '?mini=1';
    }
    if (!popup) {
      alert('The pop-up was blocked. Allow pop-ups for this page and try again.');
      return;
    }
    popup.resizeTo(340, 420);
    popup.focus();

    const petVideoSection = document.getElementById('pet-video-section');
    if (petVideoSection) {
      if (miniPopupMonitor === null) miniPopupRestoreHidden = petVideoSection.hidden;
      petVideoSection.hidden = true;
      if (miniPopupMonitor !== null) clearInterval(miniPopupMonitor);
      miniPopupMonitor = setInterval(() => {
        if (popup.closed) {
          petVideoSection.hidden = miniPopupRestoreHidden;
          miniPopupRestoreHidden = null;
          clearInterval(miniPopupMonitor);
          miniPopupMonitor = null;
        }
      }, 250);
    }
  });
  document.getElementById('stopAlarm').addEventListener('click', () => {
    stopAllAlarms();
  });
  document.addEventListener('click', (event) => {
    if (event.composedPath().some((target) =>
      target instanceof Element && target.classList.contains('alarm-side'))) return;
    document.querySelectorAll('.alarm-side').forEach((side) => {
      side.querySelector('.alarm-toggle').setAttribute('aria-expanded', 'false');
      side.querySelector('.alarm-settings').hidden = true;
      side.closest('.clock-card').classList.remove('alarm-open');
    });
  });
  alarmDialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    stopAllAlarms();
  });
  let miniResizeFrame = 0;
  window.addEventListener('resize', () => {
    if (!miniResizeFrame) {
      miniResizeFrame = requestAnimationFrame(() => {
        miniResizeFrame = 0;
        fitMiniWindow();
      });
    }
  });
  reduceMotion.addEventListener('change', () => {
    const now = Date.now();
    cards.forEach((ref) => {
      if (!reduceMotion.matches && ref.item.animation) startPetNow(ref, now);
      else updatePet(ref, now);
    });
  });
  setInterval(() => updateAll(Date.now()), 1000);
  if (isMini) {
    document.body.classList.add('mini');
    document.title = 'Cat and Dog World Clock (Mini Window)';
  }
  recordVisit();
  render();
})();

/* Manual translations and language preference. */
(() => {
  const manualTranslations = {
    en: {
      lang: "English", title: "How to Use Cat and Dog World Clock",
      intro: "Welcome to <strong>Cat and Dog World Clock</strong>—a simple, customizable analog world clock designed to stay open on your screen all day.",
      citiesTitle: "Nearly 150 Cities in 3 Steps:", citiesText: "① Click + Add Clock → ② Search for and select a city → ③ Click Add Clock in the dialog.",
      minimalTitle: "Make It Minimal Mode:", minimalText: "Click the <em>Make It Minimal</em> button to shrink and simplify the layout for a distraction-free workspace. If your browser or screen is in Full Screen mode, exit Full Screen first.",
      colorsTitle: "Automatic Background Colors:", colorsText: "The clock card background changes automatically according to each city's local time: at 06:00, 12:00, 18:00, and 00:00.",
      animationsTitle: "Cat & Dog Animations:", animationsText: "Cute cat and dog animations appear at scheduled times. To turn them off, click the <u>Animation</u> button on that clock.",
      saveTitle: "Auto-Save Settings:", saveText: "Your preferred cities, window size, and color settings are saved automatically for continuous daily use.",
      alarmsTitle: "Multiple Alarms:", alarmsText: "Click Alarm Set on a clock, then click Add alarm to add multiple alarms. Set each time and switch it On.",
      faceThemeTitle: "Clock Face Themes:", faceThemeText: "Click a clock face and choose a style to change its appearance.",
      deleteTitle: "Remove a Clock:", deleteText: "Hover over the upper-right corner of a clock card to reveal Delete, then click it.",
      stopAlarmTitle: "Stop a Ringing Alarm:", stopAlarmText: "When an alarm rings, click Stop alarm in the on-screen dialog to silence it.",
      customClockTitle: "Custom City Clocks:", customClockText: "Click Clock Customize, enter any city name, and set its GMT offset manually (−12:00 to +14:00)."
    },
    th: {
      lang: "ภาษา", title: "วิธีใช้นาฬิกาโลก Cat and Dog",
      intro: "ยินดีต้อนรับสู่ <strong>Cat and Dog World Clock</strong> นาฬิกาอนาล็อกแบบโค้งที่ปรับแต่งได้ง่าย ใช้งานต่อเนื่องบนหน้าจอตลอดทั้งวัน",
      citiesTitle: "ดูเวลาเมืองต่างๆ ทั่วโลกเกือบ 150 เมืองใน 3 ขั้นตอน:", citiesText: "① กด + Add Clock → ② ค้นหาและเลือกเมืองในช่อง Search City → ③ กด Add Clock ในหน้าต่าง",
      minimalTitle: "โหมดย่อหน้าจอ:", minimalText: "กดปุ่ม <em>Make It Minimal</em> เพื่อย่อและทำให้หน้าจอเรียบง่าย หากกำลังอยู่ในโหมดเต็มหน้าจอของเบราว์เซอร์หรือหน้าจอ ให้ออกจากโหมดเต็มหน้าจอก่อน",
      colorsTitle: "สีพื้นหลังเปลี่ยนอัตโนมัติ:", colorsText: "สีพื้นหลังของการ์ดนาฬิกาจะเปลี่ยนตามเวลาท้องถิ่นของแต่ละเมืองโดยอัตโนมัติ เวลา 06:00, 12:00, 18:00 และ 00:00",
      animationsTitle: "ภาพเคลื่อนไหวแมวและสุนัข:", animationsText: "ภาพเคลื่อนไหวแมวและสุนัขจะแสดงตามเวลาที่กำหนด หากไม่ต้องการให้แสดง ให้กดปุ่ม <u>Animation</u> บนนาฬิกาเรือนนั้นเพื่อปิด",
      saveTitle: "บันทึกการตั้งค่าอัตโนมัติ:", saveText: "เมืองที่เลือก ขนาดหน้าต่าง และการตั้งค่าสีจะถูกบันทึกอัตโนมัติ เพื่อใช้งานต่อเนื่องทุกวัน",
      alarmsTitle: "ตั้งนาฬิกาปลุกได้หลายเวลา:", alarmsText: "กดปุ่ม Alarm Set บนนาฬิกา แล้วกด Add alarm เพื่อเพิ่มรายการ ตั้งเวลาแต่ละรายการและกด On เพื่อเปิดใช้งาน",
      faceThemeTitle: "เปลี่ยนธีมหน้าปัด:", faceThemeText: "คลิกที่หน้าปัดนาฬิกา แล้วเลือกรูปแบบที่ต้องการเพื่อเปลี่ยนหน้าตา",
      deleteTitle: "ลบนาฬิกา:", deleteText: "เลื่อนเมาส์ไปที่มุมขวาบนของการ์ดนาฬิกาเพื่อแสดงปุ่ม Delete แล้วคลิกปุ่มนั้น",
      stopAlarmTitle: "ปิดเสียงนาฬิกาปลุก:", stopAlarmText: "เมื่อเสียงปลุกดัง ให้กดปุ่ม Stop alarm ในหน้าต่างที่แสดงบนหน้าจอเพื่อหยุดเสียง",
      customClockTitle: "สร้างนาฬิกาเมืองกำหนดเอง:", customClockText: "กด Clock Customize ใส่ชื่อเมืองได้ตามต้องการ แล้วกำหนด GMT offset เองได้ตั้งแต่ −12:00 ถึง +14:00"
    },
    ja: {
      lang: "言語", title: "Cat and Dog World Clock の使い方",
      intro: "<strong>Cat and Dog World Clock</strong>へようこそ。一日中画面で使える、シンプルでカスタマイズ可能なアナログ世界時計です。",
      citiesTitle: "3ステップで世界約150都市の時刻を表示:", citiesText: "① + Add Clock をクリック → ② 都市を検索して選択 → ③ ダイアログの Add Clock をクリックします。",
      minimalTitle: "ミニマルモード:", minimalText: "<em>Make It Minimal</em> ボタンをクリックすると、レイアウトを縮小して集中しやすいシンプルな表示になります。ブラウザーまたは画面がフルスクリーンの場合は、先にフルスクリーンを終了してください。",
      colorsTitle: "背景色の自動変更:", colorsText: "時計カードの背景色は各都市の現地時刻に合わせて自動で変わります。変更時刻は06:00、12:00、18:00、00:00です。",
      animationsTitle: "猫と犬のアニメーション:", animationsText: "かわいい猫や犬のアニメーションが決まった時刻に表示されます。表示したくない場合は、その時計の <u>Animation</u> ボタンをクリックしてオフにしてください。",
      saveTitle: "設定の自動保存:", saveText: "選択した都市、ウィンドウサイズ、色の設定は継続的に使えるよう自動保存されます。",
      alarmsTitle: "複数のアラーム:", alarmsText: "時計の Alarm Set をクリックし、Add alarm から複数のアラームを追加できます。それぞれ時刻を設定し、On にしてください。",
      faceThemeTitle: "文字盤テーマの変更:", faceThemeText: "文字盤をクリックしてスタイルを選ぶと、見た目を変更できます。",
      deleteTitle: "時計の削除:", deleteText: "時計カードの右上にマウスを合わせると Delete ボタンが表示されます。クリックすると時計を削除します。",
      stopAlarmTitle: "アラームを止める:", stopAlarmText: "アラームが鳴ったら、画面に表示されるダイアログの Stop alarm をクリックして音を止めてください。",
      customClockTitle: "都市名を指定した時計:", customClockText: "Clock Customize をクリックし、好きな都市名と GMT オフセット（−12:00〜+14:00）を設定できます。"
    },
    zh: {
      lang: "语言", title: "如何使用 Cat and Dog 世界时钟",
      intro: "欢迎使用 <strong>Cat and Dog World Clock</strong>——一款简单、可自定义、适合整日显示在屏幕上的模拟世界时钟。",
      citiesTitle: "三步查看全球近150个城市的时间:", citiesText: "① 点击 + Add Clock → ② 搜索并选择城市 → ③ 点击对话框中的 Add Clock。",
      minimalTitle: "极简模式:", minimalText: "点击 <em>Make It Minimal</em> 按钮可缩小并简化界面，营造不受干扰的工作环境。如果浏览器或屏幕处于全屏模式，请先退出全屏。",
      colorsTitle: "背景颜色自动变化:", colorsText: "时钟卡片的背景颜色会根据各城市的当地时间自动变化，时间为06:00、12:00、18:00和00:00。",
      animationsTitle: "猫狗动画:", animationsText: "可爱的猫狗动画会在指定时间出现。如果不想显示动画，请点击该时钟上的 <u>Animation</u> 按钮将其关闭。",
      saveTitle: "自动保存设置:", saveText: "您选择的城市、窗口大小和颜色设置会自动保存，方便每天继续使用。",
      alarmsTitle: "设置多个闹钟:", alarmsText: "点击时钟上的 Alarm Set，再点击 Add alarm 即可添加多个闹钟。设置每个时间并切换为 On。",
      faceThemeTitle: "更换表盘主题:", faceThemeText: "点击表盘并选择样式即可更改外观。",
      deleteTitle: "删除时钟:", deleteText: "将鼠标移到时钟卡片右上角，出现 Delete 按钮后点击即可删除。",
      stopAlarmTitle: "停止响铃:", stopAlarmText: "闹钟响起时，点击屏幕弹窗中的 Stop alarm 按钮即可停止声音。",
      customClockTitle: "自定义城市时钟:", customClockText: "点击 Clock Customize，输入任意城市名称并手动设置 GMT 时差（−12:00 至 +14:00）。"
    },
    hi: {
      lang: "भाषा", title: "Cat and Dog World Clock का उपयोग कैसे करें",
      intro: "<strong>Cat and Dog World Clock</strong> में आपका स्वागत है—यह एक सरल और अनुकूलन योग्य एनालॉग वर्ल्ड क्लॉक है, जिसे पूरे दिन स्क्रीन पर खुला रखा जा सकता है।",
      citiesTitle: "3 चरणों में दुनिया के लगभग 150 शहरों का समय:", citiesText: "① + Add Clock पर क्लिक करें → ② शहर खोजें और चुनें → ③ डायलॉग में Add Clock पर क्लिक करें।",
      minimalTitle: "मिनिमल मोड:", minimalText: "लेआउट छोटा और सरल बनाने के लिए <em>Make It Minimal</em> बटन पर क्लिक करें। ब्राउज़र या स्क्रीन फुल स्क्रीन में हो तो पहले फुल स्क्रीन बंद करें।",
      colorsTitle: "पृष्ठभूमि का रंग अपने आप बदलता है:", colorsText: "घड़ी कार्ड का पृष्ठभूमि रंग हर शहर के स्थानीय समय के अनुसार अपने आप बदलता है: 06:00, 12:00, 18:00 और 00:00 बजे।",
      animationsTitle: "बिल्ली और कुत्ते के एनिमेशन:", animationsText: "प्यारे बिल्ली और कुत्ते के एनिमेशन तय समय पर दिखाई देते हैं। इन्हें बंद करने के लिए उस घड़ी पर <u>Animation</u> बटन क्लिक करें।",
      saveTitle: "सेटिंग्स अपने आप सेव हों:", saveText: "चुने गए शहर, विंडो आकार और रंग सेटिंग्स लगातार उपयोग के लिए अपने आप सेव हो जाती हैं।",
      alarmsTitle: "कई अलार्म सेट करें:", alarmsText: "घड़ी पर Alarm Set क्लिक करें, फिर कई अलार्म जोड़ने के लिए Add alarm क्लिक करें। हर अलार्म का समय सेट करें और उसे On करें।",
      faceThemeTitle: "घड़ी के डायल की थीम:", faceThemeText: "दिखावट बदलने के लिए घड़ी के डायल पर क्लिक करें और अपनी पसंद की शैली चुनें।",
      deleteTitle: "घड़ी हटाएँ:", deleteText: "Delete बटन दिखाने के लिए माउस को घड़ी कार्ड के ऊपरी-दाएँ कोने पर ले जाएँ, फिर उस पर क्लिक करें।",
      stopAlarmTitle: "बजता अलार्म बंद करें:", stopAlarmText: "अलार्म बजने पर आवाज़ बंद करने के लिए स्क्रीन पर आए डायलॉग में Stop alarm क्लिक करें।",
      customClockTitle: "कस्टम शहर की घड़ी:", customClockText: "Clock Customize क्लिक करें, अपनी पसंद का शहर नाम लिखें और GMT ऑफ़सेट खुद सेट करें (−12:00 से +14:00)।"
    },
    id: {
      lang: "Bahasa", title: "Cara Menggunakan Cat and Dog World Clock",
      intro: "Selamat datang di <strong>Cat and Dog World Clock</strong>—jam dunia analog yang sederhana dan dapat disesuaikan untuk tetap terbuka di layar Anda sepanjang hari.",
      citiesTitle: "Lihat Hampir 150 Kota dalam 3 Langkah:", citiesText: "① Klik + Add Clock → ② Cari dan pilih kota → ③ Klik Add Clock pada dialog.",
      minimalTitle: "Mode Minimal:", minimalText: "Klik tombol <em>Make It Minimal</em> untuk mengecilkan dan menyederhanakan tampilan agar bebas gangguan. Jika browser atau layar berada dalam mode layar penuh, keluar dari mode layar penuh terlebih dahulu.",
      colorsTitle: "Warna Latar Berubah Otomatis:", colorsText: "Warna latar kartu jam berubah otomatis mengikuti waktu setempat setiap kota: pukul 06.00, 12.00, 18.00, dan 00.00.",
      animationsTitle: "Animasi Kucing & Anjing:", animationsText: "Animasi kucing dan anjing yang lucu muncul pada waktu tertentu. Untuk mematikannya, klik tombol <u>Animation</u> pada jam tersebut.",
      saveTitle: "Simpan Pengaturan Otomatis:", saveText: "Kota pilihan, ukuran jendela, dan pengaturan warna akan tersimpan otomatis untuk penggunaan harian.",
      alarmsTitle: "Beberapa Alarm:", alarmsText: "Klik Alarm Set pada jam, lalu klik Add alarm untuk menambahkan beberapa alarm. Atur waktu masing-masing dan aktifkan dengan memilih On.",
      faceThemeTitle: "Tema Tampilan Jam:", faceThemeText: "Klik tampilan jam dan pilih gaya untuk mengubah tampilannya.",
      deleteTitle: "Hapus Jam:", deleteText: "Arahkan mouse ke sudut kanan atas kartu jam hingga tombol Delete muncul, lalu klik tombol tersebut.",
      stopAlarmTitle: "Hentikan Alarm yang Berbunyi:", stopAlarmText: "Saat alarm berbunyi, klik Stop alarm pada dialog di layar untuk menghentikan suaranya.",
      customClockTitle: "Jam Kota Kustom:", customClockText: "Klik Clock Customize, masukkan nama kota sesuka Anda, lalu atur offset GMT secara manual (−12:00 hingga +14:00)."
    },
    vi: {
      lang: "Ngôn ngữ", title: "Cách sử dụng Cat and Dog World Clock",
      intro: "Chào mừng đến với <strong>Cat and Dog World Clock</strong>—đồng hồ thế giới analog đơn giản, có thể tùy chỉnh và luôn mở trên màn hình cả ngày.",
      citiesTitle: "Xem giờ gần 150 thành phố qua 3 bước:", citiesText: "① Nhấn + Add Clock → ② Tìm và chọn thành phố → ③ Nhấn Add Clock trong hộp thoại.",
      minimalTitle: "Chế độ tối giản:", minimalText: "Nhấn nút <em>Make It Minimal</em> để thu nhỏ và đơn giản hóa giao diện, tránh làm phân tâm. Nếu trình duyệt hoặc màn hình đang ở chế độ toàn màn hình, hãy thoát chế độ toàn màn hình trước.",
      colorsTitle: "Màu nền tự động thay đổi:", colorsText: "Màu nền của thẻ đồng hồ tự động thay đổi theo giờ địa phương của từng thành phố vào lúc 06:00, 12:00, 18:00 và 00:00.",
      animationsTitle: "Hoạt ảnh mèo và chó:", animationsText: "Hoạt ảnh mèo và chó dễ thương xuất hiện theo lịch trình. Nếu không muốn xem, hãy nhấn nút <u>Animation</u> trên đồng hồ đó để tắt.",
      saveTitle: "Tự động lưu cài đặt:", saveText: "Thành phố, kích thước cửa sổ và cài đặt màu của bạn được lưu tự động để sử dụng hàng ngày.",
      alarmsTitle: "Đặt nhiều báo thức:", alarmsText: "Nhấn Alarm Set trên đồng hồ, sau đó nhấn Add alarm để thêm nhiều báo thức. Đặt giờ cho từng báo thức và chuyển sang On để bật.",
      faceThemeTitle: "Đổi giao diện mặt đồng hồ:", faceThemeText: "Nhấn vào mặt đồng hồ rồi chọn kiểu để thay đổi giao diện.",
      deleteTitle: "Xóa đồng hồ:", deleteText: "Di chuột đến góc trên bên phải của thẻ đồng hồ để hiện nút Delete, sau đó nhấn nút đó.",
      stopAlarmTitle: "Tắt báo thức đang kêu:", stopAlarmText: "Khi chuông reo, nhấn Stop alarm trong hộp thoại trên màn hình để tắt âm thanh.",
      customClockTitle: "Đồng hồ thành phố tùy chỉnh:", customClockText: "Nhấn Clock Customize, nhập tên thành phố tùy ý và tự đặt độ lệch GMT (từ −12:00 đến +14:00)."
    },
    ko: {
      lang: "언어", title: "Cat and Dog World Clock 사용 방법",
      intro: "<strong>Cat and Dog World Clock</strong>에 오신 것을 환영합니다. 화면에서 하루 종일 사용할 수 있는 간단하고 맞춤형 아날로그 세계 시계입니다.",
      citiesTitle: "3단계로 전 세계 약 150개 도시 시간 확인:", citiesText: "① + Add Clock을 누르세요 → ② 도시를 검색하고 선택하세요 → ③ 대화상자에서 Add Clock을 누르세요.",
      minimalTitle: "미니멀 모드:", minimalText: "<em>Make It Minimal</em> 버튼을 눌러 레이아웃을 축소하고 방해 없는 작업 환경으로 단순화하세요. 브라우저 또는 화면이 전체 화면 모드이면 먼저 전체 화면을 종료하세요.",
      colorsTitle: "배경색 자동 변경:", colorsText: "시계 카드의 배경색은 각 도시의 현지 시간에 따라 06:00, 12:00, 18:00, 00:00에 자동으로 바뀝니다.",
      animationsTitle: "고양이와 강아지 애니메이션:", animationsText: "귀여운 고양이와 강아지 애니메이션이 정해진 시간에 나타납니다. 원하지 않으면 해당 시계의 <u>Animation</u> 버튼을 눌러 끄세요.",
      saveTitle: "설정 자동 저장:", saveText: "선택한 도시, 창 크기 및 색상 설정은 매일 계속 사용할 수 있도록 자동 저장됩니다.",
      alarmsTitle: "여러 개의 알람 설정:", alarmsText: "시계에서 Alarm Set을 누른 다음 Add alarm을 눌러 알람을 여러 개 추가하세요. 각각 시간을 설정하고 On으로 켜세요.",
      faceThemeTitle: "시계판 테마 변경:", faceThemeText: "시계판을 클릭한 후 스타일을 선택해 모양을 바꿀 수 있습니다.",
      deleteTitle: "시계 삭제:", deleteText: "시계 카드의 오른쪽 위 모서리에 마우스를 올리면 Delete 버튼이 나타납니다. 버튼을 눌러 삭제하세요.",
      stopAlarmTitle: "울리는 알람 끄기:", stopAlarmText: "알람이 울리면 화면에 표시된 대화상자에서 Stop alarm을 눌러 소리를 끄세요.",
      customClockTitle: "사용자 지정 도시 시계:", customClockText: "Clock Customize를 누르고 원하는 도시 이름을 입력한 뒤 GMT 오프셋을 직접 설정하세요(−12:00~+14:00)."
    },
    es: {
      lang: "Idioma", title: "Cómo usar Cat and Dog World Clock",
      intro: "Bienvenido a <strong>Cat and Dog World Clock</strong>, un reloj mundial analógico sencillo y personalizable diseñado para permanecer abierto en la pantalla todo el día.",
      citiesTitle: "Casi 150 ciudades en 3 pasos:", citiesText: "① Haz clic en + Add Clock → ② Busca y selecciona una ciudad → ③ Haz clic en Add Clock en el cuadro de diálogo.",
      minimalTitle: "Modo minimalista:", minimalText: "Haz clic en <em>Make It Minimal</em> para reducir y simplificar el diseño y trabajar sin distracciones. Si el navegador o la pantalla está en modo de pantalla completa, sal primero de ese modo.",
      colorsTitle: "Cambio automático del color de fondo:", colorsText: "El fondo de cada reloj cambia automáticamente según la hora local de su ciudad: a las 06:00, 12:00, 18:00 y 00:00.",
      animationsTitle: "Animaciones de gatos y perros:", animationsText: "Las animaciones aparecen en horarios programados. Si no las quieres, haz clic en el botón <u>Animation</u> de ese reloj para desactivarlas.",
      saveTitle: "Guardar ajustes automáticamente:", saveText: "Tus ciudades, el tamaño de ventana y los colores preferidos se guardan automáticamente para un uso diario continuo.",
      alarmsTitle: "Varias alarmas:", alarmsText: "Haz clic en Alarm Set en un reloj y luego en Add alarm para añadir varias alarmas. Configura la hora de cada una y actívala con On.",
      faceThemeTitle: "Temas de la esfera:", faceThemeText: "Haz clic en la esfera del reloj y elige un estilo para cambiar su aspecto.",
      deleteTitle: "Eliminar un reloj:", deleteText: "Pasa el cursor por la esquina superior derecha de la tarjeta para mostrar Delete y haz clic en ese botón.",
      stopAlarmTitle: "Detener una alarma:", stopAlarmText: "Cuando suene una alarma, haz clic en Stop alarm en el cuadro de diálogo de la pantalla para silenciarla.",
      customClockTitle: "Reloj de ciudad personalizado:", customClockText: "Haz clic en Clock Customize, escribe el nombre que quieras y configura manualmente el desfase GMT (de −12:00 a +14:00)."
    },
    pt: {
      lang: "Idioma", title: "Como usar o Cat and Dog World Clock",
      intro: "Bem-vindo ao <strong>Cat and Dog World Clock</strong>, um relógio mundial analógico simples e personalizável para deixar aberto na tela o dia inteiro.",
      citiesTitle: "Quase 150 cidades em 3 passos:", citiesText: "① Clique em + Add Clock → ② Pesquise e selecione uma cidade → ③ Clique em Add Clock na caixa de diálogo.",
      minimalTitle: "Modo mínimo:", minimalText: "Clique em <em>Make It Minimal</em> para reduzir e simplificar o layout em um ambiente de trabalho sem distrações. Se o navegador ou a tela estiver em tela cheia, saia desse modo primeiro.",
      colorsTitle: "Mudança automática da cor de fundo:", colorsText: "A cor de fundo de cada relógio muda automaticamente de acordo com o horário local da cidade: às 06:00, 12:00, 18:00 e 00:00.",
      animationsTitle: "Animações de gatos e cães:", animationsText: "As animações aparecem em horários programados. Se não quiser vê-las, clique no botão <u>Animation</u> daquele relógio para desativá-las.",
      saveTitle: "Salvar configurações automaticamente:", saveText: "As cidades escolhidas, o tamanho da janela e as cores preferidas são salvas automaticamente para uso diário.",
      alarmsTitle: "Vários alarmes:", alarmsText: "Clique em Alarm Set no relógio e depois em Add alarm para adicionar vários alarmes. Defina o horário de cada um e ative-o em On.",
      faceThemeTitle: "Temas do mostrador:", faceThemeText: "Clique no mostrador e escolha um estilo para mudar sua aparência.",
      deleteTitle: "Excluir um relógio:", deleteText: "Passe o mouse sobre o canto superior direito do cartão do relógio para exibir Delete e clique nesse botão.",
      stopAlarmTitle: "Parar um alarme tocando:", stopAlarmText: "Quando o alarme tocar, clique em Stop alarm na caixa de diálogo exibida na tela para silenciar o som.",
      customClockTitle: "Relógio de cidade personalizado:", customClockText: "Clique em Clock Customize, digite o nome de qualquer cidade e defina manualmente o deslocamento GMT (de −12:00 a +14:00)."
    }
  };

  const manualInterfaceTranslations = {
    en: { stepsTitle: 'Simple 3 steps:', stepCity: '1. Choose a city', stepPet: '2. Choose a cat or dog style', stepAlarm: '3. Set an alarm', faq: 'More instructions / FAQ' },
    th: { stepsTitle: 'เริ่มใช้งานง่ายๆ ใน 3 ขั้นตอน:', stepCity: '1. เลือกเมือง', stepPet: '2. เลือกสไตล์แมวหรือสุนัข', stepAlarm: '3. ตั้งนาฬิกาปลุก', faq: 'ดูวิธีใช้งานเพิ่มเติม / คำถามที่พบบ่อย' },
    ja: { stepsTitle: '簡単な3ステップ:', stepCity: '1. 都市を選ぶ', stepPet: '2. 猫または犬のスタイルを選ぶ', stepAlarm: '3. アラームを設定', faq: '詳しい使い方 / よくある質問' },
    zh: { stepsTitle: '简单三步即可开始:', stepCity: '1. 选择城市', stepPet: '2. 选择猫咪或狗狗样式', stepAlarm: '3. 设置闹钟', faq: '更多使用说明 / 常见问题' },
    hi: { stepsTitle: 'आसान 3 चरण:', stepCity: '1. शहर चुनें', stepPet: '2. बिल्ली या कुत्ते की शैली चुनें', stepAlarm: '3. अलार्म सेट करें', faq: 'और निर्देश / सामान्य प्रश्न' },
    id: { stepsTitle: '3 langkah mudah:', stepCity: '1. Pilih kota', stepPet: '2. Pilih gaya kucing atau anjing', stepAlarm: '3. Atur alarm', faq: 'Petunjuk lainnya / FAQ' },
    vi: { stepsTitle: '3 bước đơn giản:', stepCity: '1. Chọn thành phố', stepPet: '2. Chọn kiểu mèo hoặc chó', stepAlarm: '3. Đặt báo thức', faq: 'Hướng dẫn thêm / Câu hỏi thường gặp' },
    ko: { stepsTitle: '간단한 3단계:', stepCity: '1. 도시 선택', stepPet: '2. 고양이 또는 강아지 스타일 선택', stepAlarm: '3. 알람 설정', faq: '자세한 사용법 / 자주 묻는 질문' },
    es: { stepsTitle: '3 pasos sencillos:', stepCity: '1. Elige una ciudad', stepPet: '2. Elige un estilo de gato o perro', stepAlarm: '3. Configura una alarma', faq: 'Más instrucciones / Preguntas frecuentes' },
    pt: { stepsTitle: '3 passos simples:', stepCity: '1. Escolha uma cidade', stepPet: '2. Escolha um estilo de gato ou cão', stepAlarm: '3. Defina um alarme', faq: 'Mais instruções / Perguntas frequentes' }
  };

  const select = document.getElementById("manualLanguage");
  if (!select) return;

  function setManualText(language) {
    const text = manualTranslations[language] || manualTranslations.en;
    const interfaceText = manualInterfaceTranslations[language] || manualInterfaceTranslations.en;
    document.documentElement.lang = language;
    document.getElementById("manualLanguageLabel").textContent = text.lang;
    document.getElementById("manualStepsTitle").textContent = interfaceText.stepsTitle;
    document.getElementById("manualStepCity").textContent = interfaceText.stepCity;
    document.getElementById("manualStepPet").textContent = interfaceText.stepPet;
    document.getElementById("manualStepAlarm").textContent = interfaceText.stepAlarm;
    document.getElementById("manualFaqSummary").textContent = interfaceText.faq;
    document.getElementById("manualTitle").textContent = text.title;
    document.getElementById("manualIntro").innerHTML = text.intro;
    document.getElementById("manualCitiesTitle").textContent = text.citiesTitle;
    document.getElementById("manualCitiesText").textContent = text.citiesText;
    document.getElementById("manualMinimalTitle").textContent = text.minimalTitle;
    document.getElementById("manualMinimalText").innerHTML = text.minimalText;
    document.getElementById("manualColorsTitle").textContent = text.colorsTitle;
    document.getElementById("manualColorsText").textContent = text.colorsText;
    document.getElementById("manualAnimationsTitle").textContent = text.animationsTitle;
    document.getElementById("manualAnimationsText").innerHTML = text.animationsText;
    document.getElementById("manualSaveTitle").textContent = text.saveTitle;
    document.getElementById("manualSaveText").textContent = text.saveText;
    document.getElementById("manualAlarmsTitle").textContent = text.alarmsTitle;
    document.getElementById("manualAlarmsText").textContent = text.alarmsText;
    document.getElementById("manualFaceThemeTitle").textContent = text.faceThemeTitle;
    document.getElementById("manualFaceThemeText").textContent = text.faceThemeText;
    document.getElementById("manualDeleteTitle").textContent = text.deleteTitle;
    document.getElementById("manualDeleteText").textContent = text.deleteText;
    document.getElementById("manualStopAlarmTitle").textContent = text.stopAlarmTitle;
    document.getElementById("manualStopAlarmText").textContent = text.stopAlarmText;
    document.getElementById("manualCustomClockTitle").textContent = text.customClockTitle;
    document.getElementById("manualCustomClockText").textContent = text.customClockText;
  }

  let savedLanguage = "en";
  try {
    savedLanguage = localStorage.getItem(STORAGE_KEYS.language) ||
      localStorage.getItem(LEGACY_LANGUAGE_KEY) || "en";
  } catch (error) {
    console.warn("Unable to load saved language:", error);
  }

  if (!manualTranslations[savedLanguage]) savedLanguage = "en";
  select.value = savedLanguage;
  setManualText(savedLanguage);

  select.addEventListener("change", () => {
    const language = select.value;
    setManualText(language);
    try {
      localStorage.setItem(STORAGE_KEYS.language, language);
    } catch (error) {
      console.warn("Unable to save language:", error);
    }
  });
})();
