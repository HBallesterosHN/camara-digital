-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "municipality" TEXT NOT NULL,
    "linkedin" TEXT,
    "website" TEXT,
    "expertiseAreas" TEXT[],
    "contributionTypes" TEXT[],
    "professionalSummary" TEXT NOT NULL,
    "committeeContribution" TEXT NOT NULL,
    "committeeExpectation" TEXT NOT NULL,
    "consent" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Member_department_idx" ON "Member"("department");

-- CreateIndex
CREATE INDEX "Member_createdAt_idx" ON "Member"("createdAt");
