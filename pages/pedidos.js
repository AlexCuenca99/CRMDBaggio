import Layout from '../components/Layout';
import Pedido from '../components/Pedido';
import Link from 'next/link';
import { gql, useQuery } from '@apollo/client'

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

const Pedidos = () => {

    const { data, loading, error } = useQuery(OBTENER_PEDIDOS);

    if(loading) return 'Cargando...';

    const { obtenerPedidos } = data;

    return ( 
        <div>
            <Layout>
                <h1 className="text-2xl text-gray-800 font-light">Pedidos</h1>
                <Link href="/nuevopedido">
                <a className="mb-3 mt-3 inline-block py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-500 focus:outline-none focus:border-orange-700 focus:shadow-outline-orange active:bg-orange-700 transition duration-150 ease-in-out">
                        Nuevo Pedido
                    </a>
                </Link>

                { obtenerPedidos.length === 0 ? (
                    <p className="mt-5 text-center text-2xl"> No existen pedidos </p>
                ) : (
                    obtenerPedidos.map( pedido => (
                        <Pedido
                            key = { pedido.id }
                            pedido = { pedido  }
                        />
                    ) )
                )}
            </Layout>
        </div>
     );
}
 
export default Pedidos;