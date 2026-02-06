/**
 * Seeder: Import des 20 entreprises PME/PMI du Burkina Faso
 * 
 * Ce script importe les données du JSON unifié dans Supabase
 * avec coordonnées GPS pour affichage sur la carte
 * 
 * ÉTAPE 1: Importer uniquement les entreprises dans pev_companies
 *          (les tables de déclarations seront créées plus tard si besoin)
 * 
 * Usage: node seed_companies.cjs
 * Date: 6 février 2026
 */

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://supabase.benga.live',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NTA1NTA0MDAsImV4cCI6MTkwODMxNjgwMH0._vzEGKcOeWa5pUsAxBDlgkui--m5itWX6B3ewlqQwY0'
);

// Coordonnées GPS des principales villes du Burkina Faso
const BURKINA_CITIES = {
  'Ouagadougou': { lat: 12.3714, lng: -1.5197 },
  'Bobo-Dioulasso': { lat: 11.1771, lng: -4.2979 },
  'Koudougou': { lat: 12.2500, lng: -2.3667 },
  'Ouahigouya': { lat: 13.5833, lng: -2.4167 },
  'Banfora': { lat: 10.6333, lng: -4.7667 },
  'Dédougou': { lat: 12.4667, lng: -3.4667 },
  'Kaya': { lat: 13.0833, lng: -1.0833 },
  'Tenkodogo': { lat: 11.7833, lng: -0.3667 },
  'Fada N\'Gourma': { lat: 12.0500, lng: 0.3500 },
  'Ziniaré': { lat: 12.5833, lng: -1.3000 },
  'Manga': { lat: 11.6667, lng: -1.0667 },
  'Gaoua': { lat: 10.3333, lng: -3.1667 },
  'Dori': { lat: 14.0333, lng: -0.0333 },
  'Léo': { lat: 11.1000, lng: -2.1000 },
  'Houndé': { lat: 11.5000, lng: -3.5167 }
};

// Fonction pour générer des coordonnées aléatoires autour d'une ville
function getRandomCoordinates(cityName) {
  const city = BURKINA_CITIES[cityName] || BURKINA_CITIES['Ouagadougou'];
  // Ajouter un petit offset aléatoire (±0.05 degrés = ~5km)
  const latOffset = (Math.random() - 0.5) * 0.1;
  const lngOffset = (Math.random() - 0.5) * 0.1;
  return {
    lat: city.lat + latOffset,
    lng: city.lng + lngOffset
  };
}

// Mapping des secteurs vers les secteurs existants dans pev_sectors
const SECTOR_MAPPING = {
  'agriculture': 'Agriculture et agroalimentaire',
  'renewable_energy': 'Énergies renouvelables',
  'waste_management': 'Gestion des déchets',
  'construction': 'Construction durable',
  'water': 'Eau et assainissement',
  'other': 'Autre'
};

