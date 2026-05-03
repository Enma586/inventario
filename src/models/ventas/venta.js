import mongoose from "mongoose";

import { METHODS_PAYMENT, STATUS_ORDER } from "../../constants/index.js";

const ventaSchema = new mongoose.Schema(
  {
    numero_factura: {
      type: String,
      required: true,
      unique: true,
    },
    // Recuperamos la sucursal
    id_sucursal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sucursal",
      required: true,
    },
    fecha: {
      type: Date,
      default: Date.now,
    },
    cliente: {
      nombre: {
        type: String,
        required: true,
      },
      nit: {
        type: String,
        required: true,
      },
    },
    items: [
      {
        id_producto: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Producto",
          required: true,
        },
        nombre_snapshot: {
          type: String,
          required: true,
        },
        precio_unitario_venta: {
          type: Number,
          required: true,
          min: 0,
        },
        cantidad: {
          type: Number,
          required: true,
          min: 1,
        },
        subtotal: {
          type: Number,
          required: true,
        },
      },
    ],
    impuestos: {
      type: Number,
      required: true,
      default: 0,
    },
    total_pagado: {
      type: Number,
      required: true,
      min: 0,
    },
    metodo_pago: {
      type: String,
      enum: METHODS_PAYMENT,
      required: true,
    },
    estado: {
      type: String,
      enum: STATUS_ORDER,
      default: "Pendiente",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Venta", ventaSchema);
