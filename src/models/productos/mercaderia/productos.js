import mongoose from "mongoose";
import { STATUS_PRODUCT } from "../../constants/index";


const productoSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: [true, "El SKU es obligatorio"],
      unique: true,
      trim: true,
    },
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      unique: true,
      trim: true,
    },
    descripcion: {
      type: String,
      required: [true, "La descripción es obligatoria"],
      trim: true,
    },
    id_categoria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categoria",
      required: [true, "La categoría es obligatoria"],
    },
    id_proveedor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proveedor",
      required: [true, "El proveedor es obligatorio"],
    },
    estado: {
      type: String,
      enum: STATUS_PRODUCT,
      default: "Disponible",
      required: [true, "El estado es obligatorio"],
    },
    precios: {
      costo_compra: {
        type: Number,
        required: true,
        min: [0, "El costo no puede ser menor a 0"],
      },
      precio_venta: {
        type: Number,
        required: true,
        min: [0, "El precio de venta no puede ser menor a 0"],
      },
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Producto", productoSchema);