const { PrismaClient } = require("./src/generated/prisma");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const password = "Tauquir@1";
  const passwordHash = await bcrypt.hash(password, 10);

  // 1. Create or get workspace
  let workspace = await prisma.workspace.findFirst({
    where: { name: "Main Workspace" }
  });

  if (!workspace) {
    workspace = await prisma.workspace.create({
      data: {
        name: "Main Workspace",
        tier: "PRO"
      }
    });
    console.log("Created Main Workspace");
  }

  // 2. Upsert Shayaan
  const shayaan = await prisma.user.upsert({
    where: { email: "Shayaan499@gmail.com" },
    update: { passwordHash, name: "Shayaan" },
    create: {
      email: "Shayaan499@gmail.com",
      name: "Shayaan",
      passwordHash
    }
  });

  // Add Shayaan to workspace as OWNER/ADMIN
  await prisma.workspaceMember.upsert({
    where: {
      userId_workspaceId: {
        userId: shayaan.id,
        workspaceId: workspace.id
      }
    },
    update: { role: "OWNER" },
    create: {
      userId: shayaan.id,
      workspaceId: workspace.id,
      role: "OWNER"
    }
  });
  console.log("Added Shayaan499@gmail.com as ADMIN/OWNER");

  // 3. Upsert bonej
  const bonej = await prisma.user.upsert({
    where: { email: "bonej2613@gmail.com" },
    update: { passwordHash, name: "Bonej" },
    create: {
      email: "bonej2613@gmail.com",
      name: "Bonej",
      passwordHash
    }
  });

  // Add bonej to workspace as MEMBER
  await prisma.workspaceMember.upsert({
    where: {
      userId_workspaceId: {
        userId: bonej.id,
        workspaceId: workspace.id
      }
    },
    update: { role: "MEMBER" },
    create: {
      userId: bonej.id,
      workspaceId: workspace.id,
      role: "MEMBER"
    }
  });
  console.log("Added bonej2613@gmail.com as MEMBER");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Database seeded successfully!");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
