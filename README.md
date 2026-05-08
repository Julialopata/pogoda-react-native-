# Pogoda tu i teraz

## Cel aplikacji

Celem aplikacji jest pobranie aktualnej lokalizacji użytkownika i wyświetlenie pogody dla tego miejsca.

## Dane z urządzenia

Aplikacja wykorzystuje lokalizację GPS telefonu.

## Wykorzystane biblioteki i API

- React Native
- Expo
- expo-location
- Open-Meteo Forecast API

## Przepływ danych

Po uruchomieniu aplikacja prosi o zgodę na dostęp do lokalizacji. Następnie pobiera współrzędne GPS i wysyła je do API Open-Meteo. API zwraca dane pogodowe w formacie JSON. Aplikacja przetwarza te dane i wyświetla aktualną temperaturę, prędkość wiatru, opady oraz prognozę godzinową na 24 godziny.

## Obsługa błędów

Aplikacja pokazuje błąd, gdy użytkownik nie wyrazi zgody na lokalizację, gdy wystąpi problem z połączeniem internetowym albo gdy API nie zwróci poprawnych danych.

## Funkcje aplikacji

- pobieranie lokalizacji GPS,
- pobieranie aktualnej pogody,
- wyświetlanie temperatury, wiatru i opadów,
- wyświetlanie prognozy na 24 godziny,
- ręczne odświeżanie danych,
- obsługa błędów i stanu ładowania.
