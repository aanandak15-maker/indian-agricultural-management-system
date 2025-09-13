#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Translation mapping for French to English with Indian agricultural context
const translations = {
  // Basic terms
  'Bonjour': 'Hello',
  'Gérer': 'Manage',
  'Gestion': 'Management',
  'Suivi': 'Tracking',
  'Parcelle': 'Field',
  'Parcelles': 'Fields',
  'Culture': 'Crop',
  'Cultures': 'Crops',
  'Récolte': 'Harvest',
  'Récoltes': 'Harvests',
  'Inventaire': 'Inventory',
  'Finance': 'Finance',
  'Finances': 'Finance',
  'Statistique': 'Statistics',
  'Statistiques': 'Statistics',
  'Analyse': 'Analysis',
  'Analyses': 'Analytics',
  'Météo': 'Weather',
  'Alerte': 'Alert',
  'Alertes': 'Alerts',
  
  // Time terms
  "aujourd'hui": 'today',
  'demain': 'tomorrow',
  'semaine': 'week',
  'mois': 'month',
  'année': 'year',
  
  // Months
  'Janvier': 'January',
  'Février': 'February',
  'Fév': 'Feb',
  'Mars': 'March',
  'Avril': 'April',
  'Avr': 'Apr',
  'Mai': 'May',
  'Juin': 'June',
  'Juillet': 'July',
  'Juil': 'Jul',
  'Août': 'August',
  'Septembre': 'September',
  'Octobre': 'October',
  'Novembre': 'November',
  'Décembre': 'December',
  
  // Guadeloupe-specific to Indian crops
  'Canne à Sucre': 'Sugarcane',
  'Banane': 'Cotton',
  'Ananas': 'Rice',
  'Igname': 'Wheat',
  'Maïs': 'Maize',
  'Blé': 'Wheat',
  'Colza': 'Mustard',
  
  // Weather terms adapted for India
  'Cyclone': 'Monsoon',
  'Pluie': 'Rainfall',
  'Sécheresse': 'Drought',
  'Pluie intense': 'Heavy rainfall',
  'Fortes précipitations': 'Heavy precipitation',
  
  // Regional adaptations
  'Guadeloupe': 'India',
  'Guadeloupéen': 'Indian',
  'Basse-Terre': 'Maharashtra',
  'archipel': 'regions',
  
  // Agricultural terms
  'exploitation': 'farm',
  'agricole': 'agricultural',
  'agriculteur': 'farmer',
  'rendement': 'yield',
  'superficie': 'area',
  'hectare': 'hectare',
  'plantation': 'field',
  'irrigation': 'irrigation',
  'tracteur': 'tractor',
  'engrais': 'fertilizer',
  'semences': 'seeds',
  'plants': 'seedlings',
  
  // UI terms
  'Ajouter': 'Add',
  'Modifier': 'Edit',
  'Supprimer': 'Delete',
  'Enregistrer': 'Save',
  'Annuler': 'Cancel',
  'Fermer': 'Close',
  'Ouvrir': 'Open',
  'Rechercher': 'Search',
  'Filtrer': 'Filter',
  'Exporter': 'Export',
  'Importer': 'Import',
  'Télécharger': 'Download',
  'Charger': 'Upload',
  'Synchroniser': 'Sync',
  'Actualiser': 'Refresh',
  'Voir': 'View',
  'Afficher': 'Show',
  'Masquer': 'Hide',
  
  // Status terms
  'Actif': 'Active',
  'Inactif': 'Inactive',
  'En cours': 'In Progress',
  'Terminé': 'Completed',
  'Planifié': 'Planned',
  'Critique': 'Critical',
  'Élevé': 'High',
  'Haute': 'High',
  'Moyen': 'Medium',
  'Moyenne': 'Medium',
  'Faible': 'Low',
  'Bas': 'Low',
  
  // Financial terms
  'Revenu': 'Revenue',
  'Revenus': 'Revenue',
  'Dépense': 'Expense',
  'Dépenses': 'Expenses',
  'Bénéfice': 'Profit',
  'Rentabilité': 'Profitability',
  'Coût': 'Cost',
  'Prix': 'Price',
  'Vente': 'Sale',
  'Ventes': 'Sales',
  'Achat': 'Purchase',
  'Achats': 'Purchases',
  'Facture': 'Invoice',
  'Paiement': 'Payment',
  'Subvention': 'Subsidy',
  'Subventions': 'Subsidies',
  
  // Common phrases
  'Aperçu': 'Overview',
  'Tableau de bord': 'Dashboard',
  'Paramètres': 'Settings',
  'Rapports': 'Reports',
  'Données': 'Data',
  'Informations': 'Information',
  'Détails': 'Details',
  'Résumé': 'Summary',
  'Total': 'Total',
  'Moyenne': 'Average',
  'Minimum': 'Minimum',
  'Maximum': 'Maximum',
  'Croissance': 'Growth',
  'Tendance': 'Trend',
  'Performance': 'Performance',
  'Objectif': 'Target',
  'Résultat': 'Result',
  'Indicateur': 'Indicator',
  'Métrique': 'Metric',
  
  // Longer phrases and sentences
  'Voici un aperçu de votre exploitation agricole': "Here's an overview of your agricultural operations",
  'Gérez, surveillez et optimisez': 'Manage, monitor and optimize',
  'Visualisez et analysez les données': 'Visualize and analyze the data',
  'Suivez vos performances': 'Track your performance',
  'Optimisez la rentabilité': 'Optimize profitability',
  'Planifiez vos activités': 'Plan your activities',
  'Surveillez vos cultures': 'Monitor your crops',
  'Gérez votre inventaire': 'Manage your inventory',
  'Analysez vos finances': 'Analyze your finances',
  'Suivez la météo': 'Track weather conditions',
  'Recevez des alertes': 'Receive alerts',
  
  // Error and success messages
  'Erreur': 'Error',
  'Succès': 'Success',
  'Attention': 'Warning',
  'Information': 'Information',
  'Chargement': 'Loading',
  'Aucune donnée': 'No data',
  'Données non disponibles': 'Data not available',
  'Opération réussie': 'Operation successful',
  'Opération échouée': 'Operation failed',
  'Veuillez patienter': 'Please wait',
  'Connexion en cours': 'Connecting',
  'Synchronisation en cours': 'Syncing',
  'Sauvegarde en cours': 'Saving',
  'Chargement en cours': 'Loading',
  
  // Form labels
  'Nom': 'Name',
  'Description': 'Description',
  'Type': 'Type',
  'Catégorie': 'Category',
  'Date': 'Date',
  'Heure': 'Time',
  'Quantité': 'Quantity',
  'Unité': 'Unit',
  'Valeur': 'Value',
  'Montant': 'Amount',
  'Statut': 'Status',
  'Priorité': 'Priority',
  'Commentaire': 'Comment',
  'Notes': 'Notes',
  'Remarques': 'Remarks',
  'Observations': 'Observations',
  
  // Navigation
  'Accueil': 'Home',
  'Tableau de bord': 'Dashboard',
  'Retour': 'Back',
  'Suivant': 'Next',
  'Précédent': 'Previous',
  'Première page': 'First page',
  'Dernière page': 'Last page',
  'Page': 'Page',
  'de': 'of',
  'sur': 'of',
  'Aller à': 'Go to',
  'Menu': 'Menu',
  'Navigation': 'Navigation',
  
  // Units and measurements
  'hectares': 'hectares',
  'ha': 'ha',
  'tonnes': 'tonnes',
  't': 't',
  'kg': 'kg',
  'grammes': 'grams',
  'g': 'g',
  'litres': 'liters',
  'l': 'l',
  'mètres': 'meters',
  'm': 'm',
  'centimètres': 'centimeters',
  'cm': 'cm',
  'kilomètres': 'kilometers',
  'km': 'km',
  'pourcentage': 'percentage',
  '%': '%',
  'degrés': 'degrees',
  '°C': '°C',
  'mm': 'mm',
  'millimètres': 'millimeters'
};

