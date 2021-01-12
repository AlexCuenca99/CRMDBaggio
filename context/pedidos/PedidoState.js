import React, { useReducer } from "react";
import PedidoContext from "./PedidoContext";
import PedidoReducer from "./PedidoReducer";

import {
    SELECCIONAR_CLIENTE,
    SELECCIONAR_ALIMENTO,
    CANTIDAD_ALIMENTO,
    ACTUALIZAR_TOTAL
} from "../../types";

const PedidoState = ({ children }) => {
    // State de pedidos
    const initialState = {
    cliente: {},
    alimentos: [],
    total: 0,
};

const [state, dispatch] = useReducer(PedidoReducer, initialState);

    // Modificar el Cliente
    const agregarCliente = (cliente) => {
        // console.log(cliente);
        dispatch({
            type: SELECCIONAR_CLIENTE,
            payload: cliente,
        })
    }

    // Modifica los alimentos
    const agregarAlimento = alimentosSeleccionados => {
        
        let nuevoState;

        if( state.alimentos !== null && alimentosSeleccionados !== null && state.alimentos.length > 0 ) {
            // Toamr del segundo arreglo, una copia para asignarlo al primero
            nuevoState = alimentosSeleccionados.map( alimento => {
                const nuevoObjeto  = state.alimentos.find( alimentoState => alimentoState.id === alimento.id  );
                return { ...alimento, ...nuevoObjeto }
            } );
        }else{
            nuevoState = alimentosSeleccionados;
        }

        dispatch({
            type: SELECCIONAR_ALIMENTO,
            payload: nuevoState
        })
    }

    // Modiica las cantidades de los productos
    const cantidadAlimentos = nuevoAlimento => {
        dispatch({
            type: CANTIDAD_ALIMENTO,
            payload: nuevoAlimento
        })
    }

    const actualizarTotal = () => {
        dispatch({
            type: ACTUALIZAR_TOTAL
        })
    }

    return (
        <PedidoContext.Provider
        value={{
            cliente: state.cliente,
            alimentos: state.alimentos,
            total: state.total,
            agregarCliente,
            agregarAlimento,
            cantidadAlimentos,
            actualizarTotal
        }}
        >
        {" "}
        {children}
        </PedidoContext.Provider>
    );
};

export default PedidoState;
