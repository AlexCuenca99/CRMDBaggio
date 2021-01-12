import React from 'react';
import Swal from 'sweetalert2'
import { gql, useMutation } from '@apollo/client'
import Router from 'next/router';

const ELIMINAR_CLIENTE = gql `
    mutation eliminarCliente($id: ID!){
        eliminarCliente(id: $id)
    }
`;

const OBTENER_CLIENTES = gql`
  query obtenerClientes{
    obtenerClientes{
      id
      nombre
      apellido
      cedula
      direccion
      creado
    }  
  }
`;

const Cliente = ({ cliente }) => {

    //Mutation para eliminar un cliente
    const [ eliminarCliente ] = useMutation(ELIMINAR_CLIENTE, {
        update(cache){
            //Obtener una copia del objeto de cache
            const { obtenerClientes } = cache.readQuery({ query: OBTENER_CLIENTES });

            //Reescribir cache
            cache.writeQuery({
                query: OBTENER_CLIENTES,
                data: {
                    obtenerClientes : obtenerClientes.filter( clienteActual => clienteActual.id !== id )
                }
            })
        }
    });

    const { nombre, apellido, cedula, direccion, id } = cliente;

    //Eliminar un cliente
    const confirmarEliminarCliente = () => {
        Swal.fire({
            title: '¿Está seguro de eliminar este cliente?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar cliente',
            cancelButtonText: 'No, cancelar'
        }).then( async (result) => {   
            if (result.isConfirmed) {
                
                try {

                    //Eliminar por ID
                    const { data } = await  eliminarCliente({
                        variables: {
                            id
                        }
                    });

                    //console.log(data);
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
                        title: data.eliminarCliente
                      })
                } catch (error) {
                    console.log(error);
                }
            }
        })
    }

    const editarCliente = () => {
        Router.push({
            pathname: '/editarcliente/[id]', 
            query: { id }
        })
    }
    return (
        <tr>
                <td className="px-6 py-4 text-sm leading-5 font-medium text-gray-900">{nombre} {apellido}</td>
                <td className="px-6 py-4 text-sm leading-5 font-medium text-gray-900">{cedula} </td>
                <td className="px-6 py-4 text-sm leading-5 font-medium text-gray-900">{direccion} </td>
                <td className="px-6 py-4 text-sm leading-5 font-medium text-gray-900">
                    <button
                        type="button"
                        className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-200 text-red-800"
                        onClick={ () => confirmarEliminarCliente(id) }
                    >
                        Eliminar
                    </button>
                </td>
                <td className="px-6 py-4 text-sm leading-5 font-medium text-gray-900">
                    <button
                        type="button"
                        className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-200 text-green-800"
                        onClick={ () => editarCliente(id) }
                    >
                        Editar
                    </button>
                </td>
        </tr>
    )
    ;
}
 
export default Cliente;