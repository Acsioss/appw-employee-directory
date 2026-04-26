// Données mockées pour l'annuaire des agents

const data = {
    // Localisations (DE_LIEU)
    lieux: [
        {
            LIE_CODE: 'SITE001',
            LIE_DOMAINE: 'Central',
            LIE_NOM: 'Hôtel du Département',
            LIE_ADRESSE: '1 Esplanade François Mitterrand, 86000 Poitiers',
            LIE_LATITUDE: 46.5802,
            LIE_LONGITUDE: 0.3378,
            LIE_CONTACT: '05.49.88.00.00'
        },
        {
            LIE_CODE: 'SITE002',
            LIE_DOMAINE: 'Social',
            LIE_NOM: 'Maison des Solidarités - Poitiers',
            LIE_ADRESSE: '15 Rue de la Marne, 86000 Poitiers',
            LIE_LATITUDE: 46.5756,
            LIE_LONGITUDE: 0.3412,
            LIE_CONTACT: '05.49.88.10.00'
        },
        {
            LIE_CODE: 'SITE003',
            LIE_DOMAINE: 'Routes',
            LIE_NOM: 'Centre d\'Exploitation Routière - Chasseneuil',
            LIE_ADRESSE: 'Route de Limoges, 86360 Chasseneuil-du-Poitou',
            LIE_LATITUDE: 46.6589,
            LIE_LONGITUDE: 0.3156,
            LIE_CONTACT: '05.49.88.20.00'
        },
        {
            LIE_CODE: 'SITE004',
            LIE_DOMAINE: 'Education',
            LIE_NOM: 'Collège Les Feuillants',
            LIE_ADRESSE: 'Avenue des Feuillants, 86000 Poitiers',
            LIE_LATITUDE: 46.5923,
            LIE_LONGITUDE: 0.3567,
            LIE_CONTACT: '05.49.88.30.00'
        },
        {
            LIE_CODE: 'SITE005',
            LIE_DOMAINE: 'Social',
            LIE_NOM: 'Maison des Solidarités - Châtellerault',
            LIE_ADRESSE: '28 Rue Jean Jaurès, 86100 Châtellerault',
            LIE_LATITUDE: 46.8178,
            LIE_LONGITUDE: 0.5456,
            LIE_CONTACT: '05.49.88.40.00'
        }
    ],

    // Entités organisationnelles (DE_ENTITE)
    entites: [
        // Direction Générale
        { ENT_CODERH: 'DG', ENT_NOM: 'Direction Générale', ENT_NOM_COURT: 'DG', ENT_CODERH_PERE: null, ENT_SITE: 'SITE001', ENT_MISSIONS: 'Pilotage stratégique du Département', ENT_EFFECTIF: 15 },
        { ENT_CODERH: 'DGS', ENT_NOM: 'Secrétariat Général', ENT_NOM_COURT: 'SG', ENT_CODERH_PERE: 'DG', ENT_SITE: 'SITE001', ENT_MISSIONS: 'Coordination administrative', ENT_EFFECTIF: 8 },
        
        // Direction des Ressources Humaines
        { ENT_CODERH: 'DRH', ENT_NOM: 'Direction des Ressources Humaines', ENT_NOM_COURT: 'DRH', ENT_CODERH_PERE: 'DG', ENT_SITE: 'SITE001', ENT_MISSIONS: 'Gestion des carrières et paie', ENT_EFFECTIF: 25 },
        { ENT_CODERH: 'DRH_REC', ENT_NOM: 'Service Recrutement', ENT_NOM_COURT: 'Recrutement', ENT_CODERH_PERE: 'DRH', ENT_SITE: 'SITE001', ENT_MISSIONS: 'Recrutement et intégration', ENT_EFFECTIF: 6 },
        { ENT_CODERH: 'DRH_FORM', ENT_NOM: 'Service Formation', ENT_NOM_COURT: 'Formation', ENT_CODERH_PERE: 'DRH', ENT_SITE: 'SITE001', ENT_MISSIONS: 'Développement des compétences', ENT_EFFECTIF: 8 },
        { ENT_CODERH: 'DRH_PAIE', ENT_NOM: 'Service Paie', ENT_NOM_COURT: 'Paie', ENT_CODERH_PERE: 'DRH', ENT_SITE: 'SITE001', ENT_MISSIONS: 'Gestion de la paie', ENT_EFFECTIF: 11 },

        // Direction Financière
        { ENT_CODERH: 'DF', ENT_NOM: 'Direction Financière', ENT_NOM_COURT: 'DF', ENT_CODERH_PERE: 'DG', ENT_SITE: 'SITE001', ENT_MISSIONS: 'Gestion budgétaire et comptable', ENT_EFFECTIF: 30 },
        { ENT_CODERH: 'DF_BUDG', ENT_NOM: 'Service Budget', ENT_NOM_COURT: 'Budget', ENT_CODERH_PERE: 'DF', ENT_SITE: 'SITE001', ENT_MISSIONS: 'Élaboration et suivi budgétaire', ENT_EFFECTIF: 12 },
        { ENT_CODERH: 'DF_COMPT', ENT_NOM: 'Service Comptabilité', ENT_NOM_COURT: 'Compta', ENT_CODERH_PERE: 'DF', ENT_SITE: 'SITE001', ENT_MISSIONS: 'Tenue de la comptabilité', ENT_EFFECTIF: 10 },
        { ENT_CODERH: 'DF_FISC', ENT_NOM: 'Service Fiscalité', ENT_NOM_COURT: 'Fiscalité', ENT_CODERH_PERE: 'DF', ENT_SITE: 'SITE001', ENT_MISSIONS: 'Gestion fiscale', ENT_EFFECTIF: 8 },

        // Direction de l'Action Sociale
        { ENT_CODERH: 'DAS', ENT_NOM: 'Direction de l\'Action Sociale', ENT_NOM_COURT: 'DAS', ENT_CODERH_PERE: 'DG', ENT_SITE: 'SITE002', ENT_MISSIONS: 'Politique sociale départementale', ENT_EFFECTIF: 45 },
        { ENT_CODERH: 'DAS_ENF', ENT_NOM: 'Service Enfance Famille', ENT_NOM_COURT: 'Enfance', ENT_CODERH_PERE: 'DAS', ENT_SITE: 'SITE002', ENT_MISSIONS: 'Protection de l\'enfance', ENT_EFFECTIF: 18 },
        { ENT_CODERH: 'DAS_HAND', ENT_NOM: 'Service Handicap', ENT_NOM_COURT: 'Handicap', ENT_CODERH_PERE: 'DAS', ENT_SITE: 'SITE002', ENT_MISSIONS: 'Accompagnement personnes handicapées', ENT_EFFECTIF: 15 },
        { ENT_CODERH: 'DAS_SEN', ENT_NOM: 'Service Seniors', ENT_NOM_COURT: 'Seniors', ENT_CODERH_PERE: 'DAS', ENT_SITE: 'SITE005', ENT_MISSIONS: 'Politique personnes âgées', ENT_EFFECTIF: 12 },

        // Direction des Routes et Transports
        { ENT_CODERH: 'DRT', ENT_NOM: 'Direction des Routes et Transports', ENT_NOM_COURT: 'DRT', ENT_CODERH_PERE: 'DG', ENT_SITE: 'SITE003', ENT_MISSIONS: 'Entretien du réseau routier', ENT_EFFECTIF: 80 },
        { ENT_CODERH: 'DRT_EXP', ENT_NOM: 'Service Exploitation', ENT_NOM_COURT: 'Exploitation', ENT_CODERH_PERE: 'DRT', ENT_SITE: 'SITE003', ENT_MISSIONS: 'Entretien courant des routes', ENT_EFFECTIF: 45 },
        { ENT_CODERH: 'DRT_INV', ENT_NOM: 'Service Investissement', ENT_NOM_COURT: 'Investissement', ENT_CODERH_PERE: 'DRT', ENT_SITE: 'SITE001', ENT_MISSIONS: 'Travaux neufs', ENT_EFFECTIF: 20 },
        { ENT_CODERH: 'DRT_TRANS', ENT_NOM: 'Service Transports', ENT_NOM_COURT: 'Transports', ENT_CODERH_PERE: 'DRT', ENT_SITE: 'SITE001', ENT_MISSIONS: 'Organisation des transports', ENT_EFFECTIF: 15 },

        // Direction de l'Éducation et de la Jeunesse
        { ENT_CODERH: 'DEJ', ENT_NOM: 'Direction de l\'Éducation et de la Jeunesse', ENT_NOM_COURT: 'DEJ', ENT_CODERH_PERE: 'DG', ENT_SITE: 'SITE004', ENT_MISSIONS: 'Politique éducative', ENT_EFFECTIF: 35 },
        { ENT_CODERH: 'DEJ_COLL', ENT_NOM: 'Service Collèges', ENT_NOM_COURT: 'Collèges', ENT_CODERH_PERE: 'DEJ', ENT_SITE: 'SITE004', ENT_MISSIONS: 'Gestion des collèges', ENT_EFFECTIF: 20 },
        { ENT_CODERH: 'DEJ_JEUN', ENT_NOM: 'Service Jeunesse', ENT_NOM_COURT: 'Jeunesse', ENT_CODERH_PERE: 'DEJ', ENT_SITE: 'SITE001', ENT_MISSIONS: 'Politique jeunesse', ENT_EFFECTIF: 15 },

        // Direction des Systèmes d'Information
        { ENT_CODERH: 'DSI', ENT_NOM: 'Direction des Systèmes d\'Information', ENT_NOM_COURT: 'DSI', ENT_CODERH_PERE: 'DG', ENT_SITE: 'SITE001', ENT_MISSIONS: 'SI et numérique', ENT_EFFECTIF: 28 },
        { ENT_CODERH: 'DSI_DEV', ENT_NOM: 'Service Développement', ENT_NOM_COURT: 'Développement', ENT_CODERH_PERE: 'DSI', ENT_SITE: 'SITE001', ENT_MISSIONS: 'Développement applicatif', ENT_EFFECTIF: 15 },
        { ENT_CODERH: 'DSI_INFRA', ENT_NOM: 'Service Infrastructure', ENT_NOM_COURT: 'Infrastructure', ENT_CODERH_PERE: 'DSI', ENT_SITE: 'SITE001', ENT_MISSIONS: 'Réseaux et serveurs', ENT_EFFECTIF: 13 }
    ],

    // Agents (UTILISATEUR)
    agents: [
        {
            UTI_MATRICULERH: 'AG001',
            UTI_CIVILITE: 'M.',
            UTI_NOM: 'Dupont',
            UTI_PRENOM: 'Jean',
            UTI_EMAIL: 'jean.dupont@vienne.fr',
            UTI_TELEPHONE: '05.49.88.10.01',
            UTI_FONCTION: 'Directeur Général',
            UTI_GRADE: 'Administrateur territorial',
            UTI_STATUT: 'Titulaire',
            UTI_PRESENTIEL: true,
            UTI_CODERH: 'DG',
            UTI_RESP: null,
            UTI_RESP_N2: null,
            UTI_GROUPES: ['Direction', 'Cadres'],
            UTI_STATUS: 'online'
        },
        {
            UTI_MATRICULERH: 'AG002',
            UTI_CIVILITE: 'Mme',
            UTI_NOM: 'Martin',
            UTI_PRENOM: 'Sophie',
            UTI_EMAIL: 'sophie.martin@vienne.fr',
            UTI_TELEPHONE: '05.49.88.10.02',
            UTI_FONCTION: 'Secrétaire Générale',
            UTI_GRADE: 'Attaché principal',
            UTI_STATUT: 'Titulaire',
            UTI_PRESENTIEL: true,
            UTI_CODERH: 'DGS',
            UTI_RESP: 'AG001',
            UTI_RESP_N2: null,
            UTI_GROUPES: ['Direction', 'Cadres'],
            UTI_STATUS: 'online'
        },
        {
            UTI_MATRICULERH: 'AG003',
            UTI_CIVILITE: 'M.',
            UTI_NOM: 'Bernard',
            UTI_PRENOM: 'Pierre',
            UTI_EMAIL: 'pierre.bernard@vienne.fr',
            UTI_TELEPHONE: '05.49.88.20.01',
            UTI_FONCTION: 'DRH',
            UTI_GRADE: 'Attaché principal',
            UTI_STATUT: 'Titulaire',
            UTI_PRESENTIEL: true,
            UTI_CODERH: 'DRH',
            UTI_RESP: 'AG001',
            UTI_RESP_N2: null,
            UTI_GROUPES: ['Direction', 'RH', 'Cadres'],
            UTI_STATUS: 'away'
        },
        {
            UTI_MATRICULERH: 'AG004',
            UTI_CIVILITE: 'Mme',
            UTI_NOM: 'Petit',
            UTI_PRENOM: 'Marie',
            UTI_EMAIL: 'marie.petit@vienne.fr',
            UTI_TELEPHONE: '05.49.88.20.05',
            UTI_FONCTION: 'Responsable Recrutement',
            UTI_GRADE: 'Attaché',
            UTI_STATUT: 'Titulaire',
            UTI_PRESENTIEL: true,
            UTI_CODERH: 'DRH_REC',
            UTI_RESP: 'AG003',
            UTI_RESP_N2: 'AG001',
            UTI_GROUPES: ['RH', 'Encadrement'],
            UTI_STATUS: 'online'
        },
        {
            UTI_MATRICULERH: 'AG005',
            UTI_CIVILITE: 'M.',
            UTI_NOM: 'Robert',
            UTI_PRENOM: 'Thomas',
            UTI_EMAIL: 'thomas.robert@vienne.fr',
            UTI_TELEPHONE: '05.49.88.20.08',
            UTI_FONCTION: 'Chargé de Formation',
            UTI_GRADE: 'Rédacteur',
            UTI_STATUT: 'Titulaire',
            UTI_PRESENTIEL: false,
            UTI_CODERH: 'DRH_FORM',
            UTI_RESP: 'AG003',
            UTI_RESP_N2: 'AG001',
            UTI_GROUPES: ['RH'],
            UTI_STATUS: 'offline'
        },
        {
            UTI_MATRICULERH: 'AG006',
            UTI_CIVILITE: 'Mme',
            UTI_NOM: 'Richard',
            UTI_PRENOM: 'Isabelle',
            UTI_EMAIL: 'isabelle.richard@vienne.fr',
            UTI_TELEPHONE: '05.49.88.30.01',
            UTI_FONCTION: 'Directrice Financière',
            UTI_GRADE: 'Administrateur territorial',
            UTI_STATUT: 'Titulaire',
            UTI_PRESENTIEL: true,
            UTI_CODERH: 'DF',
            UTI_RESP: 'AG001',
            UTI_RESP_N2: null,
            UTI_GROUPES: ['Direction', 'Finances', 'Cadres'],
            UTI_STATUS: 'online'
        },
        {
            UTI_MATRICULERH: 'AG007',
            UTI_CIVILITE: 'M.',
            UTI_NOM: 'Durand',
            UTI_PRENOM: 'Michel',
            UTI_EMAIL: 'michel.durand@vienne.fr',
            UTI_TELEPHONE: '05.49.88.30.05',
            UTI_FONCTION: 'Chef de Service Budget',
            UTI_GRADE: 'Attaché principal',
            UTI_STATUT: 'Titulaire',
            UTI_PRESENTIEL: true,
            UTI_CODERH: 'DF_BUDG',
            UTI_RESP: 'AG006',
            UTI_RESP_N2: 'AG001',
            UTI_GROUPES: ['Finances', 'Encadrement'],
            UTI_STATUS: 'online'
        },
        {
            UTI_MATRICULERH: 'AG008',
            UTI_CIVILITE: 'Mme',
            UTI_NOM: 'Leroy',
            UTI_PRENOM: 'Catherine',
            UTI_EMAIL: 'catherine.leroy@vienne.fr',
            UTI_TELEPHONE: '05.49.88.40.01',
            UTI_FONCTION: 'Directrice Action Sociale',
            UTI_GRADE: 'Administrateur territorial',
            UTI_STATUT: 'Titulaire',
            UTI_PRESENTIEL: true,
            UTI_CODERH: 'DAS',
            UTI_RESP: 'AG001',
            UTI_RESP_N2: null,
            UTI_GROUPES: ['Direction', 'Social', 'Cadres'],
            UTI_STATUS: 'away'
        },
        {
            UTI_MATRICULERH: 'AG009',
            UTI_CIVILITE: 'M.',
            UTI_NOM: 'Moreau',
            UTI_PRENOM: 'Laurent',
            UTI_EMAIL: 'laurent.moreau@vienne.fr',
            UTI_TELEPHONE: '05.49.88.50.01',
            UTI_FONCTION: 'Directeur des Routes',
            UTI_GRADE: 'Ingénieur en chef',
            UTI_STATUT: 'Titulaire',
            UTI_PRESENTIEL: true,
            UTI_CODERH: 'DRT',
            UTI_RESP: 'AG001',
            UTI_RESP_N2: null,
            UTI_GROUPES: ['Direction', 'Technique', 'Cadres'],
            UTI_STATUS: 'online'
        },
        {
            UTI_MATRICULERH: 'AG010',
            UTI_CIVILITE: 'Mme',
            UTI_NOM: 'Simon',
            UTI_PRENOM: 'Nathalie',
            UTI_EMAIL: 'nathalie.simon@vienne.fr',
            UTI_TELEPHONE: '05.49.88.60.01',
            UTI_FONCTION: 'Directrice Éducation',
            UTI_GRADE: 'Attaché principal',
            UTI_STATUT: 'Titulaire',
            UTI_PRESENTIEL: true,
            UTI_CODERH: 'DEJ',
            UTI_RESP: 'AG001',
            UTI_RESP_N2: null,
            UTI_GROUPES: ['Direction', 'Education', 'Cadres'],
            UTI_STATUS: 'online'
        },
        {
            UTI_MATRICULERH: 'AG011',
            UTI_CIVILITE: 'M.',
            UTI_NOM: 'Laurent',
            UTI_PRENOM: 'Stéphane',
            UTI_EMAIL: 'stephane.laurent@vienne.fr',
            UTI_TELEPHONE: '05.49.88.70.01',
            UTI_FONCTION: 'DSI',
            UTI_GRADE: 'Ingénieur territorial',
            UTI_STATUT: 'Titulaire',
            UTI_PRESENTIEL: true,
            UTI_CODERH: 'DSI',
            UTI_RESP: 'AG001',
            UTI_RESP_N2: null,
            UTI_GROUPES: ['Direction', 'Informatique', 'Cadres'],
            UTI_STATUS: 'online'
        },
        {
            UTI_MATRICULERH: 'AG012',
            UTI_CIVILITE: 'Mme',
            UTI_NOM: 'Dubois',
            UTI_PRENOM: 'Valérie',
            UTI_EMAIL: 'valerie.dubois@vienne.fr',
            UTI_TELEPHONE: '05.49.88.20.12',
            UTI_FONCTION: 'Gestionnaire Paie',
            UTI_GRADE: 'Rédacteur',
            UTI_STATUT: 'Titulaire',
            UTI_PRESENTIEL: true,
            UTI_CODERH: 'DRH_PAIE',
            UTI_RESP: 'AG003',
            UTI_RESP_N2: 'AG001',
            UTI_GROUPES: ['RH'],
            UTI_STATUS: 'online'
        }
    ]
};

// Export pour utilisation globale
window.appData = data;
