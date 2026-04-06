require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const axios = require("axios");
const crypto = require("crypto");

const { USER_ROLE, USER_STATUS } = require("../../utils/constants");

const prisma = new PrismaClient();
const TMDB_API_KEY = process.env.TMDB_API_KEY;

function stableObjectId(value) {
  return crypto.createHash("md5").update(value).digest("hex").slice(0, 24);
}

// ================= SAFE AXIOS =================
async function safeAxiosGet(url, retries = 3) {
  try {
    return await axios.get(url, { timeout: 15000 });
  } catch (err) {
    if (retries > 0) {
      const delay = (4 - retries) * 2000;
      console.log(`🔁 Retry in ${delay / 1000}s...`);
      await new Promise(r => setTimeout(r, delay));
      return safeAxiosGet(url, retries - 1);
    }
    throw err;
  }
}

// ================= FALLBACK MOVIES =================
function getFallbackMovies() {
  console.log("⚠️ Using fallback movies (offline mode)");

  return [
    {
      name: "Inception",
      poster: "https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0"
    },
    {
      name: "Interstellar",
      poster: "https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E"
    },
    {
      name: "The Dark Knight",
      poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=EXeTwQWrcwY"
    },
    {
      name: "Avengers Endgame",
      poster: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=TcMBFSGVi1c"
    },
    {
      name: "Joker",
      poster: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=zAGVQLHvwOY"
    },
    {
      name: "Titanic",
      poster: "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=kVrqfYjkTdQ"
    },
    {
      name: "Avatar",
      poster: "https://image.tmdb.org/t/p/w500/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=5PSNL1qE6VY"
    },
    {
      name: "John Wick",
      poster: "https://image.tmdb.org/t/p/w500/fZPSd91yGE9fCcCe6OoQr6E0VdX.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=2AUmvWm5ZDQ"
    },
    {
      name: "RRR",
      poster: "https://image.tmdb.org/t/p/w500/ljHwDPz4W5gP5Q3H2Bklq4H3b2C.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=f_vbAtFSEc0"
    },
    {
      name: "KGF Chapter 2",
      poster: "https://image.tmdb.org/t/p/w500/khNv0LxQK3WcT0Q8tW3n3dC7JxB.jpg",
      trailerUrl: "https://www.youtube.com/watch?v=JKa05nyUmuQ"
    }
  ];
}

// ================= FETCH MOVIES =================
async function fetchMoviesFromTMDB() {
  if (!TMDB_API_KEY) {
    console.log("⚠️ TMDB API key missing → using fallback movies");
    return getFallbackMovies();
  }

  try {
    const movies = [];

    console.log("📡 Calling TMDB API...");

    const res = await safeAxiosGet(
      `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&page=1`
    );

    for (let movie of res.data.results) {
      try {
        const videoRes = await safeAxiosGet(
          `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${TMDB_API_KEY}`
        );

        const trailer = videoRes.data.results.find(v =>
          v.type === "Trailer" &&
          v.site === "YouTube" &&
          v.official === true &&
          v.name.toLowerCase().includes("trailer")
        );

        if (
          !trailer ||
          !movie.poster_path ||
          trailer.name.toLowerCase().includes("teaser") ||
          trailer.name.toLowerCase().includes("clip")
        ) {
          continue;
        }

        movies.push({
          name: movie.title,
          poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          trailerUrl: `https://www.youtube.com/watch?v=${trailer.key}`
        });

        console.log(`✅ Added: ${movie.title}`);

        if (movies.length >= 20) break;

      } catch (err) {}
    }

    // 🚨 fallback if API failed
    if (movies.length === 0) {
      return getFallbackMovies();
    }

    return movies;

  } catch (error) {
    console.log("❌ TMDB failed → switching to fallback");
    return getFallbackMovies();
  }
}

