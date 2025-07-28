const { PrismaClient } = require("../src/generated/prisma/client");

const prisma = new PrismaClient();

async function main() {
  const categories = [
    {
      name: "Web Development",
      slug: "web-development",
      description: "All things related to front-end and back-end development.",
    },
    {
      name: "Artificial Intelligence",
      slug: "artificial-intelligence",
      description: "AI news, tutorials, and research updates.",
    },
    {
      name: "Productivity",
      slug: "productivity",
      description: "Tips and tools to help you get more done.",
    },
    {
      name: "Tech News",
      slug: "tech-news",
      description: "Latest updates and trends in technology.",
    },
    {
      name: "Open Source",
      slug: "open-source",
      description: "Explore and contribute to open source projects.",
    },
    {
      name: "Startups",
      slug: "startups",
      description: "Learn about new startups and business ideas.",
    },
    {
      name: "Game Development",
      slug: "game-development",
      description: "Creating games, engines, and graphics.",
    },
    {
      name: "Mobile Development",
      slug: "mobile-development",
      description: "iOS, Android, and cross-platform app development.",
    },
    {
      name: "Machine Learning",
      slug: "machine-learning",
      description: "ML concepts, tutorials, and models.",
    },
    {
      name: "Design",
      slug: "design",
      description: "UI/UX, graphics, and digital product design.",
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log("✅ Categories seeded successfully");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding categories:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
