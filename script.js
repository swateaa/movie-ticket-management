
const movies = [
  { id: 1, title: "The Dark Knight", genre: "Action", rating: "9.0", duration: "152 min", price: 220, icon: "🦇", a: "#182848", b: "#4b6cb7" },
  { id: 2, title: "Interstellar", genre: "Sci-Fi", rating: "8.7", duration: "169 min", price: 250, icon: "🚀", a: "#101827", b: "#574b90" },
  { id: 3, title: "The Grand Adventure", genre: "Drama", rating: "8.2", duration: "128 min", price: 180, icon: "🏔️", a: "#744b32", b: "#c79a58" },
  { id: 4, title: "Laugh Out Loud", genre: "Comedy", rating: "7.9", duration: "115 min", price: 160, icon: "😂", a: "#a83e56", b: "#f0a34a" },
  { id: 5, title: "Galaxy Quest", genre: "Sci-Fi", rating: "8.4", duration: "138 min", price: 230, icon: "🪐", a: "#302b63", b: "#a044ff" },
  { id: 6, title: "Magic Kingdom", genre: "Animation", rating: "8.1", duration: "105 min", price: 190, icon: "🏰", a: "#134e5e", b: "#71b280" }
];

const $ = id => document.getElementById(id);
const selectedSeats = new Set();
const occupiedSeats = new Set(["A4", "B2", "C6", "D3", "E7"]);
const SEAT_PRICE = 0;
let bookingNumber = 1000;

function renderMovies() {
  const search = $("movie-search").value.toLowerCase().trim();
  const genre = $("genre-filter").value;

  const filtered = movies.filter(movie =>
    movie.title.toLowerCase().includes(search) &&
    (genre === "All" || movie.genre === genre)
  );

  $("movie-count").textContent = `${filtered.length} MOVIES`;

  $("movie-grid").innerHTML = filtered.length
    ? filtered.map(movie => `
      <article class="movie-card">
        <div class="poster" style="--poster-a:${movie.a};--poster-b:${movie.b}">
          <span>${movie.icon}</span>
          <span class="poster-title">${movie.title}</span>
        </div>
        <div class="movie-info">
          <h3>${movie.title}</h3>
          <div class="movie-meta">${movie.genre} · ${movie.duration}</div>
          <div class="movie-bottom">
            <span class="rating">★ ${movie.rating}</span>
            <span class="movie-price">₹${movie.price}</span>
            <button class="primary-button" data-movie="${movie.id}">Book Now</button>
          </div>
        </div>
      </article>
    `).join("")
    : '<p class="muted">No movies found. Try another search.</p>';
}

function renderMovieOptions() {
  $("selected-movie").innerHTML =
    '<option value="">Choose a movie</option>' +
    movies.map(movie =>
      `<option value="${movie.id}">${movie.title} — ₹${movie.price}</option>`
    ).join("");
}

function renderSeats() {
  const map = $("seat-map");
  map.innerHTML = "";

  ["A", "B", "C", "D", "E"].forEach(row => {
    for (let number = 1; number <= 8; number++) {
      const seatId = row + number;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "seat";
      button.textContent = seatId;
      button.setAttribute("aria-label", `Seat ${seatId}`);

      if (occupiedSeats.has(seatId)) {
        button.disabled = true;
        button.title = "Unavailable seat";
      } else if (selectedSeats.has(seatId)) {
        button.classList.add("selected");
        button.setAttribute("aria-pressed", "true");
      } else {
        button.setAttribute("aria-pressed", "false");
      }

      button.addEventListener("click", () => {
        if (selectedSeats.has(seatId)) {
          selectedSeats.delete(seatId);
        } else {
          selectedSeats.add(seatId);
        }
        renderSeats();
        updateSummary();
      });

      map.appendChild(button);
    }
  });
}

function getSelectedMovie() {
  return movies.find(movie => movie.id === Number($("selected-movie").value));
}

function updateSummary() {
  const movie = getSelectedMovie();
  $("summary-movie").textContent = movie ? movie.title : "Not selected";
  $("summary-date").textContent = $("show-date").value || "Not selected";
  $("summary-time").textContent = $("show-time").value;
  $("summary-seats").textContent = [...selectedSeats].sort().join(", ") || "None";
  $("summary-total").textContent = `₹${movie ? movie.price * selectedSeats.size : 0}`;
  $("booking-message").textContent = "";
  $("booking-message").className = "";
}

function showMessage(message, type) {
  $("booking-message").textContent = message;
  $("booking-message").className = type;
}

function bookTickets() {
  const movie = getSelectedMovie();
  const date = $("show-date").value;

  if (!movie) {
    showMessage("Please select a movie first.", "error");
    return;
  }

  if (!date) {
    showMessage("Please select a show date.", "error");
    return;
  }

  if (date < new Date().toLocaleDateString("en-CA")) {
    showMessage("Please select today or a future date.", "error");
    return;
  }

  if (selectedSeats.size === 0) {
    showMessage("Please select at least one available seat.", "error");
    return;
  }

  const total = movie.price * selectedSeats.size;
  const bookingId = `CB${++bookingNumber}`;
  const seats = [...selectedSeats].sort();

  showMessage(
    `Demo booking confirmed! ID: ${bookingId}. ${movie.title} · ${seats.join(", ")} · Total ₹${total}. No payment was processed.`,
    "success"
  );

  // Demo only: clear the current selection after confirmation.
  // This does not save bookings to a server.
  selectedSeats.clear();
  renderSeats();
  updateSummary();
}

$("movie-search").addEventListener("input", renderMovies);
$("genre-filter").addEventListener("change", renderMovies);
$("selected-movie").addEventListener("change", updateSummary);
$("show-date").addEventListener("change", updateSummary);
$("show-time").addEventListener("change", updateSummary);
$("book-button").addEventListener("click", bookTickets);

$("movie-grid").addEventListener("click", event => {
  const button = event.target.closest("[data-movie]");
  if (!button) return;

  $("selected-movie").value = button.dataset.movie;
  updateSummary();
  $("booking").scrollIntoView({ behavior: "smooth" });
});

const dateInput = $("show-date");
const localToday = [
  new Date().getFullYear(),
  String(new Date().getMonth() + 1).padStart(2, "0"),
  String(new Date().getDate()).padStart(2, "0")
].join("-");

dateInput.min = localToday;

renderMovies();
renderMovieOptions();
renderSeats();
updateSummary();
