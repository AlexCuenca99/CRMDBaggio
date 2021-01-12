import React from 'react';
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { gql, useMutation } from '@apollo/client'
import Swal from 'sweetalert2';
import { useRouter } from 'next/router'

const NUEVO_INGREDIENTE = gql`
    mutation nuevoIngrediente($input: IngredienteInput){
        nuevoIngrediente(input: $input){
            id
            nombre
            existencia
            precio
            elaboracion
            vencimiento
        }
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

const NuevoIngrediente = () => {

    //Routing de crear ingrediente
    const router = useRouter();

    // Mutation para crear nuevos ingredientes
    const [ nuevoIngrediente ] = useMutation(NUEVO_INGREDIENTE, {
        update(cache, { data: { nuevoIngrediente } }) {
            // Obtener el objeto de cache
            const {obtenerIngredientes} = cache.readQuery({ query: OBTENER_INGREDIENTES });

            // Reescribir el objeto
            cache.writeQuery({
                query: OBTENER_INGREDIENTES,
                data: {
                    obtenerIngredientes: [...obtenerIngredientes, nuevoIngrediente]
                }
            });
        }
    });

    // Variables para las fechas de ayer y hoy
    const yesterday = new Date(Date.now() -86400000);
    const today = new Date(Date.now() );
    
    // Formulario para nuevos ingredientes
    const formik = useFormik({
        initialValues: {
            nombre: '',
            existencia: '',
            precio: '',
            elaboracion: '',
            vencimiento: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                        .required('El nombre es obligatorio'),
            existencia: Yup.number()
                            .required('La cantidad es obligatoria')
                            .positive('La cantidad debe ser positiva')
                            .integer('La cantidad deber ser entera'),
            precio: Yup.number()
                        .required('El precio es obligatorio')
                        .positive('El precio debe ser positivo'),
            elaboracion: Yup.date()
                            .required('La fecha de elaboración es obligatoria')
                            .min('2015/12/30', 'La fecha no es válida')
                            .max(today, 'La fecha no es válida'),
            vencimiento: Yup.date()
                            .required('La fecha de vencimiento es obligatoria')
                            .min(yesterday, 'La fecha no es válida')
                            .max('2030/12/30', 'La fecha no es válida')
        }),
        onSubmit: async valores => {
            
            const { nombre, existencia, precio, elaboracion, vencimiento } = valores;
            try {
                const { data } = await nuevoIngrediente ({
                    variables: {
                        input: {
                            nombre, 
                            existencia,
                            precio,
                            elaboracion,
                            vencimiento
                        }
                    }
                });

                //console.log(data);

                // Mostrar una alerta
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
                    title: 'Ingrediente Agregado Correctamente'
                  });

                // Redireccionar hacia ingredientes
                router.push('/ingredientes');

            } catch (error) {
                console.log(error);
            }
        }
    })

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Nuevo Ingrediente</h1>
            
            <div className="flex justify-center mt-5">
                <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
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
                                placeholder="Nombre del Ingrediente"
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
                            <label className="block text-sm leading-5 font-medium text-gray-700 mb-2 mt-4" htmlFor="existencia">
                                Cantidad
                            </label>
                            <input 
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-orange-300 focus:z-10 sm:text-sm sm:leading-5"
                                id="existencia"
                                type="number"
                                placeholder="Cantidad del Ingrediente"
                                value={formik.values.existencia}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>

                        { formik.touched.existencia && formik.errors.existencia ? (
                                <div className="mb-2 bg-red-100 border-l-4 border-red-500 text-red-700">
                                    {/* <p className="font-bold">Error</p> */}
                                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">{ formik.errors.existencia }</p>
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
                                placeholder="Precio del Ingrediente"
                                value={formik.values.precio}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>

                        { formik.touched.precio && formik.errors.precio ? (
                                <div className="mb-2 bg-red-100 border-l-4 border-red-500 text-red-700">
                                    {/* <p className="font-bold">Error</p> */}
                                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">{ formik.errors.precio }</p>
                                </div>
                        ) : null }

                        <div>
                            <label className="block text-sm leading-5 font-medium text-gray-700 mb-2 mt-4" htmlFor="elaboracion">
                                Elaboración
                            </label>
                            <input 
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-orange-300 focus:z-10 sm:text-sm sm:leading-5"
                                id="elaboracion"
                                type="date"
                                placeholder="Elaboración del Ingrediente"
                                value={formik.values.elaboracion}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        
                        { formik.touched.elaboracion && formik.errors.elaboracion ? (
                                <div className="mb-2 bg-red-100 border-l-4 border-red-500 text-red-700">
                                    {/* <p className="font-bold">Error</p> */}
                                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">{ formik.errors.elaboracion }</p>
                                </div>
                        ) : null }

                        <div>
                            <label className="block text-sm leading-5 font-medium text-gray-700 mb-2 mt-4" htmlFor="vencimiento">
                                Vencimiento
                            </label>
                            <input 
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-orange-300 focus:z-10 sm:text-sm sm:leading-5"
                                id="vencimiento"
                                type="date"
                                placeholder="Vencimiento del Ingrediente"
                                value={formik.values.vencimiento}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>

                        { formik.touched.vencimiento && formik.errors.vencimiento ? (
                                <div className="mb-2 bg-red-100 border-l-4 border-red-500 text-red-700">
                                    {/* <p className="font-bold">Error</p> */}
                                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">{ formik.errors.vencimiento }</p>
                                </div>
                        ) : null }

                        <input
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-500 focus:outline-none focus:border-orange-700 focus:shadow-outline-orange active:bg-orange-700 transition duration-150 ease-in-out mt-10"
                            value="Agregar Nuevo Ingrediente"
                        />

                    </form>
                </div>
            </div>
        </Layout>
    );
}
 
export default NuevoIngrediente;