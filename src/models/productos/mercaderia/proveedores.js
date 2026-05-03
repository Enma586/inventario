import mongoose from 'mongoose'

const proveedorSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del proveedor es obligatorio'],
        unique: true,
        trim: true
    },
    direccion: {
        type: String,
        required: [true, 'La dirección del proveedor es obligatoria'],
        trim: true
    },
    telefono: {
        type: String,
        required: [true, 'El teléfono del proveedor es obligatorio'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'El correo electrónico del proveedor es obligatorio'],
        unique: true,
        trim: true
    }
}, {
    timestamps: true    
})

export default mongoose.model('Proveedor', proveedorSchema)