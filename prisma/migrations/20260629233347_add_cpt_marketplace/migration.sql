-- CreateTable
CREATE TABLE "CptCourse" (
    "id" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "description" JSONB NOT NULL,
    "price" INTEGER NOT NULL,
    "videoUrl" TEXT,
    "thumbnailUrl" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CptCourse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CptPurchase" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "stripeSessionId" TEXT NOT NULL,
    "amountPaid" INTEGER NOT NULL,
    "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CptPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CptPurchase_stripeSessionId_key" ON "CptPurchase"("stripeSessionId");

-- CreateIndex
CREATE INDEX "CptPurchase_courseId_idx" ON "CptPurchase"("courseId");

-- CreateIndex
CREATE INDEX "CptPurchase_email_idx" ON "CptPurchase"("email");

-- AddForeignKey
ALTER TABLE "CptPurchase" ADD CONSTRAINT "CptPurchase_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "CptCourse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
