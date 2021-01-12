import {
    SELECCIONAR_CLIENTE,
    SELECCIONAR_ALIMENTO,
    CANTIDAD_ALIMENTO,
    ACTUALIZAR_TOTAL
} from "../../types";

export default (state, action) => {
    switch (action.type) {
        case SELECCIONAR_CLIENTE:
            return {
                ...state,
                cliente: action.payload
            }
        case SELECCIONAR_ALIMENTO:
                return {
                    ...state,
                    alimentos: action.payload
                }
        case CANTIDAD_ALIMENTO:
            return {
                ...state,
                alimentos: state.alimentos.map( alimento => alimento.id === action.payload.id ? alimento = action.payload : alimento )
            }
        case ACTUALIZAR_TOTAL:
            return {
                ...state,
                total: state.alimentos.reduce( ( nuevoTotal, articulo ) => nuevoTotal += articulo.precio * articulo.cantidad, 0 )
            }
        default:
        return state;
    }
};
