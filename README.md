# ArtificialOrNaturalIntelligence – Das ultra Ratespiel

## Projektbeschreibung

ArtificialOrNaturalIntelligence ist ein Webbasiertes Ratespiel, bei dem es darum geht, zu erraten, ob ein digitaler Inhalt KI generiert ist oder von einem Menschen erstellt wurde. Dabei kann es sich beispielsweise um einen Text, ein Bild, ein Video oder eine Audiodatei handeln. Am Ende bekommt der Benutzer seine Resultate als Übersicht angezeigt. 

---

## Tech Stack

| Bereich   | Technologie |
| --------- | ----------- |
| Frontend  | Angular     |
| Backend   | NestJS      |
| Datenbank | PostgreSQL  |

## Team und Rollen

| Teammitglied              | Aufgaben                                               |
| ------------------------- | ------------------------------------------------------ |
| Kevin Wurzinger           | Github Verwaltung, Projektleitung, Backend Entwicklung |
| Michael Walch             | Build & Release Engineer                               |
| Zsolt Pataky              | Frontend Entwicklung                                   |

---

## Todos sind im Github Projekt ersichtlich

---

## Lokales Setup

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

## Docker Setup (Lokal)

Zunächst das Repository klonen und ins geklonte Verzeichnis wechseln. Benötigt `dockerd` bzw. Docker Desktop

Dann ins `backend`-Verzeichnis wechseln und die `.env`-Datei aus der Vorlage erstellen

```bash
cd backend
cp .env.example .env
```

Dabei ist der Wert von `PG_HOST` von `localhost` nach `artificialornaturalintelligence-postgres` abzuändern.

``` bash
sed 's/PG_HOST=localhost/PG_HOST=artificialornaturalintelligence-postgres/g' backend/.env.example 
```

Zuletzt in die Wurzel des Repositorys zurückwechseln und die Docker-Container erstellen und ausführen.

``` bash
docker compose --env-file ./backend/.env up -d
```
