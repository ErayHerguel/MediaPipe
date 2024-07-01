# Rehub - Rehabilitation Tracking App

Rehub ist eine App zur Überwachung und Verfolgung von Rehabilitationsübungen mithilfe von Mediapipe Pose und Svelte.

## Inhaltsverzeichnis
- [Überblick](#überblick)
- [Technologien](#technologien)
- [Design-Elemente](#design-elemente)
- [Funktionen](#funktionen)
- [Installation](#installation)
- [Nutzung](#nutzung)

## Überblick

Rehub ist eine webbasierte Anwendung, die Benutzern hilft, ihre Rehabilitationsübungen zu verfolgen. Die App verwendet die Mediapipe Pose-Bibliothek, um die Bewegungen des Benutzers zu erkennen und zu analysieren, und Svelte zur Erstellung der Benutzeroberfläche. Rehub soll jedem ermöglichen, überall mit wenig Stress und einfach seinen Reha-Übungsplan zu überwachen, zu tracken und die Übungen unter Überwachung zu machen, auch wenn man nicht in der Klinik ist.

## Technologien

- **Framework:** Svelte
- **Bibliotheken:** Mediapipe Pose, Svelte Chart.js
- **Sprachen:** TypeScript, JavaScript, HTML, CSS
- **Build-Tool:** Vite

## Design-Elemente

- **Schriftarten:** SF Pro
- **Farben:**
  - Hintergrundfarbe: `#fafffe`
  - Akzentfarbe: `#00e6bd`
  - Textfarbe: `#333333`
- **Icons:** SF Icons
- **Audiodateien:** TTS-Anweisungen und Signaltöne

## Funktionen

- **Kamera-Tracking:** Die App verfolgt die Bewegungen des Benutzers in Echtzeit und berechnet die Winkel der Gelenke, um die Übungsausführung zu analysieren.
- **Sprach- und Signal-Anweisungen:** Die App gibt dem Benutzer akustische Anweisungen je nach ausgewählter Lautstärkeeinstellung. Es gibt verschiedene Anweisungen für unterschiedliche Situationen während der Übungsausführung und -überwachung.
- **Lautstärkeregelung:** Der Benutzer kann die Lautstärke der akustischen Anweisungen einstellen. Es gibt die Optionen `Mute`, `Medium` (Signal) und `High` (TTS-Anweisungen).

## Installation

1. **Abhängigkeiten installieren:**
    ```sh
    npm install
    ```

2. **Entwicklungsserver starten:**
    ```sh
    npm run dev -- --open
    ```

3. **HTTPS mit Ngrok starten:**
    Öffne ein neues Terminal und führe den folgenden Befehl aus:
    ```sh
    ngrok http http://localhost:5173
    ```
    Besuche den generierten Ngrok-Link, der im Terminal angezeigt wird. Dieser HTTPS-Link ist erforderlich, damit die Kamera auf mobilen Geräten funktioniert.

## Nutzung

1. **Starten der App:**
    Öffne einen Browser und gehe zu dem Ngrok-Link, der im Terminal angezeigt wird, z. B. `https://1234abcd.ngrok.io`.

2. **Navigation:**
    - **Dashboard:** Hier findest du eine Übersicht über alle durchgeführten Übungen und deren Statistiken. Es zeigt den Fortschritt und die Leistungsdaten der vergangenen Sitzungen an.
    - **Tracking:** In diesem Bereich kannst du die Kamera aktivieren und deine Übungen in Echtzeit überwachen lassen. Die App verfolgt deine Bewegungen und gibt dir akustische Anweisungen, um die Übung korrekt auszuführen.
    - **Stats:** In diesem Abschnitt kannst du detaillierte Informationen zu deinen Übungen und deren Fortschritt einsehen. Die App zeigt dir eine Analyse deiner Übungsausführungen, einschließlich der Wiederholungen und Sets.

3. **Lautstärkeregelung:**
    - **Mute:** Keine akustischen Anweisungen werden abgespielt.
    - **Medium:** Es werden einfache Signaltöne abgespielt, um den Benutzer zu leiten.
    - **High:** Es werden ausführliche TTS-Anweisungen abgespielt, um den Benutzer detailliert durch die Übungen zu führen.

Rehub wurde entwickelt, um die Rehabilitation zu Hause zu erleichtern, indem es eine benutzerfreundliche Plattform bietet, die es ermöglicht, Übungen effektiv zu überwachen und den Fortschritt zu verfolgen.
