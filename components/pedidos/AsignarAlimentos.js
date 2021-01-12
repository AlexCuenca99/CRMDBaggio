import React, { useEffect, useState, useContext } from "react";
import Select from "react-select";
import { gql, useQuery } from "@apollo/client";
import PedidoContext from "../../context/pedidos/PedidoContext";

const OBTENER_ALIMENTOS = gql`
    query obtenerAlimentos {
        obtenerAlimentos {
            id
            nombre
            tipo
            descripcion
            precio
            creado
        }
    }
`;

const AsignarAlimentos = () => {

    // State local del componente
    const [ alimentos, setAlimentos ] = useState([]);

    // Context de pedidos
    const pedidoContext = useContext(PedidoContext);
    const { agregarAlimento } = pedidoContext;

    // Query para la busqueda de alimentos
    const { data, loading, error } = useQuery(OBTENER_ALIMENTOS);

    useEffect( () => {
        // TODO : Funcion para pasar a PedidoState
        agregarAlimento(alimentos);
    }, [alimentos]) 

    const seleccionarAlimento = alimento => {
        setAlimentos(alimento);
    }

    if (loading) return null;

    const { obtenerAlimentos } = data;
    return (
        <>
        <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">
            2.- Selecciona o busca los alimentos
        </p>
        <Select
            className="mt-3"
            options={obtenerAlimentos}
            onChange={(opcion) => seleccionarAlimento(opcion)}
            isMulti = { true }
            getOptionValue={(opciones) => opciones.id}
            getOptionLabel={(opciones) => `${opciones.nombre} - Tipo ${opciones.tipo}`}
            placeholder="Busque o seleccione el alimento"
            noOptionsMessage={() => "No hay resultados"}
        />
        </>
    );
};

export default AsignarAlimentos;