// ================= MAIN SEED =================
async function seedDemo() {
  try {
    if (process.env.NODE_ENV === "production") return;

    const hashedPassword = await bcrypt.hash(process.env.DEMO_PASSWORD, 10);
    const users = ["rahul", "priya", "amit", "neha", "arjun"];
    const cities = [
      "Chandigarh", "Delhi", "Mumbai", "Bangalore", "Pune",
      "Hyderabad", "Chennai", "Kolkata", "Ahmedabad", "Jaipur"
    ];

    await prisma.payment.deleteMany({});
    await prisma.booking.deleteMany({});
    await prisma.show.deleteMany({});
    await prisma.theatre.deleteMany({});
    await prisma.movie.deleteMany({});
    await prisma.user.deleteMany({
      where: {
        OR: [
          { email: { in: users.map((name) => `${name}@demo.com`) } },
          { email: { startsWith: "owner", endsWith: "@demo.com" } }
        ]
      }
    });

    // USERS
    for (let name of users) {
      await prisma.user.upsert({
        where: { email: `${name}@demo.com` },
        update: {
          name,
          password: hashedPassword,
          userRole: USER_ROLE.customer,
          userStatus: USER_STATUS.approved
        },
        create: {
          id: stableObjectId(`demo-user:${name}`),
          name,
          email: `${name}@demo.com`,
          password: hashedPassword,
          userRole: USER_ROLE.customer,
          userStatus: USER_STATUS.approved
        }
      });
    }

    console.log("👤 Users seeded");

    // OWNERS
    const owners = [];

    for (let i = 1; i <= 10; i++) {
      const owner = await prisma.user.upsert({
        where: { email: `owner${i}@demo.com` },
        update: {
          name: `Owner ${i}`,
          password: hashedPassword,
          userRole: USER_ROLE.client,
          userStatus: USER_STATUS.approved
        },
        create: {
          id: stableObjectId(`demo-owner:${i}`),
          name: `Owner ${i}`,
          email: `owner${i}@demo.com`,
          password: hashedPassword,
          userRole: USER_ROLE.client,
          userStatus: USER_STATUS.approved
        }
      });

      owners.push(owner);
    }

    console.log("🏢 Owners seeded");

    // MOVIES
    console.log("⏳ Fetching movies...");
    const moviesData = await fetchMoviesFromTMDB();

    const movies = [];

    for (let [index, m] of moviesData.entries()) {
      const movie = await prisma.movie.upsert({
        where: { id: stableObjectId(`demo-movie:${index}:${m.name}`) },
        update: {
          name: m.name,
          description: `${m.name} blockbuster movie`,
          casts: ["Actor"],
          trailerUrl: m.trailerUrl,
          language: "English",
          releaseDate: new Date("2026-04-01T00:00:00.000Z"),
          director: "Director",
          releaseStatus: "RELEASED",
          poster: m.poster
        },
        create: {
          id: stableObjectId(`demo-movie:${index}:${m.name}`),
          name: m.name,
          description: `${m.name} blockbuster movie`,
          casts: ["Actor"],
          trailerUrl: m.trailerUrl,
          language: "English",
          releaseDate: new Date("2026-04-01T00:00:00.000Z"),
          director: "Director",
          releaseStatus: "RELEASED",
          poster: m.poster
        }
      });

      movies.push(movie);
    }

    console.log(`🎬 ${movies.length} Movies seeded`);

    // THEATRES
    const theatres = [];

    for (let i = 0; i < 10; i++) {
      const theatre = await prisma.theatre.upsert({
        where: { id: stableObjectId(`demo-theatre:${cities[i]}`) },
        update: {
          name: `PVR ${cities[i]}`,
          city: cities[i],
          pincode: 160001 + i,
          ownerId: owners[i].id,
          movieIds: movies.map(m => m.id)
        },
        create: {
          id: stableObjectId(`demo-theatre:${cities[i]}`),
          name: `PVR ${cities[i]}`,
          city: cities[i],
          pincode: 160001 + i,
          ownerId: owners[i].id,
          movieIds: movies.map(m => m.id)
        }
      });

      theatres.push(theatre);
    }

    console.log("🏟 Theatres seeded");

    // SHOWS
    const showTimes = [
      "2026-04-10T09:00:00.000Z",
      "2026-04-10T13:00:00.000Z",
      "2026-04-10T18:00:00.000Z",
      "2026-04-10T21:00:00.000Z"
    ];

    for (let t of theatres) {
      for (let m of movies) {
        for (let time of showTimes) {
          await prisma.show.upsert({
            where: {
              id: stableObjectId(`demo-show:${t.id}:${m.id}:${time}`)
            },
            update: {
              theatreId: t.id,
              movieId: m.id,
              timing: new Date(time),
              noOfSeats: 100,
              price: 150 + Math.floor(Math.random() * 200),
              format: "2D"
            },
            create: {
              id: stableObjectId(`demo-show:${t.id}:${m.id}:${time}`),
              theatreId: t.id,
              movieId: m.id,
              timing: new Date(time),
              noOfSeats: 100,
              price: 150 + Math.floor(Math.random() * 200),
              format: "2D"
            }
          });
        }
      }
    }

    console.log("🎟 Shows seeded");

  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = seedDemo;
