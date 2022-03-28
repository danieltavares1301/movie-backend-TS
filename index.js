import prisma from '@prisma/client';

const prismaClient = new prisma.PrismaClient();

(async () => {
  try {
    await prismaClient.user.create({
      data: {
        name: 'Daniel',
        email: 'daniel@email.com',
        password: '123',
        phone: '999999',
        birthDate: new Date(),
        country: 'Brasil',
      },
    });
  } catch (error) {
    console.log(error);
  }
})();

// teste
