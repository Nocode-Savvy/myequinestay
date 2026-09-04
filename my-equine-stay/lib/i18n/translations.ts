export type Language = "en" | "es" | "fr";

export interface Translations {
  nav: {
    home: string;
    browseStays: string;
    listProperty: string;
    favorites: string;
    faq: string;
    contact: string;
    createAccount: string;
    signIn: string;
    signOut: string;
    myAccount: string;
    admin: string;
  };
  hero: {
    title: string;
    script: string;
    pill1: string;
    pill2: string;
    searchPlaceholder: string;
    location: string;
    checkIn: string;
    checkOut: string;
    guests: string;
    horses: string;
    bedrooms: string;
    bathrooms: string;
    propertyType: string;
    allTypes: string;
    findStay: string;
    listYourProperty: string;
  };
  services: {
    heading: string;
    subheading: string;
    comingSoon: string;
    visitSite: string;
    proTagline: string;
    adoptTagline: string;
    tackTagline: string;
    sitTagline: string;
    plannerTagline: string;
  };
  howItWorks: {
    heading: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
  };
  shelters: {
    heading: string;
    subheading: string;
    partnerTitle: string;
    partnerDesc: string;
    donateBtn: string;
    visitWebsite: string;
  };
  listings: {
    heading: string;
    viewAll: string;
    perNight: string;
    perWeek: string;
    stalls: string;
    bedrooms: string;
  };
  search: {
    heading: string;
    alertMe: string;
    filter: string;
    showMap: string;
    showList: string;
    clearAll: string;
    showResults: string;
  };
  dashboard: {
    myAccount: string;
    welcome: string;
    addProperty: string;
    activeListings: string;
    draftsUnpaid: string;
    unreadInquiries: string;
    publishedThisMonth: string;
    myListings: string;
    inquiries: string;
    accountSettings: string;
    noListingsYet: string;
  };
  footer: {
    terms: string;
    privacy: string;
    waiver: string;
    manageAlerts: string;
    copyright: string;
  };
  propertyDetail: {
    backToResults: string;
    share: string;
    linkCopied: string;
    save: string;
    saved: string;
    featuredStay: string;
    photos: string;
    photoGallery: string;
    bedrooms: string;
    bathrooms: string;
    stalls: string;
    horseCap: string;
    aboutStay: string;
    totalAcreagePrefix: string;
    totalAcreageSuffix: string;
    facilitiesHeading: string;
    facilitiesSub: string;
    facilityNotesTitle: string;
    amenitiesHeading: string;
    petPolicyLabel: string;
    petsWelcome: string;
    noPets: string;
    smokingPolicyLabel: string;
    smokingAllowed: string;
    nonSmoking: string;
    languagesLabel: string;
    availabilityHeading: string;
    availabilitySub: string;
    availableLegend: string;
    bookedLegend: string;
    minStayLabel: string;
    nightSingular: string;
    nightPlural: string;
    locationHeading: string;
    locationSub: string;
    approximateZoneBadge: string;
    night: string;
    week: string;
    month: string;
    directBookingNote: string;
    contactHostDirectly: string;
    yourName: string;
    yourEmail: string;
    arrival: string;
    departure: string;
    numberOfHorses: string;
    horseSingle: string;
    horsePlural: string;
    messageToHost: string;
    messagePlaceholder: string;
    sendInquiryBtn: string;
    inquirySentTitle: string;
    inquirySentSuccess: string;
    sendAnotherMessage: string;
    hostedBy: string;
    directMessageVerified: string;
    listingNotFound: string;
    returnToBrowse: string;
    daysOfWeek: {
      sun: string;
      mon: string;
      tue: string;
      wed: string;
      thu: string;
      fri: string;
      sat: string;
    };
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: "Home",
      browseStays: "Browse stays",
      listProperty: "List your property",
      favorites: "Favorites",
      faq: "FAQ",
      contact: "Contact",
      createAccount: "Create your account",
      signIn: "Sign in",
      signOut: "Log out",
      myAccount: "My account",
      admin: "Admin",
    },
    hero: {
      title: "Find Your Equine Stay",
      script: "in Florida, USA",
      pill1: "Short-term stays • Direct owner contact • No middleman",
      pill2: "Homes • Farms • Barns • Stalls • RV Spots & More",
      searchPlaceholder: "Search any Florida city",
      location: "Location",
      checkIn: "Check-in",
      checkOut: "Check-out",
      guests: "Guests",
      horses: "Horses",
      bedrooms: "Bedrooms",
      bathrooms: "Bathrooms",
      propertyType: "Property type",
      allTypes: "All types",
      findStay: "Find a Stay",
      listYourProperty: "List your property",
    },
    services: {
      heading: "My Equine Services",
      subheading:
        "Explore the growing My Equine family of sites and services. Just click any icon to get started.",
      comingSoon: "Coming soon",
      visitSite: "Visit site",
      proTagline: "Your horse deserves the best care.",
      adoptTagline: "Rescue and adoption, coming soon.",
      tackTagline: "Curated tack and gear marketplace.",
      sitTagline: "Trusted horse sitters and farm sitters.",
      plannerTagline: "Plan and manage your show season.",
    },
    howItWorks: {
      heading: "How it works",
      step1Title: "Search stays",
      step1Desc:
        "Filter by equestrian farms, houses, apartments, private bedrooms, RVs, horse facilities, and more.",
      step2Title: "Contact the owner",
      step2Desc: "Message the property owner directly through the platform.",
      step3Title: "Book with the owner",
      step3Desc: "No commissions. No middlemen. Arrange your stay directly.",
    },
    shelters: {
      heading: "Shelters we support",
      subheading:
        "Support the equine community. Donate below, or add an optional donation when paying for your listing. 100% of your donation goes directly to the shelter. My Equine Stay never handles donation funds.",
      partnerTitle: "Shelter partners",
      partnerDesc:
        "Supported equine shelters and rescues appear here, each with their own logo, description and donation link.",
      donateBtn: "Donate to this shelter",
      visitWebsite: "Visit website",
    },
    listings: {
      heading: "Featured Equine Stays in Ocala, FL",
      viewAll: "View all stays",
      perNight: "NIGHT",
      perWeek: "WEEK",
      stalls: "stalls",
      bedrooms: "bd",
    },
    search: {
      heading: "Equine Stays",
      alertMe: "Alert me on new listings",
      filter: "Filter",
      showMap: "Show map",
      showList: "Show list",
      clearAll: "Clear all",
      showResults: "Show results",
    },
    dashboard: {
      myAccount: "MY ACCOUNT",
      welcome: "Welcome",
      addProperty: "Add property",
      activeListings: "ACTIVE LISTINGS",
      draftsUnpaid: "DRAFTS (UNPAID)",
      unreadInquiries: "UNREAD INQUIRIES",
      publishedThisMonth: "PUBLISHED THIS MONTH",
      myListings: "My listings",
      inquiries: "Inquiries",
      accountSettings: "Account settings",
      noListingsYet: "You don't have any listings yet.",
    },
    footer: {
      terms: "Terms of Service",
      privacy: "Privacy Policy",
      waiver: "Liability Waiver.",
      manageAlerts: "Manage email alerts",
      copyright:
        "This platform is operated by My Equine Services. All rights reserved.",
    },
    propertyDetail: {
      backToResults: "Back to results",
      share: "Share",
      linkCopied: "Link copied!",
      save: "Save",
      saved: "Saved",
      featuredStay: "★ Featured Stay",
      photos: "Photos",
      photoGallery: "Photo Gallery",
      bedrooms: "Bedrooms",
      bathrooms: "Bathrooms",
      stalls: "Stalls",
      horseCap: "Horse Cap",
      aboutStay: "About this stay",
      totalAcreagePrefix: "Total Acreage:",
      totalAcreageSuffix: "acres of fenced equestrian property",
      facilitiesHeading: "Horse Facilities & Stabling",
      facilitiesSub: "Equestrian features verified for this property:",
      facilityNotesTitle: "Facility Notes from Owner",
      amenitiesHeading: "Amenities",
      petPolicyLabel: "Pet policy:",
      petsWelcome: "Pets Welcome",
      noPets: "No Pets in House",
      smokingPolicyLabel: "Smoking:",
      smokingAllowed: "Allowed in designated areas",
      nonSmoking: "Strictly Non-Smoking",
      languagesLabel: "Languages:",
      availabilityHeading: "Availability",
      availabilitySub:
        "Availability is for reference only. Confirm final dates directly with the property owner.",
      availableLegend: "Available",
      bookedLegend: "Booked / Reserved",
      minStayLabel: "Minimum stay:",
      nightSingular: "night",
      nightPlural: "nights",
      locationHeading: "Location",
      locationSub:
        "For owner and guest privacy, the pin indicates the approximate area in {city}, FL. Exact address will be shared directly upon confirmation.",
      approximateZoneBadge: "Approximate zone · {city}, FL",
      night: "Night",
      week: "Week",
      month: "Month",
      directBookingNote: "Direct booking: 0% platform commission taken.",
      contactHostDirectly: "Contact Host Directly",
      yourName: "Your Name",
      yourEmail: "Your Email",
      arrival: "Arrival",
      departure: "Departure",
      numberOfHorses: "Number of Horses",
      horseSingle: "horse",
      horsePlural: "horses",
      messageToHost: "Message to Host",
      messagePlaceholder:
        "Introduce yourself, your horses, disciplines, and desired dates...",
      sendInquiryBtn: "Send Inquiry to Host",
      inquirySentTitle: "Inquiry Sent!",
      inquirySentSuccess:
        "Your message has been sent directly to {name}. They will respond shortly.",
      sendAnotherMessage: "Send another message",
      hostedBy: "Hosted by",
      directMessageVerified: "Direct message verified",
      listingNotFound: "Listing not found",
      returnToBrowse: "Return to Browse",
      daysOfWeek: {
        sun: "Sun",
        mon: "Mon",
        tue: "Tue",
        wed: "Wed",
        thu: "Thu",
        fri: "Fri",
        sat: "Sat",
      },
    },
  },

  es: {
    nav: {
      home: "Inicio",
      browseStays: "Buscar estancias",
      listProperty: "Publicar propiedad",
      favorites: "Favoritos",
      faq: "Preguntas",
      contact: "Contacto",
      createAccount: "Crear cuenta",
      signIn: "Iniciar sesión",
      signOut: "Cerrar sesión",
      myAccount: "Mi cuenta",
      admin: "Admin",
    },
    hero: {
      title: "Encuentra Tu Estancia Ecuestre",
      script: "en Florida, EE.UU.",
      pill1: "Estancias cortas • Contacto directo con propietarios • Sin intermediarios",
      pill2: "Casas • Granjas • Establos • Puestos • Espacios para RV y Más",
      searchPlaceholder: "Buscar cualquier ciudad de Florida",
      location: "Ubicación",
      checkIn: "Llegada",
      checkOut: "Salida",
      guests: "Huéspedes",
      horses: "Caballos",
      bedrooms: "Habitaciones",
      bathrooms: "Baños",
      propertyType: "Tipo de propiedad",
      allTypes: "Todos los tipos",
      findStay: "Buscar Estancia",
      listYourProperty: "Publica tu propiedad",
    },
    services: {
      heading: "Mis Servicios Ecuestres",
      subheading:
        "Explora la creciente familia de sitios y servicios de My Equine. Haz clic en cualquier ícono para comenzar.",
      comingSoon: "Próximamente",
      visitSite: "Visitar sitio",
      proTagline: "Tu caballo merece el mejor cuidado.",
      adoptTagline: "Rescate y adopción, próximamente.",
      tackTagline: "Mercado seleccionado de monturas y equipo.",
      sitTagline: "Cuidadores de caballos y granjas de confianza.",
      plannerTagline: "Planifica y gestiona tu temporada de competencias.",
    },
    howItWorks: {
      heading: "Cómo funciona",
      step1Title: "Busca estancias",
      step1Desc:
        "Filtra por fincas ecuestres, casas, apartamentos, habitaciones privadas, autocaravanas e instalaciones hípicas.",
      step2Title: "Contacta al propietario",
      step2Desc:
        "Envía un mensaje directamente al propietario a través de nuestra plataforma segura.",
      step3Title: "Reserva con el propietario",
      step3Desc:
        "Sin comisiones ni intermediarios. Coordina tu estancia directamente con él.",
    },
    shelters: {
      heading: "Refugios que apoyamos",
      subheading:
        "Apoya a la comunidad ecuestre. Dona a continuación, o agrega una donación voluntaria al publicar tu propiedad. El 100% de tu donación va directamente al refugio. My Equine Stay nunca retiene fondos.",
      partnerTitle: "Refugios asociados",
      partnerDesc:
        "Los refugios y rescates ecuestres apoyados aparecen aquí con su logotipo, descripción y enlace de donación.",
      donateBtn: "Donar a este refugio",
      visitWebsite: "Visitar sitio web",
    },
    listings: {
      heading: "Estancias Ecuestres Destacadas en Ocala, FL",
      viewAll: "Ver todas las estancias",
      perNight: "NOCHE",
      perWeek: "SEMANA",
      stalls: "establos",
      bedrooms: "hab",
    },
    search: {
      heading: "Estancias Ecuestres",
      alertMe: "Avisarme de nuevas propiedades",
      filter: "Filtros",
      showMap: "Ver mapa",
      showList: "Ver lista",
      clearAll: "Borrar filtros",
      showResults: "Mostrar resultados",
    },
    dashboard: {
      myAccount: "MI CUENTA",
      welcome: "Bienvenido",
      addProperty: "Añadir propiedad",
      activeListings: "PROPIEDADES ACTIVAS",
      draftsUnpaid: "BORRADORES (NO PAGADOS)",
      unreadInquiries: "CONSULTAS NO LEÍDAS",
      publishedThisMonth: "PUBLICADAS ESTE MES",
      myListings: "Mis propiedades",
      inquiries: "Consultas",
      accountSettings: "Configuración de cuenta",
      noListingsYet: "Aún no tienes ninguna propiedad publicada.",
    },
    footer: {
      terms: "Términos de servicio",
      privacy: "Política de privacidad",
      waiver: "Exención de responsabilidad",
      manageAlerts: "Gestionar alertas de correo",
      copyright:
        "Esta plataforma es operada por My Equine Services. Todos los derechos reservados.",
    },
    propertyDetail: {
      backToResults: "Volver a los resultados",
      share: "Compartir",
      linkCopied: "¡Enlace copiado!",
      save: "Guardar",
      saved: "Guardado",
      featuredStay: "★ Estancia Destacada",
      photos: "Fotos",
      photoGallery: "Galería de Fotos",
      bedrooms: "Habitaciones",
      bathrooms: "Baños",
      stalls: "Establos",
      horseCap: "Capacidad Equina",
      aboutStay: "Sobre esta estancia",
      totalAcreagePrefix: "Superficie Total:",
      totalAcreageSuffix: "acres de finca ecuestre vallada",
      facilitiesHeading: "Instalaciones Hípicas y Establos",
      facilitiesSub: "Características ecuestres verificadas para esta propiedad:",
      facilityNotesTitle: "Notas de las instalaciones del propietario",
      amenitiesHeading: "Servicios y Comodidades",
      petPolicyLabel: "Política de mascotas:",
      petsWelcome: "Se admiten mascotas",
      noPets: "No se admiten mascotas en la casa",
      smokingPolicyLabel: "Fumar:",
      smokingAllowed: "Permitido en zonas designadas",
      nonSmoking: "Estrictamente no fumadores",
      languagesLabel: "Idiomas:",
      availabilityHeading: "Disponibilidad",
      availabilitySub:
        "La disponibilidad es solo de referencia. Confirma las fechas finales directamente con el propietario.",
      availableLegend: "Disponible",
      bookedLegend: "Reservado / No disponible",
      minStayLabel: "Estancia mínima:",
      nightSingular: "noche",
      nightPlural: "noches",
      locationHeading: "Ubicación",
      locationSub:
        "Por privacidad del propietario y los huéspedes, el marcador indica el área aproximada en {city}, FL. La dirección exacta se facilitará tras la confirmación.",
      approximateZoneBadge: "Zona aproximada · {city}, FL",
      night: "Noche",
      week: "Semana",
      month: "Mes",
      directBookingNote: "Reserva directa: 0% de comisión de plataforma.",
      contactHostDirectly: "Contactar al anfitrión directamente",
      yourName: "Tu Nombre",
      yourEmail: "Tu Correo Electrónico",
      arrival: "Llegada",
      departure: "Salida",
      numberOfHorses: "Número de Caballos",
      horseSingle: "caballo",
      horsePlural: "caballos",
      messageToHost: "Mensaje al anfitrión",
      messagePlaceholder:
        "Preséntate, menciona tus caballos, disciplinas y fechas deseadas...",
      sendInquiryBtn: "Enviar consulta al anfitrión",
      inquirySentTitle: "¡Consulta Enviada!",
      inquirySentSuccess:
        "Tu mensaje ha sido enviado directamente a {name}. Responderán a la brevedad.",
      sendAnotherMessage: "Enviar otro mensaje",
      hostedBy: "Hospedado por",
      directMessageVerified: "Mensaje directo verificado",
      listingNotFound: "Propiedad no encontrada",
      returnToBrowse: "Volver a explorar",
      daysOfWeek: {
        sun: "Dom",
        mon: "Lun",
        tue: "Mar",
        wed: "Mié",
        thu: "Jue",
        fri: "Vie",
        sat: "Sáb",
      },
    },
  },

  fr: {
    nav: {
      home: "Accueil",
      browseStays: "Explorer les séjours",
      listProperty: "Publier une propriété",
      favorites: "Favoris",
      faq: "FAQ",
      contact: "Contact",
      createAccount: "Créer un compte",
      signIn: "Se connecter",
      signOut: "Déconnexion",
      myAccount: "Mon compte",
      admin: "Admin",
    },
    hero: {
      title: "Trouvez Votre Séjour Équestre",
      script: "en Floride, États-Unis",
      pill1: "Courts séjours • Contact direct propriétaire • Sans intermédiaire",
      pill2: "Maisons • Haras • Écuries • Boxes • Emplacements VR & Plus",
      searchPlaceholder: "Rechercher une ville en Floride",
      location: "Emplacement",
      checkIn: "Arrivée",
      checkOut: "Départ",
      guests: "Voyageurs",
      horses: "Chevaux",
      bedrooms: "Chambres",
      bathrooms: "Salles de bain",
      propertyType: "Type d'hébergement",
      allTypes: "Tous les types",
      findStay: "Trouver un séjour",
      listYourProperty: "Publier votre propriété",
    },
    services: {
      heading: "Nos Services Équestres",
      subheading:
        "Découvrez la famille grandissante de plateformes et services My Equine. Cliquez sur une icône pour démarrer.",
      comingSoon: "Bientôt disponible",
      visitSite: "Visiter le site",
      proTagline: "Votre cheval mérite les meilleurs soins.",
      adoptTagline: "Refuges et adoption, bientôt disponible.",
      tackTagline: "Place de marché sellerie et équipement sélectionné.",
      sitTagline: "Gardiens de confiance pour chevaux et domaines.",
      plannerTagline: "Planifiez et organisez votre saison de compétition.",
    },
    howItWorks: {
      heading: "Comment ça fonctionne",
      step1Title: "Recherchez des séjours",
      step1Desc:
        "Filtrez par domaines équestres, maisons, appartements, chambres privées, VR, et infrastructures équestres.",
      step2Title: "Contactez le propriétaire",
      step2Desc:
        "Envoyez un message direct au propriétaire du lieu via notre messagerie.",
      step3Title: "Réservez avec le propriétaire",
      step3Desc:
        "Zéro commission. Zéro intermédiaire. Concluez votre séjour directement.",
    },
    shelters: {
      heading: "Refuges partenaires",
      subheading:
        "Soutenez la communauté équine. Faites un don ci-dessous ou ajoutez un don lors de votre publication. 100% de votre don est reversé au refuge. My Equine Stay ne prend aucun frais.",
      partnerTitle: "Refuges soutenus",
      partnerDesc:
        "Les refuges et centres de sauvetage équestres apparaissent ici avec leur logo, présentation et lien de don.",
      donateBtn: "Faire un don à ce refuge",
      visitWebsite: "Visiter le site web",
    },
    listings: {
      heading: "Séjours Équestres à Ocala, FL",
      viewAll: "Voir tous les séjours",
      perNight: "NUIT",
      perWeek: "SEMAINE",
      stalls: "boxes",
      bedrooms: "ch",
    },
    search: {
      heading: "Séjours Équestres",
      alertMe: "M'alerter lors de nouveaux séjours",
      filter: "Filtres",
      showMap: "Afficher la carte",
      showList: "Afficher la liste",
      clearAll: "Effacer tout",
      showResults: "Afficher les résultats",
    },
    dashboard: {
      myAccount: "MON COMPTE",
      welcome: "Bienvenue",
      addProperty: "Ajouter une propriété",
      activeListings: "ANNONCES ACTIVES",
      draftsUnpaid: "BROUILLONS (NON PAYÉS)",
      unreadInquiries: "MESSAGES NON LUS",
      publishedThisMonth: "PUBLIÉES CE MOIS",
      myListings: "Mes annonces",
      inquiries: "Messages",
      accountSettings: "Paramètres du compte",
      noListingsYet: "Vous n'avez pas encore d'annonce.",
    },
    footer: {
      terms: "Conditions d'utilisation",
      privacy: "Politique de confidentialité",
      waiver: "Décharge de responsabilité",
      manageAlerts: "Gérer les alertes e-mail",
      copyright:
        "Cette plateforme est gérée par My Equine Services. Tous droits réservés.",
    },
    propertyDetail: {
      backToResults: "Retour aux résultats",
      share: "Partager",
      linkCopied: "Lien copié !",
      save: "Enregistrer",
      saved: "Enregistré",
      featuredStay: "★ Séjour en Vedette",
      photos: "Photos",
      photoGallery: "Galerie de Photos",
      bedrooms: "Chambres",
      bathrooms: "Salles de bain",
      stalls: "Boxes",
      horseCap: "Capacité Chevaux",
      aboutStay: "À propos de ce séjour",
      totalAcreagePrefix: "Superficie Totale :",
      totalAcreageSuffix: "acres de domaine équestre clôturé",
      facilitiesHeading: "Infrastructures Équestres & Écuries",
      facilitiesSub: "Équipements équestres vérifiés pour cette propriété :",
      facilityNotesTitle: "Notes sur les installations par le propriétaire",
      amenitiesHeading: "Équipements & Confort",
      petPolicyLabel: "Animaux de compagnie :",
      petsWelcome: "Animaux bienvenus",
      noPets: "Pas d'animaux dans l'habitation",
      smokingPolicyLabel: "Fumeurs :",
      smokingAllowed: "Autorisé dans les zones réservées",
      nonSmoking: "Strictement non-fumeur",
      languagesLabel: "Langues :",
      availabilityHeading: "Disponibilité",
      availabilitySub:
        "Disponibilité donnée à titre indicatif. Confirmez vos dates finales directement avec le propriétaire.",
      availableLegend: "Disponible",
      bookedLegend: "Réservé / Indisponible",
      minStayLabel: "Séjour minimum :",
      nightSingular: "nuit",
      nightPlural: "nuits",
      locationHeading: "Localisation",
      locationSub:
        "Pour la tranquillité de l'hôte et des voyageurs, le repère indique la zone approximative à {city}, FL. L'adresse exacte sera communiquée après confirmation.",
      approximateZoneBadge: "Zone approximative · {city}, FL",
      night: "Nuit",
      week: "Semaine",
      month: "Mois",
      directBookingNote: "Réservation directe : 0% de commission de plateforme.",
      contactHostDirectly: "Contacter l'hôte en direct",
      yourName: "Votre Nom",
      yourEmail: "Votre E-mail",
      arrival: "Arrivée",
      departure: "Départ",
      numberOfHorses: "Nombre de Chevaux",
      horseSingle: "cheval",
      horsePlural: "chevaux",
      messageToHost: "Message à l'hôte",
      messagePlaceholder:
        "Présentez-vous, vos chevaux, vos disciplines et vos dates souhaitées...",
      sendInquiryBtn: "Envoyer le message à l'hôte",
      inquirySentTitle: "Message Envoyé !",
      inquirySentSuccess:
        "Votre message a été transmis directement à {name}. Une réponse vous parviendra sous peu.",
      sendAnotherMessage: "Envoyer un autre message",
      hostedBy: "Hôte :",
      directMessageVerified: "Messagerie directe vérifiée",
      listingNotFound: "Annonce introuvable",
      returnToBrowse: "Retour aux annonces",
      daysOfWeek: {
        sun: "Dim",
        mon: "Lun",
        tue: "Mar",
        wed: "Mer",
        thu: "Jeu",
        fri: "Ven",
        sat: "Sam",
      },
    },
  },
};
