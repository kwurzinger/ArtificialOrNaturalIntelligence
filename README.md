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

### Frontend starten
```bash
cd frontend
npm install
npm start
```
Der Angular Dev-Server läuft anschließend standardmäßig auf http://localhost:4200 und proxyt `http://localhost:3000/api`.

### Backend starten
```bash
cd backend
npm install
npm run start:dev
```
Das NestJS Backend startet im Watch-Modus auf http://localhost:3000.
