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
  privacy: {
    badge: string;
    title: string;
    lastUpdated: string;
    termsLink: string;
    waiverLink: string;
    sections: Array<{
      title: string;
      body?: string;
      list?: string[];
    }>;
  };
  terms: {
    badge: string;
    title: string;
    lastUpdated: string;
    privacyLink: string;
    waiverLink: string;
    sections: Array<{
      num: string;
      title: string;
      body: string;
      highlight?: boolean;
    }>;
  };
  waiver: {
    badge: string;
    title: string;
    lastUpdated: string;
    warningTitle: string;
    warningText: string;
    termsLink: string;
    privacyLink: string;
    sections: Array<{
      num: string;
      title: string;
      body: string;
      highlight?: boolean;
    }>;
  };
  faq: {
    backToHome: string;
    badge: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    noResults: string;
    askAiBtn: string;
    stillQuestions: string;
    categories: {
      platform: string;
      accounts: string;
      verification: string;
    };
    items: Array<{
      category: "platform" | "accounts" | "verification";
      question: string;
      answer: string;
    }>;
  };
  contact: {
    title: string;
    subtitle: string;
    name: string;
    namePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    subject: string;
    subjectPlaceholder: string;
    message: string;
    messagePlaceholder: string;
    send: string;
    sending: string;
    successTitle: string;
    successText: string;
    sendAnother: string;
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
    privacy: {
      badge: "Privacy",
      title: "Privacy Policy",
      lastUpdated: "My Equine Stay LLC · Last updated: 2026",
      termsLink: "← Terms & Conditions",
      waiverLink: "Liability Waiver →",
      sections: [
        {
          title: "Information We Collect",
          body: "Name, email address, phone number, location, profile information, listing information, messages, subscription details, payment information, and technical usage information.",
        },
        {
          title: "How We Use Your Information",
          list: [
            "Operate the platform.",
            "Allow users to connect.",
            "Manage accounts.",
            "Process subscription payments.",
            "Improve platform performance.",
            "Send important service-related communications.",
          ],
        },
        {
          title: "Platform Role",
          body: "My Equine Stay LLC acts solely as a connection platform. We do not participate in bookings, rentals, negotiations, or agreements between users.",
        },
        {
          title: "Payments",
          body: "Payments collected through the platform are subscription fees only. My Equine Stay LLC never processes payments between users.",
        },
        {
          title: "Cookies",
          body: "The platform uses cookies and similar technologies to improve functionality and user experience.",
        },
        {
          title: "Information Sharing",
          body: "We do not sell or rent personal information. Information may only be shared with service providers, when required by law, or to protect the platform and its users.",
        },
        {
          title: "Data Security",
          body: "Reasonable safeguards are used to protect user information. However, no online system can guarantee absolute security.",
        },
        {
          title: "Account Deletion",
          body: "Users may request deletion of their account, subject to legal record-retention requirements.",
        },
        {
          title: "Contact",
          body: "For privacy questions or account deletion requests, please use the Contact page or reach out to our support team.",
        },
      ],
    },
    terms: {
      badge: "Legal Terms",
      title: "Terms & Conditions",
      lastUpdated: "My Equine Stay LLC · Last updated: 2026",
      privacyLink: "Privacy Policy →",
      waiverLink: "Liability Waiver →",
      sections: [
        {
          num: "1",
          title: "Platform Purpose",
          body: "My Equine Stay LLC operates solely as an online marketplace and connection platform. My Equine Stay LLC does not provide, supervise, manage, or control any services, rentals, accommodations, or equine activities offered by users. The platform only facilitates introductions between independent users.",
        },
        {
          num: "2",
          title: "Independent Users",
          body: "All users are independent individuals or businesses. Nothing contained on this platform creates an employer-employee relationship, agency relationship, partnership, joint venture, or franchise relationship between My Equine Stay LLC and any user.",
        },
        {
          num: "3",
          title: "Age Requirement",
          body: "Users must be at least 18 years old to create an account or use the platform.",
        },
        {
          num: "4",
          title: "No Screening or Verification",
          body: "My Equine Stay LLC does not verify user identity, qualifications, licensing, insurance, references, criminal background, experience, reliability, or safety.",
        },
        {
          num: "5",
          title: "User Responsibility",
          body: "Users are solely responsible for conducting their own due diligence before entering into any agreement or interaction with another user.",
        },
        {
          num: "6",
          title: "No Responsibility for Transactions",
          body: "My Equine Stay LLC is not a party to any agreement between users. All bookings, rentals, payments, and services occur directly between users.",
        },
        {
          num: "7",
          title: "No Guarantee",
          body: "My Equine Stay LLC does not guarantee the accuracy, completeness, legality, reliability, availability, pricing, photographs, descriptions, amenities, or quality of any listing, service, property, or user.",
        },
        {
          num: "8",
          title: "User-Generated Content",
          body: "Users are solely responsible for all information, photographs, descriptions, pricing, and other content they publish.",
        },
        {
          num: "9",
          title: "Assumption of Risk",
          body: "All interactions with other users occur entirely at the user's own risk.",
        },
        {
          num: "10",
          title: "Animal and Property Risks",
          body: "My Equine Stay LLC is not responsible for injuries, death, illness, theft, property damage, animal injury, escaped animals, or any incident involving horses, livestock, pets, accommodations, RV sites, barns, trailers, or other property.",
        },
        {
          num: "11",
          title: "Equine Activity Liability Notice",
          body: "Under Florida Statutes §§773.01–773.06, equine activity sponsors are generally not liable for injury or death resulting from the inherent risks of equine activities.",
          highlight: true,
        },
        {
          num: "12",
          title: "Release of Liability",
          body: "Users release My Equine Stay LLC, its owners, members, managers, employees, contractors, affiliates, successors, and partners from any claims arising out of the use of the platform.",
        },
        {
          num: "13",
          title: "Limitation of Liability",
          body: "My Equine Stay LLC shall not be liable for theft, fraud, scams, misrepresentation, property damage, personal injury, animal injury, financial loss, service failure, cancellations, disputes, or any indirect, incidental, special, punitive, or consequential damages.",
        },
        {
          num: "14",
          title: "Disputes Between Users",
          body: "Any dispute between users shall be resolved exclusively between those users. My Equine Stay LLC has no obligation to investigate or mediate disputes.",
        },
        {
          num: "15",
          title: "User Indemnification",
          body: "Users agree to defend, indemnify, and hold harmless My Equine Stay LLC from any claims arising from their use of the platform.",
        },
        {
          num: "16",
          title: "No Professional Advice",
          body: "Information available on the platform is provided for informational purposes only and does not constitute legal, veterinary, medical, financial, insurance, or professional advice.",
        },
        {
          num: "17",
          title: "User Conduct",
          body: "Users agree not to publish false or misleading listings; impersonate another person; violate any applicable law; upload unlawful or infringing content; or misuse the platform.",
        },
        {
          num: "18",
          title: "Account Suspension",
          body: "My Equine Stay LLC reserves the right to suspend or permanently remove any account or listing that violates these Terms, without prior notice.",
        },
        {
          num: "19",
          title: "Intellectual Property",
          body: "All trademarks, logos, branding, software, website design, and platform content are the exclusive property of My Equine Stay LLC unless otherwise indicated.",
        },
        {
          num: "20",
          title: "Arbitration Agreement",
          body: "Except where prohibited by law, disputes shall be resolved through binding arbitration.",
        },
        {
          num: "21",
          title: "Class Action Waiver",
          body: "Users agree that disputes shall be resolved individually and not as part of any class action.",
        },
        {
          num: "22",
          title: "Governing Law",
          body: "These Terms shall be governed by the laws of the State of Florida.",
        },
        {
          num: "23",
          title: "Changes to These Terms",
          body: "My Equine Stay LLC may modify these Terms at any time. Continued use of the platform constitutes acceptance of the updated Terms.",
        },
        {
          num: "24",
          title: "Acceptance",
          body: "By creating an account, posting listings, purchasing a subscription, or using the platform, users acknowledge that they have read, understood, and agree to these Terms.",
          highlight: true,
        },
      ],
    },
    waiver: {
      badge: "Equine Risk Notice",
      title: "Liability Waiver",
      lastUpdated: "My Equine Stay LLC · Last updated: 2026",
      warningTitle: "Mandatory Florida Statutory Warning (F.S. §773.04)",
      warningText:
        "WARNING: Under Florida law, an equine activity sponsor or equine professional is not liable for an injury to, or the death of, a participant in equine activities resulting from the inherent risks of equine activities.",
      termsLink: "← Terms & Conditions",
      privacyLink: "Privacy Policy →",
      sections: [
        {
          num: "1",
          title: "Inherent Risks",
          body: "Equine activities involve inherent risks including unpredictable horse behavior, falls, kicks, bites, collisions, transportation hazards, and environmental conditions.",
        },
        {
          num: "2",
          title: "Florida Equine Activity Liability Act",
          body: "Under Florida Statutes §§773.01–773.06, equine activity sponsors are generally not liable for injuries resulting from the inherent risks of equine activities.",
          highlight: true,
        },
        {
          num: "3",
          title: "Platform Role",
          body: "My Equine Stay LLC operates solely as an online marketplace connecting independent users.",
        },
        {
          num: "4",
          title: "No Inspection or Certification",
          body: "My Equine Stay LLC does not inspect, certify, verify, or guarantee the condition, legality, safety, suitability, or quality of any property, accommodation, barn, pasture, RV site, horse facility, or service listed on the platform.",
        },
        {
          num: "5",
          title: "User Responsibility",
          body: "Users are solely responsible for evaluating safety, verifying qualifications, confirming insurance coverage, and determining whether a property, service, or provider meets their needs.",
        },
        {
          num: "6",
          title: "Assumption of Risk",
          body: "Users voluntarily assume all risks associated with equine activities, travel, rentals, accommodations, and interactions with other users.",
        },
        {
          num: "7",
          title: "No Emergency Responsibility",
          body: "My Equine Stay LLC is not responsible for providing emergency medical care, veterinary care, rescue services, transportation, or insurance.",
        },
        {
          num: "8",
          title: "Release of Liability",
          body: "Users release My Equine Stay LLC, its owners, members, managers, employees, contractors, affiliates, successors, and partners from any liability arising from use of the platform, including injury, death, property damage, animal injury, theft, financial loss, or disputes between users.",
        },
        {
          num: "9",
          title: "Acknowledgment",
          body: "By using the platform, users acknowledge that they understand the risks, voluntarily assume those risks, and agree to the terms of this Liability Waiver.",
          highlight: true,
        },
      ],
    },
    faq: {
      backToHome: "Back to home",
      badge: "Help center",
      title: "Frequently asked questions",
      subtitle:
        "Everything you need to know about connecting with property owners on My Equine Stay.",
      searchPlaceholder: "Search questions…",
      noResults: "No questions match your search.",
      askAiBtn: "Ask AI",
      stillQuestions: "Still have questions? Chat with our assistant.",
      categories: {
        platform: "About the platform",
        accounts: "Accounts & listings",
        verification: "Verification & responsibility",
      },
      items: [
        {
          category: "platform",
          question: "How does My Equine Stay work?",
          answer:
            "My Equine Stay is a connection platform. We allow users to find properties and connect directly with property owners. We do not handle bookings, payments, or agreements.",
        },
        {
          category: "platform",
          question: "Is booking done on My Equine Stay?",
          answer:
            "No. My Equine Stay does not process bookings or payments. All arrangements are made directly between users.",
        },
        {
          category: "platform",
          question: "How do I contact a property owner?",
          answer:
            "Create an account, browse listings, and click \"Contact Owner\" on any property to connect directly.",
        },
        {
          category: "accounts",
          question: "Do I need an account?",
          answer:
            "Yes. You need an account to contact property owners or list a property.",
        },
        {
          category: "accounts",
          question: "How do I list my property?",
          answer:
            "Create an account, choose a listing plan, and publish your property. You will receive inquiries directly from users.",
        },
        {
          category: "accounts",
          question: "What does a subscription include?",
          answer:
            "Subscriptions include listing creation and management, visibility on the platform, and direct communication with users.",
        },
        {
          category: "accounts",
          question: "How does pricing work?",
          answer:
            "Property owners set their own pricing and terms. All pricing and agreements are negotiated directly between users.",
        },
        {
          category: "verification",
          question: "Are properties verified?",
          answer:
            "No. My Equine Stay does not verify listings. Users are responsible for verifying information and making their own decisions.",
        },
        {
          category: "verification",
          question: "Are we responsible for agreements?",
          answer:
            "No. My Equine Stay is not involved in any agreements, transactions, or disputes between users.",
        },
        {
          category: "verification",
          question: "Who handles property conditions?",
          answer:
            "Users are solely responsible for their actions, listings, agreements, and interactions with other users.",
        },
        {
          category: "verification",
          question: "Do you handle payments?",
          answer: "No. We do not process or hold any payments.",
        },
        {
          category: "verification",
          question: "What happens if there is a problem?",
          answer:
            "All issues must be resolved directly between users. My Equine Stay is not responsible.",
        },
      ],
    },
    contact: {
      title: "Contact Us",
      subtitle:
        "Questions, feedback, or partnership ideas? Send us a message.",
      name: "Name",
      namePlaceholder: "Your full name",
      email: "Email",
      emailPlaceholder: "you@example.com",
      subject: "Subject",
      subjectPlaceholder: "How can we help?",
      message: "Message",
      messagePlaceholder: "Write your message here…",
      send: "Send Message",
      sending: "Sending…",
      successTitle: "Message Sent",
      successText:
        "Thank you for reaching out! We have received your message and will get back to you shortly at {email}.",
      sendAnother: "Send another message",
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
    privacy: {
      badge: "Privacidad",
      title: "Política de Privacidad",
      lastUpdated: "My Equine Stay LLC · Última actualización: 2026",
      termsLink: "← Términos y Condiciones",
      waiverLink: "Exención de Responsabilidad →",
      sections: [
        {
          title: "Información que recopilamos",
          body: "Nombre, dirección de correo electrónico, número de teléfono, ubicación, información de perfil, detalles del anuncio, mensajes, datos de suscripción, información de pago y datos técnicos de uso.",
        },
        {
          title: "Cómo usamos su información",
          list: [
            "Gestionar y operar la plataforma.",
            "Permitir la conexión directa entre usuarios.",
            "Administrar cuentas de usuario.",
            "Procesar pagos de suscripción.",
            "Mejorar el rendimiento del servicio.",
            "Enviar notificaciones y avisos importantes del servicio.",
          ],
        },
        {
          title: "Función de la plataforma",
          body: "My Equine Stay LLC actúa exclusivamente como una plataforma de conexión. No intervenimos en reservas, alquileres, negociaciones ni acuerdos celebrados entre usuarios.",
        },
        {
          title: "Pagos",
          body: "Los pagos procesados en la plataforma corresponden únicamente a cuotas de suscripción. My Equine Stay LLC no procesa transacciones económicas entre usuarios.",
        },
        {
          title: "Cookies",
          body: "La plataforma utiliza cookies y tecnologías similares para mejorar la funcionalidad y enriquecer la experiencia de navegación del usuario.",
        },
        {
          title: "Divulgación de información",
          body: "No vendemos ni alquilamos información personal. Solo compartimos datos con proveedores de servicios, por requerimiento legal obligatorio o para salvaguardar la plataforma y a sus miembros.",
        },
        {
          title: "Seguridad de los datos",
          body: "Implementamos medidas razonables para proteger la información. No obstante, ningún sistema en línea garantiza seguridad invulnerable.",
        },
        {
          title: "Eliminación de cuenta",
          body: "Los usuarios pueden solicitar la eliminación de su cuenta en cualquier momento, sujeto a las obligaciones legales de retención de registros.",
        },
        {
          title: "Contacto",
          body: "Si tiene dudas sobre su privacidad o desea eliminar su cuenta, utilice nuestra página de Contacto o comuníquese con nuestro equipo de asistencia.",
        },
      ],
    },
    terms: {
      badge: "Términos Legales",
      title: "Términos y Condiciones",
      lastUpdated: "My Equine Stay LLC · Última actualización: 2026",
      privacyLink: "Política de Privacidad →",
      waiverLink: "Exención de Responsabilidad →",
      sections: [
        {
          num: "1",
          title: "Propósito de la Plataforma",
          body: "My Equine Stay LLC opera únicamente como un mercado en línea y plataforma de conexión. My Equine Stay LLC no provee, supervisa, administra ni controla ningún servicio, alquiler, alojamiento o actividad ecuestre ofrecida por los usuarios. La plataforma solo facilita presentaciones entre usuarios independientes.",
        },
        {
          num: "2",
          title: "Usuarios Independientes",
          body: "Todos los usuarios son personas o entidades comerciales independientes. Nada en esta plataforma crea una relación de empleador-empleado, agencia, sociedad, empresa conjunta ni franquicia entre My Equine Stay LLC y ningún usuario.",
        },
        {
          num: "3",
          title: "Requisito de Edad",
          body: "Los usuarios deben tener al menos 18 años para crear una cuenta o utilizar la plataforma.",
        },
        {
          num: "4",
          title: "Sin Verificación ni Selección",
          body: "My Equine Stay LLC no verifica la identidad, cualificaciones, licencias, seguros, referencias, antecedentes penales, experiencia, fiabilidad ni seguridad de los usuarios.",
        },
        {
          num: "5",
          title: "Responsabilidad del Usuario",
          body: "Los usuarios son los únicos responsables de realizar su propia diligencia debida antes de celebrar acuerdos o interactuar con otro usuario.",
        },
        {
          num: "6",
          title: "Sin Responsabilidad por Transacciones",
          body: "My Equine Stay LLC no es parte de ningún acuerdo entre usuarios. Todas las reservas, estancias, pagos y servicios se acuerdan directamente entre ellos.",
        },
        {
          num: "7",
          title: "Sin Garantías",
          body: "My Equine Stay LLC no garantiza la exactitud, integridad, legalidad, fiabilidad, disponibilidad, precios, fotos, descripciones, comodidades ni calidad de ningún anuncio, propiedad o usuario.",
        },
        {
          num: "8",
          title: "Contenido Generado por el Usuario",
          body: "Los usuarios son exclusivamente responsables de toda la información, fotografías, descripciones, precios y demás contenido que publiquen.",
        },
        {
          num: "9",
          title: "Asunción de Riesgo",
          body: "Todas las interacciones con otros usuarios se realizan bajo el propio y exclusivo riesgo del usuario.",
        },
        {
          num: "10",
          title: "Riesgos de Animales y Propiedades",
          body: "My Equine Stay LLC no se hace responsable por lesiones, muerte, enfermedades, robos, daños a la propiedad, daños a animales, animales escapados o cualquier incidente relacionado con caballos, ganado, mascotas, establos o vehículos.",
        },
        {
          num: "11",
          title: "Aviso de Responsabilidad sobre Actividades Ecuestres",
          body: "Bajo los Estatutos de Florida §§773.01–773.06, los patrocinadores de actividades ecuestres generalmente no son responsables por lesiones o muerte que resulten de los riesgos inherentes de las actividades ecuestres.",
          highlight: true,
        },
        {
          num: "12",
          title: "Exoneración de Responsabilidad",
          body: "Los usuarios liberan a My Equine Stay LLC, sus propietarios, gerentes, empleados y afiliados de cualquier reclamo derivado del uso de la plataforma.",
        },
        {
          num: "13",
          title: "Limitación de Responsabilidad",
          body: "My Equine Stay LLC no será responsable por fraudes, robos, engaños, daños materiales, lesiones personales, pérdidas financieras, cancelaciones o daños consecuentes.",
        },
        {
          num: "14",
          title: "Disputas entre Usuarios",
          body: "Cualquier disputa entre usuarios deberá resolverse exclusivamente entre ellos. My Equine Stay LLC no tiene obligación de investigar ni mediar.",
        },
        {
          num: "15",
          title: "Indemnización",
          body: "Los usuarios aceptan defender e indemnizar a My Equine Stay LLC frente a cualquier reclamo o costo derivado de su uso de la plataforma.",
        },
        {
          num: "16",
          title: "Sin Asesoramiento Profesional",
          body: "La información en la plataforma se brinda únicamente con fines informativos y no constituye asesoramiento legal, veterinario, financiero ni médico.",
        },
        {
          num: "17",
          title: "Conducta del Usuario",
          body: "Los usuarios se comprometen a no publicar anuncios falsos, no suplantar identidades, acatar la ley vigente y no hacer un uso indebido de la plataforma.",
        },
        {
          num: "18",
          title: "Suspensión de Cuenta",
          body: "My Equine Stay LLC se reserva el derecho de suspender o cancelar cualquier cuenta o publicación que incumpla estos términos, sin previo aviso.",
        },
        {
          num: "19",
          title: "Propiedad Intelectual",
          body: "Todas las marcas registradas, logotipos, diseño web y contenidos son propiedad exclusiva de My Equine Stay LLC.",
        },
        {
          num: "20",
          title: "Acuerdo de Arbitraje",
          body: "Salvo donde la ley lo prohíba, cualquier disputa legal se resolverá mediante arbitraje vinculante individual.",
        },
        {
          num: "21",
          title: "Renuncia a Demandas Colectivas",
          body: "Los usuarios aceptan resolver disputas de forma individual y no como parte de ninguna demanda colectiva.",
        },
        {
          num: "22",
          title: "Ley Aplicable",
          body: "Estos Términos se rigen por las leyes del Estado de Florida, Estados Unidos.",
        },
        {
          num: "23",
          title: "Modificaciones a los Términos",
          body: "My Equine Stay LLC podrá modificar estos Términos en cualquier momento. El uso continuado de la plataforma implica su aceptación.",
        },
        {
          num: "24",
          title: "Aceptación",
          body: "Al crear una cuenta, publicar o utilizar la plataforma, el usuario confirma que ha leído, comprendido y aceptado plenamente estos Términos.",
          highlight: true,
        },
      ],
    },
    waiver: {
      badge: "Aviso de Riesgo Ecuestre",
      title: "Exención de Responsabilidad",
      lastUpdated: "My Equine Stay LLC · Última actualización: 2026",
      warningTitle: "Aviso Obligatorio según la Ley de Florida (F.S. §773.04)",
      warningText:
        "ADVERTENCIA: Bajo la ley de Florida, un patrocinador de actividades ecuestres o un profesional ecuestre no es responsable por lesiones o muerte de un participante en actividades ecuestres que resulten de los riesgos inherentes a las actividades ecuestres.",
      termsLink: "← Términos y Condiciones",
      privacyLink: "Política de Privacidad →",
      sections: [
        {
          num: "1",
          title: "Riesgos Inherentes",
          body: "Las actividades ecuestres implican riesgos inherentes como comportamiento impredecible de los caballos, caídas, coces, mordiscos, colisiones, riesgos de transporte y condiciones climáticas.",
        },
        {
          num: "2",
          title: "Ley de Responsabilidad de Actividades Ecuestres de Florida",
          body: "Bajo los Estatutos de Florida §§773.01–773.06, los patrocinadores no son responsables por daños derivados de los riesgos inherentes a estas actividades.",
          highlight: true,
        },
        {
          num: "3",
          title: "Función de la Plataforma",
          body: "My Equine Stay LLC opera exclusivamente como un directorio y punto de contacto digital entre usuarios independientes.",
        },
        {
          num: "4",
          title: "Sin Inspección ni Certificación",
          body: "My Equine Stay LLC no inspecciona, certifica ni garantiza la seguridad, adecuación o legalidad de ninguna propiedad, establo, pastizal o servicio listado.",
        },
        {
          num: "5",
          title: "Responsabilidad del Usuario",
          body: "Los usuarios son los únicos responsables de evaluar la seguridad, cualificaciones y coberturas de seguro antes de utilizar un espacio.",
        },
        {
          num: "6",
          title: "Asunción Voluntaria de Riesgos",
          body: "Los usuarios asumen libre y voluntariamente todos los riesgos asociados con las actividades ecuestres, traslados y estancias.",
        },
        {
          num: "7",
          title: "Sin Responsabilidad de Emergencia",
          body: "My Equine Stay LLC no proporciona atención médica, auxilio veterinario, servicios de rescate ni seguros de cobertura para emergencias.",
        },
        {
          num: "8",
          title: "Liberación Total de Responsabilidad",
          body: "Los usuarios eximen a My Equine Stay LLC de toda responsabilidad por lesiones, muerte, pérdidas materiales, daños a animales o litigios entre partes.",
        },
        {
          num: "9",
          title: "Reconocimiento y Conformidad",
          body: "Al utilizar esta plataforma, el usuario declara haber leído, comprendido y aceptado en su totalidad esta exención de responsabilidad.",
          highlight: true,
        },
      ],
    },
    faq: {
      backToHome: "Volver al inicio",
      badge: "Centro de ayuda",
      title: "Preguntas frecuentes",
      subtitle:
        "Todo lo que necesitas saber para conectar con propietarios ecuestres en My Equine Stay.",
      searchPlaceholder: "Buscar preguntas…",
      noResults: "Ninguna pregunta coincide con tu búsqueda.",
      askAiBtn: "Preguntar a la IA",
      stillQuestions: "¿Aún tienes dudas? Habla con nuestro asistente.",
      categories: {
        platform: "Sobre la plataforma",
        accounts: "Cuentas y anuncios",
        verification: "Verificación y responsabilidad",
      },
      items: [
        {
          category: "platform",
          question: "¿Cómo funciona My Equine Stay?",
          answer:
            "My Equine Stay es una plataforma de conexión. Permitimos a los usuarios encontrar propiedades y conectar directamente con los propietarios. No gestionamos reservas, pagos ni contratos.",
        },
        {
          category: "platform",
          question: "¿Se reserva a través de My Equine Stay?",
          answer:
            "No. My Equine Stay no procesa reservas ni pagos. Todos los acuerdos se realizan directamente entre los usuarios.",
        },
        {
          category: "platform",
          question: "¿Cómo contacto al propietario de una propiedad?",
          answer:
            "Crea una cuenta, explora las propiedades y pulsa \"Contactar al anfitrión\" en cualquier anuncio para comunicarte de inmediato.",
        },
        {
          category: "accounts",
          question: "¿Necesito una cuenta?",
          answer:
            "Sí. Necesitas una cuenta para enviar mensajes a los propietarios o para publicar tu propio espacio.",
        },
        {
          category: "accounts",
          question: "¿Cómo publico mi propiedad?",
          answer:
            "Crea tu cuenta, selecciona un plan de publicación y rellena los datos de tu finca o establo. Comenzarás a recibir consultas directas.",
        },
        {
          category: "accounts",
          question: "¿Qué incluye una suscripción?",
          answer:
            "Las suscripciones incluyen la creación y edición del anuncio, visibilidad destacada en la plataforma y comunicación directa con los interesados.",
        },
        {
          category: "accounts",
          question: "¿Cómo se fijan los precios?",
          answer:
            "Cada propietario establece sus propias tarifas y condiciones. Todos los precios se acuerdan directamente entre usuarios sin comisiones añadidas.",
        },
        {
          category: "verification",
          question: "¿Las propiedades están verificadas físicamente?",
          answer:
            "No. My Equine Stay no realiza inspecciones presenciales. Los usuarios son responsables de verificar la información y tomar sus propias decisiones.",
        },
        {
          category: "verification",
          question: "¿My Equine Stay es responsable de los acuerdos?",
          answer:
            "No. My Equine Stay no interviene en contratos, transacciones ni disputas entre usuarios.",
        },
        {
          category: "verification",
          question: "¿Quién responde por las condiciones del lugar?",
          answer:
            "Los propietarios y huéspedes son responsables directos de sus instalaciones, acuerdos y conducta mutua.",
        },
        {
          category: "verification",
          question: "¿Gestionan los cobros de estancias?",
          answer:
            "No. No retenemos, cobramos ni gestionamos los pagos correspondientes a las estancias.",
        },
        {
          category: "verification",
          question: "¿Qué sucede si surge un problema?",
          answer:
            "Cualquier desacuerdo debe ser resuelto amistosamente y de forma directa entre las partes involucradas.",
        },
      ],
    },
    contact: {
      title: "Contáctanos",
      subtitle:
        "¿Tienes dudas, sugerencias o propuestas de colaboración? Envíanos un mensaje.",
      name: "Nombre",
      namePlaceholder: "Tu nombre completo",
      email: "Correo electrónico",
      emailPlaceholder: "tu@ejemplo.com",
      subject: "Asunto",
      subjectPlaceholder: "¿En qué podemos ayudarte?",
      message: "Mensaje",
      messagePlaceholder: "Escribe tu mensaje aquí…",
      send: "Enviar Mensaje",
      sending: "Enviando…",
      successTitle: "Mensaje Enviado",
      successText:
        "¡Gracias por comunicarte con nosotros! Hemos recibido tu mensaje y te responderemos pronto a {email}.",
      sendAnother: "Enviar otro mensaje",
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
    privacy: {
      badge: "Confidentialité",
      title: "Politique de Confidentialité",
      lastUpdated: "My Equine Stay LLC · Dernière mise à jour : 2026",
      termsLink: "← Conditions Générales",
      waiverLink: "Décharge de Responsabilité →",
      sections: [
        {
          title: "Informations collectées",
          body: "Nom, adresse e-mail, numéro de téléphone, localisation, profil, détails des annonces, messagerie, abonnement, informations de paiement et données techniques d'utilisation.",
        },
        {
          title: "Utilisation de vos informations",
          list: [
            "Exploiter et administrer la plateforme.",
            "Permettre la mise en relation directe entre utilisateurs.",
            "Gérer les comptes utilisateurs.",
            "Traiter les paiements d'abonnements.",
            "Améliorer les performances et fonctionnalités du service.",
            "Envoyer des notifications de service importantes.",
          ],
        },
        {
          title: "Rôle de la plateforme",
          body: "My Equine Stay LLC agit exclusivement comme plateforme de mise en relation. Nous n'intervenons dans aucune réservation, location, négociation ou contrat entre membres.",
        },
        {
          title: "Paiements",
          body: "Les paiements perçus sur la plateforme concernent exclusivement les abonnements de publication. My Equine Stay LLC ne traite aucun paiement direct entre membres.",
        },
        {
          title: "Cookies",
          body: "La plateforme utilise des cookies et technologies similaires pour améliorer son fonctionnement et l'expérience utilisateur.",
        },
        {
          title: "Partage des données",
          body: "Nous ne vendons ni ne louons vos informations personnelles. Elles ne sont partagées qu'avec nos prestataires techniques, sur réquisition légale ou pour préserver la sécurité de la communauté.",
        },
        {
          title: "Sécurité des données",
          body: "Des mesures techniques raisonnables sont déployées. Néanmoins, aucun système informatique en ligne ne peut garantir une sécurité absolue.",
        },
        {
          title: "Suppression de compte",
          body: "Les utilisateurs peuvent demander la clôture et la suppression de leur compte à tout moment, sous réserve des obligations légales de conservation des données.",
        },
        {
          title: "Contact",
          body: "Pour toute question relative à la vie privée ou pour supprimer votre compte, veuillez utiliser notre page Contact ou joindre notre équipe.",
        },
      ],
    },
    terms: {
      badge: "Mentions Légales",
      title: "Conditions Générales d'Utilisation",
      lastUpdated: "My Equine Stay LLC · Dernière mise à jour : 2026",
      privacyLink: "Politique de Confidentialité →",
      waiverLink: "Décharge de Responsabilité →",
      sections: [
        {
          num: "1",
          title: "Objet de la Plateforme",
          body: "My Equine Stay LLC opère uniquement en tant que place de marché en ligne et plateforme de mise en relation. My Equine Stay LLC ne fournit, ne supervise ni ne gère aucun hébergement, location ou activité équestre.",
        },
        {
          num: "2",
          title: "Utilisateurs Indépendants",
          body: "Tous les utilisateurs sont des particuliers ou des professionnels indépendants. Aucune relation d'employeur à employé, de mandat ou d'agence n'existe avec My Equine Stay LLC.",
        },
        {
          num: "3",
          title: "Âge Requis",
          body: "Vous devez être âgé d'au moins 18 ans pour créer un compte ou utiliser la plateforme.",
        },
        {
          num: "4",
          title: "Absence de Contrôle Préalable",
          body: "My Equine Stay LLC ne vérifie pas l'identité, les diplômes, les assurances, les références ou la fiabilité des utilisateurs.",
        },
        {
          num: "5",
          title: "Responsabilité Personnelle",
          body: "Chaque utilisateur est seul responsable d'effectuer ses propres vérifications avant de conclure un accord.",
        },
        {
          num: "6",
          title: "Absence d'Implication dans les Transactions",
          body: "My Equine Stay LLC n'est partie à aucun contrat d'hébergement. Tous les accords et règlements sont conclus directement entre membres.",
        },
        {
          num: "7",
          title: "Absence de Garantie",
          body: "My Equine Stay LLC ne garantit ni l'exactitude des descriptions, ni la qualité, disponibilité ou légalité des annonces publiées.",
        },
        {
          num: "8",
          title: "Contenu Publié par les Utilisateurs",
          body: "Les utilisateurs assument l'entière responsabilité des photos, textes et tarifs qu'ils diffusent.",
        },
        {
          num: "9",
          title: "Acceptation des Risques",
          body: "Toutes les interactions et transactions se déroulent sous la responsabilité exclusive des utilisateurs.",
        },
        {
          num: "10",
          title: "Risques Liés aux Animaux et Propriétés",
          body: "My Equine Stay LLC décline toute responsabilité en cas d'accident, blessure d'équidés, décès, vol ou dégradation matérielle.",
        },
        {
          num: "11",
          title: "Avertissement Légal sur les Activités Équestres",
          body: "En vertu des lois de Floride (F.S. §§773.01–773.06), les organisateurs d'activités équestres ne sont généralement pas responsables des dommages causés par les risques inhérents à ces pratiques.",
          highlight: true,
        },
        {
          num: "12",
          title: "Décharge de Responsabilité",
          body: "Les utilisateurs dégagent My Equine Stay LLC, ses dirigeants et employés de toute réclamation liée à l'utilisation du service.",
        },
        {
          num: "13",
          title: "Limitation de Responsabilité",
          body: "My Equine Stay LLC ne saurait être tenue responsable des fraudes, dommages directs ou indirects, pertes financières ou litiges entre membres.",
        },
        {
          num: "14",
          title: "Litiges entre Utilisateurs",
          body: "Tout différend doit être réglé exclusivement entre les parties prenantes. My Equine Stay LLC n'agit pas en tant que médiateur.",
        },
        {
          num: "15",
          title: "Indemnisation",
          body: "L'utilisateur s'engage à garantir et indemniser My Equine Stay LLC contre toute réclamation consécutive à son comportement ou à ses annonces.",
        },
        {
          num: "16",
          title: "Absence de Conseil Professionnel",
          body: "Les informations fournies sur le site ne constituent pas un avis vétérinaire, juridique ou médical qualifié.",
        },
        {
          num: "17",
          title: "Règles de Bonne Conduite",
          body: "Il est interdit de publier des annonces trompeuses, d'usurper une identité ou de violer les lois en vigueur.",
        },
        {
          num: "18",
          title: "Résiliation et Suspension",
          body: "My Equine Stay LLC se réserve le droit de suspendre sans préavis tout compte en infraction avec ces conditions.",
        },
        {
          num: "19",
          title: "Propriété Intellectuelle",
          body: "Tous les éléments du site, marques et logos sont la propriété exclusive de My Equine Stay LLC.",
        },
        {
          num: "20",
          title: "Convention d'Arbitrage",
          body: "Sauf disposition contraire de la loi, les litiges seront tranchés par voie d'arbitrage individuel contraignant.",
        },
        {
          num: "21",
          title: "Renonciation aux Recours Collectifs",
          body: "Les utilisateurs acceptent de renoncer à toute action collective ou groupée.",
        },
        {
          num: "22",
          title: "Droit Applicable",
          body: "Les présentes conditions sont régies par le droit de l'État de Floride, États-Unis.",
        },
        {
          num: "23",
          title: "Modification des Conditions",
          body: "My Equine Stay LLC peut modifier ces termes à tout moment. La poursuite de l'utilisation vaut acceptation.",
        },
        {
          num: "24",
          title: "Acceptation Complète",
          body: "L'inscription ou l'utilisation de la plateforme vaut acceptation pleine et entière de l'ensemble de ces conditions.",
          highlight: true,
        },
      ],
    },
    waiver: {
      badge: "Avertissement Risque Équestre",
      title: "Décharge de Responsabilité",
      lastUpdated: "My Equine Stay LLC · Dernière mise à jour : 2026",
      warningTitle: "Avertissement Légal Obligatoire de Floride (F.S. §773.04)",
      warningText:
        "AVERTISSEMENT : En vertu de la loi de Floride, un organisateur d'activités équestres ou un professionnel du secteur équestre n'est pas responsable des blessures ou du décès d'un participant résultant des risques inhérents aux activités équestres.",
      termsLink: "← Conditions Générales",
      privacyLink: "Politique de Confidentialité →",
      sections: [
        {
          num: "1",
          title: "Risques Inhérents",
          body: "Les activités équestres comportent des risques inhérents imprévisibles : chutes, ruades, morsures, collisions, transport et conditions climatiques.",
        },
        {
          num: "2",
          title: "Loi de Floride sur les Activités Équestres",
          body: "En vertu des statuts de Floride §§773.01–773.06, les organisateurs ne sont pas tenus pour responsables des risques normaux et inhérents au cheval.",
          highlight: true,
        },
        {
          num: "3",
          title: "Rôle de la Plateforme",
          body: "My Equine Stay LLC agit strictement comme intermédiaire technique et annuaire de contact en ligne.",
        },
        {
          num: "4",
          title: "Absence d'Inspection des Lieux",
          body: "My Equine Stay LLC ne visite ni ne certifie la conformité, la sécurité ou la salubrité des installations répertoriées.",
        },
        {
          num: "5",
          title: "Responsabilité des Voyageurs et Propriétaires",
          body: "Il incombe à chacun de s'assurer des conditions de sécurité et de vérifier la validité des assurances requises.",
        },
        {
          num: "6",
          title: "Acceptation Volontaire des Risques",
          body: "Chaque utilisateur accepte volontairement les risques inhérents aux déplacements, séjours et contacts animaliers.",
        },
        {
          num: "7",
          title: "Absence d'Assistance d'Urgence",
          body: "My Equine Stay LLC ne fournit aucune prestation de soins vétérinaires, d'urgence médicale ou de dépannage.",
        },
        {
          num: "8",
          title: "Exonération Totale",
          body: "L'utilisateur renonce à poursuivre My Equine Stay LLC pour tout préjudice physique, matériel ou financier survenu durant son séjour.",
        },
        {
          num: "9",
          title: "Consentement et Engagement",
          body: "L'accès au service implique la compréhension et l'acceptation sans réserve de cette décharge.",
          highlight: true,
        },
      ],
    },
    faq: {
      backToHome: "Retour à l'accueil",
      badge: "Centre d'aide",
      title: "Foire aux questions",
      subtitle:
        "Tout ce que vous devez savoir pour contacter les propriétaires sur My Equine Stay.",
      searchPlaceholder: "Rechercher une question…",
      noResults: "Aucune question ne correspond à votre recherche.",
      askAiBtn: "Demander à l'IA",
      stillQuestions: "Vous avez encore des questions ? Discutez avec notre assistant.",
      categories: {
        platform: "À propos de la plateforme",
        accounts: "Comptes et annonces",
        verification: "Vérification et responsabilités",
      },
      items: [
        {
          category: "platform",
          question: "Comment fonctionne My Equine Stay ?",
          answer:
            "My Equine Stay est une plateforme de mise en relation directe. Nous permettons aux cavaliers et propriétaires d'équidés d'échanger en toute transparence, sans commissions intermédiaires.",
        },
        {
          category: "platform",
          question: "Effectue-t-on la réservation sur le site ?",
          answer:
            "Non. My Equine Stay ne gère ni les réservations ni les paiements des séjours. Toutes les modalités sont convenues directement entre vous et l'hôte.",
        },
        {
          category: "platform",
          question: "Comment contacter un hôte ?",
          answer:
            "Créez votre compte, naviguez parmi les annonces et cliquez sur « Contacter l'hôte » pour envoyer votre message.",
        },
        {
          category: "accounts",
          question: "Dois-je obligatoirement avoir un compte ?",
          answer:
            "Oui. Un compte est requis pour contacter les propriétaires ou publier votre propre propriété équestre.",
        },
        {
          category: "accounts",
          question: "Comment publier mon domaine ou mes boxes ?",
          answer:
            "Créez un compte, choisissez votre formule d'abonnement et remplissez la fiche descriptive. Vous recevrez directement les demandes de cavaliers.",
        },
        {
          category: "accounts",
          question: "Que comprend l'abonnement ?",
          answer:
            "La publication de vos hébergements et installations, une visibilité ciblée auprès des cavaliers et la messagerie directe sans frais cachés.",
        },
        {
          category: "accounts",
          question: "Comment sont fixés les prix ?",
          answer:
            "Chaque propriétaire fixe librement ses tarifs et conditions. Aucun frais de commission n'est prélevé sur vos accords.",
        },
        {
          category: "verification",
          question: "Les propriétés font-elles l'objet d'une visite de vérification ?",
          answer:
            "Non. My Equine Stay ne réalise pas d'inspection sur place. Les utilisateurs effectuent leurs propres vérifications avant tout engagement.",
        },
        {
          category: "verification",
          question: "My Equine Stay est-il partie prenante aux accords ?",
          answer:
            "Non. La plateforme n'intervient dans aucun contrat, paiement de séjour ou litige entre membres.",
        },
        {
          category: "verification",
          question: "Qui est garant de l'état des installations ?",
          answer:
            "Les hôtes et leurs hôtes assument l'entière responsabilité de leurs échanges, comportements et locaux.",
        },
        {
          category: "verification",
          question: "Gérez-vous le règlement des séjours ?",
          answer:
            "Non. Nous ne prélevons ni ne retenons aucun paiement lié aux locations et séjours.",
        },
        {
          category: "verification",
          question: "Que faire en cas de problème ou de désaccord ?",
          answer:
            "Tous les différends doivent être réglés directement et amiablement entre l'hôte et le voyageur.",
        },
      ],
    },
    contact: {
      title: "Contactez-nous",
      subtitle:
        "Des questions, suggestions ou propositions de partenariat ? Envoyez-nous un message.",
      name: "Nom",
      namePlaceholder: "Votre nom complet",
      email: "E-mail",
      emailPlaceholder: "vous@exemple.com",
      subject: "Objet",
      subjectPlaceholder: "Comment pouvons-nous vous aider ?",
      message: "Message",
      messagePlaceholder: "Rédigez votre message ici…",
      send: "Envoyer le message",
      sending: "Envoi en cours…",
      successTitle: "Message Envoyé",
      successText:
        "Merci de nous avoir contactés ! Nous avons bien reçu votre message et vous répondrons très prochainement à {email}.",
      sendAnother: "Envoyer un autre message",
    },
  },
};
