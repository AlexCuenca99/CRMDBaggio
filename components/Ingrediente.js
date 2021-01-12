import React from 'react';
import Swal from 'sweetalert2';
import { gql, useMutation } from '@apollo/client';
import Router, { useRouter } from 'next/router';

const ELIMINAR_INGREDIENTE = gql`
    mutation eliminarIngrediente($id: ID!){
        eliminarIngrediente(id: $id)
    }
`;

const OBTENER_INGREDIENTES = gql`
    query obtenerIngredientes {
        obtenerIngredientes {
            id
            nombre
            precio
            existencia
            elaboracion
            vencimiento
        }
    }
`;

const Ingrediente = ({ingrediente}) => {

    //Routing para editar ingredinte
    const router = useRouter();

    //Mutation para eliminar ingrediente
    const [ eliminarIngrediente ] = useMutation(ELIMINAR_INGREDIENTE, {
        update(cache) {
            const { obtenerIngredientes } = cache.readQuery({
                query: OBTENER_INGREDIENTES
            });

            cache.writeQuery({
                query: OBTENER_INGREDIENTES,
                data: {
                    obtenerIngredientes: obtenerIngredientes.filter( ingredienteActual => ingredienteActual.id !== id )
                }
            })
        }
    });

    const { id, nombre, precio, existencia, elaboracion, vencimiento } = ingrediente;

    const confirmarEliminarIngrediente = () => {

        Swal.fire({
            title: '¿Está seguro de eliminar este ingrediente?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar ingrediente',
            cancelButtonText: 'No, cancelar'
        }).then( async (result) => {   
            if (result.isConfirmed) {
                try {
                    // Elminar producto de la BD
                    const { data } = await eliminarIngrediente({
                        variables: {
                            id
                        }
                    });
                    
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
                        title: 'Ingrediente Eliminado Correctamente'
                      })
                } catch (error) {
                    console.log(error);
                }
            }
        })
    }

    const editarIngrediente = () => {
        Router.push({
            pathname: '/editaringrediente/[id]',
            query: { id }
        })
    } 

    return (
        <tr>
            <td className="px-6 py-4 text-sm leading-5 font-medium text-gray-900"> {nombre} </td>
            <td className="px-6 py-4 text-sm leading-5 font-medium text-gray-900"> {existencia} </td>
            <td className="px-6 py-4 text-sm leading-5 font-medium text-gray-900"> $ {precio} </td>
            <td className="px-6 py-4 text-sm leading-5 font-medium text-gray-900"> {elaboracion} </td>
            <td className="px-6 py-4 text-sm leading-5 font-medium text-gray-900"> {vencimiento} </td>
            <td className="px-6 py-4 text-sm leading-5 font-medium text-gray-900">
                <button
                    type="button"
                    className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-200 text-red-800"
                    onClick={ () => confirmarEliminarIngrediente() }
                >
                    Eliminar
                </button>
            </td>
            <td className="px-6 py-4 text-sm leading-5 font-medium text-gray-900">
                <button
                    type="button"
                    className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-200 text-green-800"
                    onClick={ () => editarIngrediente(id) }
                >
                    Editar
                </button>
            </td>
        </tr>
    );
}
 
export default Ingrediente;