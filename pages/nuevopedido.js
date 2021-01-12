import React, { useContext } from "react";
import Layout from "../components/Layout";
import AsignarCliente from "../components/pedidos/AsignarCliente";
import AsignarAlimentos from "../components/pedidos/AsignarAlimentos";
import ResumenPedido from "../components/pedidos/ResumenPedido";
import Total from "../components/pedidos/Total";
import { gql, useMutation } from '@apollo/client'
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';

// Context de Pedidos
import PedidoContext from "../context/pedidos/PedidoContext";

const NUEVO_PEDIDO = gql`
    mutation nuevoPedido($input: PedidoInput){
        nuevoPedido(input: $input){
            id
        }
    }
`;

const OBTENER_PEDIDOS = gql`
    query obtenerPedidos{
        obtenerPedidos{
            id
            pedido{
                id
                cantidad
                nombre
            }
            total
            cliente {
                id
                nombre
                apellido
                direccion
                cedula
            }
            estado
        }
    }
`;

const NuevoPedido = () => {

    const router = useRouter();

    // Utilizar context y extraer sus valores
    const pedidoContext = useContext(PedidoContext);
    const { cliente, alimentos, total } = useContext(PedidoContext);

    const { id } = cliente;

    // Mutation para crear un nuevo pedido
    const [ nuevoPedido ] = useMutation(NUEVO_PEDIDO, {
        update( cache, { data: { nuevoPedido } } ) {
            const { obtenerPedidos } = cache.readQuery({
                query: OBTENER_PEDIDOS,
            });

            cache.writeQuery({
                query: OBTENER_PEDIDOS,
                data: {
                    obtenerPedidos: [...obtenerPedidos, nuevoPedido ]
                }
            })
        }
    })

    const validarPedido = () => {

        if(alimentos !== null )
            return !alimentos.every( alimento => alimento.cantidad > 0 ) || total === 0 || cliente.length === 0 ? " opacity-50 cursor-not-allowed " : "" ;
    }

    const crearNuevoPedido = async () => {

        const { id } = cliente;

        // Remover lo no deseado de alimento
        const pedido = alimentos.map(( { __typename, tipo, descripcion, creado, ...alimento } ) => alimento)

        try {
            const { data } = await nuevoPedido({
                variables: {
                    input: {
                        cliente: id,
                        total,
                        pedido
                    }
                }
            });
            // console.log(data);

            // Redireccionar
            router.push('/pedidos');

            // Mostrar mensaje
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
                title: 'Pedido Creado'
              })

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Layout>
        <h1 className="text-2xl text-gray-800 font-light">Crear Nuevo Pedido</h1>
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <AsignarCliente />
                    <AsignarAlimentos />
                    <ResumenPedido />
                    <Total />

                    <button
                        type="button"
                        className = { ` group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-500 focus:outline-none focus:border-orange-700 focus:shadow-outline-orange active:bg-orange-700 transition duration-150 ease-in-out mt-10 ${ validarPedido() }` }
                        onClick = {() => crearNuevoPedido() }
                    > Registrar Pedido </button>
                </div>
            </div>
        </Layout>
    );
};

export default NuevoPedido;
