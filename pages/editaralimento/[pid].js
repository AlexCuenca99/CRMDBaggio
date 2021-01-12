import React from 'react';
import { useRouter } from 'next/router'
import Layout from '../../components/Layout';
import { gql, useQuery, useMutation } from '@apollo/client';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

const OBTENER_ALIMENTO = gql`
    query obtenerAlimento($id: ID!){
            obtenerAlimento(id: $id){
            id
            nombre
            tipo
            descripcion
            precio
        }
    }
`;

const ACTUALIZAR_ALIMENTO = gql`
    mutation actualizarAlimento($id: ID!, $input: AlimentoInput){
        actualizarAlimento(id: $id, input: $input){
            id
            nombre
            tipo
            descripcion
            precio
        }
    }
`;

const EditarAlimento = () => {

    //Routing para editar alimento
    const router = useRouter();

    const { query: { id } }= router;
    // console.log(id);

    // Query para obtener alimento
    const {data, loading, error} = useQuery(OBTENER_ALIMENTO, {
        variables: {
            id
        }
    });

    // Mutation para actualizar alimento
    const [ actualizarAlimento ] = useMutation( ACTUALIZAR_ALIMENTO );

    // Schema de Validacion
    const schemaValidacion = Yup.object({
        nombre: Yup.string()
                    .required('El nombre es obligatorio'),
        tipo: Yup.string()
                .required('El tipo es obligatorio')
                .matches(/Pizza|Lasaña|Ensalada|Bebida/, 'El tipo no es válido'),
        precio: Yup.number()
                    .required('El precio es obligatorio')
                    .positive('El precio debe ser positivo'),
        descripcion: Yup.string()
                        .required('La descripción es obligatoria')
                        .min(10, 'La descripción debe tener al menos 10 caracteres')
    });

    if(loading) return 'Cargando...';

    if(!data) return 'Acción no permitida';
    
    const actualizarInfoAlimento = async valores => {
        // console.log(vkalores);
        const { nombre, tipo, precio, descripcion } = valores;

        try {
            
            const { data } = await actualizarAlimento({
                variables: {
                    id,
                    input: {
                        nombre,
                        tipo,
                        precio,
                        descripcion
                    }
                }
            });

            //console.log(data);

            // Redireccionar hacia alimentos
            router.push('/alimentos');

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
                title: 'Alimento Actualizado'
              })

        } catch (error) {  
            console.log(error);
        }
    }

    const { obtenerAlimento } = data;

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Editar Alimento</h1>
            
            <div className="flex justify-center mt-5">
                <svg class="w-20 h-20" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M6 3a1 1 0 011-1h.01a1 1 0 010 2H7a1 1 0 01-1-1zm2 3a1 1 0 00-2 0v1a2 2 0 00-2 2v1a2 2 0 00-2 2v.683a3.7 3.7 0 011.055.485 1.704 1.704 0 001.89 0 3.704 3.704 0 014.11 0 1.704 1.704 0 001.89 0 3.704 3.704 0 014.11 0 1.704 1.704 0 001.89 0A3.7 3.7 0 0118 12.683V12a2 2 0 00-2-2V9a2 2 0 00-2-2V6a1 1 0 10-2 0v1h-1V6a1 1 0 10-2 0v1H8V6zm10 8.868a3.704 3.704 0 01-4.055-.036 1.704 1.704 0 00-1.89 0 3.704 3.704 0 01-4.11 0 1.704 1.704 0 00-1.89 0A3.704 3.704 0 012 14.868V17a1 1 0 001 1h14a1 1 0 001-1v-2.132zM9 3a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm3 0a1 1 0 011-1h.01a1 1 0 110 2H13a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
            </div>

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">

                    <Formik
                        enableReinitialize
                        initialValues={ obtenerAlimento }
                        validationSchema = { schemaValidacion }
                        onSubmit={ valores => {
                            actualizarInfoAlimento( valores );
                        }}
                    >
                        { props => {
                            return(

                                <form
                                    // className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                                    onSubmit={props.handleSubmit}
                                >
                                    <div>
                                        <label className="block text-sm leading-5 font-medium text-gray-700 mb-2 mt-4" htmlFor="nombre">
                                            Nombre
                                        </label>
                                        <input 
                                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-orange-300 focus:z-10 sm:text-sm sm:leading-5"
                                            id="nombre"
                                            type="text"
                                            placeholder="Nombre del Alimento"
                                            value={props.values.nombre}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>

                                    { props.touched.nombre && props.errors.nombre ? (
                                        <div className="mb-2 bg-red-100 border-l-4 border-red-500 text-red-700">
                                            {/* <p className="font-bold">Error</p> */}
                                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">{ props.errors.nombre }</p>
                                        </div>
                                    ) : null }

                                    <div>
                                        <label className="block text-sm leading-5 font-medium text-gray-700 mb-2 mt-4" htmlFor="tipo">
                                            Tipo
                                        </label>
                                        <input 
                                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-orange-300 focus:z-10 sm:text-sm sm:leading-5"
                                            id="tipo"
                                            type="text"
                                            placeholder="Tipo de Alimento"
                                            value={props.values.tipo}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>

                                    { props.touched.tipo && props.errors.tipo ? (
                                        <div className="mb-2 bg-red-100 border-l-4 border-red-500 text-red-700">
                                            {/* <p className="font-bold">Error</p> */}
                                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">{ props.errors.tipo }</p>
                                        </div>
                                    ) : null }

                                    <div>
                                        <label className="block text-sm leading-5 font-medium text-gray-700 mb-2 mt-4" htmlFor="precio">
                                            Precio
                                        </label>
                                        <input 
                                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-orange-300 focus:z-10 sm:text-sm sm:leading-5"
                                            id="precio"
                                            type="number"
                                            placeholder="Precio del Alimento"
                                            value={props.values.precio}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>

                                    { props.touched.precio && props.errors.precio ? (
                                        <div className="mb-2 bg-red-100 border-l-4 border-red-500 text-red-700">
                                            {/* <p className="font-bold">Error</p> */}
                                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">{ props.errors.precio }</p>
                                        </div>
                                    ) : null }

                                    <div>
                                        <label className="block text-sm leading-5 font-medium text-gray-700 mb-2 mt-4" htmlFor="descripcion">
                                            Descripción
                                        </label>
                                        <input 
                                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-orange-300 focus:z-10 sm:text-sm sm:leading-5"
                                            id="descripcion"
                                            type="text"
                                            placeholder="Descripción del Alimento"
                                            value={props.values.descripcion}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>
                                    
                                    { props.touched.descripcion && props.errors.descripcion ? (
                                        <div className="mb-2 bg-red-100 border-l-4 border-red-500 text-red-700">
                                            {/* <p className="font-bold">Error</p> */}
                                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">{ props.errors.descripcion }</p>
                                        </div>
                                    ) : null }

                                    <input
                                        type="submit"
                                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-500 focus:outline-none focus:border-orange-700 focus:shadow-outline-orange active:bg-orange-700 transition duration-150 ease-in-out mt-10"
                                        value="Actualizar Alimento"
                                    />

                                </form>
                            )
                        }}
                    </Formik>
                </div>
            </div>
        </Layout>
    );
}
 
export default EditarAlimento;