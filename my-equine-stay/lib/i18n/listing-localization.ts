import type { Language } from "./translations";
import type { ListingWithPhotos } from "@/types/database";

/* ─────────────────────────────────────────────────────────────
   Property Type Translations
   ───────────────────────────────────────────────────────────── */
export const PROPERTY_TYPE_TRANSLATIONS: Record<
  string,
  Record<Language, string>
> = {
  equestrian_farm: {
    en: "Equestrian Farm",
    es: "Finca Ecuestre",
    fr: "Domaine Équestre",
  },
  house: {
    en: "House / Villa with Barn",
    es: "Casa / Villa con Establo",
    fr: "Maison / Villa avec Écurie",
  },
  apartment: {
    en: "Apartment / Guest House",
    es: "Apartamento / Casa de Huéspedes",
    fr: "Appartement / Maison d'Hôtes",
  },
  private_bedroom: {
    en: "Private Room + Stalls",
    es: "Habitación Privada + Establos",
    fr: "Chambre Privée + Boxes",
  },
  rv: {
    en: "RV / Camper",
    es: "Autocaravana / RV",
    fr: "Camping-car / VR",
  },
  rv_hookup: {
    en: "RV Hookup / Pad",
    es: "Espacio / Conexión para RV",
    fr: "Emplacement / Raccordement VR",
  },
  pasture_rental: {
    en: "Pasture Rental",
    es: "Alquiler de Pastos",
    fr: "Location de Pâturage",
  },
  barn_stall: {
    en: "Barn / Stalls Only",
    es: "Solo Establo / Boxes",
    fr: "Écurie / Boxes Uniquement",
  },
  other: {
    en: "Other Equestrian Property",
    es: "Otra Propiedad Ecuestre",
    fr: "Autre Propriété Équestre",
  },
};

