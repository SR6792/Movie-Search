const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const OMDB_API_KEY = 'cbb546d7';
const USERS_FILE = path.join(__dirname, 'data', 'users.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, '[]');
}

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'movie-search-secret-key-2026',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Make user available to all templates
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.error = null;
    res.locals.success = null;
    next();
});

// Helper: read/write users
function getUsers() {
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
}
function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Helper: fetch from OMDB
async function omdbSearch(query) {
    const url = `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${OMDB_API_KEY}`;
    const res = await fetch(url);
    return res.json();
}
async function omdbDetails(imdbID) {
    const url = `https://www.omdbapi.com/?i=${encodeURIComponent(imdbID)}&plot=full&apikey=${OMDB_API_KEY}`;
    const res = await fetch(url);
    return res.json();
}

// ==================== ROUTES ====================

// Home / Search
app.get('/', async (req, res) => {
    const query = req.query.q || '';
    let movies = [];
    let searchError = null;

    if (query) {
        try {
            const data = await omdbSearch(query);
            if (data.Response === 'True') {
                movies = data.Search;
            } else {
                searchError = data.Error;
            }
        } catch (e) {
            searchError = 'Failed to fetch movies. Please try again.';
        }
    }

    res.render('home', { query, movies, searchError });
});

// Movie detail
app.get('/movie/:id', async (req, res) => {
    try {
        const movie = await omdbDetails(req.params.id);
        if (movie.Response === 'False') {
            return res.render('home', { query: '', movies: [], searchError: 'Movie not found.' });
        }
        res.render('movie', { movie });
    } catch (e) {
        res.render('home', { query: '', movies: [], searchError: 'Failed to load movie details.' });
    }
});

// Login page
app.get('/login', (req, res) => {
    if (req.session.user) return res.redirect('/');
    res.render('login', { error: null });
});

// Login POST
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const users = getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
        return res.render('login', { error: 'No account found with that email.' });
    }
    if (!bcrypt.compareSync(password, user.password)) {
        return res.render('login', { error: 'Invalid password.' });
    }

    req.session.user = { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
    res.redirect('/');
});

// Register page
app.get('/register', (req, res) => {
    if (req.session.user) return res.redirect('/');
    res.render('register', { error: null });
});

// Register POST
app.post('/register', (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password) {
        return res.render('register', { error: 'All fields are required.' });
    }
    if (password.length < 6) {
        return res.render('register', { error: 'Password must be at least 6 characters.' });
    }
    if (password !== confirmPassword) {
        return res.render('register', { error: 'Passwords do not match.' });
    }

    const users = getUsers();
    if (users.find(u => u.email === email)) {
        return res.render('register', { error: 'An account with that email already exists.' });
    }

    const hashed = bcrypt.hashSync(password, 10);
    const newUser = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2),
        name,
        email,
        password: hashed,
        createdAt: new Date().toISOString()
    };
    users.push(newUser);
    saveUsers(users);

    req.session.user = { id: newUser.id, name: newUser.name, email: newUser.email, createdAt: newUser.createdAt };
    res.redirect('/');
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Profile page (login info)
app.get('/profile', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    res.render('profile');
});

app.listen(PORT, () => {
    console.log(`🎬 Movie Search SSR running at http://localhost:${PORT}`);
});
