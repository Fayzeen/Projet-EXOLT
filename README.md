# EXOLT - Bot Discord de Notification Email

[EN COURS] Bot Discord permettant de notifier les utilisateurs lors de la réception d'emails dans un salon prédéfini.

## Projet en Développement

Ceci est mon **premier projet** de ce type. N'ayant pas encore beaucoup d'expérience en développement, le code n'est pas parfait et certaines fonctionnalités ne sont pas encore implémentées. Le projet est encore en construction et évolue régulièrement.

## Description

EXOLT est un bot Discord qui se connecte à une boîte mail via IMAP et envoie des notifications dans un salon Discord spécifique lorsqu'un nouvel email est reçu.

### Fonctionnalités prévues

- ✅ Connexion IMAP à une boîte mail
- ✅ Intégration Discord
- ✅ Système d'authentification
- ⏳ Configuration du salon de notification par l'utilisateur directement sur le bot
- ⏳ Personnalisation des notifications directement sur le bot
- ⏳ Filtres d'emails directement sur le bot
- ⏳ Système de langage directement sur le bot
- ⏳ Gestion multi-utilisateurs 

## Technologies Utilisées

- **Node.js** avec TypeScript
- **Discord.js** - Interaction avec Discord
- **IMAP / ImapFlow** - Connexion aux serveurs email
- **MailParser** - Analyse des emails
- **Better Auth** - Système d'authentification
- **dotenv** - Gestion des variables d'environnement

## Configuration

Créez un fichier `.env` à la racine du projet avec les informations suivantes :
```env
DISCORD_TOKEN=votre_token_discord
IMAP_USER=votre_email
IMAP_PASSWORD=votre_mot_de_passe
IMAP_HOST=imap.votre-serveur.com
```

## Remerciements

Je tiens à remercier chaleureusement tous les développeurs qui m'ont aidé et guidé sur ce projet. Leur soutien et leurs conseils ont été précieux pour mon apprentissage et la réalisation de ce bot.


---

**Note** : Ce projet est un work-in-progress et certaines fonctionnalités peuvent ne pas être stables ou complètes.
**Mon discord** : thefayz (si vous souhaitez m'aider sur le projet) 
