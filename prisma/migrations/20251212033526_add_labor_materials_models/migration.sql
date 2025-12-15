-- CreateEnum
CREATE TYPE "LaborType" AS ENUM ('STAFF', 'NMT', 'CONTRACT');

-- CreateEnum
CREATE TYPE "LaborStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "MaterialStatus" AS ENUM ('ORDERED', 'DELIVERED', 'IN_USE', 'DEPLETED');

-- CreateTable
CREATE TABLE "labor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "designation" TEXT,
    "department" TEXT,
    "contact" TEXT,
    "daily_rate" DOUBLE PRECISION,
    "type" "LaborType" NOT NULL,
    "status" "LaborStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "labor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "materials" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "supplier" TEXT,
    "cost_per_unit" DOUBLE PRECISION,
    "total_cost" DOUBLE PRECISION,
    "delivery_date" TIMESTAMP(3),
    "status" "MaterialStatus" NOT NULL DEFAULT 'ORDERED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_updates" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "weather" TEXT,
    "work_done" TEXT NOT NULL,
    "labor_count" INTEGER NOT NULL,
    "issues" TEXT,
    "photos" TEXT,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_updates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "status_board" (
    "id" TEXT NOT NULL,
    "project_name" TEXT NOT NULL,
    "phase" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "status_board_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "labor_type_idx" ON "labor"("type");

-- CreateIndex
CREATE INDEX "labor_status_idx" ON "labor"("status");

-- CreateIndex
CREATE INDEX "materials_category_idx" ON "materials"("category");

-- CreateIndex
CREATE INDEX "materials_status_idx" ON "materials"("status");

-- CreateIndex
CREATE INDEX "daily_updates_date_idx" ON "daily_updates"("date");
