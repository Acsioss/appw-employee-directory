# Annuaire des Agents - Intranet

Application web d'annuaire des agents pour intranet d'entreprise, développée avec **Tabler UI** et **JavaScript vanilla**.

## 📋 Description

Cette application permet de consulter et rechercher des agents au sein d'une organisation. Elle offre plusieurs fonctionnalités :

- **Recherche globale** : Recherchez un agent, un site ou une entité
- **Navigation hiérarchique** : Arborescence des entités et sites
- **Carte interactive** : Visualisation géographique des lieux
- **Filtres avancés** : Filtrage par fonctions, groupes et localisations
- **Vue détaillée** : Fiche complète pour chaque agent
- **Mode responsive** : Interface adaptée aux mobiles et tablettes

## 🚀 Technologies utilisées

- **Frontend** :
  - HTML5 / CSS3 / JavaScript (ES6+)
  - [Tabler](https://tabler.io/) - Framework UI moderne
  - [jsTree](https://www.jstree.com/) - Navigation arborescente
  - [Leaflet](https://leafletjs.com/) - Cartes interactives
  - [Select2](https://select2.org/) - Composant de recherche
  - Bootstrap 5

## 📁 Structure du projet

```
appw-employee-directory/
├── annuaire-agents.html    # Page principale de l'application
├── index.php               # Point d'entrée PHP
├── css/
│   └── styles.css          # Styles personnalisés
├── js/
│   └── app.js              # Logique métier de l'application
├── data/
│   └── mock-data.js        # Données de test (mock)
└── README.md               # Documentation
```

## 🔧 Installation

1. Clonez le dépôt :
```bash
git clone <repository-url>
cd appw-employee-directory
```

2. Ouvrez simplement `annuaire-agents.html` dans votre navigateur, ou utilisez un serveur web local :

```bash
# Avec PHP
php -S localhost:8000

# Ou avec Python
python -m http.server 8000
```

3. Accédez à l'application via `http://localhost:8000`

## 💡 Fonctionnalités principales

### Recherche
- Barre de recherche globale avec autocomplétion
- Recherche multi-critères (nom, prénom, fonction, entité, site)

### Navigation
- Arbre hiérarchique des entités
- Liste des sites géographiques
- Navigation fluide entre les vues

### Carte
- Visualisation des lieux sur une carte interactive
- Marqueurs pour chaque site
- Informations contextuelles au survol

### Filtres
- Filtrage dynamique par fonction
- Filtrage par groupe de travail
- Filtrage par localisation

## 📝 Notes

- Les données sont actuellement simulées via `data/mock-data.js`
- Pour une utilisation en production, remplacez les données mock par une API réelle
- L'application est conçue pour fonctionner en environnement intranet

## 🤝 Contribution

Les contributions sont les bienvenues. N'hésitez pas à soumettre des issues ou des pull requests.

## 📄 Licence

Ce projet est propriété de l'organisation et destiné à un usage interne.

---

Développé avec ❤️ pour l'intranet d'entreprise
