/*
  Warnings:

  - Added the required column `updatedAt` to the `Compra` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `CompraDetalle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Producto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Proveedor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Sucursal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Venta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `VentaDetalle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Compra" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "CompraDetalle" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Producto" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Proveedor" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Stock" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Sucursal" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Venta" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "VentaDetalle" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
