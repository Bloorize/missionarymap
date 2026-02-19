// This file contains a comprehensive list of LDS missions and logic to map them to coordinates.

export interface Mission {
    id: string; // slugified name
    name: string;
}

export interface MissionLocation {
    lat: number;
    lng: number;
    zoom?: number;
}

// A curated map of cities/regions to coordinates to support the "Smart Search"
// This saves us from having to hardcode 450+ lat/lng pairs.
// We just look for these distinct keys in the mission name.
const CITY_COORDINATES: Record<string, { lat: number, lng: number }> = {
    // USA - West
    "Salt Lake City": { lat: 40.76, lng: -111.89 },
    "Provo": { lat: 40.23, lng: -111.65 },
    "Orem": { lat: 40.29, lng: -111.69 },
    "Ogden": { lat: 41.22, lng: -111.97 },
    "St George": { lat: 37.09, lng: -113.56 },
    "Logan": { lat: 41.73, lng: -111.83 },
    "Layton": { lat: 41.06, lng: -111.97 },
    "Boise": { lat: 43.61, lng: -116.20 },
    "Idaho Falls": { lat: 43.49, lng: -112.03 },
    "Pocatello": { lat: 42.86, lng: -112.44 },
    "Twin Falls": { lat: 42.56, lng: -114.46 },
    "Meridian": { lat: 43.61, lng: -116.39 },
    "Phoenix": { lat: 33.44, lng: -112.07 },
    "Mesa": { lat: 33.41, lng: -111.83 },
    "Scottsdale": { lat: 33.49, lng: -111.92 },
    "Tucson": { lat: 32.22, lng: -110.97 },
    "Gilbert": { lat: 33.35, lng: -111.78 },
    "Las Vegas": { lat: 36.16, lng: -115.13 },
    "Reno": { lat: 39.52, lng: -119.81 },
    "Los Angeles": { lat: 34.05, lng: -118.24 },
    "Anaheim": { lat: 33.83, lng: -117.91 },
    "Arcadia": { lat: 34.13, lng: -118.04 },
    "Bakersfield": { lat: 35.37, lng: -119.01 },
    "Fresno": { lat: 36.73, lng: -119.78 },
    "Long Beach": { lat: 33.77, lng: -118.19 },
    "Modesto": { lat: 37.63, lng: -120.99 },
    "Newport Beach": { lat: 33.61, lng: -117.89 },
    "Oakland": { lat: 37.80, lng: -122.27 },
    "Redlands": { lat: 34.05, lng: -117.18 },
    "Riverside": { lat: 33.98, lng: -117.37 },
    "Roseville": { lat: 38.75, lng: -121.28 },
    "Sacramento": { lat: 38.58, lng: -121.49 },
    "San Bernardino": { lat: 34.10, lng: -117.28 },
    "San Diego": { lat: 32.71, lng: -117.16 },
    "San Francisco": { lat: 37.77, lng: -122.41 },
    "San Jose": { lat: 37.33, lng: -121.88 },
    "Santa Rosa": { lat: 38.44, lng: -122.71 },
    "Ventura": { lat: 34.27, lng: -119.22 },
    "Portland": { lat: 45.51, lng: -122.67 },
    "Eugene": { lat: 44.05, lng: -123.08 },
    "Salem": { lat: 44.94, lng: -123.03 },
    "Seattle": { lat: 47.60, lng: -122.33 },
    "Tacoma": { lat: 47.25, lng: -122.44 },
    "Everett": { lat: 47.97, lng: -122.20 },
    "Spokane": { lat: 47.65, lng: -117.42 },
    "Vancouver": { lat: 45.63, lng: -122.66 }, // WA
    "Kennewick": { lat: 46.21, lng: -119.13 },
    "Yakima": { lat: 46.60, lng: -120.50 },
    "Anchorage": { lat: 61.21, lng: -149.90 },
    "Honolulu": { lat: 21.30, lng: -157.85 },
    "Billings": { lat: 45.78, lng: -108.50 },
    "Great Falls": { lat: 47.50, lng: -111.30 },
    "Denver": { lat: 39.73, lng: -104.99 },
    "Fort Collins": { lat: 40.58, lng: -105.08 },
    "Colorado Springs": { lat: 38.83, lng: -104.82 },
    "Albuquerque": { lat: 35.08, lng: -106.65 },
    "Farmington": { lat: 36.72, lng: -108.20 },

    // USA - Central/South
    "Dallas": { lat: 32.77, lng: -96.79 },
    "Fort Worth": { lat: 32.75, lng: -97.33 },
    "Houston": { lat: 29.76, lng: -95.36 },
    "San Antonio": { lat: 29.42, lng: -98.49 },
    "Austin": { lat: 30.26, lng: -97.74 },
    "Lubbock": { lat: 33.57, lng: -101.85 },
    "McAllen": { lat: 26.20, lng: -98.23 },
    "El Paso": { lat: 31.76, lng: -106.48 },
    "Oklahoma City": { lat: 35.46, lng: -97.51 },
    "Tulsa": { lat: 36.15, lng: -95.99 },
    "Bentonville": { lat: 36.37, lng: -94.20 },
    "Little Rock": { lat: 34.74, lng: -92.28 },
    "Wichita": { lat: 37.68, lng: -97.33 },
    "Omaha": { lat: 41.25, lng: -95.93 },
    "Bismarck": { lat: 46.80, lng: -100.78 },
    "Rapid City": { lat: 44.08, lng: -103.23 },
    "Minneapolis": { lat: 44.97, lng: -93.26 },
    "St Louis": { lat: 38.62, lng: -90.19 },
    "Kansas City": { lat: 39.09, lng: -94.57 },
    "Independence": { lat: 39.09, lng: -94.41 },
    "Nauvoo": { lat: 40.55, lng: -91.38 },
    "Chicago": { lat: 41.87, lng: -87.62 },
    "Milwaukee": { lat: 43.03, lng: -87.90 },
    "Detroit": { lat: 42.33, lng: -83.04 },
    "Lansing": { lat: 42.73, lng: -84.55 },
    "Indianapolis": { lat: 39.76, lng: -86.15 },
    "Cleveland": { lat: 41.49, lng: -81.69 },
    "Columbus": { lat: 39.96, lng: -82.99 },
    "Cincinnati": { lat: 39.10, lng: -84.51 },

    // USA - East
    "New York": { lat: 40.71, lng: -74.00 },
    "Syracuse": { lat: 43.04, lng: -76.14 },
    "Morristown": { lat: 40.79, lng: -74.48 },
    "Philadelphia": { lat: 39.95, lng: -75.16 },
    "Pittsburgh": { lat: 40.44, lng: -79.99 },
    "Washington DC": { lat: 38.90, lng: -77.03 },
    "Baltimore": { lat: 39.29, lng: -76.61 },
    "Richmond": { lat: 37.54, lng: -77.43 },
    "Charleston": { lat: 38.34, lng: -81.63 }, // WV
    "Raleigh": { lat: 35.77, lng: -78.63 },
    "Charlotte": { lat: 35.22, lng: -80.84 },
    "Columbia": { lat: 34.00, lng: -81.03 },
    "Atlanta": { lat: 33.74, lng: -84.38 },
    "Knoxville": { lat: 35.96, lng: -83.92 },
    "Nashville": { lat: 36.16, lng: -86.78 },
    "Memphis": { lat: 35.14, lng: -90.04 },
    "Birmingham": { lat: 33.51, lng: -86.81 },
    "Jackson": { lat: 32.29, lng: -90.18 },
    "Baton Rouge": { lat: 30.45, lng: -91.18 },
    "Orlando": { lat: 28.53, lng: -81.37 },
    "Tampa": { lat: 27.95, lng: -82.45 },
    "Fort Lauderdale": { lat: 26.12, lng: -80.13 },
    "Miami": { lat: 25.76, lng: -80.19 },
    "Jacksonville": { lat: 30.33, lng: -81.65 },

    // Canada
    "Calgary": { lat: 51.04, lng: -114.07 },
    "Edmonton": { lat: 53.54, lng: -113.49 },
    "Vancouver BC": { lat: 49.28, lng: -123.12 },
    "Winnipeg": { lat: 49.89, lng: -97.13 },
    "Toronto": { lat: 43.65, lng: -79.38 },
    "Montreal": { lat: 45.50, lng: -73.56 },
    "Halifax": { lat: 44.64, lng: -63.57 },

    // Mexico
    "Mexico City": { lat: 19.43, lng: -99.13 },
    "Guadalajara": { lat: 20.65, lng: -103.34 },
    "Monterrey": { lat: 25.68, lng: -100.31 },
    "Puebla": { lat: 19.04, lng: -98.20 },
    "Mérida": { lat: 20.96, lng: -89.59 },
    "Tijuana": { lat: 32.51, lng: -117.03 },
    "Hermosillo": { lat: 29.07, lng: -110.97 },
    "Culiacán": { lat: 24.80, lng: -107.39 },
    "Torreón": { lat: 25.54, lng: -103.40 },
    "Ciudad Juárez": { lat: 31.69, lng: -106.42 },
    "Chihuahua": { lat: 28.63, lng: -106.06 },
    "Saltillo": { lat: 25.41, lng: -100.99 },
    "Tampico": { lat: 22.23, lng: -97.86 },
    "Xalapa": { lat: 19.54, lng: -96.92 },
    "Veracruz": { lat: 19.17, lng: -96.13 },
    "Tuxtla Gutiérrez": { lat: 16.75, lng: -93.12 },
    "Oaxaca": { lat: 17.07, lng: -96.72 },
    "Cuernavaca": { lat: 18.92, lng: -99.22 },
    "Pachuca": { lat: 20.10, lng: -98.75 },
    "Querétaro": { lat: 20.58, lng: -100.38 },
    "León": { lat: 21.12, lng: -101.68 },
    "Aguascalientes": { lat: 21.88, lng: -102.29 },

    // South America - Brazil
    "São Paulo": { lat: -23.55, lng: -46.63 },
    "Rio de Janeiro": { lat: -22.90, lng: -43.17 },
    "Brasília": { lat: -15.82, lng: -47.92 },
    "Curitiba": { lat: -25.42, lng: -49.27 },
    "Porto Alegre": { lat: -30.03, lng: -51.22 },
    "Belo Horizonte": { lat: -19.91, lng: -43.93 },
    "Recife": { lat: -8.04, lng: -34.87 },
    "Fortaleza": { lat: -3.73, lng: -38.52 },
    "Manaus": { lat: -3.11, lng: -60.02 },
    "Belém": { lat: -1.45, lng: -48.50 },
    "Salvador": { lat: -12.97, lng: -38.50 },
    "Goiânia": { lat: -16.68, lng: -49.26 },
    "Campinas": { lat: -22.90, lng: -47.06 },
    "Santos": { lat: -23.96, lng: -46.33 },
    "Florianópolis": { lat: -27.59, lng: -48.54 },
    "Maceió": { lat: -9.66, lng: -35.73 },
    "Natal": { lat: -5.79, lng: -35.20 },
    "João Pessoa": { lat: -7.11, lng: -34.86 },
    "Teresina": { lat: -5.09, lng: -42.80 },
    "Juiz de Fora": { lat: -21.76, lng: -43.35 },
    "Piracicaba": { lat: -22.73, lng: -47.64 },
    "Ribeirão Preto": { lat: -21.17, lng: -47.81 },
    "Londrina": { lat: -23.30, lng: -51.16 },

    // South America - Hispanic
    "Buenos Aires": { lat: -34.60, lng: -58.38 },
    "Córdoba": { lat: -31.42, lng: -64.18 },
    "Rosario": { lat: -32.94, lng: -60.63 },
    "Mendoza": { lat: -32.88, lng: -68.84 },
    "Bahía Blanca": { lat: -38.71, lng: -62.26 },
    "Salta": { lat: -24.78, lng: -65.42 },
    "Neuquén": { lat: -38.95, lng: -68.05 },
    "Santiago": { lat: -33.44, lng: -70.66 }, // Chile
    "Concepción": { lat: -36.82, lng: -73.04 },
    "Viña del Mar": { lat: -33.02, lng: -71.55 },
    "Antofagasta": { lat: -23.63, lng: -70.39 },
    "Rancagua": { lat: -34.17, lng: -70.74 },
    "Osorno": { lat: -40.57, lng: -73.13 },
    "Lima": { lat: -12.04, lng: -77.04 }, // Peru
    "Cusco": { lat: -13.53, lng: -71.96 },
    "Arequipa": { lat: -16.40, lng: -71.53 },
    "Trujillo": { lat: -8.11, lng: -79.03 },
    "Piura": { lat: -5.19, lng: -80.63 },
    "Huancayo": { lat: -12.06, lng: -75.20 },
    "Iquitos": { lat: -3.74, lng: -73.25 },
    "Bogotá": { lat: 4.71, lng: -74.07 }, // Colombia
    "Medellín": { lat: 6.24, lng: -75.56 },
    "Cali": { lat: 3.45, lng: -76.53 },
    "Barranquilla": { lat: 10.96, lng: -74.79 },
    "Quito": { lat: -0.18, lng: -78.46 }, // Ecuador
    "Guayaquil": { lat: -2.18, lng: -79.88 },
    "Asunción": { lat: -25.26, lng: -57.57 }, // Paraguay
    "Montevideo": { lat: -34.90, lng: -56.16 }, // Uruguay
    "Caracas": { lat: 10.48, lng: -66.90 }, // Venezuela
    "Maracaibo": { lat: 10.65, lng: -71.61 },
    "La Paz": { lat: -16.50, lng: -68.11 }, // Bolivia
    "Cochabamba": { lat: -17.39, lng: -66.15 },
    "Santa Cruz": { lat: -17.76, lng: -63.18 },

    // Europe
    "London": { lat: 51.50, lng: -0.12 },
    "Manchester": { lat: 53.48, lng: -2.24 },
    "Birmingham UK": { lat: 52.48, lng: -1.89 },
    "Leeds": { lat: 53.80, lng: -1.54 },
    "Scotland": { lat: 55.95, lng: -3.18 }, // Edinburgh
    "Paris": { lat: 48.85, lng: 2.35 },
    "Lyon": { lat: 45.76, lng: 4.83 },
    "Frankfurt": { lat: 50.11, lng: 8.68 },
    "Berlin": { lat: 52.52, lng: 13.40 },
    "Munich": { lat: 48.13, lng: 11.58 },
    "Düsseldorf": { lat: 51.22, lng: 6.77 },
    "Rome": { lat: 41.90, lng: 12.49 },
    "Milan": { lat: 45.46, lng: 9.19 },
    "Madrid": { lat: 40.41, lng: -3.70 },
    "Barcelona": { lat: 41.38, lng: 2.16 },
    "Málaga": { lat: 36.72, lng: -4.42 },
    "Lisbon": { lat: 38.72, lng: -9.13 },
    "Porto": { lat: 41.15, lng: -8.62 },
    "Zurich": { lat: 47.37, lng: 8.54 }, // Alpine
    "Vienna": { lat: 48.20, lng: 16.37 },
    "Brussels": { lat: 50.85, lng: 4.35 }, // Belgium/Netherlands
    "Amsterdam": { lat: 52.36, lng: 4.90 },
    "Copenhagen": { lat: 55.67, lng: 12.56 },
    "Stockholm": { lat: 59.32, lng: 18.06 },
    "Oslo": { lat: 59.91, lng: 10.75 },
    "Helsinki": { lat: 60.16, lng: 24.93 },
    "Warsaw": { lat: 52.22, lng: 21.01 },
    "Prague": { lat: 50.07, lng: 14.43 },
    "Budapest": { lat: 47.49, lng: 19.04 },
    "Bucharest": { lat: 44.42, lng: 26.10 },
    "Kyiv": { lat: 50.45, lng: 30.52 },
    "Adriatic": { lat: 45.81, lng: 15.98 }, // Zagreb
    "Athens": { lat: 37.98, lng: 23.72 },

    // Asia
    "Tokyo": { lat: 35.68, lng: 139.69 },
    "Nagoya": { lat: 35.18, lng: 136.90 },
    "Kobe": { lat: 34.69, lng: 135.19 },
    "Hiroshima": { lat: 34.38, lng: 132.45 },
    "Fukuoka": { lat: 33.59, lng: 130.40 },
    "Sapporo": { lat: 43.06, lng: 141.35 },
    "Sendai": { lat: 38.26, lng: 140.87 },
    "Seoul": { lat: 37.56, lng: 126.97 },
    "Busan": { lat: 35.17, lng: 129.07 },
    "Daejeon": { lat: 36.35, lng: 127.38 },
    "Taipei": { lat: 25.03, lng: 121.56 },
    "Taichung": { lat: 24.14, lng: 120.67 },
    "Kaohsiung": { lat: 22.62, lng: 120.30 },
    "Hong Kong": { lat: 22.31, lng: 114.16 },
    "Manila": { lat: 14.59, lng: 120.98 },
    "Quezon City": { lat: 14.67, lng: 121.04 },
    "Cebu": { lat: 10.31, lng: 123.88 },
    "Davao": { lat: 7.19, lng: 125.45 },
    "Bacolod": { lat: 10.67, lng: 122.95 },
    "Cagayan de Oro": { lat: 8.45, lng: 124.63 },
    "Urdaneta": { lat: 15.97, lng: 120.57 },
    "Naga": { lat: 13.62, lng: 123.18 },
    "Legazpi": { lat: 13.13, lng: 123.73 },
    "Tacloban": { lat: 11.24, lng: 125.00 },
    "Bangkok": { lat: 13.75, lng: 100.50 },
    "Singapore": { lat: 1.35, lng: 103.81 },
    "Kuala Lumpur": { lat: 3.13, lng: 101.68 },
    "Jakarta": { lat: -6.20, lng: 106.84 },
    "Phnom Penh": { lat: 11.55, lng: 104.92 },
    "Ulaanbaatar": { lat: 47.88, lng: 106.90 },
    "Bangalore": { lat: 12.97, lng: 77.59 },
    "New Delhi": { lat: 28.61, lng: 77.20 },

    // Pacific
    "Auckland": { lat: -36.84, lng: 174.76 },
    "Wellington": { lat: -41.28, lng: 174.77 },
    "Hamilton": { lat: -37.78, lng: 175.27 },
    "Sydney": { lat: -33.86, lng: 151.20 },
    "Melbourne": { lat: -37.81, lng: 144.96 },
    "Brisbane": { lat: -27.47, lng: 153.02 },
    "Perth": { lat: -31.95, lng: 115.86 },
    "Adelaide": { lat: -34.92, lng: 138.60 },
    "Apia": { lat: -13.83, lng: -171.75 }, // Samoa
    "Suva": { lat: -18.14, lng: 178.44 }, // Fiji
    "Nuku'alofa": { lat: -21.13, lng: -175.20 }, // Tonga
    "Papeete": { lat: -17.54, lng: -149.56 }, // Tahiti

    // Africa
    "Accra": { lat: 5.60, lng: -0.18 }, // Ghana
    "Kumasi": { lat: 6.68, lng: -1.62 },
    "Cape Coast": { lat: 5.10, lng: -1.24 },
    "Lagos": { lat: 6.52, lng: 3.37 }, // Nigeria
    "Ibadan": { lat: 7.37, lng: 3.94 },
    "Benin City": { lat: 6.33, lng: 5.62 },
    "Enugu": { lat: 6.45, lng: 7.54 },
    "Port Harcourt": { lat: 4.81, lng: 7.04 },
    "Kinshasa": { lat: -4.44, lng: 15.26 }, // DRC
    "Lubumbashi": { lat: -11.66, lng: 27.48 },
    "Nairobi": { lat: -1.29, lng: 36.82 }, // Kenya
    "Johannesburg": { lat: -26.20, lng: 28.04 }, // South Africa
    "Cape Town": { lat: -33.92, lng: 18.42 },
    "Durban": { lat: -29.85, lng: 31.02 },
    "Harare": { lat: -17.82, lng: 31.05 }, // Zimbabwe
    "Lusaka": { lat: -15.38, lng: 28.32 }, // Zambia
    "Maputo": { lat: -25.96, lng: 32.57 }, // Mozambique
    "Abidjan": { lat: 5.36, lng: -4.00 }, // Cote d'Ivoire
    "Freetown": { lat: 8.46, lng: -13.23 }, // Sierra Leone
    "Monrovia": { lat: 6.30, lng: -10.79 }, // Liberia
    "Antananarivo": { lat: -18.87, lng: 47.50 }, // Madagascar
};

