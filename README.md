# ☁️ Mon Drive S3 — Gold Edition - Système de Gestion Cloud Privé (Premium OLED)

Application web moderne, robuste et 100% responsive permettant de piloter un espace de stockage cloud Amazon Web Services (AWS) S3 à la manière d'un Google Drive ou d'un Dropbox personnel, enveloppée dans une interface haut de gamme **OLED Black & Gold**.

## 🎛️ Architecture Technique & Frameworks

Le projet est construit sur une architecture découplée (Monorepo) afin de séparer proprement la logique métier de l'interface utilisateur :
- **Back-end :** NestJS (Framework Node.js progressif en TypeScript) couplé avec le SDK officiel `@aws-sdk/client-s3` (v3).
- **Front-end :** Vue.js 3 (Composition API) configuré avec Vite pour des performances optimales.
- **Design & Responsive :** Design immersif Premium (OLED Black & Gold) entièrement adaptatif (Mobile, Tablette, Desktop).
- **Conteneurisation :** Docker & Docker Compose pour un déploiement et une isolation complète des environnements en une seule commande.

## 🔒 Politique de Sécurité & Architecture Stateless

Conformément aux normes d'architecture cloud et de sécurité les plus strictes, **aucune clé d'authentification AWS, identifiant ou donnée sensible n'est stockée sur le serveur back-end ou dans un fichier de configuration persistant**.

- **Architecture Stateless :** Les identifiants AWS S3 (`Access Key ID`, `Secret Access Key`, `Region`, `Bucket Name`) sont saisis de manière sécurisée par l'utilisateur directement sur l'interface et transmis à chaque requête HTTP via des en-têtes sécurisés (`headers`) ou via les paramètres d'URL (`query params`) pour les flux de téléchargement.
- Un fichier de sécurité globale `.gitignore` bloque toute tentative d'envoi accidentel de configurations ou de dépendances locales (`node_modules`).

---

## 🚀 Lancement Rapide avec Docker (Recommandé)

Grâce à la dockerisation complète de l'architecture, il n'est pas nécessaire d'installer Node.js ou des gestionnaires de paquets sur votre machine hôte.

### 1. Prérequis
Assurez-vous que **Docker** et **Docker Compose** sont installés et démarrés sur votre système.

### 2. Construction et Démarrage
Exécutez la commande d'orchestration suivante à la racine du projet :

```bash
docker-compose up --build

```

**Ce qui va se passer automatiquement :**

* Docker va isoler et compiler le serveur d'API NestJS (disponible sur `http://localhost:3000`).
* Docker va compiler les assets de production de Vue.js et configurer un serveur web **Nginx** hautement performant pour distribuer le Front-end.
* L'application web responsive complète devient accessible sur votre navigateur à l'adresse suivante : **`http://localhost`** (Port HTTP standard 80).

---

## 🛠️ Développement Local (Sans Docker)

Si vous préférez exécuter les frameworks de manière native sur votre machine :

### Lancement du Back-end (NestJS)

```bash
cd backend
npm install
npm run start:dev

```

L'API écoutera sur le port `http://localhost:3000`.

### Lancement du Front-end (Vue.js 3 / Vite)

```bash
cd frontend
npm install
npm run dev

```

L'interface de développement sera accessible sur `http://localhost:5173`.

---

## 📦 Fonctionnalités & Bonnes Pratiques Implémentées (Critères d'Évaluation)

* **Gestion Dynamique des Accès (Stateless) :** Formulaire de configuration à la volée permettant de basculer instantanément d'un Bucket S3 à un autre sans redémarrage du serveur.
* **Liste Synchronisée :** Lecture en temps réel des objets présents sur le Bucket S3 avec affichage des métadonnées (Nom, taille, etc.).
* **Validation Stricte des Fichiers (Pipes NestJS) :** Intégration d'un `ParseFilePipe` avec un `MaxFileSizeValidator` sur la route d'upload. Les fichiers sont limités à **10 Mo maximum** pour éviter les attaques par déni de service (DoS) et la saturation de la mémoire tampon du serveur.
* **Téléversement Direct (Upload) :** Prise en charge des fichiers via un intercepteur de requêtes multipart (`Multer`) pour un transfert vers S3 sans stockage temporaire sur le disque dur du serveur.
* **Téléchargement Sécurisé (Download Stream) :** Pipeline de flux binaire (`Stream`) depuis AWS pour forcer le téléchargement local des fichiers depuis l'interface client tout en préservant le `Content-Type` d'origine.
* **Suppression (Delete) :** Nettoyage définitif et instantané des objets ciblés sur l'infrastructure cloud S3.
* **Gestion Globale des Erreurs (Exception Filters) :** Capture complète des exceptions du SDK AWS (Ex: clés invalides, Bucket inexistant). L'API renvoie un code d'erreur HTTP standardisé (`400 Bad Request`, `401 Unauthorized`) intercepté par l'interface utilisateur pour un affichage propre via des notifications (Toasts).
* **Contrôle Strict du CORS :** Configuration du serveur NestJS pour autoriser explicitement les en-têtes personnalisés indispensables (`x-aws-key`, `x-aws-secret`, etc.) initiés par le Front-end local.

```
