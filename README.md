# 🎬 GoodFilms

GoodFilms är en mobilapplikation byggd med React Native och Expo. Appen gör det möjligt att:

- Spara filmer du sett
- Betygsätta och kommentera dem
- Se vad andra användare nyligen sett

Appen fokuserar på enkelhet och tydlighet – inspirerad av appar som Letterboxd och Goodreads men utan onödigt brus.

---

## 🚀 Funktioner

- 🔐 **Autentisering:** Inloggning och registrering med e-post via Supabase
- 🔍 **Sök:** Hitta filmer med TMDB:s sök-API
- 📊 **Trending & Top Rated:** Upptäck populära filmer via TMDB
- ➕ **Lägg till film:** Lägg till filmer med egen kommentar och betyg
- 🎥 **Min lista:** Se dina sparade filmer
- 👥 **Community Feed:** Se vad andra användare sett nyligen

---

## 🛠 Tekniker

| Teknik             | Beskrivning                                                                 |
|--------------------|-----------------------------------------------------------------------------|
| **React Native**   | Används för att bygga mobilappen                                            |
| **Expo**           | Gör utvecklingen enklare och möjliggör APK-build via EAS                    |
| **Expo Router**    | Filbaserad routing för enkel navigering                                     |
| **Supabase**       | Open-source backend med autentisering och PostgreSQL-baserad databas        |
| **TMDB API**       | Hämtar filmdata som titel, betyg och poster                                 |
| **EAS Build**      | Bygger produktionsklara APK-filer i molnet via Expo                         |

---

## ⚙️ Installation

```bash
git clone https://github.com/oliverhhh/GoodFilms.git
cd GoodFilms
npm install
npx expo start

---

## 🧪 Testad på

- ✅ Android (APK via EAS Build)  
- ❌ iOS (inte testad)

---

## 🔗 Länkar & Dokumentation

- 📘 [TMDB API Docs](https://developer.themoviedb.org/docs)
- 🔐 [Supabase Docs](https://supabase.com/docs)
- ⚙️ [Expo Docs](https://docs.expo.dev)
- 📦 [EAS Build](https://docs.expo.dev/eas)

---

## 👨‍💻 Utvecklare

**Oliver Nilsson**  
Byggt som examensprojekt inom Javautveckling  
[GitHub: @oliverhhh](https://github.com/oliverhhh)

---

## 📦 APK-distribution

Appen är byggd med EAS Build och kan installeras manuellt via APK.  
APK-filen delas separat via t.ex. e-post eller länk.

---
