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
        <button class="small-button" onclick="addMovie()">
        <img src="images/plus-icon.png" alt="Hinzufügen">
        </button>
    `;
}

function addMovie() {
    const movieName = document.getElementById("movieInput").value;
    if (movieName.trim() === "") {
        alert("Du hast leider keinen Film eingegeben :(");
        return;
    }
    const newMovieRef = db.ref("movies").push();
    newMovieRef.set({
        name: movieName,
        watched: false
    });
    alert(`Super! Der Film "${movieName}" wurde hinzugefügt! Aron freut sich schon darauf ;)`);

    // Textfeld nach dem Hinzufügen des Films leeren
    movieInput.value = ""; // Das Textfeld wird geleert
}

// Sicherstellen, dass der Event-Listener erst nach dem Laden des HTMLs hinzugefügt wird
document.addEventListener("DOMContentLoaded", function() {
    // Event-Listener für das Textfeld, um auf die Enter-Taste zu reagieren
    document.getElementById("movieInput").addEventListener("keyup", function(event) {
        if (event.key === "Enter") {  // Überprüft, ob die Enter-Taste gedrückt wurde
            addMovie();  // Ruft die Funktion addMovie() auf, um den Film hinzuzufügen
        }
    });
});

// Button 2: Filmliste anzeigen
function showMovieList() {
    db.ref("movies").once("value", (snapshot) => {
        const movies = snapshot.val();
        if (!movies) {
            outputDiv.innerHTML = "Du hast leider noch keinen Film zur Liste hinzugefügt :(";
            return;
        }

        let html = "<ul>";
        for (const id in movies) {
            const movie = movies[id];
            const watchedStyle = movie.watched ? "style='color: green;'" : "";
            const eyeIcon = movie.watched ? "eye-slash-icon.png" : "eye-icon.png";
            const buttonText = movie.watched ? "Nicht gesehen" : "Gesehen";
            html += `
                <li ${watchedStyle}>
                    <span class="movie-title">${movie.name}</span> <!-- Filmtitel als eigenes Element -->
                    <button class="small-button" onclick="toggleWatched('${id}', ${movie.watched})">
                        <img src="images/${eyeIcon}" alt="${buttonText}">
                    </button>
                    <button class="small-button" onclick="deleteMovie('${id}')">
                        <img src="images/trash-icon.png" alt="Löschen">
                    </button>
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
            outputDiv.innerHTML = "Wir haben wohl schon alle Filme in der Liste gesehen! :O Füge erst einen neuen Film hinzu!";
            return;
        }

        const randomMovie = unwatchedMovies[Math.floor(Math.random() * unwatchedMovies.length)];
        outputDiv.innerHTML = `Der Randomizer schlägt folgenden Film vor:<br><br><strong style="color: magenta; font-size: 1.2em;">${randomMovie.name}</strong>`;
    });
}
