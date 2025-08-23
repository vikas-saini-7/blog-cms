// Add this function before the createBlog export
const findUniqueSlug = async (title) => {
  const baseSlug = slugify(title, { lower: true, strict: true });

  // Check if base slug exists
  const existingPost = await prisma.post.findUnique({
    where: { slug: baseSlug },
  });

  if (!existingPost) {
    return baseSlug;
  }

  // Generate attractive suffixes (2-5 characters max)
  const suffixes = [
    "x",
    "v2",
    "pro",
    "new",
    "plus",
    "xl",
    "max",
    "neo",
    "alt",
    "ex",
  ];

  // Try with attractive suffixes first
  for (const suffix of suffixes) {
    const candidateSlug = `${baseSlug}-${suffix}`;
    const existing = await prisma.post.findUnique({
      where: { slug: candidateSlug },
    });

    if (!existing) {
      return candidateSlug;
    }
  }

  // If all attractive suffixes are taken, use numbers
  let counter = 1;
  while (counter <= 999) {
    const candidateSlug = `${baseSlug}-${counter}`;
    const existing = await prisma.post.findUnique({
      where: { slug: candidateSlug },
    });

    if (!existing) {
      return candidateSlug;
    }
    counter++;
  }

  // Fallback to timestamp if everything else fails
  return `${baseSlug}-${Date.now()}`;
};

module.exports = { findUniqueSlug };
