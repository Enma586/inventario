import mongoose from "mongoose";


const categoriaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre de la categoría es obligatorio"],
      unique: true,
      trim: true,
    },
    descripcion: {
      type: String,
      required: [true, "La descripción de la categoría es obligatoria"],
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Categoria", categoriaSchema);