import React, { useState, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';
import Swal from 'sweetalert2';

const ACTUALIZAR_PEDIDO = gql`
    mutation actualizarPedido($id: ID!, $input: PedidoInput){
            actualizarPedido(id:$id, input: $input){
            estado
        }
    }
`;

const ELIMINAR_PEDIDO = gql`
    mutation eliminarPedido($id: ID!){
        eliminarPedido(id: $id)
    }
`;

const OBTENER_PEDIDOS = gql`
    query obtenerPedidos{
        obtenerPedidos{
            id
        }
    }
`;

const Pedido = ({ pedido }) => {

    const { id, total, cliente: { nombre, apellido, cedula, direccion }, estado, cliente } = pedido;

    // Mutation para cambiar el estadp de un pedido
    const [ actualizarPedido ] = useMutation( ACTUALIZAR_PEDIDO )
    const [ eliminarPedido ] = useMutation( ELIMINAR_PEDIDO, {
        update(cache){
            const { obtenerPedidos } = cache.readQuery({
                query: OBTENER_PEDIDOS
            });

            cache.writeQuery({
                query: OBTENER_PEDIDOS,
                data: {
                    obtenerPedidos: obtenerPedidos.filter( pedido => pedido.id !== id )
                }
            })
        }
    } )

    //console.log(pedido);

    const [ estadoPedido, setEstadoPedido ] = useState(estado);
    const [ clase, setClase ] = useState('');

    useEffect(() => {
        if( estadoPedido ){
            setEstadoPedido(estadoPedido);
        }
        clasePedido();
    }, [ estadoPedido ]);

    // Funcion que modifica el color del pedido acuerdo al estado
    const clasePedido = () => {
        if( estadoPedido === 'PENDIENTE' ){
            setClase('border-yellow-500')
        }else if ( estadoPedido === 'COMPLETADO' ){
            setClase('border-green-500')
        } else {
            setClase('border-red-800')
        }
    }

    const cambiarEstadoPedido = async nuevoEstado => {
        try {
            const { data } = await actualizarPedido({
                variables: {
                    id, 
                    input: {
                        estado: nuevoEstado,
                        cliente: cliente.id
                    }
                }
            });
            setEstadoPedido(data.actualizarPedido.estado);
        } catch (error) {
            console.log(error);
        }
    }

    const confirmarEliminarPedido = () => {
        Swal.fire({
            title: '¿Está seguro de eliminar este pedido?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar pedido',
            cancelButtonText: 'No, cancelar'
        }).then( async (result) => {   
            if (result.isConfirmed) {
                
                try {
                    //Eliminar por ID
                    const {data} = await eliminarPedido({
                        variables: {
                            id
                        }
                    });

                    //Mostrar una alerta
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                          toast.addEventListener('mouseenter', Swal.stopTimer)
                          toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                      })
                      
                      Toast.fire({
                        icon: 'success',
                        title: data.eliminarPedido
                      })
                } catch (error) {
                    console.log(error);
                }
            }
        })
    }
    return (
        <div className={` ${ clase } border-t-4 mt-4 bg-white rounded p-6 md:grid md:grid-cols-2 md:gap-4 shadow-lg`}>
            <div className="">
                <p className="font-bold text-gray-800">Cliente: { nombre } { apellido } </p>
                { cedula && (
                    <p className="flex items-center my-2">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path></svg>
                        { cedula }
                    </p>
                )}
                { direccion && (
                    <p className="flex items-center my-2">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        { direccion }
                    </p>
                )}
                <h2 className="text-gray-800 font-bold mt-10">Estado Pedido: </h2>

                <select
                    className="mt-2 p-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-200 text-indigo-800"
                    value = { estadoPedido }
                    onChange = { e => cambiarEstadoPedido( e.target.value ) }
                >
                    <option value="COMPLETADO"> COMPLETADO </option>
                    <option value="PENDIENTE"> PENDIENTE </option>
                    <option value="CANCELADO"> CANCELADO </option>
                </select>
            </div>

            <div>
                <h2 className="text-gray-800 font-bold mt-2">Resumen del Pedido</h2>
                { pedido.pedido.map( articulo => (
                    <div key={ articulo.id } className="mt-4 ">
                        <p className="text-sm text-gray-600">Producto: { articulo.nombre }</p>
                        <p className="text-sm text-gray-600">Cantidad: { articulo.cantidad }</p>
                    </div>
                )) }

                <p className="text-gray-800 mt-3 font-bold">Total a pagar:
                    <span className="font-light"> $ {total}</span>
                </p>

                <button
                    className="mt-8 p-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-200 text-red-800"
                    onClick={ () => confirmarEliminarPedido() }
                >
                    Eliminar Pedido
                </button>
            </div>
        </div>
    );
}
 
export default Pedido;