import mongoose from 'mongoose'
const sucursalSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [ true, 'El nombre de la sucursal es obligatorio' ],
    unique: true
  },
  direccion: {
    type: String,
    required: [ true, 'La dirección de la sucursal es obligatoria' ]
  },
  telefono: {
    type: String,
    required: [ true, 'El teléfono de la sucursal es obligatorio' ]
  },
  encargado: {
    type: String,
    required: [ true, 'El encargado de la sucursal es obligatorio' ]
  },
  activa: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Sucursal', sucursalSchema);