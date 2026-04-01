require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { USER_ROLE, USER_STATUS } = require('../../utils/constants');

const prisma = new PrismaClient();

async function seedDemo() {
  if (process.env.NODE_ENV === "production") return;

  const hashedPassword = await bcrypt.hash(process.env.DEMO_PASSWORD, 10);

  // USERS
  const users = ["rahul", "priya", "amit", "neha", "arjun"];

  for (let name of users) {
    await prisma.user.upsert({
      where: { email: `${name}@demo.com` },
      update: {},
      create: {
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

  for (let i = 1; i <= 5; i++) {
    const owner = await prisma.user.upsert({
      where: { email: `owner${i}@demo.com` },
      update: {},
      create: {
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
  const movies = [];
  const names = ["Jawan", "Animal", "Pathaan", "KGF 2", "Pushpa"];

  for (let name of names) {
    const movie = await prisma.movie.upsert({
      where: { name },
      update: {},
      create: {
        name,
        description: `${name} movie`,
        casts: ["Actor A"],
        trailerUrl: "https://youtube.com",
        language: "Hindi",
        releaseDate: new Date(),
        director: "Director",
        releaseStatus: "RELEASED",
        poster: "url"
      }
    });
    movies.push(movie);
  }

  console.log("🎬 Movies seeded");

  // THEATRES
  const theatres = [];

  for (let i = 0; i < 5; i++) {
    const theatre = await prisma.theatre.upsert({
      where: { name: `Theatre ${i + 1}` },
      update: {},
      create: {
        name: `Theatre ${i + 1}`,
        city: "Chandigarh",
        pincode: 160001,
        ownerId: owners[i].id,
        movieIds: movies.map(m => m.id)
      }
    });
    theatres.push(theatre);
  }

  console.log("🏟 Theatres seeded");

  // SHOWS
  await prisma.show.deleteMany({});

  let count = 0;
  for (let t of theatres) {
    for (let m of movies) {
      if (count >= 20) break;

      await prisma.show.create({
        data: {
          theatreId: t.id,
          movieId: m.id,
          timing: new Date(),
          noOfSeats: 100,
          price: 200
        }
      });

      count++;
    }
  }

  console.log("🎟 Shows seeded");
}

module.exports = seedDemo;