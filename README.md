# ArtificialOrNaturalIntelligence – Das ultra Ratespiel

## Projektbeschreibung

ArtificialOrNaturalIntelligence ist ein Webbasiertes Ratespiel, bei dem es darum geht, zu erraten, ob ein digitaler Inhalt KI generiert ist oder von einem Menschen erstellt wurde. Dabei kann es sich beispielsweise um einen Text, einen Quellcode oder um ein Bild handeln. Wenn der Benutzer richtig rät, bekommt er eine unique ID, um an einer Lotterie teilzunehmen. Die Webseite soll Teil des Event Trailers sein (@FHJoanneum)

---

## Tech Stack

| Bereich   | Technologie                                          |
| --------- | ---------------------------------------------------- |
| Frontend  | Angular                                              |
| Backend   | NestJS                                               |
| Datenbank | Muss noch abgeklärt werden (PostgreSQL oder MongoDB) |



## Team und Rollen

| Teammitglied    | Aufgaben                                  |
| --------------- | ----------------------------------------- |
| Resch Cindy     | Design / UI + Frontendentwicklung         |
| Wurzinger Kevin | Backendentwicklung (REST API + Datenbank) |


---

## Todos

1. Wireframes und UI-Design entwerfen  
2. Datenbank designen und API Endpunkte planen
3. Musthave Features implementieren
4. Nice-to-have Features implementieren
5. Projektabschluss + Präsentation

---

## Lokales Setup

Zunächst das Repository clonen und öffnen. Danach ausgehend vom Project Root wie folgt
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
