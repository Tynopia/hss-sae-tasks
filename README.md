# HSS SAE Tasks – Projektübersicht

Beim Erstellen dieses Projekts lag unser Fokus auf einer modernen, benutzerfreundlichen Oberfläche sowie auf dem Einsatz aktueller Technologien wie Python mit FastAPI.

## Tech-Stack

| Name             | Beschreibung                                                                                                                                                | Ort                |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| **FastAPI**      | Moderne, asynchrone Web-Framework für Python. Nutzt Typannotationen zur Strukturierung von Routen und Services. Vergleichbar mit Spring Boot.               | Backend            |
| **Next.js**      | React-Framework mit Unterstützung für serverseitiges Rendering, statische Seitengenerierung und API-Routen – ideal für moderne Webanwendungen.              | Frontend           |
| **Tailwind CSS** | Dienstprogramm-basiertes CSS-Framework, das ein schnelles und flexibles Styling direkt über Klassen im HTML ermöglicht.                                     | Frontend           |
| **shadcn/ui**    | Open-Source-UI-Bibliothek mit sofort einsatzbereiten, stilvollen Komponenten auf Basis von Tailwind CSS ([https://ui.shadcn.com/](https://ui.shadcn.com/)). | Frontend           |
| **Prisma**       | ORM zur typsicheren Anbindung von relationalen Datenbanken wie PostgreSQL oder SQLite. Generiert native Typen für Frontend und Backend.                     | Frontend / Backend |
| **Auth.js**      | Authentifizierungs-Framework für Next.js mit Unterstützung für OAuth, Credentials und Token-basiertes Login.                                                | Frontend           |
| **Resend**       | E-Mail-Versand-Service, der für Transaktionsmails wie Registrierungsbestätigungen und Passwort-Resets genutzt wird.                                         | Frontend           |

---

## Lokale Installation

### Backend

1. Klonen Sie dieses GitHub-Repository lokal auf Ihren Laptop:

   ```bash
   git clone <REPO-URL>
   ```

2. Öffnen Sie das Projekt mit **PyCharm**.

3. Installieren Sie die Python-Abhängigkeiten:

   ```bash
   pip install --no-cache-dir -r requirements.txt
   ```

4. Generieren Sie die Python-Modelle aus dem Prisma-Schema:

   ```bash
   prisma generate --generator=python --schema=./site/prisma/schema-sqlite.prisma
   ```

   Dadurch wird eine SQLite-Datenbank unter `./site/prisma/data` erstellt sowie passende Python-Klassen für den Datenbankzugriff generiert.

   > **Tipp:** Öffnen Sie die SQLite-Datei mit **JetBrains DataGrip** oder **HeidiSQL** für eine visuelle Ansicht der Datenbank.

5. Starten Sie das Backend über PyCharm:

   * Wählen Sie oben rechts die Konfiguration **FastAPIProject**
   * Starten Sie das Projekt

### Frontend

1. Öffnen Sie den `site`-Ordner in **VS Code**
   (Alternativ PyCharm, jedoch nicht empfohlen für Frontend-Projekte)

2. Installieren Sie die Node.js-Abhängigkeiten:

   ```bash
   npm ci
   ```

3. Generieren Sie die Prisma-Clienttypen für das Frontend:

   ```bash
   npx prisma generate --generator=client
   ```

4. Erstellen Sie eine `.env`-Datei im `site`-Verzeichnis mit folgendem Inhalt:

   ```env
   AUTH_RESEND_KEY= # Schlüssel bitte per Direktnachricht bei mir anfragen (Microsoft Teams)
   AUTH_SECRET=z+5CIjLD2nFu1Qu7+qxwSu/b2WEMK294s8Z+FCJ5VTU=
   API_URL=http://localhost:8000
   DATABASE_URL=file:./data/dev.sqlite
   ```

5. Starten Sie den lokalen Entwicklungsserver:

   ```bash
   npm run dev
   ```

## Hinweise zur Authentifizierung und E-Mail-Versand

* **Auth.js** wird für die vollständige User-Authentifizierung verwendet (Login, Registrierung, Session-Handling).
* **Resend** übernimmt den Versand aller E-Mails, z. B. für:

  * Verifizierungsmails bei Registrierung
  * Zurücksetzen von Passwörtern
  * Systembenachrichtigungen

Die entsprechenden SMTP- und API-Schlüssel sind über das `.env`-File konfigurierbar.