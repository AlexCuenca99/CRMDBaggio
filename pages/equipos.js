import Layout from '../components/Layout';
import Equipo from '../components/Equipo'
import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';

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

const Equipos = () => {

    // Query para obtener equipos
    const { data, loading, error } = useQuery(OBTENER_EQUIPOS);

    // console.log(data);
    // console.log(loading);
    // console.log(error);

    if(loading) return 'Cargando...';

    return ( 
        <div>
            <Layout>
                <h1 className="text-2xl text-gray-800 font-light">Equipos</h1>

                <Link href="/nuevoequipo">
                    <a className="mb-3 mt-3 inline-block py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-500 focus:outline-none focus:border-orange-700 focus:shadow-outline-orange active:bg-orange-700 transition duration-150 ease-in-out">
                        Nuevo Equipo
                    </a>
                </Link>

                <div className="overflow-x-scroll">
                    <table className="table-auto divide-y mt-10 w-full w-lg divide-gray-50">
                        <thead>
                            <tr className="px-6 py-3 border-b border-gray-200 bg-gray-200 text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                            <th className="px-6 py-3 border-b border-gray-200 bg-gray-200 text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-3 border-b border-gray-200 bg-gray-200 text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">Marca</th>
                            <th className="px-6 py-3 border-b border-gray-200 bg-gray-200 text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">Precio</th>
                            <th className="px-6 py-3 border-b border-gray-200 bg-gray-200 text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">Cantidad</th>
                            <th className="px-6 py-3 border-b border-gray-200 bg-gray-200 text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">Eliminar</th>
                            <th className="px-6 py-3 border-b border-gray-200 bg-gray-200 text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">Editar</th>
                            </tr>
                        </thead>

                        <tbody className="bg-white">
                            {data.obtenerEquipos.map( equipo => (
                            <Equipo
                                key={equipo.id}
                                equipo={equipo}
                            />
                            ))}
                        </tbody>
                    </table>
                </div>
            </Layout>
        </div>
     );
}
 
export default Equipos;