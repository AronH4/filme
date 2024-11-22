// Firebase-Konfiguration
const firebaseConfig = {
    apiKey: "AIzaSyAsZs09loiPgmowybrAoXOo_LkijR_0yIA",
    authDomain: "filme-17656.firebaseapp.com",
    databaseURL: "https://filme-17656-default-rtdb.firebaseio.com",
    projectId: "filme-17656",
    storageBucket: "filme-17656.firebasestorage.app",
    messagingSenderId: "236735539362",
    appId: "1:236735539362:web:fef6b9aabf033a7ae1cffb"
};

// Firebase initialisieren
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Globale Variable für das Output-Div
let outputDiv = document.getElementById("outputDiv");

// Button 1: Film eintragen
function showInputField() {
    outputDiv.innerHTML = `
        <input id="movieInput" type="text" placeholder="Film eintragen">
        <button onclick="addMovie()">Hinzufügen</button>
    `;
}

function addMovie() {
    const movieInput = document.getElementById("movieInput").value;
    if (movieInput.trim() === "") {
        alert("Du hast leider keinen Film eingetragen. Deshalb wurde auch kein Film zur Liste hinzugefügt.");
        return;
    }
    db.ref("movies").push({
        name: movieInput,
        watched: false
    });
    alert(`Super!<br>Der Film "${movieInput}" wurde hinzugefügt!<br>Aron freut sich schon darauf :)`);
}

// Button 2: Filmliste anzeigen
function showMovieList() {
    db.ref("movies").once("value", (snapshot) => {
        const movies = snapshot.val();
        if (!movies) {
            outputDiv.innerHTML = "Du hast leider noch keinen Film zur Liste hinzugefügt :(.";
            return;
        }

        let html = "<ul>";
        for (const id in movies) {
            const movie = movies[id];
            const watchedStyle = movie.watched ? "style='color: green;'" : "";
            const buttonText = movie.watched ? "Nicht gesehen" : "Gesehen";
            html += `
                <li ${watchedStyle}>
                    ${movie.name}
                    <button onclick="toggleWatched('${id}', ${movie.watched})">${buttonText}</button>
                    <button onclick="deleteMovie('${id}')">Löschen</button>
                </li>
            `;
        }
        html += "</ul>";
        outputDiv.innerHTML = html;
    });
}

// Toggle-Funktion für gesehen/ungesehen
function toggleWatched(movieId, isWatched) {
    // Wenn der Film als gesehen markiert ist, setze ihn auf ungesehen und umgekehrt
    db.ref(`movies/${movieId}`).update({
        watched: !isWatched
    });
    showMovieList(); // Filmliste nach Änderung neu laden
}

function deleteMovie(movieId) {
    db.ref(`movies/${movieId}`).remove();
    showMovieList(); // Filmliste nach Löschung neu laden
}

// Button 3: Zufälligen Film vorschlagen
function suggestRandomMovie() {
    db.ref("movies").once("value", (snapshot) => {
        const movies = snapshot.val();
        if (!movies) {
            outputDiv.innerHTML = "Du hast leider noch keinen Film zur Liste hinzugefügt :(";
            return;
        }

        const unwatchedMovies = Object.values(movies).filter(movie => !movie.watched);
        if (unwatchedMovies.length === 0) {
            outputDiv.innerHTML = "Wir haben wohl schon alle Filme in der Liste gesehen! :O<br>Füge erst einen neuen Film hinzu!";
            return;
        }

        const randomMovie = unwatchedMovies[Math.floor(Math.random() * unwatchedMovies.length)];
        outputDiv.innerHTML = `Der Randomizer schlägt folgenden Film vor: <strong>${randomMovie.name}</strong>?`;
    });
}
