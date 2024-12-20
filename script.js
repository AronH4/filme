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

//GIFS
const gifs = [
    'gifs/cat.gif',
    'gifs/duck.gif',
    'gifs/goldy.gif',
    'gifs/otter.gif',
    'gifs/pengu.gif',
    'gifs/seal.gif'
];

// Globale Variable für das Output-Div
let outputDiv = document.getElementById("outputDiv")

//ACHTUNG LÖSCHBAR BIS BUTTON 1
document.getElementById('secretAreaButton').addEventListener('click', showEasterEggImage);

function showEasterEggImage() {
    const easterEggImage = document.createElement('img');
    easterEggImage.src = 'images/easteregg.png'; // Pfad zum Bild
    easterEggImage.alt = 'Easter Egg';
    easterEggImage.style.position = 'fixed';
    easterEggImage.style.top = '50%';
    easterEggImage.style.left = '50%';
    easterEggImage.style.transform = 'translate(-50%, -50%)';
    easterEggImage.style.zIndex = '9999';
    document.body.appendChild(easterEggImage);
}

// Button 1: Film eintragen
function showInputField() {
   
    document.body.classList.remove('movie-list-active');
    
    removeFixedPosition();

    document.getElementById("gifContainer").innerHTML = ''; // Entferne das GIF
    
    outputDiv.innerHTML = `
        <input id="movieInput" type="text" placeholder="Film eintragen">
        <button class="small-button" onclick="addMovie()">
        <img src="images/plus-icon.png" alt="Hinzufügen">
        </button>
    `;
}

// Funktion zum Entfernen der Fixierung der Header und Buttons
function removeFixedPosition() {
    document.body.classList.remove('fixed-header-buttons-active'); // Entferne die fixierte Position
}

// Funktion zum Hinzufügen eines Films
function addMovie() {
    const movieName = document.getElementById("movieInput").value.trim();
    
    // Überprüfen, ob das Textfeld leer ist
    if (movieName === "") {
        alert("Du hast leider keinen Film eingegeben :(");
        return;
    }
    
    // Überprüfen, ob der Film bereits in der Datenbank existiert
    db.ref("movies").once("value", (snapshot) => {
        const movies = snapshot.val();
        let movieExists = false;
        
        // Wenn Filme existieren, durch alle Filme iterieren
        for (const id in movies) {
            if (movies[id].name.toLowerCase() === movieName.toLowerCase()) {
                movieExists = true;
                break;
            }
        }

        // Wenn der Film bereits existiert
        if (movieExists) {
            alert(`Der Film "${movieName}" ist bereits in deiner Liste!`);
        } else {
            // Wenn der Film nicht existiert, Film hinzufügen
            const newMovieRef = db.ref("movies").push();
            newMovieRef.set({
                name: movieName,
                watched: false
            });
            alert(`Super! Der Film "${movieName}" wurde hinzugefügt! Aron freut sich schon darauf ;)`);
        }
    });
    
    // Textfeld nach dem Hinzufügen leeren
    document.getElementById("movieInput").value = '';
}

// Button 2: Filmliste anzeigen
function showMovieList() {
 // Füge die fixierte Klasse zum Header hinzu
    document.body.classList.add('fixed-header-buttons-active', 'movie-list-active'); 

    document.getElementById("gifContainer").innerHTML = ''; // Entferne das GIF
    
    db.ref("movies").once("value", (snapshot) => {
        const movies = snapshot.val();
        if (!movies) {
            outputDiv.innerHTML = "Du hast leider noch keinen Film zur Liste hinzugefügt :(";
            return;
        }

        // Arrays für ungesehene und gesehene Filme
        let unwatchedMovies = [];
        let watchedMovies = [];
        
        // Zähler für ungesehene und gesehene Filme
        let unwatchedCount = 0;
        let watchedCount = 0;

        // Filme in die jeweiligen Arrays aufteilen und Zähler aktualisieren
        for (const id in movies) {
            const movie = movies[id];
            if (movie.watched) {
                watchedMovies.push({ id, ...movie });
                watchedCount++; // Zähler für gesehene Filme
            } else {
                unwatchedMovies.push({ id, ...movie });
                unwatchedCount++; // Zähler für ungesehene Filme
            }
        }

        // Sortieren der ungesehenen und gesehenen Filme alphabetisch
        unwatchedMovies.sort((a, b) => a.name.localeCompare(b.name)); // Ungesehene Filme sortieren
        watchedMovies.sort((a, b) => a.name.localeCompare(b.name)); // Gesehene Filme sortieren

        // HTML für die Filmliste zusammenbauen
        let html = "<ul>";
        
        // Ungesehene Filme anzeigen
        for (const movie of unwatchedMovies) {
            const eyeIcon = "eye-icon.png";
            html += `
                <li class="movie-item">
                    <div class="movie-title" style="color: orange;">
                        ${movie.name}
                    </div>
                    <div class="movie-buttons">
                        <button class="small-button" onclick="toggleWatched('${movie.id}', ${movie.watched})">
                            <img src="images/${eyeIcon}" alt="Gesehen">
                        </button>
                        <button class="small-button" onclick="deleteMovie('${movie.id}')">
                            <img src="images/trash-icon.png" alt="Löschen">
                        </button>
                    </div>
                </li>
            `;
        }

        // Gesehene Filme anzeigen
        for (const movie of watchedMovies) {
            const eyeIcon = "eye-slash-icon.png";
            html += `
                <li class="movie-item">
                    <div class="movie-title" style="color: red; text-decoration: line-through;">
                        ${movie.name}
                    </div>
                    <div class="movie-buttons">
                        <button class="small-button" onclick="toggleWatched('${movie.id}', ${movie.watched})">
                            <img src="images/${eyeIcon}" alt="Nicht gesehen">
                        </button>
                        <button class="small-button" onclick="deleteMovie('${movie.id}')">
                            <img src="images/trash-icon.png" alt="Löschen">
                        </button>
                    </div>
                </li>
            `;
        }

        // Trennstrich und Counter hinzufügen
        html += `
            </ul>
        `;

        outputDiv.innerHTML = html;
    });
}

// Funktion zum Verlassen der Filmliste (z.B. zurück zum Start)
function hideMovieList() {
    // Entferne die fixierte Klasse vom Header
    document.body.classList.remove('fixed-header-buttons-active', 'movie-list-active');
    outputDiv.innerHTML = ''; // Optional: Löscht den Inhalt der Filmliste, wenn du zurück gehst
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
    document.body.classList.remove('movie-list-active');
    
    removeFixedPosition();
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

// Zufälliges GIF auswählen
        const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

        // GIF anzeigen
        const gifContainer = document.getElementById("gifContainer");
        gifContainer.innerHTML = `<img src="${randomGif}" alt="GIF" style="width: 100%; height: auto; animation: loopGif 10s infinite;">`;
    });
}
