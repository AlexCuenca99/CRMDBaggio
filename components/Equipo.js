import React from 'react';
import { gql, useMutation } from '@apollo/client';
import Swal from 'sweetalert2';
import Router from 'next/router';

const ELIMINAR_EQUIPO = gql`
    mutation eliminarEquipo($id: ID!){
        eliminarEquipo(id: $id)
    }
`;

const OBTENER_EQUIPOS = gql`
    query obtenerEquipos{
        obtenerEquipos{
            id
            nombre
            marca
            cantidad
            precio
            creado
        }
    }
`;

const Equipo = ({ equipo }) => {

    // Objeto de datos de tipo equipo
    const { id, nombre, marca, cantidad, precio } = equipo;

    //Mutation para eliminar un equipo
    const [ eliminarEquipo ] = useMutation(ELIMINAR_EQUIPO, {
        update(cache){
            const { obtenerEquipos } = cache.readQuery({
                query: OBTENER_EQUIPOS
            });

            cache.writeQuery({
                query: OBTENER_EQUIPOS,
                data: {
                    obtenerEquipos: obtenerEquipos.filter(  equipoActual => equipoActual.id !== id)
                }
            })
        }
    });

    // Funcion para eliminar un equipo
    const confirmarEliminarEquipo = () => {
        Swal.fire({
            title: '¿Está seguro de eliminar este alimento?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar alimento',
            cancelButtonText: 'No, cancelar'
        }).then( async (result) => {   
            if (result.isConfirmed) {
                try {
                    // Elminar equipo de la BD
                    const { data } = await eliminarEquipo({
                        variables: {
                            id
                        }
                    });
                    
                    // Mostrar alerta
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
                        title: 'Equipo Eliminado Correctamente'
                      })
                } catch (error) {
                    console.log(error);
                }
            }
        })
    }

    const editarEquipo = () => {
        Router.push({
            pathname: '/editarequipo/[id]',
            query: { id }
        })
    }

    return (
        <tr>
            <td className="px-6 py-4 text-sm leading-5 font-medium text-gray-900"> {nombre} </td>
            <td className="px-6 py-4 text-sm leading-5 font-medium text-gray-900"> {marca} </td>
            <td className="px-6 py-4 text-sm leading-5 font-medium text-gray-900"> $ {precio} </td>
            <td className="px-6 py-4 text-sm leading-5 font-medium text-gray-900"> {cantidad} </td>
            <td className="px-6 py-4 text-sm leading-5 font-medium text-gray-900">
                <button
                    type="button"
                    className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-200 text-red-800"
                    onClick={ () => confirmarEliminarEquipo() }
                >
                    Eliminar
                </button>
            </td>
            <td className="px-6 py-4 text-sm leading-5 font-medium text-gray-900">
                <button
                    type="button"
                    className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-200 text-indigo-800"
                    onClick={ () => editarEquipo(id) }
                >
                    Editar
                </button>
            </td>
        </tr>
    );
}
 
export default Equipo;