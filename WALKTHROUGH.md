# 🏰 Les Terres Du Lions - Walkthrough Complet

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Rôle : Aventurier (Client)](#rôle--aventurier-client)
- [Rôle : Prestataire](#rôle--prestataire)
- [Rôle : Administrateur](#rôle--administrateur)
- [Fonctionnalités transversales](#fonctionnalités-transversales)
- [Architecture technique](#architecture-technique)

---

## Vue d'ensemble

**Les Terres Du Lions** est une application web de gestion de parc d'aventures médiéval. Elle permet aux visiteurs (Aventuriers) de découvrir des lieux, participer à des quêtes, réserver des événements et acheter des produits. Les Prestataires gèrent leurs établissements, produits et événements. Les Administrateurs supervisent l'ensemble de la plateforme.

### Concepts clés

- **Locations** : Lieux physiques dans le parc (restaurants, boutiques, attractions)
- **Quêtes** : Missions gamifiées liées à des locations, donnant XP et or
- **XP/Niveau/Or** : Système de progression pour les aventuriers
- **Événements** : Activités planifiées avec réservation et billeterie
- **Produits** : Articles vendus par les prestataires dans leurs boutiques
- **QR Codes** : Validation de quêtes et de commandes

### Rôles disponibles

1. **Aventurier** : Visiteur du parc (client)
2. **Prestataire** : Exploitant d'un ou plusieurs lieux
3. **Administrateur** : Gestionnaire de la plateforme

---

## Rôle : Aventurier (Client)

### Objectif du rôle

L'Aventurier découvre le parc, participe à des quêtes pour gagner de l'XP et de l'or, achète des produits, réserve des événements et progresse dans son aventure médiévale.

---

### Scénario principal : Parcours complet d'un Aventurier

#### 1. Inscription / Connexion

**Écran : Page d'accueil (`/`)**
- Affichage : Hero splash avec logo du royaume
- Actions possibles :
  - Cliquer sur "Commencer l'aventure" → redirection vers `/register`
  - Cliquer sur "Se connecter" (dans la navbar) → redirection vers `/login`
  - Explorer la carte (accessible sans connexion) → `/map`
  - Consulter les événements publics → `/events`

**Écran : Inscription (`/register`)**
- Formulaire d'inscription :
  - Prénom, Nom
  - Email, Mot de passe
  - Date de naissance (optionnel)
  - Téléphone (optionnel)
  - Choix d'un avatar (galerie prédéfinie ou upload)
  - Bio (optionnel)
- Actions :
  - Soumettre le formulaire → Création du compte avec rôle "aventurier"
  - Redirection automatique vers `/login` après succès
- Cas alternatifs :
  - Email déjà utilisé → Message d'erreur
  - Validation échouée → Messages d'erreur sur les champs

**Écran : Connexion (`/login`)**
- Formulaire de connexion :
  - Email
  - Mot de passe
- Actions :
  - Soumettre → Authentification JWT, stockage du token
  - Redirection vers la page d'accueil (`/`) si succès
- Cas alternatifs :
  - Identifiants incorrects → Message d'erreur
  - Compte non vérifié → Potentiel message d'avertissement

#### 2. Découverte de la carte et des locations

**Écran : Carte interactive (`/map`)**
- Affichage :
  - Carte du parc avec marqueurs pour chaque location
  - Filtres par type de location (restaurants, boutiques, attractions, etc.)
  - Recherche par nom
- Actions possibles :
  - Cliquer sur un marqueur → Popup avec détails de la location
    - Nom, description, icône
    - Bouton "Voir les événements" → `/location/{locationId}/events`
    - Bouton "Voir la boutique" (si produits disponibles) → `/boutique/{locationId}`
    - Bouton "Voir les quêtes" (si quêtes disponibles) → Affichage des quêtes dans la popup
  - Accepter une quête depuis la popup → Ajout à "Mes Quêtes"
  - Utiliser les filtres → Mise à jour dynamique de la carte
- Navigation :
  - Retour à l'accueil via navbar

#### 3. Participation aux quêtes

**Écran : Mes Quêtes (`/my-quests`)**
- Authentification requise
- Affichage en 3 sections :
  1. **Quêtes en cours** :
     - Carte de quête avec : titre, description, location, récompense XP
     - Actions :
       - "Scanner" → `/qr/scan` pour valider la quête
       - "Abandonner" → Dialogue de confirmation, suppression de la quête
  2. **Quêtes complétées** :
     - Historique des succès
     - Affichage de l'XP gagnée
  3. **Quêtes échouées** :
     - Historique des échecs (si implémenté)

**Écran : Scanner QR Code (`/qr/scan`)**
- Interface de scan via webcam ou upload d'image
- Actions :
  - Scanner un QR code de quête → Validation automatique
  - Gain d'XP et d'or → Mise à jour du profil
  - Notification de succès
  - Redirection vers `/my-quests` avec statut "complétée"
- Cas alternatifs :
  - QR code invalide → Message d'erreur
  - QR code déjà utilisé → Message d'erreur
  - Quête non acceptée → Erreur "Quête non trouvée"

#### 4. Consultation et réservation d'événements

**Écran : Liste globale des événements (`/events`)**
- Accessible sans connexion
- Affichage :
  - Grille de cartes d'événements
  - Chaque carte : titre, location, date/heure, description, prix
- Actions :
  - Cliquer sur un événement → `/events/{id}`

**Écran : Détails d'un événement (`/events/{id}`)**
- Affichage :
  - Informations complètes : titre, description, location, horaires
  - Prix, capacité totale, places restantes
  - Image/bannière (si disponible)
- Actions :
  - Si **non connecté** :
    - Bouton "Réserver" → Redirection vers `/login`
  - Si **connecté** :
    - Sélecteur de quantité (nombre de places)
    - Bouton "Réserver" → Création d'une réservation
      - Statut initial : PENDING
      - Calcul du prix total
      - Redirection vers `/my-reservations`
- Cas alternatifs :
  - Événement complet → Bouton "Réserver" désactivé
  - Quantité > places restantes → Message d'erreur

**Écran : Mes Réservations (`/my-reservations`)**
- Authentification requise
- Affichage :
  - Liste des réservations (passées et futures)
  - Pour chaque réservation : événement, date, quantité, prix total, statut
- Actions :
  - Annuler une réservation (si statut PENDING) → Confirmation puis mise à jour
  - Voir les détails de l'événement → Retour vers `/events/{id}`
- Statuts possibles :
  - PENDING : En attente (peut être annulée)
  - CONFIRMED : Confirmée (paiement validé)
  - CANCELLED : Annulée

#### 5. Achat de produits

**Écran : Liste des boutiques (`/boutique`)**
- Affichage :
  - Grille de cartes de locations (boutiques)
  - Pour chaque boutique : nom, description, image bannière, nombre de produits, nom du prestataire
- Actions :
  - Cliquer sur une boutique → `/boutique/{locationId}`

**Écran : Produits d'une boutique (`/boutique/{locationId}`)**
- Affichage :
  - En-tête avec nom de la boutique, description, prestataire
  - Barre de recherche et filtres
  - Grille de cartes produits
  - Chaque carte : image, nom, description, prix
- Actions :
  - Ajouter un produit au panier (bouton "+") → Mise à jour du panier (LignePanier)
  - Retour à la liste des boutiques (bouton "Retour")
- Cas alternatifs :
  - Stock épuisé → Bouton "Ajouter" désactivé
  - Non connecté → Redirection vers `/login` lors de l'ajout

**Écran : Panier (`/panier`)**
- Authentification requise
- Affichage :
  - Liste des produits ajoutés (LignePanier)
  - Pour chaque ligne : image, nom, quantité, prix unitaire, prix total
  - Prix total global
- Actions :
  - Modifier la quantité (+ / -)
  - Supprimer un produit du panier
  - Vider le panier (bouton)
  - "Passer commande" → `/checkout`
- Cas alternatifs :
  - Panier vide → Message "Votre panier est vide"

**Écran : Validation de commande (`/checkout`)**
- Authentification requise
- Affichage :
  - Récapitulatif de la commande
  - Formulaire de paiement (simulé ou intégration Stripe/PayPal)
- Actions :
  - Valider la commande → Création d'une Commande avec état "waiting"
  - Génération d'un QR code de commande → Redirection vers `/commandes`
- Cas alternatifs :
  - Erreur de paiement → Message d'erreur, retour au panier
  - Stock insuffisant → Erreur, mise à jour du panier

**Écran : Mes Commandes (`/commandes`)**
- Authentification requise
- Affichage :
  - Liste des commandes passées
  - Pour chaque commande : numéro, date, total, état
  - Détails des lignes de commande (produits, quantités)
  - QR code associé (pour retrait)
- États possibles :
  - **waiting** : En attente de paiement ou préparation
  - **payed** : Payée, en cours de préparation
  - **collected** : Retirée (QR code scanné par le prestataire)
- Actions :
  - Afficher le QR code pour retrait → Modal avec QR code
  - Voir les détails de chaque produit

#### 6. Gestion du profil

**Écran : Mon Profil (`/profile`)**
- Authentification requise
- Affichage :
  - Informations personnelles : nom, email, téléphone, date de naissance
  - Avatar (modifiable)
  - Statistiques : niveau, XP, or
  - Bio / présentation
- Actions :
  - Modifier les informations → Formulaire éditable
  - Changer l'avatar (galerie ou upload)
  - Sauvegarder les modifications
  - Se déconnecter (bouton dans navbar)
- Navigation :
  - Lien vers "Mes Quêtes"
  - Lien vers "Mes Réservations"
  - Lien vers "Mes Commandes"

---

### Scénarios secondaires

#### Scan d'un QR code sur le terrain

- Parcours :
  1. L'aventurier se rend sur une location physique
  2. Scan du QR code statique de la location (via `/qr/scan`)
  3. Affichage des quêtes disponibles pour cette location
  4. Acceptation d'une quête → Ajout à "Mes Quêtes"
  5. Validation immédiate ou ultérieure

#### Progression et niveaux

- L'aventurier gagne de l'XP en complétant des quêtes
- Lorsque l'XP atteint un seuil, le niveau augmente automatiquement
- Gain d'or en récompense de quêtes
- L'or peut être utilisé (fonctionnalité future : achats premium, avantages)

#### Consultation des événements par location

- Depuis la carte (`/map`), clic sur une location
- Bouton "Voir les événements" → `/location/{locationId}/events`
- Liste filtrée des événements pour cette location uniquement
- Même parcours de réservation que l'écran global

---

### Permissions et limites

**Accès autorisé** :
- Pages publiques : `/`, `/map`, `/events`, `/events/{id}`, `/boutique`, `/boutique/{locationId}`, `/qr/scan`
- Pages authentifiées : `/profile`, `/my-quests`, `/panier`, `/checkout`, `/commandes`, `/my-reservations`

**Restrictions** :
- Ne peut pas accéder aux pages `/admin/*` et `/prestataire/*`
- Ne peut pas créer ou gérer de locations, produits, événements ou quêtes
- Ne peut pas scanner les QR codes de commande (réservé aux prestataires)

**Limitations fonctionnelles** :
- Ne peut accepter qu'une seule fois la même quête
- Ne peut pas annuler une réservation confirmée (statut CONFIRMED)
- Ne peut pas modifier une commande après validation

---

## Rôle : Prestataire

### Objectif du rôle

Le Prestataire gère un ou plusieurs établissements (locations) dans le parc. Il crée et vend des produits, organise des événements, propose des quêtes et valide les commandes clients via QR code.

---

### Scénario principal : Parcours complet d'un Prestataire

#### 1. Inscription / Connexion

**Écran : Inscription (`/register`)**
- Identique à l'aventurier, mais avec :
  - Sélection du rôle "prestataire" lors de l'inscription
  - Choix du type de prestataire (id_prestataire_type) : restaurateur, commerçant, animateur, etc.
- Après inscription et connexion, redirection vers `/prestataire`

**Écran : Connexion (`/login`)**
- Identique, avec redirection automatique vers `/prestataire` après authentification

#### 2. Tableau de bord Prestataire

**Écran : Dashboard (`/prestataire`)**
- Authentification requise (rôle : prestataire)
- Affichage :
  - Statistiques principales :
    - Nombre de services gérés (actuellement statique : 3)
    - Nombre de locations gérées (actuellement statique : 2)
    - Revenus mensuels (actuellement statique : 1 250 €)
  - Cartes d'accès rapide :
    - "Mes Services" → (non implémenté)
    - "Mes Locations" → `/prestataire/locations`
    - "Revenus" → (non implémenté)
- Navigation :
  - Liens vers les sections de gestion (produits, quêtes, scan commandes, événements)

#### 3. Gestion des Locations

**Écran : Mes Locations (`/prestataire/locations`)**
- Authentification requise (rôle : prestataire)
- Affichage :
  - Liste des locations appartenant au prestataire
  - Pour chaque location : nom, type, description, capacité, statut (achetée/non achetée)
- Actions :
  - Voir les événements de cette location → `/prestataire/location/{locationId}/events`
  - Modifier une location (si implémenté) → Formulaire d'édition
  - Créer une nouvelle location (si autorisé par l'admin)
- Cas alternatifs :
  - Aucune location → Message "Vous n'avez pas encore de location"

#### 4. Gestion des Produits

**Écran : Mes Produits (`/prestataire/products`)**
- Authentification requise (rôle : prestataire)
- Affichage :
  - Liste des produits créés par le prestataire
  - Pour chaque produit : image, nom, description, prix, stock (par service/location)
- Actions :
  - **Créer un nouveau produit** :
    - Formulaire : nom, description, prix, image (upload ou URL)
    - Association à une location/service
    - Définition du stock initial
    - Validation → Ajout en base de données
  - **Modifier un produit** :
    - Formulaire pré-rempli
    - Mise à jour des informations
  - **Supprimer un produit** :
    - Confirmation → Suppression (si aucune commande en cours)
  - **Gérer le stock** :
    - Modification des quantités disponibles par location/service
- Cas alternatifs :
  - Stock épuisé → Indicateur visuel "Rupture de stock"
  - Produit dans une commande → Suppression bloquée ou avertissement

#### 5. Gestion des Quêtes

**Écran : Mes Quêtes (`/prestataire/quests`)**
- Authentification requise (rôle : prestataire)
- Affichage :
  - Liste des quêtes créées par le prestataire pour ses locations
  - Pour chaque quête : titre, description, location associée, récompense XP
- Actions :
  - **Créer une nouvelle quête** :
    - Formulaire : titre, description, XP reward
    - Sélection d'une location (parmi celles du prestataire)
    - Validation → Création de la quête
  - **Modifier une quête** :
    - Formulaire pré-rempli
    - Mise à jour des informations
  - **Supprimer une quête** :
    - Confirmation → Suppression (attention aux quêtes en cours)
  - **Voir les statistiques** (si implémenté) :
    - Nombre d'acceptations
    - Taux de complétion
- Cas alternatifs :
  - Aucune location → Impossible de créer une quête (message d'erreur)

#### 6. Gestion des Événements

**Écran : Gestionnaire d'événements pour une location (`/prestataire/location/{locationId}/events`)**
- Authentification requise (rôle : prestataire)
- Affichage :
  - Liste des événements pour cette location
  - Pour chaque événement : titre, description, date/heure début et fin, prix, capacité, places vendues
- Actions :
  - **Créer un nouvel événement** :
    - Formulaire : titre, description
    - Dates et heures (début, fin)
    - Prix, capacité maximale
    - Validation → Création de l'événement
  - **Modifier un événement** :
    - Formulaire pré-rempli
    - Mise à jour (avec restrictions si réservations existantes)
  - **Supprimer un événement** :
    - Confirmation → Suppression (si aucune réservation ou remboursement)
  - **Voir les réservations** :
    - Liste des clients ayant réservé
    - Quantités, statuts (PENDING, CONFIRMED, CANCELLED)
    - Option de confirmer/annuler manuellement
- Cas alternatifs :
  - Événement avec réservations → Modification/suppression restreinte
  - Capacité dépassée → Aucune nouvelle réservation possible

**Écran : Liste de tous mes événements (via Dashboard)**
- Accès via un lien global depuis `/prestataire`
- Vue consolidée de tous les événements sur toutes les locations du prestataire
- Actions similaires

#### 7. Validation des Commandes (Scan QR)

**Écran : Scanner les Commandes (`/prestataire/orders/scan`)**
- Authentification requise (rôle : prestataire)
- Interface :
  - Scanner QR code via webcam
  - Upload d'une image QR code
- Workflow :
  1. Le client présente son QR code de commande (généré après checkout)
  2. Le prestataire scanne le QR code
  3. Affichage des détails de la commande :
     - Numéro de commande
     - Client (nom, email)
     - Produits commandés (noms, quantités)
     - Total
     - Statut actuel
  4. Actions possibles :
     - **Valider le retrait** → Passage du statut à "collected"
     - **Refuser** → (si implémenté) annulation ou signalement
- Cas alternatifs :
  - QR code invalide → Message d'erreur
  - Commande déjà retirée (statut "collected") → Avertissement
  - Commande ne concernant pas ce prestataire → Erreur de permission
  - QR code expiré (si TTL implémenté) → Erreur

#### 8. Gestion du Profil Prestataire

**Écran : Mon Profil (intégré dans `/prestataire` avec onglet "profile")**
- Redirection depuis `/profile` si l'utilisateur est prestataire
- Affichage :
  - Informations personnelles (nom, email, téléphone, bio)
  - Présentation du prestataire (texte long, affiché sur la page boutique)
  - Type de prestataire
  - Avatar
- Actions :
  - Modifier les informations
  - Modifier la présentation (champ "presentation" dans User)
  - Sauvegarder
- Cas alternatifs :
  - Erreur de validation → Messages d'erreur

---

### Scénarios secondaires

#### Consultation des statistiques produits

- Accès depuis le dashboard ou la page produits
- Visualisation :
  - Produits les plus vendus
  - Chiffre d'affaires par produit
  - Évolution des ventes dans le temps
- (Si implémenté via `/admin/shop/stats` pour prestataires)

#### Gestion du stock en temps réel

- Après chaque commande validée (statut "collected"), le stock est décrémenté automatiquement
- Le prestataire peut manuellement ajuster le stock (page produits)
- Notifications si stock faible (si implémenté)

#### Réponse aux demandes clients

- (Non implémenté actuellement)
- Potentiellement : messagerie, commentaires sur produits, avis

---

### Permissions et limites

**Accès autorisé** :
- Pages prestataires : `/prestataire`, `/prestataire/products`, `/prestataire/locations`, `/prestataire/quests`, `/prestataire/orders/scan`, `/prestataire/location/{locationId}/events`
- Pages publiques : toutes (comme aventurier)
- Pages authentifiées générales : `/profile`, `/my-quests`, `/my-reservations`, `/panier`, `/checkout`, `/commandes` (en tant qu'utilisateur)

**Restrictions** :
- Ne peut pas accéder aux pages `/admin/*`
- Ne peut gérer que ses propres locations, produits, quêtes et événements
- Ne peut pas modifier les locations d'autres prestataires
- Ne peut pas voir les commandes globales (seulement celles de ses produits via scan)

**Limitations fonctionnelles** :
- Ne peut pas supprimer une location si des événements ou produits y sont liés
- Ne peut pas supprimer un produit s'il est dans une commande non terminée
- Ne peut pas annuler un événement avec réservations confirmées sans gestion de remboursement

---

## Rôle : Administrateur

### Objectif du rôle

L'Administrateur supervise l'ensemble de la plateforme : gestion des utilisateurs, locations, produits, événements, quêtes, et consultation des statistiques globales.

---

### Scénario principal : Parcours complet d'un Administrateur

#### 1. Connexion

**Écran : Connexion (`/login`)**
- Identique aux autres rôles
- Après connexion, redirection automatique vers `/admin`

#### 2. Tableau de bord Administrateur

**Écran : Dashboard Admin (`/admin`)**
- Authentification requise (rôle : admin)
- Affichage :
  - Cartes de navigation par domaine :
    - **Quêtes** : Gestion et statistiques
    - **Boutique** : Gestion produits et statistiques
    - **Locations** : Gestion des lieux
    - **Utilisateurs** : Gestion des comptes
  - Chaque carte mène vers :
    - `/admin/quests` (Gestion des Quêtes)
    - `/admin/quests/stats` (Statistiques Quêtes)
    - `/admin/products` (Gestion Boutique)
    - `/admin/shop/stats` (Statistiques Boutique)
    - `/admin/locations` (Gestion Locations)
    - `/admin/users` (Gestion Utilisateurs)
- Navigation :
  - Menu latéral ou navbar avec accès rapide aux sections
  - Lien vers profil admin
  - Déconnexion

#### 3. Gestion des Utilisateurs

**Écran : Gestion des Utilisateurs (`/admin/users`)**
- Authentification requise (rôle : admin)
- Affichage :
  - Tableau complet des utilisateurs :
    - ID, Prénom, Nom, Email, Rôle, Niveau, XP, Or, Vérifié, Date de création
  - Filtres par rôle (aventurier, prestataire, admin)
  - Recherche par nom ou email
  - Pagination
- Actions :
  - **Voir les détails** d'un utilisateur → Modal ou page dédiée
  - **Modifier un utilisateur** :
    - Formulaire d'édition : nom, email, rôle, niveau, XP, or, statut vérifié
    - Validation → Mise à jour
  - **Supprimer un utilisateur** :
    - Confirmation → Suppression (attention aux dépendances : commandes, réservations, quêtes)
  - **Créer un nouvel utilisateur** :
    - Formulaire complet
    - Définition du rôle et type de prestataire si applicable
  - **Promouvoir/Rétrograder** un utilisateur (changement de rôle)
- Cas alternatifs :
  - Suppression d'un prestataire avec locations → Avertissement ou blocage
  - Suppression d'un aventurier avec commandes en cours → Avertissement

#### 4. Gestion des Locations

**Écran : Gestion des Locations (`/admin/locations`)**
- Authentification requise (rôle : admin)
- Affichage :
  - Liste de toutes les locations du parc
  - Pour chaque location : nom, type, prestataire associé, capacité, statut (achetée/non achetée), position GPS
  - Filtres par type de location
  - Recherche par nom
- Actions :
  - **Créer une nouvelle location** :
    - Formulaire : nom, description, type (id_location_type)
    - Position GPS (latitude, longitude) via sélection sur carte
    - Icône et image bannière
    - Capacité maximale
    - Prix (si applicable pour achat par prestataire)
    - Code statique QR (optionnel)
    - Validation → Création
  - **Modifier une location** :
    - Formulaire pré-rempli
    - Changement de prestataire associé
    - Mise à jour des informations
  - **Supprimer une location** :
    - Confirmation → Suppression (si aucune dépendance : quêtes, événements, produits)
  - **Assigner à un prestataire** :
    - Sélection d'un prestataire existant
    - Mise à jour du champ `id_prestataire`
  - **Visualiser sur la carte** → Redirection vers `/map` avec focus sur la location
- Cas alternatifs :
  - Location avec quêtes/événements → Suppression bloquée ou cascade
  - Location sans prestataire → Affichage "Non assignée"

#### 5. Gestion des Produits (Boutique globale)

**Écran : Gestion Boutique (`/admin/products`)**
- Authentification requise (rôle : admin)
- Affichage :
  - Liste de tous les produits de tous les prestataires
  - Colonnes : image, nom, prestataire, prix, description, date de création
  - Filtres par prestataire
  - Recherche par nom
- Actions :
  - **Créer un produit** (au nom d'un prestataire) :
    - Sélection du prestataire (id_prestataire)
    - Formulaire : nom, description, prix, image
    - Validation → Création
  - **Modifier un produit** :
    - Formulaire pré-rempli
    - Changement de prestataire, prix, description
  - **Supprimer un produit** :
    - Confirmation → Suppression (attention aux commandes)
  - **Gérer le stock** :
    - Accès au stock par service/location
    - Modification des quantités
- Cas alternatifs :
  - Produit dans une commande → Suppression bloquée

#### 6. Gestion des Quêtes

**Écran : Gestion des Quêtes (`/admin/quests`)**
- Authentification requise (rôle : admin)
- Affichage :
  - Liste de toutes les quêtes de tous les prestataires/locations
  - Colonnes : titre, description, location, XP reward, date de création
  - Filtres par location
  - Recherche par titre
- Actions :
  - **Créer une nouvelle quête** :
    - Formulaire : titre, description, XP reward
    - Sélection d'une location (id_location)
    - Validation → Création
  - **Modifier une quête** :
    - Formulaire pré-rempli
    - Changement de location, XP, description
  - **Supprimer une quête** :
    - Confirmation → Suppression (attention aux quêtes en cours par des aventuriers)
  - **Voir les statistiques** → `/admin/quests/stats`
- Cas alternatifs :
  - Quête acceptée par des aventuriers → Avertissement lors de la modification/suppression

**Écran : Statistiques Quêtes (`/admin/quests/stats`)**
- Authentification requise (rôle : admin)
- Affichage :
  - Graphiques et tableaux :
    - Nombre total de quêtes créées
    - Nombre d'aventuriers ayant accepté des quêtes
    - Taux de complétion global
    - Quêtes les plus populaires
    - Répartition par location
    - Évolution dans le temps
- Actions :
  - Filtres par période, location, statut
  - Export des données (si implémenté)

#### 7. Gestion des Événements (Vue globale)

- L'admin peut voir et gérer tous les événements de toutes les locations
- Accès via les pages prestataires ou une vue admin dédiée (à créer si nécessaire)
- Actions :
  - Créer, modifier, supprimer des événements pour n'importe quelle location
  - Voir les réservations globales
  - Statistiques : nombre d'événements, taux de remplissage, revenus

#### 8. Consultation des Statistiques Boutique

**Écran : Statistiques Boutique (`/admin/shop/stats`)**
- Authentification requise (rôle : admin)
- Affichage :
  - Graphiques et tableaux :
    - Chiffre d'affaires global
    - Nombre de commandes (total, par statut)
    - Produits les plus vendus
    - Revenus par prestataire
    - Évolution des ventes dans le temps
    - Panier moyen
- Actions :
  - Filtres par période, prestataire, produit
  - Export des données

#### 9. Gestion du Profil Admin

**Écran : Mon Profil (`/profile`)**
- Identique aux autres rôles
- Affichage des informations personnelles de l'admin
- Modification possible (nom, email, mot de passe, avatar)

---

### Scénarios secondaires

#### Modération de contenu

- Vérification et validation des descriptions de produits, événements, quêtes
- Suppression de contenu inapproprié
- Bannissement d'utilisateurs (via modification du rôle ou suppression)

#### Ajout de types de locations et services

- Gestion des types de prestataires (`prestataire_types`)
- Gestion des types de locations (`location_type`)
- Gestion des types de services (`service_types`)
- (Via interface admin ou directement en base si non implémenté)

#### Export et reporting

- Export de données CSV/Excel pour analyse externe
- Génération de rapports mensuels (revenus, utilisateurs actifs, quêtes complétées)

#### Configuration globale de l'application

- Paramètres système (non implémenté actuellement)
- Gestion des traductions (i18n)
- Gestion des rôles et permissions (si évolution future)

---

### Permissions et limites

**Accès autorisé** :
- Toutes les pages de l'application
- Pages admin : `/admin`, `/admin/users`, `/admin/locations`, `/admin/products`, `/admin/quests`, `/admin/quests/stats`, `/admin/shop/stats`
- Pages prestataires et aventuriers (en lecture/test)

**Restrictions** :
- Aucune (l'admin a tous les droits)

**Limitations fonctionnelles** :
- Les suppressions en cascade peuvent provoquer des incohérences si mal gérées
- Attention à la suppression d'utilisateurs avec dépendances (commandes, réservations, quêtes)

---

## Fonctionnalités transversales

### Système d'authentification (JWT)

**Fonctionnement** :
- Inscription → Création utilisateur + hash du mot de passe (bcrypt)
- Connexion → Vérification email/mot de passe → Génération d'un token JWT
- Token stocké dans le localStorage (frontend)
- Envoi du token dans le header `Authorization: Bearer <token>` pour chaque requête authentifiée
- Middleware backend vérifie le token et extrait l'utilisateur

**Routes publiques** :
- `/`, `/map`, `/events`, `/events/{id}`, `/boutique`, `/boutique/{locationId}`, `/qr/scan`, `/login`, `/register`

**Routes protégées** :
- Toutes les routes nécessitant `meta: { requiresAuth: true }` dans le router
- Redirection automatique vers `/login` si non authentifié

**Routes par rôle** :
- Aventurier : accès aux pages client
- Prestataire : accès aux pages client + `/prestataire/*`
- Admin : accès à toutes les pages

### Système de QR Codes

**Types de QR codes** :
1. **QR code de location (statique)** :
   - Associé à chaque location (`static_code` dans Location)
   - Scanné par l'aventurier pour découvrir quêtes et infos
2. **QR code de quête (dynamique)** :
   - Généré lors de l'acceptation d'une quête (UserQuest)
   - Scanné pour valider la complétion (passage de "accepted" à "completed")
3. **QR code de commande (dynamique)** :
   - Généré après validation du checkout (QRSession)
   - Scanné par le prestataire pour valider le retrait (passage de "payed" à "collected")

**Workflow QR Sessions** :
- Création d'un QRSession avec :
  - `token` : UUID unique
  - `status` : PENDING
  - `data` : JSON contenant les informations (userId, orderId, items, etc.)
  - `created_by_id` : Utilisateur ayant généré le QR
- Scan → Récupération du QRSession via le token
- Validation → Mise à jour du status (SCANNED, USED)
- `scanned_by_id` : Utilisateur ayant scanné (si authentifié)

**Pages de scan** :
- `/qr/scan` : Scan général (quêtes, découverte)
- `/prestataire/orders/scan` : Scan des commandes (réservé prestataires)

**Page de génération** :
- `/qr/generate` : Interface pour générer un QR code (admin/prestataire)

### Système de progression (XP, Niveau, Or)

**✅ SYSTÈME FONCTIONNEL ET IMPLÉMENTÉ**

**Calcul de l'XP** :
- Chaque quête complétée donne un montant d'XP (`xp_reward`)
- L'XP est automatiquement ajoutée à l'utilisateur lors de la complétion
- Formule de niveau : `Niveau = floor(sqrt(XP / 50)) + 1`
- Le niveau est recalculé automatiquement après chaque gain d'XP

**Tableau de progression** :
- Niveau 1 : 0 XP
- Niveau 2 : 50 XP
- Niveau 3 : 200 XP
- Niveau 5 : 800 XP
- Niveau 10 : 4,050 XP
- Niveau 20 : 18,050 XP
- Niveau 50 : 122,500 XP

**Gain d'or** :
- Or automatiquement gagné en complétant des quêtes
- Formule : `Gold = floor(XP / 2)`
- Exemple : Quête de 50 XP donne 25 Gold
- Or stocké dans le profil utilisateur

**Affichage** :
- Barre de progression XP visible dans le profil
- Niveau affiché dans la navbar ou profil
- Or affiché avec icône de pièce d'or
- API `/api/v1/users/progression` pour récupérer les détails complets

**Documentation technique** : Voir `backend/docs/XP_SYSTEM.md` pour plus de détails

### Gestion du panier et commandes

**Workflow complet** :
1. Aventurier ajoute des produits au panier → Création/Mise à jour de `LignePanier`
2. Validation du panier → Page `/panier` avec récapitulatif
3. Passage commande → Page `/checkout` avec paiement simulé
4. Création d'une `Commande` avec statut "waiting"
5. Création des `LigneCommande` pour chaque produit
6. Génération d'un `QRSession` pour le retrait
7. Redirection vers `/commandes` avec affichage du QR code
8. Aventurier présente le QR code au prestataire
9. Prestataire scanne → Validation → Statut "collected"
10. Décrémentation du stock (si implémenté)

**États d'une commande** :
- **waiting** : En attente de paiement (ou préparation après paiement simulé)
- **payed** : Payée, en cours de préparation
- **collected** : Retirée, commande terminée

### Système d'événements et réservations

**Workflow complet** :
1. Prestataire crée un événement via `/prestataire/location/{locationId}/events`
2. Événement visible sur `/events` (liste globale) et `/location/{locationId}/events` (par location)
3. Aventurier consulte l'événement → `/events/{id}`
4. Aventurier réserve (quantité de places) → Création d'une `EventReservation` avec statut "PENDING"
5. Calcul du prix total (`quantity * event.price`)
6. Paiement (simulé ou réel) → Statut "CONFIRMED"
7. Places vendues incrémentées (`sold` dans Event)
8. Aventurier consulte ses réservations → `/my-reservations`
9. Annulation possible si statut "PENDING" → Statut "CANCELLED", places libérées

**Gestion de la capacité** :
- `capacity` : Nombre total de places
- `sold` : Nombre de places vendues
- Places restantes : `capacity - sold`
- Réservation bloquée si `sold >= capacity`

### Système de Blogs (Actualités / Lore)

**Fonctionnalité** (partiellement implémentée) :
- Chaque location peut avoir des articles de blog (`Blog`)
- Contenu riche (texte long, markdown possible)
- Peut être gratuit ou payant (`is_sellable`, `price`)
- Si payant, achat similaire à un produit (via commande ou système dédié)

**Utilisation potentielle** :
- Actualités du parc
- Lore et histoire des locations
- Guides pour les aventuriers
- Promotions et offres spéciales

### Internationalisation (i18n)

**Configuration** :
- Dossier `/frontend/src/locales` avec fichiers JSON par langue
- Clés de traduction utilisées dans tous les composants via `{{ t('key') }}`
- Changement de langue dynamique (sélecteur dans navbar)
- Langues supportées : français (par défaut), anglais, autres selon les fichiers JSON

**Gestion des traductions** :
- Chaque ajout de texte dans l'interface doit avoir sa clé i18n
- Traductions dans tous les fichiers `locales/*.json`

---

## Architecture technique

### Stack technologique

**Frontend** :
- **Framework** : Vue 3 (Composition API) + TypeScript
- **Routeur** : Vue Router (avec guards d'authentification)
- **State Management** : Pinia (stores : auth, event, cart, etc.)
- **UI** : Tailwind CSS (thème médiéval personnalisé)
- **i18n** : Vue I18n
- **Build** : Vite

**Backend** :
- **Framework** : NestJS (Node.js + TypeScript)
- **ORM** : Prisma
- **Base de données** : MySQL
- **Authentification** : JWT (JSON Web Tokens) avec bcrypt pour hash des mots de passe
- **API** : REST (documentation Swagger disponible via `/docs/swagger.yaml`)

**Infrastructure** :
- **Conteneurisation** : Docker (docker-compose.yml pour MySQL)
- **Monorepo** : Nx workspace (gestion backend + frontend)

### Structure du projet

```
SAE_Project_BUT2/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Contrôleurs REST
│   │   ├── services/        # Logique métier
│   │   ├── middleware/      # Auth, validation, etc.
│   │   ├── routes/          # Définition des routes
│   │   ├── seeds/           # Données de test
│   │   └── prisma.ts        # Client Prisma
│   ├── prisma/
│   │   ├── schema.prisma    # Schéma global (importe les sous-schémas)
│   │   ├── user.prisma      # Modèles User, Role, AvatarType
│   │   ├── quest.prisma     # Modèles Quest, UserQuest
│   │   ├── shop.prisma      # Modèles Product, Commande, Stock, etc.
│   │   ├── service.prisma   # Modèles Location, Service, Event, Blog
│   │   ├── prestataire.prisma # Modèle PrestataireType
│   │   └── qrcode.prisma    # Modèle QRSession
│   └── docs/
│       └── swagger.yaml     # Documentation API
├── frontend/
│   ├── src/
│   │   ├── views/           # Pages principales
│   │   ├── components/      # Composants réutilisables
│   │   ├── stores/          # Pinia stores
│   │   ├── services/        # Appels API
│   │   ├── router/          # Configuration du routeur
│   │   ├── locales/         # Fichiers de traduction i18n
│   │   ├── mocks/           # Données de test (pour mode mock)
│   │   └── utils/           # Utilitaires (ex: predefined markers)
│   └── public/
│       ├── images/          # Images (avatars, icônes, bannières)
│       └── maps/            # Cartes de fond
├── docker-compose.yml       # Configuration MySQL
├── README.md                # Instructions d'installation
└── WALKTHROUGH.md           # Ce document
```

### Modèle de données (résumé)

**Utilisateurs** :
- `User` : Informations utilisateur (nom, email, rôle, XP, niveau, or, avatar, etc.)
- `Role` : Enum (admin, aventurier, prestataire)
- `AvatarType` : Enum (gallery, upload)
- `PrestataireType` : Type de prestataire (restaurateur, commerçant, etc.)

**Locations et Services** :
- `Location` : Lieu dans le parc (nom, position GPS, capacité, prestataire, etc.)
- `LocationType` : Type de location (restaurant, boutique, attraction, etc.)
- `Service` : Service proposé par un prestataire dans une location
- `ServiceType` : Type de service

**Quêtes** :
- `Quest` : Quête (titre, description, XP reward, location)
- `UserQuest` : Relation entre utilisateur et quête (statut : accepted, completed, failed)
- `UserQuestStatus` : Enum (accepted, completed, failed)

**Boutique et Commandes** :
- `Product` : Produit vendu par un prestataire (nom, prix, description, image)
- `LignePanier` : Ligne de panier (produit, quantité, utilisateur)
- `Commande` : Commande (date, total, utilisateur, statut)
- `LigneCommande` : Ligne de commande (produit, quantité, prix)
- `Stock` : Stock d'un produit dans un service/location
- `EtatCommande` : Enum (waiting, payed, collected)

**Événements et Réservations** :
- `Event` : Événement (titre, description, dates, prix, capacité, location)
- `EventReservation` : Réservation d'un événement (utilisateur, quantité, prix total, statut)
- `ReservationStatus` : Enum (PENDING, CONFIRMED, CANCELLED)

**Blogs** :
- `Blog` : Article de blog (titre, contenu, location, prix si vendable)

**QR Codes** :
- `QRSession` : Session QR (token, statut, données JSON, créateur, scanneur)
- `QRCodeStatus` : Enum (PENDING, SCANNED, USED)

### API Routes principales (résumé)

**Authentification** :
- `POST /auth/register` : Inscription
- `POST /auth/login` : Connexion
- `GET /auth/me` : Infos utilisateur connecté
- `PUT /auth/profile` : Mise à jour profil

**Utilisateurs (Admin)** :
- `GET /users` : Liste des utilisateurs
- `GET /users/:id` : Détails d'un utilisateur
- `POST /users` : Créer un utilisateur
- `PUT /users/:id` : Modifier un utilisateur
- `DELETE /users/:id` : Supprimer un utilisateur

**Locations** :
- `GET /locations` : Liste des locations
- `GET /locations/:id` : Détails d'une location
- `POST /locations` : Créer une location (Admin/Prestataire)
- `PUT /locations/:id` : Modifier une location
- `DELETE /locations/:id` : Supprimer une location

**Produits** :
- `GET /products` : Liste des produits
- `GET /products/:id` : Détails d'un produit
- `POST /products` : Créer un produit (Prestataire)
- `PUT /products/:id` : Modifier un produit
- `DELETE /products/:id` : Supprimer un produit

**Panier et Commandes** :
- `GET /cart` : Panier de l'utilisateur connecté
- `POST /cart` : Ajouter au panier
- `PUT /cart/:productId` : Modifier quantité
- `DELETE /cart/:productId` : Retirer du panier
- `POST /orders` : Créer une commande
- `GET /orders` : Liste des commandes de l'utilisateur
- `GET /orders/:id` : Détails d'une commande
- `PUT /orders/:id/status` : Mettre à jour le statut (Prestataire)

**Quêtes** :
- `GET /quests` : Liste des quêtes
- `GET /quests/:id` : Détails d'une quête
- `POST /quests` : Créer une quête (Prestataire/Admin)
- `PUT /quests/:id` : Modifier une quête
- `DELETE /quests/:id` : Supprimer une quête
- `GET /user-quests` : Quêtes de l'utilisateur
- `POST /user-quests` : Accepter une quête
- `PUT /user-quests/:id/complete` : Compléter une quête
- `DELETE /user-quests/:id` : Abandonner une quête

**Événements** :
- `GET /events` : Liste des événements
- `GET /events/:id` : Détails d'un événement
- `POST /events` : Créer un événement (Prestataire)
- `PUT /events/:id` : Modifier un événement
- `DELETE /events/:id` : Supprimer un événement
- `POST /events/:id/reserve` : Réserver un événement
- `GET /reservations` : Réservations de l'utilisateur
- `PUT /reservations/:id/cancel` : Annuler une réservation

**QR Codes** :
- `POST /qr/generate` : Générer un QR code
- `POST /qr/scan` : Scanner un QR code
- `GET /qr/:token` : Récupérer une session QR

**Blogs** :
- `GET /blogs` : Liste des blogs
- `GET /blogs/:id` : Détails d'un blog
- `POST /blogs` : Créer un blog (Prestataire/Admin)
- `PUT /blogs/:id` : Modifier un blog
- `DELETE /blogs/:id` : Supprimer un blog

---

## Navigation complète (Carte des écrans)

```
/ (Accueil public)
  ├─ /register (Inscription)
  ├─ /login (Connexion)
  ├─ /map (Carte interactive)
  │   └─ Popup location → /boutique/{locationId} | /location/{locationId}/events
  ├─ /events (Liste événements globale)
  │   └─ /events/{id} (Détails événement)
  ├─ /boutique (Liste des boutiques)
  │   └─ /boutique/{locationId} (Produits d'une boutique)
  │       └─ /panier (Panier)
  │           └─ /checkout (Validation commande)
  │               └─ /commandes (Mes commandes)
  │                   └─ QR code pour retrait
  ├─ /location/{locationId}/events (Événements par location)
  └─ /qr/scan (Scan QR code public)

📍 Aventurier (connecté)
  ├─ /profile (Mon profil)
  ├─ /my-quests (Mes quêtes)
  │   └─ /qr/scan (Scanner pour valider quête)
  ├─ /my-reservations (Mes réservations d'événements)
  ├─ /panier (Panier)
  ├─ /checkout (Validation commande)
  └─ /commandes (Mes commandes)

🛠️ Prestataire (connecté)
  ├─ /prestataire (Dashboard prestataire)
  │   ├─ Tab: Profil → Formulaire profil intégré
  │   ├─ /prestataire/products (Gestion produits)
  │   ├─ /prestataire/locations (Mes locations)
  │   │   └─ /prestataire/location/{locationId}/events (Gestion événements)
  │   ├─ /prestataire/quests (Gestion quêtes)
  │   └─ /prestataire/orders/scan (Scanner commandes clients)
  └─ Accès aux pages Aventurier (en tant qu'utilisateur)

👑 Administrateur (connecté)
  ├─ /admin (Dashboard admin)
  │   ├─ /admin/users (Gestion utilisateurs)
  │   ├─ /admin/locations (Gestion locations)
  │   ├─ /admin/products (Gestion boutique globale)
  │   ├─ /admin/shop/stats (Statistiques boutique)
  │   ├─ /admin/quests (Gestion quêtes globales)
  │   └─ /admin/quests/stats (Statistiques quêtes)
  └─ Accès à toutes les pages (lecture/test)

🔧 Utilitaires
  ├─ /qr/generate (Génération QR codes)
  ├─ /qr/scan (Scan QR codes)
  └─ /editor-test (Page de test éditeur, dev uniquement)
```

---

## Cas d'usage avancés et flux complets

### Flux 1 : Aventurier participe à une quête complète

1. **Découverte** : L'aventurier visite `/map` et clique sur une location
2. **Quêtes disponibles** : Popup affiche les quêtes associées
3. **Acceptation** : Clic sur "Accepter la quête" → Ajout à `/my-quests` (statut: accepted)
4. **Réalisation** : L'aventurier se rend physiquement sur place
5. **Validation** : Scan du QR code via `/qr/scan` → Vérification du QRSession
6. **Récompense** : Statut passe à "completed", gain d'XP et or
7. **Progression** : Niveau augmente si seuil atteint, visible dans `/profile`

### Flux 2 : Prestataire organise un événement

1. **Accès** : Prestataire se connecte → `/prestataire`
2. **Navigation** : Clic sur "Mes Locations" → `/prestataire/locations`
3. **Sélection** : Clic sur "Voir les événements" d'une location → `/prestataire/location/{locationId}/events`
4. **Création** : Clic "Créer un événement" → Formulaire (titre, description, dates, prix, capacité)
5. **Validation** : Soumission → Événement créé, visible sur `/events`
6. **Réservations** : Les aventuriers réservent via `/events/{id}`
7. **Gestion** : Prestataire voit les réservations, peut confirmer/annuler

### Flux 3 : Aventurier achète un produit et le retire

1. **Découverte** : `/boutique` → Sélection d'une boutique → `/boutique/{locationId}`
2. **Ajout au panier** : Clic sur "+" sur plusieurs produits → Mise à jour LignePanier
3. **Consultation panier** : `/panier` → Vérification des quantités et prix
4. **Validation** : Clic "Passer commande" → `/checkout` → Paiement simulé
5. **Confirmation** : Commande créée (statut: waiting ou payed), QR code généré
6. **Consultation** : `/commandes` → Liste des commandes, QR code affiché
7. **Retrait** : Aventurier présente le QR code au prestataire
8. **Scan** : Prestataire via `/prestataire/orders/scan` → Validation
9. **Finalisation** : Statut → "collected", stock décrémenté

### Flux 4 : Admin supervise et corrige une anomalie

1. **Connexion** : Admin se connecte → `/admin`
2. **Problème signalé** : Un produit a un prix incorrect
3. **Navigation** : `/admin/products` → Recherche du produit
4. **Modification** : Clic "Modifier" → Correction du prix → Sauvegarde
5. **Vérification utilisateur** : `/admin/users` → Vérification du prestataire
6. **Notification** : (Si système de notification implémenté) Message au prestataire
7. **Statistiques** : Consultation `/admin/shop/stats` pour impact global

---

## Glossaire

- **Aventurier** : Utilisateur client, visiteur du parc
- **Prestataire** : Utilisateur exploitant une ou plusieurs locations
- **Admin** : Administrateur de la plateforme
- **Location** : Lieu physique dans le parc (restaurant, boutique, attraction)
- **Quête** : Mission gamifiée liée à une location, donnant XP et or
- **XP** : Points d'expérience, permettent de monter de niveau
- **Niveau** : Progression du joueur basée sur l'XP cumulée
- **Or** : Monnaie virtuelle (future utilisation : achats premium, boosts)
- **QR Code** : Code scannable pour valider quêtes ou commandes
- **QRSession** : Session générée lors de la création d'un QR code dynamique
- **Commande** : Achat de produits par un aventurier
- **LignePanier** : Produit temporaire dans le panier
- **LigneCommande** : Produit validé dans une commande finalisée
- **Événement** : Activité planifiée avec réservation et billeterie
- **Réservation** : Inscription à un événement avec achat de places
- **Boutique** : Interface de vente de produits (par location)
- **Stock** : Quantité disponible d'un produit dans un service/location
- **JWT** : JSON Web Token, utilisé pour l'authentification
- **i18n** : Internationalisation (gestion multilingue)

---

## Remarques et améliorations potentielles

### Fonctionnalités actuellement partielles ou à compléter

1. **Système de paiement** : Actuellement simulé, intégration Stripe/PayPal à prévoir
2. **Notifications** : Système de notifications push ou emails (quête complétée, réservation confirmée, etc.)
3. **Messagerie** : Communication entre aventuriers et prestataires
4. **Avis et commentaires** : Système de notation des produits, événements, locations
5. **Système d'amis / Guildes** : Fonctionnalité sociale (groupes d'aventuriers)
6. **Boutique d'or** : Utilisation de l'or pour achats premium (boosts, cosmétiques)
7. **Achievements / Badges** : Succès déblocables (ex : "10 quêtes complétées")
8. **Historique détaillé** : Logs d'actions (admin), historique de progression (aventurier)
9. **Système de remboursement** : Gestion automatisée des annulations d'événements/commandes
10. **Gestion avancée du stock** : Alertes stock faible, réapprovisionnement automatique
11. **Statistiques en temps réel** : Dashboards avec graphiques interactifs (Chart.js, D3.js)
12. **Export de données** : CSV, PDF pour les statistiques et rapports
13. **API publique** : Endpoints pour partenaires ou applications tierces
14. **Mode hors ligne** : PWA (Progressive Web App) avec synchronisation

### Cas limites et erreurs possibles

- **Double acceptation de quête** : Géré par clé composite (id_user, id_quest) dans UserQuest
- **Stock négatif** : Validation côté backend pour empêcher quantité > stock
- **Capacité événement dépassée** : Vérification `sold < capacity` avant réservation
- **QR code réutilisé** : Statut USED empêche la réutilisation
- **Suppression en cascade** : Attention aux dépendances (ex : supprimer location avec quêtes)
- **Token JWT expiré** : Middleware renvoie 401, frontend redirige vers `/login`
- **Changement de rôle** : Si un aventurier devient prestataire, ses quêtes/commandes restent valides

---

**Fin du Walkthrough Complet**

Ce document couvre l'intégralité des fonctionnalités, écrans, et flux de l'application **Les Terres Du Lions**. Il est destiné aux développeurs, contributeurs, et reviewers produit pour une compréhension exhaustive du système.

Pour toute question ou ajout, consulter le code source ou contacter l'équipe de développement.
