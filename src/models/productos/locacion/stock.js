import mongoose from 'mongoose'

const stockSchema = new mongoose.Schema({
  id_producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producto',
    required: [ true, 'El producto es obligatorio']
  },
  id_sucursal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sucursal',
    required: [true, 'La sucursal es obligatoria']
  },
  cantidad: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  pasillo_ubicacion: String, // Opcional: para saber dónde está el producto en esa tienda
  stock_minimo: {
    type: Number,
    default: 5
  }
}, { timestamps: true });

// Índice compuesto para evitar que un producto se repita en la misma sucursal
stockSchema.index({ id_producto: 1, id_sucursal: 1 }, { unique: true });

module.exports = mongoose.model('Stock', stockSchema);