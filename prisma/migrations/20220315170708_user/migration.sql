-- CreateEnum
CREATE TYPE "Region" AS ENUM ('SUL', 'SUDESTE', 'NORTE', 'NORDESTE', 'CENTROOESTE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "email" TEXT,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "region" "Region" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
