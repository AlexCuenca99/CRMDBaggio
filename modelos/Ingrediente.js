const mongoose = require('mongoose');

const IngredientesSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true
    },
    existencia: {
        type: Number,
        required: true,
        trim: true
    },
    precio: {
        type: Number,
        required: true,
        trim: true
    },
    elaboracion: {
        type: Date,
        required: true,
        trim: true
    },
    vencimiento: {
        type: Date,
        required: true,
        trim: true
    },
    creado: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Ingrediente', IngredientesSchema);