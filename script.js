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

// HTML-Elemente referenzieren
const outputDiv = document.getElementById("output");

// Funktion: Film eintragen
function showInputField() {
    outputDiv.innerHTML = `
        <input id="movieInput" type="text" placeholder="Filmname eintragen">
        <button onclick="addMovie()">Hinzufügen</button>
    `;
}

function addMovie() {
    const movieName = document.getElementById("movieInput").value;
    if (movieName.trim() === "") return;

    const movieRef = db.ref("movies").push();
    movieRef.set({ name: movieName, watched: false });
    alert(`${movieName} wurde hinzugefügt!`);
}

// Funktion: Liste anzeigen
function showMovieList() {
    db.ref("movies").once("value", (snapshot) => {
        const movies = snapshot.val();
        if (!movies) {
            outputDiv.innerHTML = "Keine Filme eingetragen.";
            return;
        }

        let html = "<ul>";
        for (const id in movies) {
            const movie = movies[id];
            html += `
                <li>
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

function markAsWatched(id) {
    db.ref(`movies/${id}`).update({ watched: true });
    alert("Film als gesehen markiert!");
    showMovieList();
}

function deleteMovie(id) {
    db.ref(`movies/${id}`).remove();
    alert("Film gelöscht!");
    showMovieList();
}

// Funktion: Zufallsfilm vorschlagen
function suggestMovie() {
    db.ref("movies").once("value", (snapshot) => {
        const movies = snapshot.val();
        if (!movies) {
            outputDiv.innerHTML = "Keine Filme zum Vorschlagen.";
            return;
        }

        const unwatched = Object.values(movies).filter(movie => !movie.watched);
        if (unwatched.length === 0) {
            outputDiv.innerHTML = "Alle Filme wurden angesehen!";
            return;
        }

        const randomMovie = unwatched[Math.floor(Math.random() * unwatched.length)];
        outputDiv.innerHTML = `Vorschlag: <b>${randomMovie.name}</b>`;
    });
}
