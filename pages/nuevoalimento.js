import React from 'react';
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { gql, useMutation } from '@apollo/client'
import { useRouter } from 'next/router';

const NUEVO_ALIMENTO = gql`
    mutation nuevoAlimento($input: AlimentoInput){
        nuevoAlimento(input: $input){
            id
            nombre
            tipo
            descripcion
            precio
            creado
        }
    }
`;

const OBTENER_ALIMENTOS = gql`
    query obtenerAlimentos{
            obtenerAlimentos{
            id
            nombre
            tipo
            descripcion
            precio
            creado
        }
    }
`;

const NuevoAlimento = () => {

    // Routing para nuevo alimento
    const router = useRouter();

    // Mutation para crear nuevos alimentos
    const [ nuevoAlimento ] = useMutation(NUEVO_ALIMENTO, {
        update(cache, { data: { nuevoAlimento } }) {
            // Obtener el objeto de cache
            const { obtenerAlimentos } = cache.readQuery({ query: OBTENER_ALIMENTOS });

            //Reescribir el objeto
            cache.writeQuery({
                query: OBTENER_ALIMENTOS,
                data: {
                    obtenerAlimentos: [...obtenerAlimentos, nuevoAlimento]
                } 
            })
        }
    });

    //Formulario para nuevos alimentos
    const formik = useFormik({
        initialValues: {
            nombre: '',
            tipo: '',
            precio: '',
            descripcion: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                        .required('El nombre es obligatorio'),
            tipo: Yup.string()
                    .required('El tipo es obligatorio')
                    .matches(/Pizza|Lasaña|Ensalada|Bebida/, 'El tipo no es válido'),
            precio: Yup.number()
                        .required('El precio es obligatorio')
                        .positive('El precio debe ser positivo')
                        .moreThan(0, 'El precio no es válido'),
            descripcion: Yup.string()
                            .required('La descripción es obligatoria')
                            .min(10, 'La descripción debe tener al menos 10 caracteres')
        }),
        onSubmit: async valores => {
            
            const { nombre, tipo, precio, descripcion } = valores;

            try {
                const { data } = await nuevoAlimento({
                    variables: {
                        input: {
                            nombre,
                            tipo,
                            precio,
                            descripcion
                        }
                    }
                });

                //console.log(data);

                // Redireccionar  hacia alimentos
                router.push('/alimentos');

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
                    title: 'Alimento Creado'
                  })

            } catch (error) {
                console.log(error);
            }
        }
    })

    return (

        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Nuevo Alimento</h1>

            <div className="flex justify-center mt-5">
                <svg class="w-20 h-20" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M6 3a1 1 0 011-1h.01a1 1 0 010 2H7a1 1 0 01-1-1zm2 3a1 1 0 00-2 0v1a2 2 0 00-2 2v1a2 2 0 00-2 2v.683a3.7 3.7 0 011.055.485 1.704 1.704 0 001.89 0 3.704 3.704 0 014.11 0 1.704 1.704 0 001.89 0 3.704 3.704 0 014.11 0 1.704 1.704 0 001.89 0A3.7 3.7 0 0118 12.683V12a2 2 0 00-2-2V9a2 2 0 00-2-2V6a1 1 0 10-2 0v1h-1V6a1 1 0 10-2 0v1H8V6zm10 8.868a3.704 3.704 0 01-4.055-.036 1.704 1.704 0 00-1.89 0 3.704 3.704 0 01-4.11 0 1.704 1.704 0 00-1.89 0A3.704 3.704 0 012 14.868V17a1 1 0 001 1h14a1 1 0 001-1v-2.132zM9 3a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm3 0a1 1 0 011-1h.01a1 1 0 110 2H13a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
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
                                placeholder="Nombre del Alimento"
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
                            <label className="block text-sm leading-5 font-medium text-gray-700 mb-2 mt-4" htmlFor="tipo">
                                Tipo
                            </label>
                            <input 
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-orange-300 focus:z-10 sm:text-sm sm:leading-5"
                                id="tipo"
                                type="text"
                                placeholder="Tipo de Alimento"
                                value={formik.values.tipo}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>

                        { formik.touched.tipo && formik.errors.tipo ? (
                            <div className="mb-2 bg-red-100 border-l-4 border-red-500 text-red-700">
                                {/* <p className="font-bold">Error</p> */}
                                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">{ formik.errors.tipo }</p>
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
                            <label className="block text-sm leading-5 font-medium text-gray-700 mb-2 mt-4" htmlFor="descripcion">
                                Descripción
                            </label>
                            <input 
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-orange-300 focus:z-10 sm:text-sm sm:leading-5"
                                id="descripcion"
                                type="text"
                                placeholder="Descripción del Alimento"
                                value={formik.values.descripcion}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        
                        { formik.touched.descripcion && formik.errors.descripcion ? (
                            <div className="mb-2 bg-red-100 border-l-4 border-red-500 text-red-700">
                                {/* <p className="font-bold">Error</p> */}
                                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">{ formik.errors.descripcion }</p>
                            </div>
                        ) : null }

                        <input
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-500 focus:outline-none focus:border-orange-700 focus:shadow-outline-orange active:bg-orange-700 transition duration-150 ease-in-out mt-10"
                            value="Agregar Nuevo Alimento"
                        />

                    </form>
                </div>
            </div>

        </Layout>
    );
}
 
export default NuevoAlimento;