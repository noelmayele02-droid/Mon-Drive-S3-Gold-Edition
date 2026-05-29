# ☁️ E-Z Drive S3 - Système de Gestion Cloud Privé (Premium OLED)

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
