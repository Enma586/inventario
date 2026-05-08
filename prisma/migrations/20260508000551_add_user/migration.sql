/*
  Warnings:

  - A unique constraint covering the columns `[codigo_generacion]` on the table `Venta` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Producto" DROP CONSTRAINT "Producto_id_categoria_fkey";

-- DropForeignKey
ALTER TABLE "Producto" DROP CONSTRAINT "Producto_id_proveedor_fkey";

-- AlterTable
ALTER TABLE "Producto" ALTER COLUMN "id_categoria" DROP NOT NULL,
ALTER COLUMN "id_proveedor" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Venta" ADD COLUMN     "cliente_email" TEXT,
ADD COLUMN     "codigo_generacion" TEXT,
ADD COLUMN     "estado_dte" TEXT NOT NULL DEFAULT 'PENDIENTE',
ADD COLUMN     "sello_recepcion" TEXT;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nombre_usuario" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_nombre_usuario_key" ON "User"("nombre_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Venta_codigo_generacion_key" ON "Venta"("codigo_generacion");

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "Categoria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_id_proveedor_fkey" FOREIGN KEY ("id_proveedor") REFERENCES "Proveedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
