import { Router } from "express";
import authRoutes from "./auth.routes.js";

import { usuarioRoutes, empleadoRoutes } from "./usuarios/index.js";
import {
  categoriaRoutes,
  proveedorRoutes,
  productoRoutes,
} from "./productos/index.js";
import { sucursalRoutes, stockRoutes } from "./sucursal/index.js";
import { ventaRoutes, ventaDetalleRoutes } from "./ventas/index.js";
import { compraRoutes, compraDetalleRoutes } from "./compras/index.js";
import { bitacoraRoutes } from "./bitacora/index.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/usuarios", usuarioRoutes);
router.use("/empleados", empleadoRoutes);
router.use("/categorias", categoriaRoutes);
router.use("/proveedores", proveedorRoutes);
router.use("/productos", productoRoutes);
router.use("/sucursales", sucursalRoutes);
router.use("/stocks", stockRoutes);
router.use("/ventas", ventaRoutes);
router.use("/ventas/:idVenta/detalles", ventaDetalleRoutes);
router.use("/compras", compraRoutes);
router.use("/compras/:idCompra/detalles", compraDetalleRoutes);
router.use("/bitacora", bitacoraRoutes);

export default router;
