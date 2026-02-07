# Documentation Technique - SkillSwap

Ce document présente l'architecture technique de la plateforme SkillSwap, incluant le modèle de données et les interactions entre les composants.

## 1. Schéma de la Base de Données (ERD)

Le schéma suivant illustre les relations entre les utilisateurs, les compétences, les échanges et les avis.

```mermaid
erDiagram
    User ||--o{ Skill : "possède"
    User ||--o{ Exchange : "enseigne"
    User ||--o{ Exchange : "apprend"
    Skill ||--o{ Exchange : "fait l'objet de"
    Skill ||--o{ Review : "reçoit"
    Exchange ||--o{ Review : "est noté par"

    User {
        int id PK
        string name
        string email UK
        string password
        string role
        int creditBalance
        datetime createdAt
    }

    Skill {
        int id PK
        string title
        string category
        string level
        text description
        int duration
        int credits
        int ownerId FK
    }

    Exchange {
        int id PK
        int teacherId FK
        int learnerId FK
        int skillId FK
        int duration
        int credits
        string status
    }

    Review {
        int id PK
        int exchangeId FK
        int skillId FK
        int rating
        string comment
    }
```

## 2. Diagramme de Classes

```mermaid
classDiagram
    class User {
        +int id
        +string name
        +string email
        +Role role
        +int creditBalance
        +register()
        +login()
    }

    class Skill {
        +int id
        +string title
        +string category
        +SkillLevel level
        +int credits
        +create()
        +update()
    }

    class Exchange {
        +int id
        +ExchangeStatus status
        +int credits
        +request()
        +accept()
        +complete()
    }

    User "1" --> "*" Skill : owns
    User "1" --> "*" Exchange : participates
    Skill "1" --> "*" Exchange : relates to
```

## 3. Diagramme de Séquence (Flux d'Échange)

Ce diagramme montre le processus typique où un apprenant demande une compétence.

```mermaid
sequenceDiagram
    participant Apprenant
    participant API
    participant DB
    participant Enseignant

    Apprenant->>API: POST /exchanges (Demande de compétence)
    API->>DB: Vérifier solde de crédits
    DB-->>API: Crédits suffisants
    API->>DB: Créer échange (Statut: PENDING)
    API-->>Apprenant: Demande envoyée

    Enseignant->>API: PATCH /exchanges/:id/status (ACCEPTED)
    API->>DB: Transférer crédits (Apprenant -> Enseignant)
    API->>DB: Mettre à jour statut (ACCEPTED)
    API-->>Enseignant: Succès
```
