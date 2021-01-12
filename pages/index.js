import Layout from '../components/Layout';
import Cliente from '../components/Cliente';
import { gql, useQuery } from '@apollo/client'
import { useRouter } from 'next/router';
import Link from 'next/link'

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

export default function Index() {
  
  const router = useRouter();

  //Consulta de Apollo
  const { data, loading, client } = useQuery(OBTENER_CLIENTES);

  if(loading){
    return <p>Cargando...</p>
  }

  if(!data.obtenerClientes){
    client.clearStore();
    router.push('/login');
    return <p>Cargando...</p>
  }

  return (
    <div>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light">Clientes</h1>
        <Link href="/nuevoCliente">
          <a className="mb-3 mt-3 inline-block py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-500 focus:outline-none focus:border-orange-700 focus:shadow-outline-orange active:bg-orange-700 transition duration-150 ease-in-out">Nuevo Cliente</a>
        </Link>
        
        <div className="overflow-x-scroll">
          <table className="table-auto divide-y mt-10 w-full w-lg divide-gray-50">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-200 text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-200 text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">Cédula</th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-200 text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">Dirección</th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-200 text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">Eliminar</th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-200 text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">Editar</th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {data.obtenerClientes.map( cliente => (
                <Cliente
                  key={cliente.id}
                  cliente={cliente}
                />
              ))}
            </tbody>
          </table>
        </div>
      </Layout>
    </div>
  );
}
