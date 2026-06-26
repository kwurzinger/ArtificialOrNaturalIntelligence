# ArtificialOrNaturalIntelligence - Installation

## Installationen in einer Produktivumgebung

### Native Installation

#### Voraussetzungen

- Webserver (Apache, nginx, etc.)
- PostgreSQL Datenbankserver
- Node.js (zusätzlich `npm` für die Verwendung von `pm2` empfohlen)

#### Installation

Das aktuelle Release vom GitHub-Repository herunterladen und entpacken.
Danach im Ordner Frontend den Ordner prod ins öffentliche Verzeichnis des Webservers kopieren.
Die Anzahl der Levels und die Anzahl der Fragen pro Level können jederzeit bei Bedarf in der Datei
"app-config.json" nach Wunsch umgestellt werden. Die Einstellung "backendURL" ist verpflichtend, da ansonsten das Frontend
nicht mit dem Backend kommunizieren kann.

```bash
cd frontend/prod
cp -r frontend/prod /usr/share/nginx/html/ # Beispiel für Nginx, je nach Webserver muss der Zielpfad entsprechend angepasst werden
```

Danach muss der Webserver so konfiguriert werden, dass der SPA Redirect von /admin auf die Angular App funktioniert (für den Adminbereich).
Ansonsten kommt ein HTTP 404 Not Found Error, da der Webserver logischerweise kein Verzeichnis "admin" finden wird.

Dazu anhand der beiliegenden Sample Konfiguration nginx.sample.conf den Nginx Server entsprechend konfigurieren.

Falls Apache als Webserver verwendet wird, dann muss "Allow Override All" erlaubt sein und folgende Module müssen geladen werden:

```bash
LoadModule rewrite_module modules/mod_rewrite.so
LoadModule headers_module modules/mod_headers.so
```

Dies bewirkt, dass die beiligende .htaccess Konfiguration funktioniert, wo das Redirect bereits korrekt definiert ist.

Dann den Webserver und den PostgreSQL-Server starten. Die vorgeschlagene Konfiguration in `.env.example` entspricht der Standardkonfiguration des PostgreSQL-Servers sowie von Backend und Frontend.

Es muss als Vorbereitung zwingend eine leere Datenbank in postgresql angelegt werden (Der Name wird in der env Konfiguration eingetragen)!!!

Das Backend ausführen, mit `node` oder mit `pm2`.

```bash
cd backend
cp .env.example .env
node main.js

# optional mit pm2 statt node (empfohlen, da man über `pm2 monit` eine gute Übersicht über node.js Services bekommt)
npm install pm2
pm2 start main.js
```

### Containerisierte Installation für Komodo, Portainer oder ähnliches

Möchte man die Produktivinstallation containerisiert machen, gibt es neben dem Release unter Packages 2 Container Images (unter Packages),
welche über die Github Registry öffentlich erreichbar sind und gepullt werden können für beliebige Deployments (z.B. wenn man ein Deployment in einem Kubernetes Cluster vornehmen möchte, alles ist möglich)

Für eine Docker Compose basierte Installation (z.B. unter Verwendung von Komodo/Portainer) gibt es eine vorbereitete Vorlage namens (docker-compose.yml.prod), welche im Komodo/Portainer beim Erstellen eines Stacks reinkopiert werden kann. Zusätzlich müssen dann noch die ENV Variablen aus der .env.example Datei reinkopiert werden.

## Lokale Installationen aus dem Github Repository

### Lokale Installation nativ

Zunächst das Repository klonen und öffnen. Danach ausgehend vom Project Root wie folgt
das Backend und das Frontend einrichten.

#### Backend starten

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

#### Frontend starten

```bash
cd frontend
npm install
npm run start
```

Der Angular Dev-Server läuft anschließend standardmäßig auf http://localhost:4200.
Die Anzahl der Levels und die Anzahl der Fragen pro Level können jederzeit in der Datei
"app-config.json" nach Wunsch umgestellt werden.

### Lokale Installation mit Docker Compose (geht auch mit Podman, im folgenden konzentriert sich diese Anleitung aber auf Docker)

Das Repository klonen und ins geklonte Verzeichnis wechseln. Benötigt `dockerd` bzw. Docker Desktop

Die `.env`-Datei aus der Vorlage im Wurzelverzeichnis erstellen und bei Bedarf anpassen

```bash
cp .env.example .env
```

Zuletzt die Docker Container erstellen und ausführen.

``` bash
docker compose up -d
```