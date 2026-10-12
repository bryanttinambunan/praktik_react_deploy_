// Popular destinations with standardized city abbreviations (e.g. Medan -> MDN, Jakarta -> JKT)
export const CITIES = [
  {
    id: 'medan',
    name: 'Medan',
    code: 'MDN',
    iata: 'KNO',
    airport: 'Kualanamu International (KNO)',
    province: 'Sumatera Utara',
    country: 'Indonesia',
    x: 130,
    y: 170,
    popular: true,
  },
  {
    id: 'bali',
    name: 'Bali',
    code: 'DPS',
    iata: 'DPS',
    aliases: ['bli', 'denpasar'],
    airport: 'I Gusti Ngurah Rai (DPS)',
    province: 'Bali',
    country: 'Indonesia',
    x: 590,
    y: 350,
    popular: true,
  },
  {
    id: 'jakarta',
    name: 'Jakarta',
    code: 'JKT',
    iata: 'CGK',
    airport: 'Soekarno-Hatta International (CGK)',
    province: 'DKI Jakarta',
    country: 'Indonesia',
    x: 290,
    y: 310,
    popular: true,
  },
  {
    id: 'surabaya',
    name: 'Surabaya',
    code: 'SBY',
    iata: 'SUB',
    airport: 'Juanda International (SUB)',
    province: 'Jawa Timur',
    country: 'Indonesia',
    x: 470,
    y: 335,
    popular: true,
  },
  {
    id: 'yogyakarta',
    name: 'Yogyakarta',
    code: 'JOG',
    iata: 'YIA',
    aliases: ['yog', 'jogja'],
    airport: 'Yogyakarta International (YIA)',
    province: 'D.I. Yogyakarta',
    country: 'Indonesia',
    x: 390,
    y: 350,
    popular: true,
  },
  {
    id: 'bandung',
    name: 'Bandung',
    code: 'BDG',
    iata: 'BDO',
    airport: 'Husein Sastranegara (BDO)',
    province: 'Jawa Barat',
    country: 'Indonesia',
    x: 315,
    y: 325,
    popular: true,
  },
  {
    id: 'semarang',
    name: 'Semarang',
    code: 'SMG',
    iata: 'SRG',
    airport: 'Jenderal Ahmad Yani (SRG)',
    province: 'Jawa Tengah',
    country: 'Indonesia',
    x: 410,
    y: 330,
    popular: false,
  },
  {
    id: 'makassar',
    name: 'Makassar',
    code: 'MKS',
    iata: 'UPG',
    airport: 'Sultan Hasanuddin International (UPG)',
    province: 'Sulawesi Selatan',
    country: 'Indonesia',
    x: 550,
    y: 240,
    popular: false,
  },
  {
    id: 'labuan-bajo',
    name: 'Labuan Bajo',
    code: 'LBJ',
    iata: 'LBJ',
    airport: 'Komodo Airport (LBJ)',
    province: 'Nusa Tenggara Timur',
    country: 'Indonesia',
    x: 670,
    y: 345,
    popular: true,
  },
  {
    id: 'lombok',
    name: 'Lombok',
    code: 'LOP',
    iata: 'LOP',
    airport: 'Lombok International (LOP)',
    province: 'Nusa Tenggara Barat',
    country: 'Indonesia',
    x: 625,
    y: 355,
    popular: false,
  },
  {
    id: 'singapore',
    name: 'Singapore',
    code: 'SIN',
    iata: 'SIN',
    airport: 'Singapore Changi Airport (SIN)',
    province: 'Central',
    country: 'Singapore',
    x: 210,
    y: 200,
    popular: true,
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    code: 'TYO',
    iata: 'HND',
    airport: 'Haneda / Narita International (HND)',
    province: 'Kanto',
    country: 'Japan',
    x: 710,
    y: 110,
    popular: false,
  },
];

export function findCity(nameOrCode) {
  if (!nameOrCode) return null;
  const query = nameOrCode.toLowerCase().trim();
  return (
    CITIES.find(
      (c) =>
        c.name.toLowerCase() === query ||
        c.code.toLowerCase() === query ||
        c.id.toLowerCase() === query ||
        (c.iata && c.iata.toLowerCase() === query) ||
        (c.aliases && c.aliases.includes(query))
    ) || {
      id: query,
      name: nameOrCode,
      code: nameOrCode.slice(0, 3).toUpperCase(),
      iata: nameOrCode.slice(0, 3).toUpperCase(),
      airport: `${nameOrCode} Airport`,
      province: 'Indonesia',
      country: 'Indonesia',
      x: 350,
      y: 250,
      popular: false,
    }
  );
}

// Compute flight details between two cities
export function getFlightDetails(fromName, toName) {
  const from = findCity(fromName);
  const to = findCity(toName);

  if (!from || !to) {
    return {
      distanceKm: 2150,
      durationText: '3h 15m',
      flightNumber: 'AG-742',
      airline: 'AeroJourney Air',
      gate: 'B12',
      direct: true,
    };
  }

  // Calculate distance based on coordinate delta
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distUnits = Math.sqrt(dx * dx + dy * dy);
  const distanceKm = Math.round(distUnits * 4.2 + 250);

  // Approximate duration: 750 km/h average + 30 mins takeoff/landing
  const totalHours = distanceKm / 700 + 0.5;
  const hours = Math.floor(totalHours);
  const mins = Math.round((totalHours - hours) * 60);

  return {
    distanceKm,
    durationText: `${hours}h ${mins.toString().padStart(2, '0')}m`,
    flightNumber: `AG-${Math.floor(100 + (from.name.charCodeAt(0) * 7 + to.name.charCodeAt(0) * 3) % 900)}`,
    airline: 'AeroJourney Air',
    gate: `G${Math.floor(1 + ((from.x + to.y) % 18))}`,
    direct: true,
  };
}