function translateText(text) {
  let translatedText = text;
  
  // Sort translations by length (longest first) to avoid partial replacements
  const sortedTranslations = Object.entries(translations)
    .sort((a, b) => b[0].length - a[0].length);
  
  for (const [french, english] of sortedTranslations) {
    // Use word boundaries for more precise matching
    const regex = new RegExp(`\\b${french.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
    translatedText = translatedText.replace(regex, english);
  }
  
  return translatedText;
}

function translateFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const translatedContent = translateText(content);
    
    if (content !== translatedContent) {
      fs.writeFileSync(filePath, translatedContent, 'utf8');
      console.log(`✅ Translated: ${filePath}`);
      return true;
    } else {
      console.log(`⚪ No changes needed: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function findTsxFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        traverse(fullPath);
      } else if (stat.isFile() && (item.endsWith('.tsx') || item.endsWith('.ts'))) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

// Main execution
const srcDir = path.join(__dirname, 'src');
const files = findTsxFiles(srcDir);

console.log(`🔍 Found ${files.length} TypeScript files to process...`);

let translatedCount = 0;
for (const file of files) {
  if (translateFile(file)) {
    translatedCount++;
  }
}

console.log(`\n📊 Translation Summary:`);
console.log(`   Total files processed: ${files.length}`);
console.log(`   Files translated: ${translatedCount}`);
console.log(`   Files unchanged: ${files.length - translatedCount}`);
