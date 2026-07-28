# KALBUD — Kalkulator Budowlany & Asystent Kosztorysowania 🏗️

[![Wersja](https://img.shields.io/badge/Wersja-2.0.0-blue.svg)](https://github.com/krzjur-oss)
[![Licencja](https://img.shields.io/badge/Licencja-WLDE-emerald.svg)](./LICENSE.md)
[![PWA](https://img.shields.io/badge/PWA-Offline%20Ready-purple.svg)](#-pwa--offline)
[![Autor](https://img.shields.io/badge/Autor-mgr%20Krzysztof%20Jureczek-slate.svg)](https://github.com/krzjur-oss)

**KALBUD** to nowoczesna, wysoce precyzyjna i działająca w trybie **Offline (PWA)** aplikacja webowa do kompleksowego obliczania zapotrzebowania na materiały oraz tworzenia kosztorysów prac brukrarskich, ogrodzeniowych i stolarskich.

Designed for investors, homeowners, and contractors to estimate costs, material volumes (tonnage, $m^3$, $m^2$, pieces), and excavation depth with high precision.

---

## 🌟 Główne Funkcje i Moduły

### 1. 🏠 Opaska Wokół Domu
- Obliczanie powierzchni i obwodu opaski z uwzględnieniem wyłączeń (np. schody, taras, wejścia).
- Precyzyjne wyliczenia kostki brukowej, żwiru dekoracyjnego, obrzeży betonowych, tłucznia i podsypki.
- Interaktywny **schemat przekroju poprzecznego 2D** podbudowy.

### 2. 🚗 Podjazdy i Parkingi
- Obsługa kształtów prostokątnych oraz L-kształtnych z opcją poszerzenia pod garaż.
- Kalkulacja wykopu, podbudowy, podsypki i nawierzchni (kostka brukowa 8 cm, płyty ażurowe).
- Uwzględnienie krawężników drogowych oraz wsporników betonowych.

### 3. 🛡️ Ogrodzenia Panelowe
- Obliczanie ilości paneli, słupków, obejm montażowych i podwalin betonowych (desek podceglanych).
- Kalkulacja obwodu i kubatury betonu pod stopy fundamentowe słupków.
- Uwzględnianie wstawiania furtek oraz bram wjazdowych.

### 4. 🪵 Wykopy pod Tarasy & Zadaszenia Drewniane
- Wycena wykopu i podbudowy pod taras (np. płyty, legary, tłuczeń).
- Kompleksowy kalkulator konstrukcji zadaszenia drewnianego (słupy, płatwie, krokwie, murłaty, łaty).
- **Interaktywna wizualizacja 3D krokwi** oraz schemat konstrukcyjny 2D.

### 5. 🛒 Zbiorczy Kosztorys & Lista Zakupów
- Automatyczne scalanie zapotrzebowania na materiały ze wszystkich modułów w jednym miejscu.
- Edytowalny cennik materiałów (z opcją zapisu własnych stawek).
- **Generator Raportów PDF** — pobieranie czytelnego kosztorysu do druku lub inwestora.
- Menedżer Projektów: Zapis, wczytywanie, duplikowanie i eksport/import konfiguracji do plików **JSON**.

### 6. 🤖 Asystent Budowlany AI (Gemini)
- Wbudowany doradca techniczny odpowiadający na pytania dotyczące grubości podbudowy, rodzajów tłucznia, zagęszczania gruntu czy norm budowlanych.

---

## 🚀 Technologie

- **Frontend:** React 18 / 19, TypeScript, Vite
- **Stylizowanie:** Tailwind CSS, Lucide React (ikony)
- **Raporty & Eksport:** jsPDF, AutoTable, Canvas API
- **Backend & AI:** Node.js, Express, Google Gemini API (`@google/genai`)
- **PWA:** Service Worker (offline cache, manifest, instalowalność na telefonach/PC)

---

## 🛠️ Uruchomienie Lokalnie

### Wymagania
- Node.js (wersja >= 18.x)
- npm / yarn / pnpm

### Krok po kroku

1. **Sklonuj repozytorium:**
   ```bash
   git clone https://github.com/krzjur-oss/kalbud.git
   cd kalbud
   ```

2. **Zainstaluj zależności:**
   ```bash
   npm install
   ```

3. **(Opcjonalnie) Skonfiguruj zmienne środowiskowe:**
   Utwórz plik `.env` na podstawie `.env.example`:
   ```env
   GEMINI_API_KEY=twój_klucz_api_gemini
   ```

4. **Uruchom serwer deweloperski:**
   ```bash
   npm run dev
   ```
   Aplikacja będzie dostępna pod adresem `http://localhost:3000`.

5. **Budowanie produkcyjne:**
   ```bash
   npm run build
   npm start
   ```

---

## 🔒 Prywatność & RODO

- **Brak zewnętrznych serwerów bazy danych:** Wszystkie projekty i dane wprowadzane przez użytkownika przechowywane są wyłącznie lokalnie w pamięci przeglądarki (`localStorage`).
- **Zero śledzenia:** Aplikacja nie zbiera ciasteczek śledzących ani danych osobowych.

---

## 📄 Licencja i Regulamin

Projekt udostępniany jest na warunkach **Wolnej Licencji Domowo-Edukacyjnej (Zastrzeżonej) — WLDE**.

- **Właściciel praw autorskich i twórca:** mgr Krzysztof Jureczek (Copyright © 2026)
- **Pełna treść licencji:** [LICENSE.md](./LICENSE.md)
- **Regulamin i polityka prywatności:** [REGULAMIN.md](./REGULAMIN.md)

*Aplikacja jest całkowicie bezpłatna do użytku domowego, prywatnego oraz dydaktycznego w szkołach i uczelniach. Wszelka komercjalizacja, redystrybucja kodu źródłowego czy sprzedaż bez zgody Autora są surowo zabronione.*

---

## ✉️ Kontakt

- **Autor:** mgr Krzysztof Jureczek
- **E-mail:** [kjureczek@proton.me](mailto:kjureczek@proton.me)
- **GitHub:** [github.com/krzjur-oss](https://github.com/krzjur-oss)
