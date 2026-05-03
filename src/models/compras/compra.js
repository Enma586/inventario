import mongoose from 'mongoose'
import { STATUS_ORDER   } from '../../constants'

const compraSchema = new mongoose.Schema({
  numero_orden: {
    type: String,
    required: true,
    unique: true
  },
  id_proveedor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proveedor',
    required: true
  },
  fecha_compra: {
    type: Date,
    default: Date.now
  },
  detalles_items: [{
    id_producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Producto',
      required: true
    },
    cantidad: {
      type: Number,
      required: true,
      min: 1
    },
    costo_unitario: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  total_compra: {
    type: Number,
    required: true,
    min: 0
  },
  estado_entrega: {
    type: String,
    enum: STATUS_ORDER,
    default: 'Pendiente'
  }
}, { timestamps: true });

module.exports = mongoose.model('Compra', compraSchema);