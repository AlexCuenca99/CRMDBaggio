import React from 'react';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router'
import { gql, useQuery, useMutation } from '@apollo/client';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

const OBTENER_EQUIPO = gql`
    query obtenerEquipo($id: ID!){
        obtenerEquipo(id: $id){
            id
            nombre
            marca
            cantidad
            precio
        }
    }
`;

const ACTUALIZAR_EQUIPO = gql`
    mutation actualizarEquipo($id: ID!, $input: EquipoInput){
        actualizarEquipo(id: $id, input: $input){
            id
            nombre
            marca
            cantidad
            precio
        }
    }
`;

const EditarEquipo = () => {

    const router = useRouter();
    
    const { query: { id } } = router;

    // Query para obtener un equipo
    const { data, loading, error } = useQuery( OBTENER_EQUIPO, {
        variables: {
            id
        }
    });

    // Mutation para actualizar equipo
    const [ actualizarEquipo ] = useMutation(ACTUALIZAR_EQUIPO);

    // Schema de validacion
    const schemaValidacion = Yup.object({
        nombre: Yup.string()
                    .required('El nombre es obligatorio')
                    .min(2, 'El nombre debe tener al menos 2 caracteres'),
        marca: Yup.string()
                    .required('La marca es necesaria')
                    .min(2, 'La marca debe tener al menos 2 caracteres'),
        precio: Yup.number()
                    .required('El precio es obligatorio')
                    .positive('El precio deber ser positivo')
                    .moreThan(0, 'El precio no es válido'),
        cantidad: Yup.number()
                    .required('La cantidad es obligatoria')
                    .integer('La cantidad no es válida')
                    .positive('La cantidad debe ser positiva')
                    .moreThan(0, 'La cantidad no es válida')
    });

    if(loading) return 'Cargando...';
    
    if (!data) return 'Accion no permitida...';
    
    const actualizarInfoEquipo = async valores => {
            
        const { nombre, marca, precio, cantidad } = valores;

        try {
            
            const { data } = await actualizarEquipo({
                variables: {
                    id,
                    input: {
                        nombre,
                        marca,
                        precio,
                        cantidad
                    }
                }
            });

            // Redireccionar hacia alimentos
            router.push('/equipos');

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
                title: 'Equipo Actualizado'
              })

        } catch (error) {  
            console.log(error);
        }
    }

    const { obtenerEquipo } = data;

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Editar Equipo</h1>

            <div className="flex justify-center mt-5">
                <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd"></path></svg>
            </div>

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">

                    <Formik
                        enableReinitialize
                        initialValues = { obtenerEquipo }
                        validationSchema = { schemaValidacion }
                        onSubmit = { valores => {
                            actualizarInfoEquipo( valores );
                        }}
                    >

                        { props => {
                            return (

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
                                            placeholder="Nombre del Equipo"
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
                                        <label className="block text-sm leading-5 font-medium text-gray-700 mb-2 mt-4" htmlFor="marca">
                                            Marca
                                        </label>
                                        <input 
                                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-orange-300 focus:z-10 sm:text-sm sm:leading-5"
                                            id="marca"
                                            type="text"
                                            placeholder="Marca del Equipo"
                                            value={props.values.marca}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>

                                    { props.touched.marca && props.errors.marca ? (
                                        <div className="mb-2 bg-red-100 border-l-4 border-red-500 text-red-700">
                                            {/* <p className="font-bold">Error</p> */}
                                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">{ props.errors.marca }</p>
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
                                            placeholder="Precio del Equipo"
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
                                        <label className="block text-sm leading-5 font-medium text-gray-700 mb-2 mt-4" htmlFor="cantidad">
                                            Cantidad
                                        </label>
                                        <input 
                                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-orange-300 focus:z-10 sm:text-sm sm:leading-5"
                                            id="cantidad"
                                            type="number"
                                            placeholder="Cantidad del Equipo"
                                            value={props.values.cantidad}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>

                                    { props.touched.cantidad && props.errors.cantidad ? (
                                        <div className="mb-2 bg-red-100 border-l-4 border-red-500 text-red-700">
                                            {/* <p className="font-bold">Error</p> */}
                                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">{ props.errors.cantidad }</p>
                                        </div>
                                    ) : null }

                                    <input
                                        type="submit"
                                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-500 focus:outline-none focus:border-orange-700 focus:shadow-outline-orange active:bg-orange-700 transition duration-150 ease-in-out mt-10"
                                        value="Actualizar Equipo"
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
 
export default EditarEquipo;