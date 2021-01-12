import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { gql, useMutation } from '@apollo/client'
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';


const NUEVO_CLIENTE = gql`
    mutation nuevoCliente($input: ClienteInput){
        nuevoCliente(input: $input){
            id
            nombre
            apellido
            cedula
            direccion
        }
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

const NuevoCliente = () => {

    //Routing para nuevo cliente
    const router = useRouter();

    //Mensaje de alerta
    const [ mensaje, guardarMensaje ] = useState(null);

    //Mutation para crear nuevos clientes
    const [ nuevoCliente ] = useMutation( NUEVO_CLIENTE, {
        update( cache, { data: { nuevoCliente } } ) {
            //Obtener el objeto de cache que deseamos actualizar
            const{ obtenerClientes } = cache.readQuery({ query: OBTENER_CLIENTES });

            //Reescribir el cache
            cache.writeQuery({
                query: OBTENER_CLIENTES,
                data: {
                    obtenerClientes: [ ...obtenerClientes, nuevoCliente ]
                }
            })
        }
    });

    const formik = useFormik({
        initialValues: {
            nombre: '',
            apellido: '',
            cedula: '',
            direccion: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                    .required('El nombre es obligatorio'),
            apellido: Yup.string()
                        .required('El apellido es obligatorio'),
            cedula: Yup.string()
                        .required('La cédula es obligatoria')
                        .length(10, 'El número de caracteres no es válido'),
            direccion: Yup.string()
                            .required('La cédula es obligatoria')
        }),
        onSubmit: async valores => {
            
            const { nombre, apellido, cedula, direccion } = valores;

            try {
                const { data } = await nuevoCliente({
                    variables:{
                        input: {
                            nombre,
                            apellido,
                            cedula,
                            direccion
                        }
                    }
                });

                //console.log(data.nuevoCliente);
                router.push('/');

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
                    title: 'Cliente Registrado'
                  })

            } catch (error) {
                guardarMensaje(error.message);

                setTimeout(() => {
                    guardarMensaje(null);
                }, 2000);
            }
        }
    });

    const mostrarMensaje = () => {
        return(
            <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{ mensaje }</p>
            </div>
        )
    }

    return ( 
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Nuevo Cliente</h1>

            { mensaje && mostrarMensaje() }

            <div className="flex justify-center mt-5">
                <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
            </div>
            
            <div className="flex justify-center mt-5">
                
                <div className="w-full max-w-lg">
                    <form
                        //className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                        onSubmit={formik.handleSubmit}
                    >
                        <div>
                            <label className="block text-sm leading-5 font-medium text-gray-700 mb-2 mt-4" htmlFor="nombre">
                                Nombre
                            </label>
                            <input 
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-orange-300 focus:z-10 sm:text-sm sm:leading-5"
                                id="nombre"
                                type="text"
                                placeholder="Nombre del Cliente"
                                value={formik.values.nombre}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>

                        { formik.touched.nombre && formik.errors.nombre ? (
                                <div className="mb-2 bg-red-100 border-l-4 border-red-500 text-red-700">
                                    {/* <p className="font-bold">Error</p> */}
                                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">{ formik.errors.nombre }</p>
                                </div>
                        ) : null }

                        <div>
                            <label className="block text-sm leading-5 font-medium text-gray-700 mb-2 mt-4" htmlFor="apellido">
                                Apellido
                            </label>
                            <input 
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-orange-300 focus:z-10 sm:text-sm sm:leading-5"
                                id="apellido"
                                type="text"
                                placeholder="Apellido del Cliente"
                                value={formik.values.apellido}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        
                        { formik.touched.apellido && formik.errors.apellido ? (
                                <div className="mb-2 bg-red-100 border-l-4 border-red-500 text-red-700">
                                    {/* <p className="font-bold">Error</p> */}
                                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">{ formik.errors.apellido }</p>
                                </div>
                        ) : null }

                        <div>
                            <label className="block text-sm leading-5 font-medium text-gray-700 mb-2 mt-4" htmlFor="cedula">
                                Cédula
                            </label>
                            <input 
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-orange-300 focus:z-10 sm:text-sm sm:leading-5"
                                id="cedula"
                                type="text"
                                placeholder="Cédula del Cliente"
                                value={formik.values.cedula}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>

                        { formik.touched.cedula && formik.errors.cedula ? (
                                <div className="mb-2 bg-red-100 border-l-4 border-red-500 text-red-700">
                                    {/* <p className="font-bold">Error</p> */}
                                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">{ formik.errors.cedula }</p>
                                </div>
                        ) : null }

                        <div>
                            <label className="block text-sm leading-5 font-medium text-gray-700 mb-2 mt-4" htmlFor="direccion">
                                Dirección
                            </label>
                            <input 
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-orange-300 focus:z-10 sm:text-sm sm:leading-5"
                                id="direccion"
                                type="nombre"
                                placeholder="Dirección del Cliente"
                                value={formik.values.direccion}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        
                        { formik.touched.direccion && formik.errors.direccion ? (
                                <div className="mb-2 bg-red-100 border-l-4 border-red-500 text-red-700">
                                    {/* <p className="font-bold">Error</p> */}
                                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">{ formik.errors.direccion }</p>
                                </div>
                        ) : null }

                        <input
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-500 focus:outline-none focus:border-orange-700 focus:shadow-outline-orange active:bg-orange-700 transition duration-150 ease-in-out mt-10"
                            value="Registrar Cliente"
                        />

                    </form>
                </div>
            </div>
        </Layout>
    );
}
 
export default NuevoCliente;