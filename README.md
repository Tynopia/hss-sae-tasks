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

Die entsprechenden SMTP- und API-Schlüssel sind über das `.env`-File konfigurierbar

Perfekt, danke für die Klarstellung! Hier ist der überarbeitete **CI/CD & Deployment**-Abschnitt, passend zum Stil deiner bisherigen README und **ohne den Inhalt der Dockerfiles oder `docker-compose.yml`**, sondern mit **klaren Verweisen und Erklärungen**:

## CI/CD & Deployment

Für die automatisierte Auslieferung der Anwendung nutzen wir eine GitHub Actions Pipeline in Kombination mit Docker und einem self-hosted Runner.

### Workflow-Ablauf

Bei jedem Push auf den `main`-Branch wird über den GitHub Actions Workflow (`.github/workflows/main.yml`) automatisch folgendes durchgeführt:

1. **Semantic Release:**
   Erstellt automatisch eine neue Version und GitHub Release, basierend auf den Commit-Messages (Conventional Commits).
2. **Docker Build:**

   * Baut das **Backend-Image** mit FastAPI und Prisma (siehe `./Dockerfile`)
   * Baut das **Frontend-Image** mit Next.js, Auth.js, Resend und Prisma Client (siehe `./site/Dockerfile`)
3. **Deployment (Self-Hosted Server):**

   * Bestehende Container werden gestoppt
   * Neue Images werden per `docker compose` hochgefahren (siehe `docker-compose.yml` im Serververzeichnis)
   * Alte Docker-Images werden automatisch entfernt, um Speicher zu sparen

### Docker-Setup

Das Projekt besteht aus zwei Docker-Images:

* **Backend-Image:**
  Enthält den FastAPI-Server und generiert automatisch die Python-Datenbankklassen aus dem Prisma-Schema.

* **Frontend-Image:**
  Erzeugt das optimierte Next.js-Frontend, inkl. E-Mail-Funktion über Resend und Authentifizierung via Auth.js.

Beide Images werden über GitHub Actions automatisch gebaut und bereitgestellt.

### Docker Compose Deployment

Auf dem Server wird `docker compose` verwendet, um die Anwendung im Produktionsbetrieb auszuführen.
Dabei:

* Wird eine **gemeinsame SQLite-Datenbank** im Docker Volume verwendet
* Werden alle **Geheimnisse und Umgebungsvariablen** über `environment` gesetzt
* Läuft der Backend-Container auf Port `8000`, der Frontend-Container auf Port `3000`

### Umgebung & Konfiguration

Im Compose-Setup werden u. a. folgende Dinge übergeben:

* **AUTH\_SECRET** & **AUTH\_RESEND\_KEY** für Auth.js + Resend
* **API\_URL**, **AUTH\_URL** & **DATABASE\_URL**
* **NODE\_ENV=production**

Die Werte dazu sind **nicht im Repository enthalten** – sondern liegen sicher im CI/CD-System oder im Server-Setup.