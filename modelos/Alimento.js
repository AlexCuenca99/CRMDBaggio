const mongoose = require('mongoose');

const AlimentosSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    tipo: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        required: false,
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

AlimentosSchema.index({ nombre: 'text' });

module.exports = mongoose.model('Alimento', AlimentosSchema);