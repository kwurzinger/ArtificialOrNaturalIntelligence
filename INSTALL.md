# ArtificialOrNaturalIntelligence - Installation

## Native Release

### Voraussetzungen

- Webserver (Apache, nginx, etc.)
- PostgreSQL Datenbankserver
- Node.js (zusätzlich `npm` für `pm2`)

### Installation

Das aktuelle Release vom GitHub-Repository herunterladen und entpacken.

```bash
cd frontend/prod
cp -r . /usr/share/nginx/html/ # Beispiel für nginx
cd ../../
```

Dann den Webserver nginx und PostgreSQL-Server starten. Die vorgeschlagene Konfiguration in `.env.example` entspricht der Standardkonfiguration des PostgreSQL-Servers sowie von nginx.

Das Backend ausführen, mit `node` oder mit `pm2`.

```bash
cd backend
cp .env.example .env
node main.js

// alternativ mit pm2 statt node
npm install pm2
npx pm2 start main.js
```


## Lokale Docker Installation

Zunächst das Repository klonen und ins geklonte Verzeichnis wechseln. Benötigt `dockerd` bzw. Docker Desktop

Die `.env`-Datei aus der Vorlage im Wurzelverzeichnis erstellen

```bash
cd backend
cp .env.example .env
```

Zuletzt die Docker Container erstellen und ausführen.

``` bash
docker compose up -d
```

## Lokale Installation aus GitHub Repository

Zunächst das Repository klonen und öffnen. Danach ausgehend vom Project Root wie folgt
das Backend und das Frontend einrichten.

### Backend starten

In den Ordner wechseln und die .env Datei aus dem Template heraus erstellen
```bash
cd backend
cp .env.example .env
```

Bevor das eigentliche Backend gestartet wird muss unbedingt vorher
die PostgreSQL Datenbank bereit gestellt werden!
Dazu je nachdem entweder PostgreSQL installieren oder die Anmeldeinformationen für eine bereits vorhandene Instanz bereithalten. Unbedingt eine leere Datenbank anlegen, da über TypeORM die Tabellen automatisch angelegt werden, falls sie noch nicht vorhanden sind.

Damit das Backend auf die Datenbank zugreifen kann, müssen die entsprechenden Variablen in der .env Datei
angepasst werden (PG_HOST, PG_PORT, etc.).

```bash
npm install
npm run start
```

Das NestJS Backend startet per Default auf http://localhost:3000.
Die URL und einige andere Einstellungen können in der .env Datei angepasst.

### Frontend starten
```bash
cd frontend
npm install
npm run start
```

Der Angular Dev-Server läuft anschließend standardmäßig auf http://localhost:4200.
Die Anzahl der Levels und die Anzahl der Fragen pro Level können jederzeit in der Datei
"app-config.json" nach Wunsch umgestellt werden.

