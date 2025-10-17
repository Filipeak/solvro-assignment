# Zadanie - sekcja backend

Stworzyłem prosty backend w Node.js z użyciem Express, który obsługuje podstawowe operacje CRUD (Create, Read, Update, Delete) dla zasobów "cocktails" i "ingredients". Oparty na Firebase Firestore.


## Instalacja i uruchomienie

Instalacja zależności:

```npm install```.

Uzupełnij plik `.env` na podstawie `.env.example`. **Uwaga:** zmienna `FIREBASE_SERVICE_ACCOUNT_KEY` jest w formacie Base64, więc należy zakodować odpowiedni plik JSON do tego formatu.

Uruchomienie serwera:

```npm start```.


## Dokumentacja API

Projekt zawiera dokumentację API stworzoną przy użyciu 'swagger-jsdoc' oraz 'swagger-ui-express' - ścieżka '/docs'.


## Testy

Testy jednostkowe zostały napisane przy użyciu 'Jest', uruchamianie: ```npm test```.

Dodatkowo automatyczne testy przy użyciu GitHub Actions.