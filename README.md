
# Route Optimization Map App

An interactive Android map application built using **Android Studio**, **HTML**, **CSS**, and **JavaScript**. This app helps users find the shortest route among multiple selected points and search for nearby restaurants, with a smooth and intuitive map interface powered by Leaflet plugins.

---

## Features

- **Multi-Point Route Optimization**
  - Allows users to select multiple destinations on the map.
  - Computes the shortest visiting path using:
    - A **Greedy algorithm** for initial route planning.
    - A **2-opt algorithm** for further optimization.

- **Nearby Restaurant Search**
  - Users can search for restaurants located near the suggested route.
  - Displayed results are shown as interactive markers on the map.

- **Interactive Map Interface**
  - Enhanced usability through integration of two **Leaflet plugins**:
    - Display of the **user’s current location**.
    - Clear visualization of all **selected destinations**.

---

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Mapping Library**: [Leaflet.js](https://leafletjs.com/) and plugins
- **Development Environment**: Android Studio
- **Route Algorithms**: Greedy algorithm, 2-opt algorithm