// We define a massive list of mission names (approximated for this demo, 
// but represents the dataset of 450+ missions).
const MISSION_NAMES = [
    // USA - Utah/Idaho
    "Utah Salt Lake City Headquarters", "Utah Salt Lake City South", "Utah Salt Lake City West",
    "Utah Provo", "Utah Orem", "Utah Ogden", "Utah St George", "Utah Layton", "Utah Logan",
    "Idaho Boise", "Idaho Pocatello", "Idaho Twin Falls", "Idaho Idaho Falls",

    // USA - West
    "Arizona Phoenix", "Arizona Mesa", "Arizona Scottsdale", "Arizona Tucson", "Arizona Gilbert", "Arizona Tempe",
    "California Los Angeles", "California Anaheim", "California Arcadia", "California Bakersfield",
    "California Fresno", "California Long Beach", "California Modesto", "California Newport Beach",
    "California Oakland", "California Redlands", "California Riverside", "California Roseville",
    "California Sacramento", "California San Bernardino", "California San Diego", "California San Francisco",
    "California San Jose", "California Santa Rosa", "California Ventura",
    "Colorado Denver North", "Colorado Denver South", "Colorado Fort Collins", "Colorado Colorado Springs",
    "Nevada Las Vegas", "Nevada Las Vegas West", "Nevada Reno",
    "Oregon Portland", "Oregon Eugene", "Oregon Salem",
    "Washington Seattle", "Washington Tacoma", "Washington Everett", "Washington Spokane",
    "Washington Vancouver", "Washington Kennewick", "Washington Yakima",
    "Alaska Anchorage", "Hawaii Honolulu",

    // USA - Central
    "Texas Dallas West", "Texas Dallas East", "Texas Fort Worth", "Texas Houston", "Texas Houston East",
    "Texas Houston South", "Texas San Antonio", "Texas Austin", "Texas Lubbock", "Texas McAllen", "Texas El Paso",
    "Oklahoma Oklahoma City", "Oklahoma Tulsa",
    "Arkansas Bentonville", "Arkansas Little Rock",
    "Kansas Wichita", "Missouri Independence", "Missouri St Louis",
    "Illinois Chicago", "Illinois Chicago West", "Illinois Nauvoo",
    "Minnesota Minneapolis", "North Dakota Bismarck", "South Dakota Rapid City",

    // USA - East
    "New York New York City", "New York Syracuse", "New Jersey Morristown",
    "Pennsylvania Philadelphia", "Pennsylvania Pittsburgh",
    "Massachusetts Boston", "Washington DC North", "Washington DC South", "Maryland Baltimore",
    "Virginia Richmond", "West Virginia Charleston",
    "North Carolina Raleigh", "North Carolina Charlotte", "South Carolina Columbia",
    "Georgia Atlanta", "Georgia Atlanta North",
    "Tennessee Knoxville", "Tennessee Nashville", "Tennessee Memphis",
    "Florida Orlando", "Florida Tampa", "Florida Fort Lauderdale", "Florida Jacksonville",
    "Alabama Birmingham", "Mississippi Jackson", "Louisiana Baton Rouge",

    // International - Americas
    "Canada Calgary", "Canada Edmonton", "Canada Vancouver", "Canada Winnipeg",
    "Canada Toronto", "Canada Montreal", "Canada Halifax",
    "Mexico Mexico City North", "Mexico Mexico City South", "Mexico Mexico City West", "Mexico Mexico City East", "Mexico Mexico City Southeast",
    "Mexico Guadalajara", "Mexico Monterrey West", "Mexico Monterrey East", "Mexico Puebla North", "Mexico Puebla South",
    "Mexico Mérida", "Mexico Tijuana", "Mexico Hermosillo", "Mexico Culiacán", "Mexico Torreón",
    "Mexico Ciudad Juárez", "Mexico Chihuahua", "Mexico Saltillo", "Mexico Tampico", "Mexico Xalapa", "Mexico Veracruz",
    "Mexico Tuxtla Gutiérrez", "Mexico Oaxaca", "Mexico Cuernavaca", "Mexico Pachuca", "Mexico Querétaro", "Mexico León", "Mexico Aguascalientes",

    // South America - Brazil
    "Brazil São Paulo North", "Brazil São Paulo South", "Brazil São Paulo East", "Brazil São Paulo West", "Brazil São Paulo Interlagos",
    "Brazil Rio de Janeiro North", "Brazil Rio de Janeiro South", "Brazil Brasília", "Brazil Curitiba", "Brazil Curitiba South",
    "Brazil Porto Alegre North", "Brazil Porto Alegre South", "Brazil Belo Horizonte", "Brazil Recife",
    "Brazil Fortaleza", "Brazil Fortaleza East", "Brazil Manaus", "Brazil Belém", "Brazil Salvador",
    "Brazil Goiânia", "Brazil Campinas", "Brazil Santos", "Brazil Florianópolis", "Brazil Maceió",
    "Brazil Natal", "Brazil João Pessoa", "Brazil Teresina", "Brazil Juiz de Fora",
    "Brazil Piracicaba", "Brazil Ribeirão Preto", "Brazil Londrina",

    // South America - Hispanic
    "Argentina Buenos Aires North", "Argentina Buenos Aires South", "Argentina Buenos Aires West",
    "Argentina Córdoba", "Argentina Rosario", "Argentina Mendoza", "Argentina Bahía Blanca", "Argentina Salta", "Argentina Neuquén",
    "Chile Santiago North", "Chile Santiago South", "Chile Santiago West", "Chile Concepción",
    "Chile Viña del Mar", "Chile Antofagasta", "Chile Rancagua", "Chile Osorno",
    "Peru Lima North", "Peru Lima South", "Peru Lima East", "Peru Lima West", "Peru Lima Central",
    "Peru Cusco", "Peru Arequipa", "Peru Trujillo", "Peru Piura", "Peru Huancayo", "Peru Iquitos",
    "Colombia Bogotá North", "Colombia Bogotá South", "Colombia Medellín", "Colombia Cali", "Colombia Barranquilla",
    "Ecuador Quito", "Ecuador Guayaquil North", "Ecuador Guayaquil South",
    "Venezuela Caracas", "Venezuela Maracaibo",
    "Bolivia La Paz", "Bolivia Cochabamba", "Bolivia Santa Cruz",
    "Paraguay Asunción", "Uruguay Montevideo",

    // Europe
    "England London", "England Manchester", "England Birmingham", "England Leeds",
    "Scotland/Ireland", "France Paris", "France Lyon",
    "Germany Frankfurt", "Germany Berlin", "Germany Munich",
    "Italy Rome", "Italy Milan",
    "Spain Madrid Note", "Spain Madrid South", "Spain Barcelona", "Spain Málaga",
    "Portugal Lisbon", "Portugal Porto",
    "Alpine German-Speaking", "Belgium/Netherlands",
    "Denmark Copenhagen", "Sweden Stockholm", "Norway Oslo", "Finland Helsinki",
    "Poland Warsaw", "Czech/Slovak", "Hungary Budapest", "Romania/Moldova", "Ukraine",
    "Adriatic North", "Adriatic South", "Greece Athens",

    // Asia/Pacific
    "Japan Tokyo North", "Japan Tokyo South", "Japan Nagoya", "Japan Kobe", "Japan Hiroshima", "Japan Fukuoka",
    "Japan Sapporo", "Japan Sendai",
    "Korea Seoul", "Korea Seoul South", "Korea Busan", "Korea Daejeon",
    "Taiwan Taipei", "Taiwan Taichung", "Taiwan Kaohsiung",
    "China Hong Kong",
    "Philippines Manila", "Philippines Quezon City", "Philippines Cebu", "Philippines Davao", "Philippines Bacolod",
    "Philippines Cagayan de Oro", "Philippines Urdaneta", "Philippines Naga", "Philippines Legazpi", "Philippines Tacloban",
    "Thailand Bangkok", "Singapore", "Malaysia Kuala Lumpur", "Indonesia Jakarta", "Cambodia Phnom Penh", "Mongolia Ulaanbaatar",
    "India Bangalore", "India New Delhi",

    // Oceania
    "New Zealand Auckland", "New Zealand Wellington", "New Zealand Hamilton",
    "Australia Sydney", "Australia Melbourne", "Australia Brisbane", "Australia Perth", "Australia Adelaide",
    "Samoa Apia", "Fiji Suva", "Tonga Nuku'alofa", "Tahiti Papeete",

    // Africa
    "Ghana Accra", "Ghana Accra West", "Ghana Kumasi", "Ghana Cape Coast",
    "Nigeria Lagos", "Nigeria Ibadan", "Nigeria Benin City", "Nigeria Enugu", "Nigeria Port Harcourt",
    "DR Congo Kinshasa East", "DR Congo Kinshasa West", "DR Congo Lubumbashi",
    "Kenya Nairobi",
    "South Africa Johannesburg", "South Africa Cape Town", "South Africa Durban",
    "Zimbabwe Harare", "Zambia Lusaka", "Mozambique Maputo",
    "Cote d'Ivoire Abidjan", "Sierra Leone Freetown", "Liberia Monrovia", "Madagascar Antananarivo"
];

// Helper to sanitize and approximate location
export function getMissionLocation(missionName: string): MissionLocation {
    // Normalize checking
    const check = missionName.toLowerCase();

    // Check our city map
    for (const [city, loc] of Object.entries(CITY_COORDINATES)) {
        if (check.includes(city.toLowerCase())) {
            // Add a tiny bit of random jitter so pins don't stack perfectly on top of each other
            // if multiple people guess the same general city (though different missions in same city)
            return {
                lat: loc.lat + (Math.random() * 0.05 - 0.025),
                lng: loc.lng + (Math.random() * 0.05 - 0.025)
            };
        }
    }

    // Fallback: Default to "General World" (0,0) or Salt Lake if completely unknown
    // But for better UX, let's fallback to Salt Lake City as the "center" of the church
    return { lat: 40.76, lng: -111.89 };
}

// Export the full list with mapped locations for the UI to use
export const ALL_MISSIONS = MISSION_NAMES.sort().map(name => {
    const loc = getMissionLocation(name);
    return {
        id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name,
        ...loc
    }
});
