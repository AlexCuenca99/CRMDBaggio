//#region 
import React from 'react';
import Swal from 'sweetalert2';
import { gql, useMutation } from '@apollo/client';
import Router from 'next/router';
//#endregion

const ELIMINAR_ALIMENTO = gql`
    mutation eliminarAlimento($id: ID!){
        eliminarAlimento(id: $id)
    }
`;

const OBTENER_ALIMENTOS = gql`
    query obtenerAlimentos{
        obtenerAlimentos{
            id
            nombre
            tipo
            descripcion
            precio
            creado
        }
    }
`;

const Alimento = ({ alimento }) => {

    //Objeto de datos de tipo alimento
    const { id, nombre, tipo, descripcion, precio } = alimento;

    // Mutation para eliminar un alimento
    const [ eliminarAlimento ] = useMutation(ELIMINAR_ALIMENTO, {
        update(cache) {
            const { obtenerAlimentos } = cache.readQuery({
                query: OBTENER_ALIMENTOS
            });

            cache.writeQuery({
                query: OBTENER_ALIMENTOS,
                data: {
                    obtenerAlimentos: obtenerAlimentos.filter( alimentoActual => alimentoActual.id !== id )
                }
            })
        }
    });

    // Funcion para eliminar un alimento
    const confirmarEliminarAlimento = () => {

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
                    // Elminar alimento de la BD
                    const { data } = await eliminarAlimento({
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
                        title: 'Alimento Eliminado Correctamente'
                      })
                } catch (error) {
                    console.log(error);
                }
            }
        })
    }

    const editarAlimento = () => {
        Router.push({
            pathname: '/editaralimento/[id]',
            query: { id }
        })
    }

    return (
        <tr>
            <td className="px-6 py-4 text-sm leading-5 font-medium text-gray-900"> {nombre} </td>
            <td className="px-6 py-4 text-sm leading-5 font-medium text-gray-900"> {tipo} </td>
            <td className="px-6 py-4 text-sm leading-5 font-medium text-gray-900"> $ {precio} </td>
            <td className="px-6 py-4 text-sm leading-5 font-medium text-gray-900"> {descripcion} </td>
            <td className="px-6 py-4 text-sm leading-5 font-medium text-gray-900">
                <button
                    type="button"
                    className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-200 text-red-800"
                    onClick={ () => confirmarEliminarAlimento() }
                >
                    Eliminar
                </button>
            </td>
            <td className="px-6 py-4 text-sm leading-5 font-medium text-gray-900">
                <button
                    type="button"
                    className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-200 text-indigo-800"
                    onClick={ () => editarAlimento(id) }
                >
                    Editar
                </button>
            </td>
        </tr>
    );
}
 
export default Alimento;