import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const password = await hash("Password1", 12);

  const user = await prisma.user.upsert({
    where: { email: "Email1" },
    update: {},
    create: {
      email: "Email1",
      username: "Username1",
      password,
    },
  });

  console.log({ user });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
