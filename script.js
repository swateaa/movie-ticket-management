
const movies = [
  { id: 1, title: "The Dark Knight", genre: "Action", rating: "9.0", duration: "152 min", price: 220, icon: "🦇", a: "#182848", b: "#4b6cb7", glow: "#4e8bff" },
  { id: 2, title: "Interstellar", genre: "Sci-Fi", rating: "8.7", duration: "169 min", price: 250, icon: "🚀", a: "#101827", b: "#574b90", glow: "#9c86ff" },
  { id: 3, title: "The Grand Adventure", genre: "Drama", rating: "8.2", duration: "128 min", price: 180, icon: "🏔️", a: "#744b32", b: "#c79a58", glow: "#eac88a" },
  { id: 4, title: "Laugh Out Loud", genre: "Comedy", rating: "7.9", duration: "115 min", price: 160, icon: "😂", a: "#a83e56", b: "#f0a34a", glow: "#ffbd74" },
  { id: 5, title: "Galaxy Quest", genre: "Sci-Fi", rating: "8.4", duration: "138 min", price: 230, icon: "🪐", a: "#302b63", b: "#a044ff", glow: "#c29aff" },
  { id: 6, title: "Magic Kingdom", genre: "Animation", rating: "8.1", duration: "105 min", price: 190, icon: "🏰", a: "#134e5e", b: "#71b280", glow: "#8ff0c4" }
];

const $ = id => document.getElementById(id);
const selectedSeats = new Set();
const occupiedSeats = new Set(["A4", "B2", "C6", "D3", "E7"]);
const MAX_SEATS = 8;
const STORAGE_KEY = "cinebook-demo-bookings";

let bookingNumber = 1000;
let toastTimer;
let lastBooking = null;

function localDate(date = new Date()) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function getMovie(id) {
  return movies.find(movie => movie.id === Number(id));
}

function getSelectedMovie() {
  return getMovie($("selected-movie").value);
}

// PAGE NAVIGATION

