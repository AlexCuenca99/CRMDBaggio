import React, { useState, useEffect, useContext } from "react";
import Select from "react-select";
import { gql, useQuery } from "@apollo/client";
import PedidoContext from "../../context/pedidos/PedidoContext";

const OBTENER_CLIENTES = gql`
    query obtenerClientes {
        obtenerClientes {
        id
        nombre
        apellido
        cedula
        direccion
        creado
        }
    }
`;

const AsignarCliente = () => {
    const [cliente, setCliente] = useState([]);

    // Context de pedidos
    const pedidoContext = useContext(PedidoContext);
    const { agregarCliente } = pedidoContext;

    // Query para la busqueda de un cliente
    const { data, loading, error } = useQuery(OBTENER_CLIENTES);

    useEffect(() => {
        agregarCliente(cliente);
    }, [cliente]);

    const seleccionarCliente = (clientes) => {
        setCliente(clientes);
    };

    // Resultado de la consulta
    if (loading) return null;

    const { obtenerClientes } = data;

    return (
        <>
        <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">
            1.- Asiga un Cliente al Pedido
        </p>
        <Select
            className="mt-3"
            options={obtenerClientes}
            onChange={(opcion) => seleccionarCliente(opcion)}
            getOptionValue={(opciones) => opciones.id}
            getOptionLabel={(opciones) => opciones.nombre}
            placeholder="Busque o seleccione el cliente"
            noOptionsMessage={() => "No hay resultados"}
        />
        </>
    );
};

export default AsignarCliente;
