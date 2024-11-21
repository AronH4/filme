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
const db = firebase.database(app);

// Globale Variable für das Output-Div
const outputDiv = document.getElementById("outputDiv");

// Button 1: Film eintragen
function showInputField() {
    outputDiv.innerHTML = `
        <input id="movieInput" type="text" placeholder="Filmname eintragen">
        <button onclick="addMovie()">Hinzufügen</button>
    `;
}

function addMovie() {
    const movieName = document.getElementById("movieInput").value;
    if (movieName.trim() === "") {
        alert("Bitte einen Filmnamen eingeben.");
        return;
    }
    const newMovieRef = db.ref("movies").push();
    newMovieRef.set({
        name: movieName,
        watched: false
    });
    alert(`Der Film "${movieName}" wurde hinzugefügt!`);
}

// Button 2: Filmliste anzeigen
function showMovieList() {
    db.ref("movies").once("value", (snapshot) => {
        const movies = snapshot.val();
        if (!movies) {
            outputDiv.innerHTML = "Keine Filme vorhanden.";
            return;
        }

        let html = "<ul>";
        for (const id in movies) {
            const movie = movies[id];
            const watchedClass = movie.watched ? "style='color: green;'" : "";
            html += `
                <li ${watchedClass}>
                    ${movie.name}
                    <button onclick="markAsWatched('${id}')">Gesehen</button>
                    <button onclick="deleteMovie('${id}')">Löschen</button>
                </li>
            `;
        }
        html += "</ul>";
        outputDiv.innerHTML = html;
    });
}

function markAsWatched(movieId) {
    db.ref(`movies/${movieId}`).update({
        watched: true
    });
    showMovieList();
}

function deleteMovie(movieId) {
    db.ref(`movies/${movieId}`).remove();
    showMovieList();
}

// Button 3: Zufälligen Film vorschlagen
function suggestRandomMovie() {
    db.ref("movies").once("value", (snapshot) => {
        const movies = snapshot.val();
        if (!movies) {
            outputDiv.innerHTML = "Keine Filme vorhanden.";
            return;
        }

        const unwatchedMovies = Object.values(movies).filter(movie => !movie.watched);
        if (unwatchedMovies.length === 0) {
            outputDiv.innerHTML = "Keine ungesehenen Filme vorhanden.";
            return;
        }

        const randomMovie = unwatchedMovies[Math.floor(Math.random() * unwatchedMovies.length)];
        outputDiv.innerHTML = `Wie wäre es mit: <strong>${randomMovie.name}</strong>?`;
    });
}
