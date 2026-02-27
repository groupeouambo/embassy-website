const servicePageData = [
  {
    id: 'passport',
    title: 'Passport Services',
    subtitle: 'Apply for a new passport or renew your existing one',
    overview: {
      heading: 'About Passport Services',
      text: 'The Embassy of the Central African Republic in the United States provides passport services to Central African citizens residing in the United States, Canada, and Mexico. Whether you need a new passport or a renewal, our consular team is here to assist you through the process.',
    },
    eligibility: {
      heading: 'Who Can Apply',
      items: [
        'Central African citizens residing in the United States, Canada, or Mexico',
        'Citizens whose passports have expired or are about to expire (within 6 months)',
        'Citizens who need to replace a lost, stolen, or damaged passport',
        'First-time applicants who are Central African nationals',
      ],
    },
    requiredDocuments: {
      heading: 'Required Documents',
      items: [
        'Current passport (or copy if lost/stolen)',
        'Certified birth certificate',
        'National identity card (Carte Nationale d\'Identite)',
        'Four (4) recent passport-size photographs (2x2 inches, white background)',
        'Proof of residence in the United States (utility bill, lease, or driver\'s license)',
        'Completed passport application form',
        'Police report (if passport was lost or stolen)',
        'Payment of applicable fees',
      ],
    },
    processSteps: {
      heading: 'Application Process',
      items: [
        'Step 1: Gather all required documents listed above',
        'Step 2: Download and complete the passport application form',
        'Step 3: Schedule an appointment at the embassy',
        'Step 4: Submit your application in person at the embassy with all documents and payment',
        'Step 5: Your application will be processed and forwarded to Bangui for passport issuance',
        'Step 6: Once ready, your passport will be available for pickup or mailed to you',
      ],
    },
    processingInfo: {
      heading: 'Processing Information',
      items: [
        'Standard processing time: 6-8 weeks',
        'New passport fee: $100 USD',
        'Passport renewal fee: $80 USD',
        'Lost/stolen passport replacement: $120 USD',
        'All fees are non-refundable',
        'Passport validity: 5 years',
      ],
    },
    applicationOptions: {
      hasOnlineApplication: false,
      pdfDownloadPath: '/forms/passport-application.pdf',
    },
    importantNotes: {
      heading: 'Important Notes',
      items: [
        'All applicants must appear in person at the embassy',
        'Applications must be submitted by appointment only',
        'Processing times may vary and are subject to delays',
        'Ensure all documents are original or certified copies',
        'Photographs must meet international passport photo standards',
        'Minors under 18 require both parents\' consent',
      ],
    },
    contact: {
      heading: 'Need Help?',
      description: 'For questions about passport services, please contact us:',
      email: 'consular@car-embassy.us',
      phone: '+1 (202) 483-7800',
      hours: 'Monday - Friday, 9:00 AM - 5:00 PM EST',
    },
  },

  {
    id: 'consular-id',
    title: 'Consular ID Card',
    subtitle: 'Consular identification for Central African nationals abroad',
    overview: {
      heading: 'What is a Consular ID?',
      text: 'The Consular ID card is an official identification document issued by the Embassy of the Central African Republic to its citizens residing abroad. It serves as proof of identity and nationality, and can be used for various administrative purposes in the United States.',
    },
    eligibility: {
      heading: 'Who Can Apply',
      items: [
        'Central African citizens residing in the United States, Canada, or Mexico',
        'Citizens who need official identification from the Central African Republic',
        'Citizens whose previous consular ID has expired',
      ],
    },
    requiredDocuments: {
      heading: 'Required Documents',
      items: [
        'Valid passport or certified copy of passport',
        'Certified birth certificate',
        'Two (2) recent passport-size photographs (2x2 inches, white background)',
        'Proof of current residence in the United States',
        'Completed consular ID application form',
        'Payment of applicable fees',
      ],
    },
    processSteps: {
      heading: 'Application Process',
      items: [
        'Step 1: Gather all required documents',
        'Step 2: Download and complete the consular ID application form',
        'Step 3: Submit your application in person or by mail to the embassy',
        'Step 4: Pay the applicable fees',
        'Step 5: Your consular ID card will be processed and issued',
      ],
    },
    processingInfo: {
      heading: 'Processing Information',
      items: [
        'Standard processing time: 3-4 weeks',
        'Application fee: $50 USD',
        'Consular ID validity: 5 years',
        'All fees are non-refundable',
      ],
    },
    applicationOptions: {
      hasOnlineApplication: false,
      pdfDownloadPath: '/forms/consular-id-application.pdf',
    },
    importantNotes: {
      heading: 'Important Notes',
      items: [
        'The consular ID is not a replacement for a passport',
        'Applicants must provide proof of Central African nationality',
        'All documents must be original or certified copies',
        'Processing times may vary',
      ],
    },
    contact: {
      heading: 'Need Help?',
      description: 'For questions about consular ID services, please contact us:',
      email: 'consular@car-embassy.us',
      phone: '+1 (202) 483-7800',
      hours: 'Monday - Friday, 9:00 AM - 5:00 PM EST',
    },
  },

  {
    id: 'birth-certificate',
    title: 'Birth Certificate',
    subtitle: 'Request a birth certificate through the embassy',
    overview: {
      heading: 'About Birth Certificate Services',
      text: 'The Embassy of the Central African Republic assists citizens in obtaining birth certificates. Whether you need an original certificate, a copy, or a transcription of a birth that occurred abroad, our consular services can help guide you through the process.',
    },
    eligibility: {
      heading: 'Who Can Request',
      items: [
        'Central African citizens born in the Central African Republic',
        'Parents requesting birth certificates for their children',
        'Legal guardians with proper documentation',
        'Citizens needing certified copies of existing birth certificates',
      ],
    },
    requiredDocuments: {
      heading: 'Required Documents',
      items: [
        'Valid identification (passport or national ID)',
        'Existing birth certificate or hospital birth record (if available)',
        'Parents\' identification documents',
        'Parents\' marriage certificate (if applicable)',
        'Two (2) recent passport-size photographs',
        'Completed birth certificate request form',
        'Payment of applicable fees',
      ],
    },
    processSteps: {
      heading: 'Application Process',
      items: [
        'Step 1: Gather all required documents',
        'Step 2: Complete the birth certificate request form online or download the PDF',
        'Step 3: Submit your application with all supporting documents',
        'Step 4: Pay the applicable fees',
        'Step 5: Your request will be forwarded to the appropriate civil registry in CAR',
        'Step 6: Once processed, the certificate will be available for pickup or mail delivery',
      ],
    },
    processingInfo: {
      heading: 'Processing Information',
      items: [
        'Standard processing time: 4-6 weeks',
        'Application fee: $50 USD',
        'Certified copy fee: $30 USD',
        'All fees are non-refundable',
      ],
    },
    applicationOptions: {
      hasOnlineApplication: true,
      onlineRoute: '/apply-info/birth-certificate',
      pdfDownloadPath: '/forms/birth-certificate-application.pdf',
    },
    importantNotes: {
      heading: 'Important Notes',
      items: [
        'All information provided must be accurate and verifiable',
        'Processing times depend on coordination with civil registries in CAR',
        'Additional documents may be requested during processing',
        'Translations must be certified if documents are not in French',
      ],
    },
    contact: {
      heading: 'Need Help?',
      description: 'For questions about birth certificate services, please contact us:',
      email: 'consular@car-embassy.us',
      phone: '+1 (202) 483-7800',
      hours: 'Monday - Friday, 9:00 AM - 5:00 PM EST',
    },
  },

  {
    id: 'minor-birth-certificate',
    title: 'Minor Child Birth Certificate',
    subtitle: 'Register a child born abroad to Central African parents',
    overview: {
      heading: 'Registering a Birth Abroad',
      text: 'Central African citizens who have children born in the United States or other countries outside the Central African Republic can register the birth at the embassy. This process ensures the child is recognized as a Central African national and receives a birth certificate from the Central African Republic.',
    },
    eligibility: {
      heading: 'Who Can Apply',
      items: [
        'Central African citizens who are parents of a child born abroad',
        'At least one parent must be a Central African national',
        'The child must not yet be registered in the Central African civil registry',
      ],
    },
    requiredDocuments: {
      heading: 'Required Documents',
      items: [
        'Child\'s US birth certificate (original and certified copy)',
        'Both parents\' valid passports or national IDs',
        'Parents\' marriage certificate (if applicable)',
        'Parents\' birth certificates',
        'Four (4) recent passport-size photographs of the child',
        'Proof of parents\' residence in the United States',
        'Completed minor birth registration form',
        'Consent of both parents (both must sign in person or provide notarized consent)',
        'Payment of applicable fees',
      ],
    },
    processSteps: {
      heading: 'Application Process',
      items: [
        'Step 1: Gather all required documents for both parents and the child',
        'Step 2: Download and complete the minor birth registration form',
        'Step 3: Both parents must appear in person at the embassy (or provide notarized consent)',
        'Step 4: Submit all documents and pay the applicable fees',
        'Step 5: The registration will be forwarded to the civil registry in Bangui',
        'Step 6: The Central African birth certificate will be issued and sent to the embassy',
      ],
    },
    processingInfo: {
      heading: 'Processing Information',
      items: [
        'Standard processing time: 6-10 weeks',
        'Registration fee: $50 USD',
        'Both parents must consent to the registration',
        'All fees are non-refundable',
      ],
    },
    applicationOptions: {
      hasOnlineApplication: false,
      pdfDownloadPath: '/forms/minor-birth-certificate-application.pdf',
    },
    importantNotes: {
      heading: 'Important Notes',
      items: [
        'Both parents must provide consent for the birth registration',
        'If one parent is absent, a notarized consent letter is required',
        'The US birth certificate must be an official certified copy',
        'All non-French documents must be accompanied by certified translations',
        'The child will be registered as a Central African national',
      ],
    },
    contact: {
      heading: 'Need Help?',
      description: 'For questions about minor birth registration, please contact us:',
      email: 'consular@car-embassy.us',
      phone: '+1 (202) 483-7800',
      hours: 'Monday - Friday, 9:00 AM - 5:00 PM EST',
    },
  },

  {
    id: 'emergency-certificate',
    title: 'Emergency Travel Certificate',
    subtitle: 'Emergency travel documents for urgent situations',
    overview: {
      heading: 'About Emergency Travel Certificates',
      text: 'An Emergency Travel Certificate (Laissez-Passer) is a temporary travel document issued by the embassy for Central African citizens who need to travel urgently but do not have a valid passport. This document is typically issued when a passport has been lost, stolen, or has expired and there is insufficient time to obtain a new one.',
    },
    eligibility: {
      heading: 'Who Can Apply',
      items: [
        'Central African citizens whose passport has been lost or stolen',
        'Citizens whose passport has expired and who need to travel urgently',
        'Citizens who need to travel for a medical emergency or family emergency',
        'Citizens being repatriated to the Central African Republic',
      ],
    },
    requiredDocuments: {
      heading: 'Required Documents',
      items: [
        'Copy of lost/stolen/expired passport (if available)',
        'Police report (in case of theft or loss)',
        'Valid identification (driver\'s license, national ID, or other government-issued ID)',
        'Two (2) recent passport-size photographs',
        'Proof of travel (flight itinerary or booking confirmation)',
        'Proof of emergency (medical documents, death certificate, etc. if applicable)',
        'Completed emergency travel certificate application form',
        'Payment of applicable fees',
      ],
    },
    processSteps: {
      heading: 'Application Process',
      items: [
        'Step 1: Contact the embassy immediately to explain your situation',
        'Step 2: Gather all available documents listed above',
        'Step 3: Complete the emergency travel certificate application form',
        'Step 4: Submit your application in person at the embassy',
        'Step 5: Pay the applicable fees',
        'Step 6: The emergency certificate will be processed on an expedited basis',
      ],
    },
    processingInfo: {
      heading: 'Processing Information',
      items: [
        'Emergency processing: 24-72 hours',
        'Application fee: $75 USD',
        'The emergency certificate is valid for a single journey only',
        'Validity period: typically 30 days from date of issue',
        'All fees are non-refundable',
      ],
    },
    applicationOptions: {
      hasOnlineApplication: true,
      onlineRoute: '/apply-info/travel-pass',
      pdfDownloadPath: '/forms/emergency-certificate-application.pdf',
    },
    importantNotes: {
      heading: 'Important Notes',
      items: [
        'This document is for emergency travel only and is not a replacement for a passport',
        'You must apply for a new passport upon return to the United States',
        'The certificate is valid for a single journey only',
        'Contact the embassy as early as possible to allow for processing time',
        'Additional verification may be required to confirm identity and nationality',
      ],
    },
    contact: {
      heading: 'Need Help?',
      description: 'For emergency travel documents, please contact us immediately:',
      email: 'emergency@car-embassy.us',
      phone: '+1 (202) 483-7800',
      hours: 'Monday - Friday, 9:00 AM - 5:00 PM EST',
      afterHours: 'For emergencies outside business hours, please call the emergency line at +1 (202) 483-7800',
    },
  },

  {
    id: 'marriage-certificate',
    title: 'Marriage Certificate',
    subtitle: 'Request or register a marriage certificate',
    overview: {
      heading: 'About Marriage Certificate Services',
      text: 'The Embassy of the Central African Republic provides marriage certificate services, including registration of marriages performed abroad and requests for copies of marriage certificates from the Central African Republic civil registry.',
    },
    eligibility: {
      heading: 'Who Can Apply',
      items: [
        'Central African citizens who were married in the Central African Republic',
        'Central African citizens who were married abroad and need to register the marriage',
        'Couples where at least one spouse is a Central African national',
      ],
    },
    requiredDocuments: {
      heading: 'Required Documents',
      items: [
        'Valid passports or national IDs of both spouses',
        'Original marriage certificate (if married abroad)',
        'Birth certificates of both spouses',
        'Two (2) recent passport-size photographs of each spouse',
        'Proof of residence in the United States',
        'Completed marriage certificate request form',
        'Divorce decree or death certificate of previous spouse (if applicable)',
        'Payment of applicable fees',
      ],
    },
    processSteps: {
      heading: 'Application Process',
      items: [
        'Step 1: Gather all required documents for both spouses',
        'Step 2: Complete the marriage certificate request form online or download the PDF',
        'Step 3: Submit your application with all supporting documents',
        'Step 4: Pay the applicable fees',
        'Step 5: Your request will be processed and forwarded to the civil registry',
        'Step 6: The certificate will be available for pickup or mailed to you',
      ],
    },
    processingInfo: {
      heading: 'Processing Information',
      items: [
        'Standard processing time: 4-6 weeks',
        'Marriage registration fee: $75 USD',
        'Certified copy fee: $30 USD',
        'All fees are non-refundable',
      ],
    },
    applicationOptions: {
      hasOnlineApplication: true,
      onlineRoute: '/apply-info/marriage',
      pdfDownloadPath: '/forms/marriage-certificate-application.pdf',
    },
    importantNotes: {
      heading: 'Important Notes',
      items: [
        'Both spouses may need to appear in person for registration',
        'Foreign marriage certificates must be officially translated into French',
        'Additional documentation may be requested',
        'Processing times depend on coordination with civil registries in CAR',
      ],
    },
    contact: {
      heading: 'Need Help?',
      description: 'For questions about marriage certificate services, please contact us:',
      email: 'consular@car-embassy.us',
      phone: '+1 (202) 483-7800',
      hours: 'Monday - Friday, 9:00 AM - 5:00 PM EST',
    },
  },

  {
    id: 'document-authentication',
    title: 'Document Authentication & Legalization',
    subtitle: 'Official authentication of documents for use in the Central African Republic',
    overview: {
      heading: 'About Document Authentication',
      text: 'Document authentication (also known as legalization) is the process of certifying that a document is genuine and can be used for official purposes in the Central African Republic. The embassy authenticates documents issued in the United States for use in CAR, and vice versa.',
    },
    eligibility: {
      heading: 'Documents That Can Be Authenticated',
      items: [
        'Birth certificates, death certificates, and marriage certificates',
        'Academic diplomas and transcripts',
        'Court orders and legal documents',
        'Commercial and business documents',
        'Power of attorney documents',
        'Any document requiring official recognition in CAR',
      ],
    },
    requiredDocuments: {
      heading: 'Required Documents',
      items: [
        'Original document to be authenticated',
        'Copy of the document',
        'Valid identification (passport or national ID)',
        'US State Department authentication (Apostille) if applicable',
        'Certified French translation (if document is in English)',
        'Completed authentication request form',
        'Payment of applicable fees',
      ],
    },
    processSteps: {
      heading: 'Authentication Process',
      items: [
        'Step 1: Obtain an Apostille from the US State Department (if required)',
        'Step 2: Have the document translated into French by a certified translator (if not already in French)',
        'Step 3: Bring the original document, translation, and Apostille to the embassy',
        'Step 4: Complete the authentication request form',
        'Step 5: Pay the applicable fees',
        'Step 6: The embassy will authenticate the document and return it to you',
      ],
    },
    processingInfo: {
      heading: 'Processing Information',
      items: [
        'Standard processing time: 2-3 weeks',
        'Authentication fee: $30-$50 USD per document',
        'Express processing (3-5 business days): additional $25 USD',
        'All fees are non-refundable',
      ],
    },
    applicationOptions: {
      hasOnlineApplication: false,
      pdfDownloadPath: '/forms/document-authentication-form.pdf',
    },
    importantNotes: {
      heading: 'Important Notes',
      items: [
        'Documents must be original or certified copies',
        'US documents may require prior authentication by the US State Department',
        'Translations must be done by a certified translator',
        'The embassy reserves the right to refuse authentication if the document cannot be verified',
        'Some documents may require additional steps depending on their nature',
      ],
    },
    contact: {
      heading: 'Need Help?',
      description: 'For questions about document authentication, please contact us:',
      email: 'consular@car-embassy.us',
      phone: '+1 (202) 483-7800',
      hours: 'Monday - Friday, 9:00 AM - 5:00 PM EST',
    },
  },

  {
    id: 'transport-deceased',
    title: 'Transport of Deceased',
    subtitle: 'Assistance with repatriating the remains of a loved one',
    overview: {
      heading: 'Repatriation of Remains',
      text: 'The Embassy of the Central African Republic understands the difficulty of losing a loved one abroad. Our consular team provides guidance and assistance to families who need to transport the remains of a deceased Central African national back to the Central African Republic. We are here to support you during this difficult time.',
    },
    requiredDocuments: {
      heading: 'Required Documents',
      items: [
        'Death certificate issued by the local authorities',
        'Medical certificate stating cause of death',
        'Embalming certificate from the funeral home',
        'Passport or identification of the deceased',
        'Authorization from the next of kin',
        'Funeral home documentation and transit permit',
        'Airline clearance for transport of remains',
        'Consular mortuary certificate (issued by the embassy)',
        'Payment of applicable fees',
      ],
    },
    processSteps: {
      heading: 'Process',
      items: [
        'Step 1: Contact the embassy as soon as possible to notify them of the death',
        'Step 2: Work with a local funeral home to prepare the remains for international transport',
        'Step 3: Gather all required documentation listed above',
        'Step 4: Visit the embassy to obtain the consular mortuary certificate',
        'Step 5: Coordinate with an airline for transport of the remains',
        'Step 6: The embassy can assist with coordination with authorities in CAR for receiving the remains',
      ],
    },
    processingInfo: {
      heading: 'Processing Information',
      items: [
        'Consular mortuary certificate processing: 3-5 business days',
        'Consular fee: varies based on services required',
        'Total costs depend on funeral home, airline, and destination within CAR',
        'The embassy can provide guidance on cost estimates',
      ],
    },
    importantNotes: {
      heading: 'Important Information',
      items: [
        'Please contact the embassy as soon as possible after a death occurs',
        'The funeral home must be licensed for international transport of remains',
        'All documents must meet both US and CAR requirements',
        'The embassy can provide a list of funeral homes experienced in international repatriation',
        'Financial assistance may be available through community organizations',
        'The embassy staff will handle your case with the utmost sensitivity and respect',
      ],
    },
    contact: {
      heading: 'Contact Us',
      description: 'Please reach out to our consular team for immediate assistance:',
      email: 'consular@car-embassy.us',
      phone: '+1 (202) 483-7800',
      hours: 'Monday - Friday, 9:00 AM - 5:00 PM EST',
      afterHours: 'For urgent matters outside business hours, please call +1 (202) 483-7800 and leave a detailed message',
    },
  },

  {
    id: 'passport-appointment',
    title: 'Passport Appointment',
    subtitle: 'Schedule your passport appointment at the embassy',
    overview: {
      heading: 'Scheduling a Passport Appointment',
      text: 'All passport services at the Embassy of the Central African Republic require an appointment. Walk-in appointments are not available for passport services. Please schedule your appointment in advance to ensure prompt and efficient service.',
    },
    processSteps: {
      heading: 'How to Schedule an Appointment',
      items: [
        'Step 1: Prepare all required documents for your passport service (see Passport Services page)',
        'Step 2: Contact the embassy by phone or email to request an appointment',
        'Step 3: Provide your full name, contact information, and the type of passport service needed',
        'Step 4: You will receive a confirmation with your appointment date and time',
        'Step 5: Arrive at the embassy at least 15 minutes before your appointment',
        'Step 6: Bring all required documents and payment to your appointment',
      ],
    },
    importantNotes: {
      heading: 'Appointment Guidelines',
      items: [
        'Appointments are available Monday through Friday, 9:00 AM - 4:00 PM EST',
        'Please arrive at least 15 minutes before your scheduled time',
        'Bring all required documents and payment to your appointment',
        'If you need to reschedule, please notify the embassy at least 24 hours in advance',
        'Walk-in service is not available for passport applications',
        'Each applicant must have their own appointment',
        'Parents applying for a minor\'s passport must bring the child to the appointment',
      ],
    },
    contact: {
      heading: 'Schedule Your Appointment',
      description: 'Contact us to schedule your passport appointment:',
      email: 'appointments@car-embassy.us',
      phone: '+1 (202) 483-7800',
      hours: 'Monday - Friday, 9:00 AM - 5:00 PM EST',
    },
  },

  {
    id: 'diaspora-organization',
    title: 'SEWA — Diaspora Organization',
    subtitle: 'Serving and empowering the Central African community in the United States',
    overview: {
      heading: 'About SEWA',
      text: 'SEWA (Service, Empowerment, Welfare & Advancement) is a diaspora organization dedicated to the Central African community living in the United States. SEWA works to unite, support, and empower Central Africans abroad by fostering solidarity, preserving cultural identity, and advocating for the well-being of community members. Through social programs, cultural events, and community outreach, SEWA serves as a vital bridge between the diaspora and the Central African Republic.',
    },
    eligibility: {
      heading: 'What SEWA Does',
      items: [
        'Community support and social services for Central Africans in the U.S.',
        'Cultural events celebrating Central African heritage and traditions',
        'Networking and solidarity among diaspora members',
        'Advocacy and representation for community needs',
        'Information and resources for newly arrived Central Africans',
        'Coordination with the Embassy on diaspora initiatives',
      ],
    },
    contact: {
      heading: 'Connect with SEWA',
      description: 'Reach out to SEWA directly through their Facebook page:',
      facebook: 'https://www.facebook.com/us.sewa',
      facebookLabel: 'SEWA on Facebook',
    },
  },
];

export function getServiceData(serviceId) {
  return servicePageData.find((service) => service.id === serviceId) || null;
}

export default servicePageData;
