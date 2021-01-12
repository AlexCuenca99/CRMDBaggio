const mongoose = require('mongoose');

const EquiposSchema = mongoose.Schema({
    nombre: { 
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    marca: {
        type: String,
        required: true,
        trim: true
    },
    cantidad: {
        type: Number,
        required: true,
        trim: true
    },
    precio: {
        type: Number,
        required: true,
        trim: true
    },
    creado: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Equipo', EquiposSchema);