// Les 20 entreprises du JSON unifié avec données complètes
const COMPANIES_DATA = [
  {
    id: 1,
    name: "Entreprise Vision d'Afrique (EVA)",
    main_activities: "Créé en 2014, l'entreprise EVA est dans la production de jus de fruits en saveurs variés du terroir. Elle a été accompagnée à un meilleur positionnement marketing de sa marque et possède aujourd'hui une politique RSE.",
    activities_summary: "Spécialisée dans la transformation de produits agroalimentaires et de produits forestiers non ligneux (PFNL)",
    sector: "agriculture",
    sdg_contributions: [1, 2, 8, 9, 12, 13],
    policies: ["RSE"],
    city: "Ouagadougou",
    hr_data: { employee_count: 14, cdi_ratio: 0.214, temporary_ratio: 0.786, local_purchases: 0.9 },
    emissions: { total: 1283, scope1: 12.78, scope2: 4.02, scope3: 1266.71 },
    waste: { solid: "15,29t/an", liquid: "773m3/an" }
  },
  {
    id: 2,
    name: "Rayon Bio",
    main_activities: "L'entreprise est dans le séchage et commercialisation de mangues. Elle a été accompagnée au verdissement des séchoirs d'une unité de séchage de mangues.",
    activities_summary: "Transformation agroalimentaire de mangues séchées",
    sector: "agriculture",
    sdg_contributions: [1, 2, 8, 9, 12, 13],
    policies: ["RSE"],
    city: "Bobo-Dioulasso",
    hr_data: { employee_count: 102, cdi_ratio: 0, temporary_ratio: 1, local_purchases: 1 },
    emissions: { total: 293.89, scope1: 2.27, scope2: 0, scope3: 291.62 },
    waste: { solid: "14,43t/an", liquid: "96m3/an" }
  },
  {
    id: 3,
    name: "Neebnooma",
    main_activities: "L'entreprise produit et transforme du riz local. Elle totalise 8 ans d'expérience dans ce domaine.",
    activities_summary: "Transformation et commercialisation une gamme variée de produits à base des riz national sous la marque AMIR.",
    sector: "agriculture",
    sdg_contributions: [1, 2, 8, 9, 12, 13],
    policies: ["RH", "RSE"],
    city: "Ouagadougou",
    hr_data: { employee_count: 33, cdi_ratio: 0.51, temporary_ratio: 0.49, local_purchases: 1 },
    emissions: { total: 1280.94, scope1: 8.92, scope2: 82.75, scope3: 1189.27 },
    waste: { solid: "362t/mois" }
  },
  {
    id: 4,
    name: "Burkina Green Energy-Electric SARL",
    main_activities: "Situé à Bobo-Dioulasso, spécialisé dans le secteur de l'énergie solaire et couvre tout le territoire burkinabè.",
    activities_summary: "Spécialisée dans les services électriques et énergétiques",
    sector: "renewable_energy",
    sdg_contributions: [1, 2, 7, 8, 9, 11, 12, 13],
    policies: ["RH", "RSE"],
    city: "Bobo-Dioulasso",
    hr_data: { employee_count: 8, cdi_ratio: 0.5, cdd_ratio: 0.5 },
    emissions: { total: 90.8, scope1: 10.11, scope2: 2.97, scope3: 77.71 },
    waste: { solid: "9kg/mois" }
  },
  {
    id: 5,
    name: "Réseau des producteurs de beurre de karité des hauts bassins et cascades (RPBHC)",
    main_activities: "Collecte et transformation des noix de karité",
    activities_summary: "Collecte et transformation les noix de karité en du beurre biologique",
    sector: "agriculture",
    sdg_contributions: [1, 5, 8, 12, 15],
    policies: ["RH", "RSE", "SST", "ENV", "QUALITE"],
    city: "Bobo-Dioulasso",
    hr_data: { employee_count: 21, cdi_ratio: 0.08, cdd_ratio: 0.92, temporary_count: 61, local_purchases: 1 },
    emissions: { total: 3339.44, scope1: 31.91, scope2: 21.48, scope3: 3286.07 },
    waste: { solid: "7,2kg/semaine", liquid: "630-1050m3/sem" }
  },
  {
    id: 6,
    name: "Agrisol-BF",
    main_activities: "Agrisol BF valorise des déchets organiques (excréments animaux) en intrants agricole.",
    activities_summary: "Transformation des matières organiques en intrants agricoles de qualité",
    sector: "agriculture",
    sdg_contributions: [1, 2, 12, 13, 15],
    policies: ["RH", "RSE"],
    city: "Ouagadougou",
    hr_data: { employee_count: 20, cdi_ratio: 0.35, cdd_ratio: 0.65, local_purchases: 1 },
    emissions: { total: 1830, scope1: 8.21, scope2: 1.23, scope3: 1825.09 },
    waste: { solid: "37,6t/an", valorization: "Valorisation des plastiques en briques" }
  },
  {
    id: 7,
    name: "TECO2",
    main_activities: "Créée en 2018, TECO² est une entreprise de valorisation des déchets plastiques dans la production des tables bancs.",
    activities_summary: "Spécialisée en gestion durable des déchets, notamment les déchets plastiques",
    sector: "waste_management",
    sdg_contributions: [1, 8, 9, 11, 12, 13],
    policies: ["RH", "SST", "RSE"],
    city: "Ouagadougou",
    hr_data: { employee_count: 21, cdd_ratio: 1, temporary_count: 76, local_purchases: 1 },
    emissions: { total: 275.81, scope1: 190.52, scope2: 9.26, scope3: 76.02 },
    waste: { valorization: "Entreprise de valorisation des déchets plastique" }
  },
  {
    id: 8,
    name: "Africa Energy Solar (AES)",
    main_activities: "Africa Energy Solaire est une entreprise de vulgarisation de l'énergie solaire créée en 2009.",
    activities_summary: "Active dans l'énergie solaire photovoltaïque pour l'électrification, le pompage solaire et la mobilité électrique",
    sector: "renewable_energy",
    sdg_contributions: [1, 2, 7, 8, 9, 11, 12, 13],
    policies: ["RH", "SST", "RSE", "HARCELEMENT", "GENRE", "ETHIQUE"],
    city: "Ouagadougou",
    hr_data: { employee_count: 30, cdi_ratio: 0.767, cdd_ratio: 0.167, solar_percentage: 85 },
    emissions: { total: 124.64, scope1: 2.14, scope2: 2.97, scope3: 119.52 },
    waste: { solid: "1022kg/an" }
  },
  {
    id: 9,
    name: "Rose Eclat",
    main_activities: "L'entreprise transforme les fruits et légumes en produits séchés, le produit principal est la mangue séchée.",
    activities_summary: "Transformation de fruits et légumes dont le cœur de métier est le séchage",
    sector: "agriculture",
    sdg_contributions: [1, 2, 5, 8, 9, 12, 17],
    policies: ["RH", "RSE", "QUALITE"],
    city: "Bobo-Dioulasso",
    hr_data: { employee_count: 200 },
    emissions: { total: 112763.28, scope1: 24333.86, scope2: 67.91, scope3: 88361.51 },
    waste: { solid: "876,634t/an", liquid: "1200m3/an", valorization: "Méthanisation" }
  },
  {
    id: 10,
    name: "POCERAM Group",
    main_activities: "Créée en 2008, Poceram Briquetterie produit des briques en terre cuite, des foyers améliorés et économes.",
    activities_summary: "Production de foyers améliorés et des briques en terre cuite/céramique",
    sector: "construction",
    sdg_contributions: [7, 8, 9, 11, 12, 13],
    policies: ["ANTI_FRAUDE", "ENV", "CONFIDENTIALITE", "RH", "RSE"],
    city: "Ouagadougou",
    hr_data: { employee_count: 22, local_purchases: 1 },
    emissions: { total: 369.01, scope1: 220.77, scope2: 37.09, scope3: 111.15 },
    waste: { solid: "6T/an", valorization: "Valorisation en boucle des déchets d'argile" }
  },
  {
    id: 11,
    name: "ZIBDON",
    main_activities: "Créée en 2019, Zibdon Ecoservices réalise des toilettes à compostage de type Biofil.",
    activities_summary: "Conception des toilettes écologiques à faible consommation d'eau grâce aux technologies BIOFIL et MICROFLASH",
    sector: "water",
    sdg_contributions: [3, 6, 8, 9, 11, 12, 13],
    policies: ["RH", "RSE"],
    city: "Ouagadougou",
    hr_data: { employee_count: 7, cdi_ratio: 0.286, cdd_ratio: 0.714, local_purchases: 1 },
    emissions: { total: 97.34, scope1: 5.26, scope2: 7.41, scope3: 84.67 },
    waste: { solid: "9,2kg/semaine" }
  },
  {
    id: 12,
    name: "BEOGO Néré",
    main_activities: "L'Union des Sociétés Coopératives Béogo Néeré transforme des amandes de Karité en beurre de Karité, savon et cosmétiques.",
    activities_summary: "Transformation et commercialisation du beurre de karité",
    sector: "agriculture",
    sdg_contributions: [1, 5, 8, 12, 15],
    policies: ["ANTI_CORRUPTION", "RSE"],
    city: "Koudougou",
    hr_data: { employee_count: 25, local_purchases: 1 },
    emissions: { total: 2519.94, scope1: 2171.24, scope2: 1.1, scope3: 347.6 },
    waste: { solid: "10t/5t de beurre produit", liquid: "96m3/5t produit", valorization: "Contrat pour la vente des eaux usées, tourteaux utilisés comme combustibles" }
  },
  {
    id: 13,
    name: "FARAFINA Engineering",
    main_activities: "Créée en 2017, Farafina Eco Engineering est dans la vulgarisation de l'énergie solaire et l'éco-conception.",
    activities_summary: "Spécialisée dans les solutions d'accès à l'énergie solaire et à l'eau autonome",
    sector: "renewable_energy",
    sdg_contributions: [1, 2, 7, 8, 9, 11, 12, 13],
    policies: ["RSE"],
    city: "Ouagadougou",
    hr_data: { cdi_ratio: 0.1, cdd_ratio: 0.64, contractor_count: 3 },
    waste: { solid: "25,9kg/mois", valorization: "Contractualisation avec des structures spécialisées" }
  },
  {
    id: 14,
    name: "Faso Attiéké",
    main_activities: "Totalisant 13 ans d'expérience, Faso Atieké transforme le manioc en atiéké, farine et autres.",
    activities_summary: "Transformation et commercialisation de produits traditionnels comme l'attiéké",
    sector: "agriculture",
    sdg_contributions: [1, 8, 9, 12, 13, 15, 17],
    policies: ["SST", "QUALITE", "RSE"],
    city: "Ouagadougou",
    hr_data: { employee_count: 73, cdi_ratio: 0.014, cdd_ratio: 0.984 },
    emissions: { total: 11621.82, scope1: 15.82, scope2: 38.13, scope3: 11567.87 },
    waste: { solid: "121,216t/an", liquid: "8000m3/an", valorization: "Méthanisation" }
  },
  {
    id: 15,
    name: "INNO FASO",
    main_activities: "Créée en 2011, l'activité principale est la production de solutions nutritionnelles contre la malnutrition.",
    activities_summary: "Produit des aliments nutritionnels pour lutter contre la malnutrition infantile",
    sector: "agriculture",
    sdg_contributions: [2, 3, 8, 9, 12, 17],
    policies: ["RH", "SST", "RSE", "QUALITE"],
    city: "Ouagadougou",
    hr_data: { employee_count: 112 },
    emissions: { total: 2866.65, scope1: 44, scope2: 467.92, scope3: 2354.73 },
    waste: { solid: "57,6t/an", liquid: "1680m3/an", valorization: "Transformation des déchets de production en nourriture pour bétail" }
  },
  {
    id: 16,
    name: "TELADO Building",
    main_activities: "Créée en 2021, Telado Global Building Bio valorise des déchets à travers la production de compost et l'installation de biodigesteurs.",
    activities_summary: "Intervient dans le domaine des énergies renouvelables, précisément dans le secteur du Biodigesteur",
    sector: "renewable_energy",
    sdg_contributions: [1, 2, 3, 7, 8, 9, 12, 13],
    policies: ["RSE"],
    city: "Ouagadougou",
    hr_data: { employee_count: 8, cdi_ratio: 0.375, cdd_ratio: 0.625, local_purchases: 1 },
    emissions: { total: 996.24, scope1: 334.09, scope2: 1.17, scope3: 660.98 },
    waste: { valorization: "Entreprise de méthanisation des déchets" }
  },
  {
    id: 17,
    name: "MOABLAOU",
    main_activities: "L'entreprise est dans la production et vente de la volaille, d'œufs, d'aliments pour volaille et de fiente.",
    activities_summary: "Spécialisée dans l'élevage, l'abattage, la transformation et la commercialisation de volailles",
    sector: "agriculture",
    sdg_contributions: [1, 2, 3, 8, 9, 12],
    policies: ["SST", "RSE", "RH"],
    city: "Ouagadougou",
    hr_data: { employee_count: 60, cdi_ratio: 0.98, cdd_ratio: 0.02, solar_percentage: 30 },
    emissions: { total: 778.07, scope1: 121.072, scope2: 388.46, scope3: 268.53 },
    waste: { solid: "22,605t/semaine" }
  },
  {
    id: 18,
    name: "3T SERVICES",
    main_activities: "Production d'engrais (compost, lixiviat) et fumure organique à base de déchets d'abattoir.",
    activities_summary: "Valorisation des déchets organiques d'abattoirs en fumure organique et engrais biologiques",
    sector: "waste_management",
    sdg_contributions: [1, 2, 12, 13, 15],
    policies: ["SST", "RSE"],
    city: "Ouagadougou",
    hr_data: { employee_count: 19, cdi_ratio: 0.263, temporary_count: 14, local_purchases: 1 },
    emissions: { total: 2982.76, scope1: 313.42, scope2: 2.9, scope3: 2666.44 },
    waste: { solid: "25,77t/an", liquid: "62,05m3/an" }
  },
  {
    id: 19,
    name: "Zi-Matériaux",
    main_activities: "Avec une expérience de 12 ans, Zi Matériaux produit des briques en terre compressée, pavés, parpaings.",
    activities_summary: "Production de Matériaux de construction locaux comme les briques en terre comprimée (BTC) et pavés",
    sector: "construction",
    sdg_contributions: [1, 3, 8, 9, 11, 12, 13],
    policies: ["SST", "RSE", "RH", "ENV"],
    city: "Ouagadougou",
    hr_data: { employee_count: 84, cdi_ratio: 0.167, cdd_ratio: 0.238, temporary_count: 60, local_purchases: 1 },
    emissions: { total: 80.83, scope1: 30.068, scope2: 12.74, scope3: 38.03 },
    waste: { valorization: "Réutilisation des déchets dans le processus de production" }
  },
  {
    id: 20,
    name: "Cajudium",
    main_activities: "Transforme et commercialise des sous-produits de l'anacarde: jus de cajou, vinaigre, amuse-bouches.",
    activities_summary: "Transformation de l'anacarde en produits alimentaires innovants: noix épicées, jus naturels, cocktails",
    sector: "agriculture",
    sdg_contributions: [1, 2, 5, 8, 9, 12],
    policies: ["RSE"],
    city: "Banfora",
    hr_data: { employee_count: 3, cdi_ratio: 1, temporary_count: 70, local_purchases: 1 },
    emissions: { total: 49.68, scope1: 0, scope2: 3, scope3: 46.68 },
    waste: { solid: "Pas de caractérisation" }
  }
];

