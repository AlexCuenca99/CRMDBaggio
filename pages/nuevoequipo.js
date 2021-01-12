import React from 'react';
import Layout from '../components/Layout';
import { useFormik } from 'formik'
import * as Yup from 'yup';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';

const NUEVO_EQUIPO = gql`
    mutation nuevoEquipo($input: EquipoInput){
        nuevoEquipo(input: $input){
            id
            nombre
            marca
            cantidad
            precio
            creado
        }
    }
`;

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

const NuevoEquipo = () => {

    // Routing para crear nuevo equipo
    const router = useRouter();

    //Mutation para crear nuevo equipo
    const [ nuevoEquipo ] = useMutation(NUEVO_EQUIPO, {
        update( cache, { data: { nuevoEquipo } } ) {

            // Obtener el objeto de cache
            const { obtenerEquipos } = cache.readQuery({ query: OBTENER_EQUIPOS });

            // Reescribir el objeto
            cache.writeQuery({
                query: OBTENER_EQUIPOS,
                data: {
                    obtenerEquipos: [ ...obtenerEquipos, nuevoEquipo ]
                }
            })
        }
    });

    const formik = useFormik({

        initialValues: {
            nombre: '',
            marca: '',
            precio: '',
            cantidad: ''
        },
        validationSchema: Yup.object({
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
        }),
        onSubmit: async valores => {
            const { nombre, marca, precio, cantidad } = valores;

            try {
                const { data } = await nuevoEquipo({
                    variables: {
                        input: {
                            nombre,
                            marca,
                            precio,
                            cantidad
                        }
                    }
                });

                //console.log(data);

                // Redireccionar  hacia alimentos
                router.push('/equipos');

                //Mostrar un mensaje de alerta
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
                    title: 'Equipo Creado'
                  })

            } catch (error) {
                console.log(error);
            }
        }
    })

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Nuevo Equipo</h1>

            <div className="flex justify-center mt-5">
                <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd"></path></svg>
            </div>

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <form
                        // className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
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
                                placeholder="Nombre del Equipo"
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
                            <label className="block text-sm leading-5 font-medium text-gray-700 mb-2 mt-4" htmlFor="marca">
                                Marca
                            </label>
                            <input 
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-orange-300 focus:z-10 sm:text-sm sm:leading-5"
                                id="marca"
                                type="text"
                                placeholder="Marca del Equipo"
                                value={formik.values.marca}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>

                        { formik.touched.marca && formik.errors.marca ? (
                            <div className="mb-2 bg-red-100 border-l-4 border-red-500 text-red-700">
                                {/* <p className="font-bold">Error</p> */}
                                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">{ formik.errors.marca }</p>
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
                            <label className="block text-sm leading-5 font-medium text-gray-700 mb-2 mt-4" htmlFor="cantidad">
                                Cantidad
                            </label>
                            <input 
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-orange-300 focus:z-10 sm:text-sm sm:leading-5"
                                id="cantidad"
                                type="number"
                                placeholder="Cantidad del Equipo"
                                value={formik.values.cantidad}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>

                        { formik.touched.cantidad && formik.errors.cantidad ? (
                            <div className="mb-2 bg-red-100 border-l-4 border-red-500 text-red-700">
                                {/* <p className="font-bold">Error</p> */}
                                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">{ formik.errors.cantidad }</p>
                            </div>
                        ) : null }

                        <input
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-500 focus:outline-none focus:border-orange-700 focus:shadow-outline-orange active:bg-orange-700 transition duration-150 ease-in-out mt-10"
                            value="Agregar Nuevo Equipo"
                        />      

                    </form>
                </div>
            </div>
        </Layout>
    );
}
 
export default NuevoEquipo;