export function getLocalizedPropertyType(slug: string, lang: Language = "en"): string {
  if (PROPERTY_TYPE_TRANSLATIONS[slug]?.[lang]) {
    return PROPERTY_TYPE_TRANSLATIONS[slug][lang];
  }
  return slug
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/* ─────────────────────────────────────────────────────────────
   Amenities Translations
   ───────────────────────────────────────────────────────────── */
export const AMENITY_TRANSLATIONS: Record<string, Record<Language, string>> = {
  wifi: {
    en: "High-Speed WiFi",
    es: "WiFi de Alta Velocidad",
    fr: "WiFi Haut Débit",
  },
  air_conditioning: {
    en: "Air Conditioning",
    es: "Aire Acondicionado",
    fr: "Climatisation",
  },
  washer_dryer: {
    en: "Washer / Dryer",
    es: "Lavadora y Secadora",
    fr: "Lave-linge / Sèche-linge",
  },
  kitchen: {
    en: "Full Kitchen",
    es: "Cocina Completa",
    fr: "Cuisine Équipée",
  },
  parking: {
    en: "Dedicated Parking",
    es: "Estacionamiento Privado",
    fr: "Parking Privé",
  },
  pet_friendly: {
    en: "Pet Friendly",
    es: "Se Admiten Mascotas",
    fr: "Animaux Acceptés",
  },
  pool: {
    en: "Swimming Pool",
    es: "Piscina",
    fr: "Piscine",
  },
  hot_tub: {
    en: "Hot Tub / Spa",
    es: "Bañera de Hidromasaje / Spa",
    fr: "Bain à Remous / Spa",
  },
  bbq_grill: {
    en: "BBQ / Grill",
    es: "Parrilla / Asador",
    fr: "Barbecue / Gril",
  },
  fireplace: {
    en: "Fireplace",
    es: "Chimenea",
    fr: "Cheminée",
  },
  ev_charging: {
    en: "EV Charging",
    es: "Carga para Vehículos Eléctricos",
    fr: "Borne de Recharge Véhicule Électrique",
  },
  security_cameras: {
    en: "Security Cameras",
    es: "Cámaras de Seguridad",
    fr: "Caméras de Surveillance",
  },
  smart_tv: {
    en: "Smart TV",
    es: "Smart TV",
    fr: "Smart TV",
  },
  workspace: {
    en: "Dedicated Workspace",
    es: "Espacio de Trabajo",
    fr: "Espace de Travail Dédié",
  },
  water_access: {
    en: "Water Access",
    es: "Acceso a Agua",
    fr: "Accès à l'Eau",
  },
};

export function getLocalizedAmenityLabel(slug: string, lang: Language = "en"): string {
  if (AMENITY_TRANSLATIONS[slug]?.[lang]) {
    return AMENITY_TRANSLATIONS[slug][lang];
  }
  return slug
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/* ─────────────────────────────────────────────────────────────
   Horse Facilities Translations
   ───────────────────────────────────────────────────────────── */
export const HORSE_FACILITY_TRANSLATIONS: Record<
  string,
  Record<Language, string>
> = {
  stalls: {
    en: "Center-aisle Barn / Stalls",
    es: "Establo con Pasillo Central / Boxes",
    fr: "Écurie Traversante / Boxes",
  },
  barn: {
    en: "Private Barn",
    es: "Establo Privado",
    fr: "Écurie Privée",
  },
  pasture: {
    en: "Turnout Pasture & Paddocks",
    es: "Pastizales y Cercados de Recreo",
    fr: "Pâturages et Paddocks",
  },
  arena: {
    en: "Riding Arena",
    es: "Pista de Equitación",
    fr: "Carrière d'Équitation",
  },
  round_pen: {
    en: "Round Pen",
    es: "Corral Redondo",
    fr: "Rond de Longe",
  },
  wash_rack: {
    en: "Wash Rack (Hot & Cold)",
    es: "Área de Lavado (Fría y Caliente)",
    fr: "Aire de Douche (Chaude et Froide)",
  },
  tack_room: {
    en: "Secure Tack Room",
    es: "Guarnicionería Segura",
    fr: "Sellerie Sécurisée",
  },
  trailer_parking: {
    en: "Horse Trailer Parking",
    es: "Aparcamiento para Remolques",
    fr: "Parking pour Vans / Camions",
  },
  feed_included: {
    en: "Feed & Hay Included",
    es: "Alimento y Heno Incluido",
    fr: "Nourriture & Foin Inclus",
  },
  hay_storage: {
    en: "Hay Storage / Loft",
    es: "Almacén / Pajar de Heno",
    fr: "Stockage de Foin / Fenil",
  },
  water_access: {
    en: "Automatic Waterers",
    es: "Bebederos Automáticos",
    fr: "Abreuvoirs Automatiques",
  },
  vet_access: {
    en: "Vet Access Nearby",
    es: "Veterinario Cercano",
    fr: "Vétérinaire Proche",
  },
  trail_access: {
    en: "Direct Trail Access",
    es: "Acceso Directo a Senderos",
    fr: "Accès Direct aux Chemins de Balade",
  },
  cross_ties: {
    en: "Cross Ties & Grooming Bays",
    es: "Amarres Cruzados y Zonas de Aseo",
    fr: "Attaches Croisées & Aires de Pansage",
  },
  night_check: {
    en: "Night Check Available",
    es: "Vigilancia Nocturna Disponible",
    fr: "Surveillance Nocturne Disponible",
  },
};

export function getLocalizedFacilityLabel(slug: string, lang: Language = "en"): string {
  if (HORSE_FACILITY_TRANSLATIONS[slug]?.[lang]) {
    return HORSE_FACILITY_TRANSLATIONS[slug][lang];
  }
  return slug
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/* ─────────────────────────────────────────────────────────────
   Calendar Month Names
   ───────────────────────────────────────────────────────────── */
export const MONTH_NAMES: Record<Language, string[]> = {
  en: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ],
  es: [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ],
  fr: [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ],
};

export function getLocalizedMonthName(monthIndex: number, lang: Language = "en"): string {
  const months = MONTH_NAMES[lang] || MONTH_NAMES.en;
  return months[monthIndex] || months[0];
}

/* ─────────────────────────────────────────────────────────────
   Sample Listings Human Translations (All 10 properties)
   ───────────────────────────────────────────────────────────── */
interface ListingContentTranslation {
  title: string;
  horse_description?: string;
  facility_notes?: string;
}

export const SAMPLE_LISTING_TRANSLATIONS: Record<
  string,
  Record<"es" | "fr", ListingContentTranslation>
> = {
  "featured-1": {
    es: {
      title: "Granja a 5 minutos del World Equestrian Center",
      horse_description:
        "Bienvenido a nuestra tranquila finca de campo, a solo 5 minutos del World Equestrian Center (WEC). Esta cómoda casa de 3 dormitorios y 2 baños es perfecta para jinetes, familias y equipos de competición que buscan una estancia relajante. La propiedad incluye un establo impecable de 4 boxes, alojamiento para hasta 6 caballos y pastos verdes vallados para el recreo diario. Disfrute de la privacidad de un entorno rural mientras se encuentra a minutos de las pistas, restaurantes y tiendas hípicas.",
      facility_notes:
        "Establo de pasillo central con 4 boxes de 12x12 con suelo de goma, sistema nebulizador antimosquitos, zona de lavado con agua fría y caliente, y 4 frondosos prados vallados de 2 acres con cerramiento de cuatro tablas.",
    },
    fr: {
      title: "Domaine à 5 minutes du World Equestrian Center",
      horse_description:
        "Bienvenue dans notre paisible propriété de campagne, à seulement 5 minutes du World Equestrian Center (WEC). Cette chaleureuse maison de 3 chambres et 2 salles de bain est idéale pour les cavaliers, familles et équipes en compétition en quête d'un séjour reposant. La propriété comprend une écurie soignée de 4 boxes, un accueil jusqu'à 6 chevaux et de superbes paddocks clôturés pour les sorties quotidiennes. Profitez du calme de la campagne tout en étant à quelques minutes des carrières, restaurants et selleries.",
      facility_notes:
        "Écurie traversante avec 4 boxes 12x12 sur tapis caoutchouc, brumisateur anti-mouches, aire de douche chaude/froide, et 4 paddocks clôturés de 2 acres.",
    },
  },
  "featured-2": {
    es: {
      title: "Golden Oak Manor — Finca Ecuestre Privada",
      horse_description:
        "Una impresionante finca ecuestre privada ubicada en 25 acres bajo el dosel de robles de Florida Central. La casa principal cuenta con 4 dormitorios y una piscina de agua salada estilo resort. Para sus caballos, disfrute de un establo de 6 boxes con pasillo central, esteras de goma, bebederos automáticos y guadarnés con control de temperatura.",
      facility_notes:
        "Pista completa de doma/salto con suelo GGT y riego. 6 boxes amplios de 14x14 con bebederos automáticos.",
    },
    fr: {
      title: "Golden Oak Manor — Domaine Équestre Privé",
      horse_description:
        "Un superbe domaine équestre privé niché sur 25 acres sous les chênes centenaires de Floride centrale. La maison principale dispose de 4 chambres et d'une piscine d'eau salée style resort. Pour vos chevaux, bénéficiez d'une écurie de 6 boxes avec tapis caoutchouc, abreuvoirs automatiques et sellerie climatisée.",
      facility_notes:
        "Carrière complète de dressage/obstacle sol GGT avec arrosage. 6 boxes spacieux 14x14 avec abreuvoirs automatiques.",
    },
  },
  "featured-3": {
    es: {
      title: "Marenella Oaks — Finca de Competición Espectacular",
      horse_description:
        "Una propiedad espectacular en el corazón del país de los caballos, a solo 20 minutos del WEC. Nuestro establo de 4 boxes tiene todo lo que sus caballos de competición necesitan: esteras de goma, ducha de agua fría/caliente, guadarnés con aire acondicionado y pista de tamaño reglamentario.",
      facility_notes:
        "4 boxes con ventiladores, esteras de goma, ducha de agua caliente y pista privada de 100x200.",
    },
    fr: {
      title: "Marenella Oaks — Écurie d'Excellence",
      horse_description:
        "Une propriété d'exception au cœur du pays équestre, à seulement 20 minutes du WEC. Notre écurie de 4 boxes offre tout le confort pour vos chevaux de concours : tapis caoutchouc, douche eau chaude/froide, sellerie climatisée et carrière aux normes.",
      facility_notes:
        "4 boxes avec ventilateurs, tapis en caoutchouc, aire de pansage eau chaude et carrière privée de 100x200.",
    },
  },
  "featured-4": {
    es: {
      title: "Serenity Pines — Finca Familiar Cerca de HITS",
      horse_description:
        "Nuestra propiedad insignia: una hermosa granja de 20 acres con dos establos que suman 8 boxes. La espaciosa casa de campo de 4 dormitorios cuenta con un porche envolvente con vistas pastorales, chimenea de leña y una cocina campestre completa. Pienso y heno incluidos en la tarifa del box.",
      facility_notes:
        "2 establos personalizados con 8 boxes grandes, sala de alimentación, pajar y 5 prados de recreo independientes.",
    },
    fr: {
      title: "Serenity Pines — Domaine Familial Proche de HITS",
      horse_description:
        "Notre domaine de référence : une magnifique propriété de 20 acres avec deux écuries totalisant 8 boxes. La spacieuse maison de 4 chambres offre une terrasse panoramique avec vue sur les pâturages, une cheminée au bois et une grande cuisine de campagne. Foin et nourriture inclus dans le tarif du box.",
      facility_notes:
        "2 écuries sur mesure avec 8 grands boxes, graineterie, fenil et 5 paddocks indépendants.",
    },
  },
  "sample-5": {
    es: {
      title: "The Bridle Gate — Casa de Campo en 5 Acres",
      horse_description:
        "Encantadora casa de campo de 3 dormitorios con un establo de 2 boxes y 4 acres de pastos mejorados cercados. Perfecta para parejas o familias pequeñas que viajan con 1 a 4 caballos. Fácil acceso a HITS y WEC.",
      facility_notes:
        "2 boxes con esteras de goma y bebederos automáticos, más 4 acres de pastos vallados.",
    },
    fr: {
      title: "The Bridle Gate — Maison de Campagne sur 5 Acres",
      horse_description:
        "Charmante maison de campagne de 3 chambres avec écurie de 2 boxes et 4 acres de pâturages clôturés. Idéal pour couples ou petites familles voyageant avec 1 à 4 chevaux. Accès facile au HITS et au WEC.",
      facility_notes:
        "2 boxes avec tapis caoutchouc et abreuvoirs automatiques, plus 4 acres de prés clôturés.",
    },
  },
  "sample-6": {
    es: {
      title: "Live Oak RV Pad — Conexión Completa con 4 Boxes",
      horse_description:
        "Conexión completa para autocaravanas (electricidad de 30/50 amperios, agua, séptico) en una tranquila finca de 8 acres con 4 boxes disponibles. Ideal para viajeros del circuito de concursos hacia eventos de WEC, HITS o FHJA.",
      facility_notes:
        "Electricidad de 30/50 amp, conexión de agua, fosa séptica y 4 boxes limpios con viruta.",
    },
    fr: {
      title: "Live Oak RV Pad — Emplacement VR Tout Confort avec 4 Boxes",
      horse_description:
        "Raccordement complet pour véhicule récréatif (30/50 ampères, eau, vidange) dans une propriété paisible de 8 acres avec 4 boxes disponibles. Parfait pour les compétiteurs se rendant au WEC, HITS ou FHJA.",
      facility_notes:
        "Électricité 30/50 A, raccordement eau, évacuation et 4 boxes propres avec litière de copeaux.",
    },
  },
  "sample-7": {
    es: {
      title: "White Pines Farm — Especialista en Estancias Prolongadas",
      horse_description:
        "Especializados en estancias prolongadas: semanas o meses, no solo noches. La casa de 3 dormitorios está totalmente equipada para el confort a largo plazo con internet por fibra de alta velocidad y espacio de trabajo tranquilo.",
      facility_notes:
        "10 boxes en 2 establos con pista y acceso directo a Marjorie Harris Carr Cross Florida Greenway.",
    },
    fr: {
      title: "White Pines Farm — Spécialiste Longs Séjours",
      horse_description:
        "Spécialisés dans les séjours de longue durée (semaines ou mois). Maison de 3 chambres toute équipée avec fibre optique haut débit et espace de travail calme.",
      facility_notes:
        "10 boxes répartis sur 2 écuries avec carrière et accès direct à la voie verte Cross Florida Greenway.",
    },
  },
  "sample-8": {
    es: {
      title: "Horse Haven en Niker Lane — Habitación Privada + 3 Boxes",
      horse_description:
        "Suite privada con entrada independiente y baño privado en una granja ecuestre en activo. Afuera, 3 boxes con esteras de goma esperan a sus caballos junto con una ducha y prado sombreado.",
      facility_notes: "3 boxes con cama limpia y prado de recreo sombreado.",
    },
    fr: {
      title: "Horse Haven à Niker Lane — Chambre Privée + 3 Boxes",
      horse_description:
        "Suite privée avec entrée dédiée et salle de bain privative au sein d'un domaine équestre en activité. À l'extérieur, 3 boxes sur tapis caoutchouc, aire de douche et paddock ombragé.",
      facility_notes: "3 boxes avec litière fraîche et paddock ombragé.",
    },
  },
  "sample-9": {
    es: {
      title: "Alquiler de Pastos WildBit — Apto para RV con 6 Boxes",
      horse_description:
        "Propiedad pensada para caballos: sin casa residencial, ideal para acampada libre o remolque. 6 boxes disponibles, 3 prados cercados y 12 acres de pastos de hierba Bermuda.",
      facility_notes:
        "6 boxes y 3 prados de hierba independientes con bebederos automáticos.",
    },
    fr: {
      title: "Location de Pâturage WildBit — Adapté VR avec 6 Boxes",
      horse_description:
        "Propriété 100% chevaux : pas d'habitation, parfait pour séjour en van ou camping autonome. 6 boxes disponibles, 3 paddocks clôturés et 12 acres d'herbe de qualité.",
      facility_notes:
        "6 boxes et 3 paddocks en herbe séparés avec abreuvoirs automatiques.",
    },
  },
  "sample-10": {
    es: {
      title: "Ironwood Stable — Establo de Competición Profesional",
      horse_description:
        "Establo profesional que ofrece alojamiento diario y semanal para competidores. 12 boxes de 12x12 con esteras de goma, bebederos automáticos y ventiladores. Encargado del establo residente a tiempo completo.",
      facility_notes:
        "12 boxes de 12x12 con esteras de goma, ventiladores industriales y encargado de establo 24/7 en el lugar.",
    },
    fr: {
      title: "Ironwood Stable — Écurie Professionnelle de Compétition",
      horse_description:
        "Écurie professionnelle proposant l'hébergement de passage pour cavaliers de compétition. 12 boxes 12x12 avec tapis caoutchouc, abreuvoirs automatiques et ventilateurs. Responsable d'écurie sur place à plein temps.",
      facility_notes:
        "12 boxes 12x12 avec tapis caoutchouc, ventilateurs industriels et responsable d'écurie présent 24h/24.",
    },
  },
};

/* Also handle alias IDs used in home page static listings */
SAMPLE_LISTING_TRANSLATIONS["golden-oak-manor"] = SAMPLE_LISTING_TRANSLATIONS["featured-2"];
SAMPLE_LISTING_TRANSLATIONS["marenella-oaks"] = SAMPLE_LISTING_TRANSLATIONS["featured-3"];
SAMPLE_LISTING_TRANSLATIONS["serenity-pines"] = SAMPLE_LISTING_TRANSLATIONS["featured-4"];

/* ─────────────────────────────────────────────────────────────
   Fallback Title & Term Translator for Dynamic User Listings
   ───────────────────────────────────────────────────────────── */
const EQUINE_TERMS_ES: Record<string, string> = {
  Farm: "Granja",
  Farms: "Granjas",
  Barn: "Establo",
  Barns: "Establos",
  Stall: "Box",
  Stalls: "Boxes",
  Manor: "Mansión",
  Estate: "Finca",
  Oaks: "Robles",
  Pines: "Pinos",
  Stable: "Establo",
  Stables: "Establos",
  Haven: "Refugio",
  "Near WEC": "Cerca del WEC",
  "Near HITS": "Cerca de HITS",
  "Minutes from": "A minutos de",
  "Extended Stay": "Estancia Prolongada",
  "Private Room": "Habitación Privada",
  "RV Hookup": "Conexión para RV",
  "RV Pad": "Espacio para RV",
  "Pasture Rental": "Alquiler de Pastos",
};

const EQUINE_TERMS_FR: Record<string, string> = {
  Farm: "Domaine",
  Farms: "Domaines",
  Barn: "Écurie",
  Barns: "Écuries",
  Stall: "Box",
  Stalls: "Boxes",
  Manor: "Manoir",
  Estate: "Propriété",
  Oaks: "Chênes",
  Pines: "Pins",
  Stable: "Écurie",
  Stables: "Écuries",
  Haven: "Refuge",
  "Near WEC": "Proche du WEC",
  "Near HITS": "Proche de HITS",
  "Minutes from": "À quelques minutes de",
  "Extended Stay": "Long Séjour",
  "Private Room": "Chambre Privée",
  "RV Hookup": "Raccordement VR",
  "RV Pad": "Emplacement VR",
  "Pasture Rental": "Location de Pâturage",
};

function translateDynamicTitle(title: string, lang: Language): string {
  if (!title || lang === "en") return title;
  const terms = lang === "es" ? EQUINE_TERMS_ES : EQUINE_TERMS_FR;
  let translated = title;
  for (const [english, localized] of Object.entries(terms)) {
    const regex = new RegExp(`\\b${english}\\b`, "gi");
    translated = translated.replace(regex, localized);
  }
  return translated;
}

/* ─────────────────────────────────────────────────────────────
   Main getLocalizedListing Helper
   ───────────────────────────────────────────────────────────── */
export function getLocalizedListing<T extends Partial<ListingWithPhotos>>(
  listing: T,
  lang: Language = "en"
): T {
  if (!listing) return listing;
  if (lang === "en") return listing;

  const translation = listing.id
    ? SAMPLE_LISTING_TRANSLATIONS[listing.id]?.[lang as "es" | "fr"]
    : undefined;

  const localizedTitle =
    translation?.title ||
    (listing.title ? translateDynamicTitle(listing.title, lang) : listing.title);

  const localizedDescription =
    translation?.horse_description || listing.horse_description;

  const localizedFacilityNotes =
    translation?.facility_notes || listing.facility_notes;

  return {
    ...listing,
    title: localizedTitle,
    horse_description: localizedDescription,
    facility_notes: localizedFacilityNotes,
  };
}