function showPage(page, updateAddress = true) {
  const validPages = ["home", "movies", "book", "mybookings"];
  if (!validPages.includes(page)) page = "home";

  document.querySelectorAll(".page").forEach(section => {
    section.classList.toggle("active", section.id === `page-${page}`);
  });

  document.querySelectorAll(".nav-link").forEach(link => {
    const active = link.dataset.page === page;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  if (updateAddress) {
    history.pushState({ page }, "", `#${page}`);
  }

  if (page === "mybookings") renderBookingHistory();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.addEventListener("click", event => {
  const link = event.target.closest("[data-page]");
  if (!link) return;

  event.preventDefault();
  showPage(link.dataset.page);
});

window.addEventListener("popstate", () => {
  showPage(location.hash.slice(1) || "home", false);
});

$("profile-button").addEventListener("click", () => {
  showPage("mybookings");
});

// MOVIE CARDS

function movieCard(movie) {
  return `
    <article class="movie-card">
      <div class="movie-poster"
        style="--poster-a:${movie.a};--poster-b:${movie.b};--glow:${movie.glow}">
        <span class="poster-tag">${escapeHTML(movie.genre.toUpperCase())}</span>
        <span class="movie-emoji">${movie.icon}</span>
        <span class="poster-title">${escapeHTML(movie.title)}</span>
      </div>
      <div class="movie-info">
        <h3>${escapeHTML(movie.title)}</h3>
        <div class="movie-meta">${escapeHTML(movie.genre)} · ${movie.duration}</div>
        <div class="movie-bottom">
          <span class="rating">★ ${movie.rating}</span>
          <span class="movie-price">₹${movie.price}</span>
          <button class="btn btn-primary" data-book-movie="${movie.id}">
            Book now →
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderHomeMovies() {
  $("home-movies").innerHTML = movies.slice(0, 3).map(movieCard).join("");
}

function renderMovies() {
  const query = $("movie-search").value.toLowerCase().trim();
  const genre = $("genre-filter").value;

  const filtered = movies.filter(movie =>
    movie.title.toLowerCase().includes(query) &&
    (genre === "All" || movie.genre === genre)
  );

  $("movie-count").textContent = `${filtered.length} FILM${filtered.length === 1 ? "" : "S"}`;

  $("all-movies").innerHTML = filtered.length
    ? filtered.map(movieCard).join("")
    : `<div class="empty-state">
        <span>🎬</span>
        <h3>No movies found</h3>
        <p>Try a different title or genre.</p>
      </div>`;
}

$("movie-search").addEventListener("input", renderMovies);
$("genre-filter").addEventListener("change", renderMovies);

document.addEventListener("click", event => {
  const button = event.target.closest("[data-book-movie]");
  if (!button) return;

  openBooking(button.dataset.bookMovie);
});

function openBooking(movieId) {
  $("selected-movie").value = String(movieId);
  selectedSeats.clear();
  renderSeats();
  updateSummary();
  showPage("book");
}

// SEAT SELECTION

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

      if (occupiedSeats.has(seatId)) {
        button.disabled = true;
        button.classList.add("unavailable");
        button.title = "Seat unavailable in this demo";
        button.setAttribute("aria-label", `Seat ${seatId}, occupied`);
      } else {
        const selected = selectedSeats.has(seatId);
        button.classList.toggle("selected", selected);
        button.setAttribute("aria-pressed", String(selected));
        button.setAttribute("aria-label", `Seat ${seatId}`);

        button.addEventListener("click", () => {
          if (selectedSeats.has(seatId)) {
            selectedSeats.delete(seatId);
          } else if (selectedSeats.size >= MAX_SEATS) {
            showToast("You can select up to 8 seats.");
            return;
          } else {
            selectedSeats.add(seatId);
          }

          renderSeats();
          updateSummary();
        });
      }

      map.appendChild(button);
    }
  });
}

// BOOKING SUMMARY

function updateSummary() {
  const movie = getSelectedMovie();

  $("summary-movie").textContent = movie ? movie.title : "Choose a movie";
  $("summary-genre").textContent = movie
    ? `${movie.genre} · ${movie.duration} · ★ ${movie.rating}`
    : "Your next favourite awaits.";

  $("summary-art").style.background = movie
    ? `radial-gradient(circle, ${movie.glow}, ${movie.a} 70%)`
    : "";

  $("summary-art").innerHTML = `<span>${movie ? movie.icon : "🎬"}</span>`;
  $("summary-date").textContent = $("show-date").value || "Not selected";
  $("summary-time").textContent = $("show-time").value;
  $("summary-seats").textContent = [...selectedSeats].sort().join(", ") || "None";
  $("summary-total").textContent = `₹${movie ? movie.price * selectedSeats.size : 0}`;
}

function showMessage(message, type) {
  const element = $("booking-message");
  element.textContent = message;
  element.className = type;
}

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

// LOCAL DEMO BOOKING STORAGE

function readBookings() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function saveBookings(bookings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    return true;
  } catch {
    return false;
  }
}

function bookTickets() {
  const movie = getSelectedMovie();
  const date = $("show-date").value;
  const time = $("show-time").value;

  if (!movie) {
    showMessage("Please choose a movie first.", "error");
    return;
  }

  if (!date || date < localDate()) {
    showMessage("Choose today or a future date.", "error");
    return;
  }

  if (!selectedSeats.size) {
    showMessage("Please select at least one available seat.", "error");
    return;
  }

  const bookings = readBookings();
  const seats = [...selectedSeats].sort();

  // Prevent duplicate seat reservations for the same
  // movie, date and showtime in this browser.
  const conflict = bookings.some(booking =>
    booking.movieId === movie.id &&
    booking.date === date &&
    booking.time === time &&
    booking.seats.some(seat => seats.includes(seat))
  );

  if (conflict) {
    showMessage("One of these seats is already in your saved demo bookings. Choose different seats.", "error");
    return;
  }

  const booking = {
    id: `CB${Date.now().toString().slice(-8)}${++bookingNumber}`,
    movieId: movie.id,
    title: movie.title,
    icon: movie.icon,
    genre: movie.genre,
    date,
    time,
    seats,
    total: movie.price * seats.length,
    createdAt: new Date().toISOString()
  };

  bookings.unshift(booking);

  if (!saveBookings(bookings)) {
    showMessage("Browser storage is unavailable. Please allow site storage and try again.", "error");
    return;
  }

  lastBooking = booking;
  selectedSeats.clear();
  renderSeats();
  updateSummary();

  showMessage(
    `Booking confirmed! ID: ${booking.id}. Your demo ticket is saved in My Bookings.`,
    "success"
  );

  showToast("🎟️ Booking confirmed!");

  // Open booking history so the confirmation is easy to see.
  setTimeout(() => {
    showPage("mybookings");
  }, 1000);
}

// MY BOOKINGS

function formatDate(date) {
  if (!date) return "Not selected";

  const parts = date.split("-").map(Number);
  if (parts.length !== 3 || parts.some(part => !Number.isFinite(part))) {
    return escapeHTML(date);
  }

  return new Date(parts[0], parts[1] - 1, parts[2])
    .toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
}

function renderBookingHistory() {
  const bookings = readBookings();
  const container = $("booking-history");

  if (!bookings.length) {
    container.innerHTML = `
      <div class="empty-state">
        <span>🎟️</span>
        <h3>Your story starts here.</h3>
        <p>You haven't booked any demo tickets yet. Find a movie and reserve your seats.</p>
        <button class="btn btn-primary" data-page="movies">Explore movies →</button>
      </div>`;
    return;
  }

  container.innerHTML = bookings.map(booking => `
    <article class="history-card">
      <div class="history-icon">${escapeHTML(booking.icon || "🎬")}</div>
      <div>
        <h3>${escapeHTML(booking.title)}</h3>
        <p>${escapeHTML(formatDate(booking.date))} · ${escapeHTML(booking.time)}</p>
        <p>Seats: ${escapeHTML((booking.seats || []).join(", "))}</p>
        <p>Booking ID: ${escapeHTML(booking.id)}</p>
      </div>
      <div class="history-price">
        ₹${Number(booking.total) || 0}
        <span>✓ Demo confirmed</span>
      </div>
    </article>
  `).join("");
}

// INITIALIZE

$("selected-movie").innerHTML =
  '<option value="">Select a movie</option>' +
  movies.map(movie =>
    `<option value="${movie.id}">${escapeHTML(movie.title)} — ₹${movie.price}</option>`
  ).join("");

$("show-date").min = localDate();
$("show-date").value = localDate();

$("selected-movie").addEventListener("change", () => {
  selectedSeats.clear();
  renderSeats();
  updateSummary();
});

$("show-date").addEventListener("change", updateSummary);
$("show-time").addEventListener("change", updateSummary);
$("book-button").addEventListener("click", bookTickets);

renderHomeMovies();
renderMovies();
renderSeats();
updateSummary();

showPage(location.hash.slice(1) || "home", false);