// Génération d'un slug unique
function generateSlug(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100);
}

// Fonction principale - Import uniquement dans pev_companies
async function seedCompanies() {
  console.log('='.repeat(60));
  console.log('SEEDER: Import des 20 entreprises PME/PMI');
  console.log('='.repeat(60));

  // 1. Récupérer les secteurs existants
  console.log('\n1. Récupération des secteurs...');
  const { data: sectors } = await supabase.from('pev_sectors').select('id, name, slug');
  console.log(`   ✓ ${sectors?.length || 0} secteurs trouvés`);

  // 2. Importer les entreprises
  console.log('\n2. Import des entreprises dans pev_companies...');
  
  let successCount = 0;
  let errorCount = 0;

  for (const company of COMPANIES_DATA) {
    try {
      console.log(`\n   [${company.id}] ${company.name}`);
      
      // Trouver le secteur correspondant
      const sectorName = SECTOR_MAPPING[company.sector] || 'Autre';
      
      // Générer les coordonnées
      const coords = getRandomCoordinates(company.city);
      
      // Préparer les données STATIQUES de l'entreprise (pev_companies)
      const companyData = {
        // Infos de base
        name: company.name,
        slug: generateSlug(company.name),
        description: company.activities_summary,
        main_activities: company.main_activities,
        activities_summary: company.activities_summary,
        industry: sectorName,
        country: 'Burkina Faso',
        city: company.city,
        
        // Coordonnées GPS
        latitude: coords.lat,
        longitude: coords.lng,
        
        // Taille et statut
        employees: company.hr_data?.employee_count || null,
        size: (company.hr_data?.employee_count || 0) > 100 ? 'grande' : 
              (company.hr_data?.employee_count || 0) > 50 ? 'moyenne' : 
              (company.hr_data?.employee_count || 0) > 10 ? 'pme' : 'tpme',
        status: 'published',
        is_verified: true,
        
        // ODD et politiques (statiques)
        sdg_contributions: company.sdg_contributions || [],
        policies_list: company.policies || []
      };
      
      // Données ÉVOLUTIVES pour les déclarations périodiques
      const hrData = {
        employee_count: company.hr_data?.employee_count || null,
        cdi_ratio: company.hr_data?.cdi_ratio ? company.hr_data.cdi_ratio * 100 : null,
        cdd_ratio: company.hr_data?.cdd_ratio ? company.hr_data.cdd_ratio * 100 : null,
        temporary_ratio: company.hr_data?.temporary_ratio ? company.hr_data.temporary_ratio * 100 : null,
        temporary_count: company.hr_data?.temporary_count || null,
        contractor_count: company.hr_data?.contractor_count || null,
        local_purchases_ratio: company.hr_data?.local_purchases ? company.hr_data.local_purchases * 100 : null,
        solar_percentage: company.hr_data?.solar_percentage || null
      };
      
      const emissionsData = {
        total_emissions: company.emissions?.total || null,
        scope1_emissions: company.emissions?.scope1 || null,
        scope2_emissions: company.emissions?.scope2 || null,
        scope3_emissions: company.emissions?.scope3 || null,
        unit: 'tCO2e'
      };
      
      const wasteData = {
        solid_waste_raw: company.waste?.solid || null,
        liquid_waste_raw: company.waste?.liquid || null,
        valorization_initiatives: company.waste?.valorization || null
      };

      // Vérifier si l'entreprise existe déjà
      const { data: existing } = await supabase
        .from('pev_companies')
        .select('id')
        .eq('slug', companyData.slug)
        .single();

      let result;
      if (existing) {
        // Mise à jour
        const { data, error } = await supabase
          .from('pev_companies')
          .update(companyData)
          .eq('id', existing.id)
          .select()
          .single();
        result = { data, error, action: 'update' };
      } else {
        // Insertion
        const { data, error } = await supabase
          .from('pev_companies')
          .insert(companyData)
          .select()
          .single();
        result = { data, error, action: 'insert' };
      }

      if (result.error) {
        console.log(`      ✗ Erreur: ${result.error.message}`);
        errorCount++;
        continue;
      }

      const companyId = result.data.id;
      console.log(`      ✓ ${result.action === 'update' ? 'Mise à jour' : 'Création'}: ${companyId}`);
      console.log(`        Secteur: ${sectorName}`);
      console.log(`        Ville: ${company.city}`);
      console.log(`        Coordonnées: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
      
      // Créer une déclaration pour l'année 2025 (données du JSON)
      const { data: period2025 } = await supabase
        .from('pev_periods')
        .select('id')
        .eq('year', 2025)
        .single();
      
      if (period2025) {
        // Vérifier si une déclaration existe déjà
        const { data: existingDecl } = await supabase
          .from('pev_company_declarations')
          .select('id')
          .eq('company_id', companyId)
          .eq('period_id', period2025.id)
          .single();
        
        let declarationId;
        
        if (existingDecl) {
          declarationId = existingDecl.id;
          console.log(`        📋 Déclaration 2025 existante: ${declarationId}`);
        } else {
          // Créer la déclaration
          const { data: newDecl, error: declError } = await supabase
            .from('pev_company_declarations')
            .insert({
              company_id: companyId,
              period_id: period2025.id,
              source: 'ADMIN',
              status: 'VALIDATED'
            })
            .select()
            .single();
          
          if (declError) {
            console.log(`        ⚠️ Erreur déclaration: ${declError.message}`);
          } else {
            declarationId = newDecl.id;
            console.log(`        📋 Déclaration 2025 créée: ${declarationId}`);
          }
        }
        
        // Insérer les données RH, émissions, déchets
        if (declarationId) {
          // Données RH
          if (hrData.employee_count || hrData.cdi_ratio) {
            const { error: hrError } = await supabase
              .from('pev_company_declaration_hr')
              .upsert({ declaration_id: declarationId, ...hrData }, { onConflict: 'declaration_id' });
            if (!hrError) console.log(`        👥 Données RH: ${hrData.employee_count || 0} employés`);
          }
          
          // Données émissions
          if (emissionsData.total_emissions) {
            const { error: emError } = await supabase
              .from('pev_company_declaration_emissions')
              .upsert({ declaration_id: declarationId, ...emissionsData }, { onConflict: 'declaration_id' });
            if (!emError) console.log(`        🌍 Émissions: ${emissionsData.total_emissions} tCO2e`);
          }
          
          // Données déchets
          if (wasteData.solid_waste_raw || wasteData.valorization_initiatives) {
            const { error: wasteError } = await supabase
              .from('pev_company_declaration_waste')
              .upsert({ declaration_id: declarationId, ...wasteData }, { onConflict: 'declaration_id' });
            if (!wasteError) console.log(`        ♻️ Déchets: ${wasteData.solid_waste_raw || 'valorisation'}`);
          }
        }
      }

      successCount++;
    } catch (err) {
      console.log(`      ✗ Erreur: ${err.message}`);
      errorCount++;
    }
  }

  // Résumé
  console.log('\n' + '='.repeat(60));
  console.log('RÉSUMÉ');
  console.log('='.repeat(60));
  console.log(`✓ Entreprises importées: ${successCount}`);
  console.log(`✗ Erreurs: ${errorCount}`);
  
  // Vérifier le résultat
  const { count } = await supabase
    .from('pev_companies')
    .select('*', { count: 'exact', head: true });
  
  console.log(`\nTotal entreprises en BDD: ${count}`);
  
  // Afficher les entreprises avec coordonnées
  const { data: companies } = await supabase
    .from('pev_companies')
    .select('name, city, latitude, longitude, status')
    .order('name');
  
  console.log('\n📍 Entreprises avec coordonnées GPS:');
  companies?.forEach(c => {
    const hasCoords = c.latitude && c.longitude;
    console.log(`   ${hasCoords ? '✓' : '✗'} ${c.name} - ${c.city} [${c.status}]`);
  });
}

// Exécuter
seedCompanies().catch(console.error);
