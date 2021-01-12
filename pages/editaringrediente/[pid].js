import React from 'react';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';
import { gql, useQuery, useMutation } from '@apollo/client';
import { Formik } from 'formik'
import * as Yup from 'yup';
import Swal from 'sweetalert2';

const OBTENER_INGREDIENTE = gql`
    query obtenerIngrediente($id: ID!){
        obtenerIngrediente(id: $id){
            id
            nombre
            existencia
            precio
            elaboracion
            vencimiento
            creado
        }
    }
`;

const ACTUALIZAR_INGREDIENTE = gql`
mutation actualizarIngrediente($id: ID!, $input: IngredienteInput){
    actualizarIngrediente(id: $id, input: $input){
        id
        nombre
        existencia
        precio
        elaboracion
        vencimiento
        creado
    }
}
`;

const EditarIngrediente = () => {

    //Routing
    const router = useRouter();

    // Variables para las fechas de ayer y hoy
    const yesterday = new Date(Date.now() -86400000);
    const today = new Date(Date.now() );

    const { query: { id } } = router;

    // Consultar para obtener el ingrediente
    const { data, loading, error } = useQuery(OBTENER_INGREDIENTE, {
        variables: {
            id
        }
    });

    // Mutation para actualizar ingrediente
    const [ actualizarIngrediente ] = useMutation(ACTUALIZAR_INGREDIENTE);

    // Schema de validación
    const schemaValidacion = Yup.object({
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
    });
    // console.log(data);
    // console.log(loading);
    // console.log(error);

    if(loading) return 'Cargando...';

    if(!data){
        return 'Acción no Permitida';
    }

    const actualizarInfoIngrediente = async valores => {
        // console.log(valores);

        const { nombre, existencia, precio, elaboracion, vencimiento } = valores;

        try {

            const { data } = await actualizarIngrediente({
                variables: {
                    id,
                    input: {
                        nombre,
                        precio,
                        existencia,
                        elaboracion,
                        vencimiento
                    }
                }
            });

            console.log(data);

            // Redirigir hacia ingredientes
            router.push('/ingredientes');

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
                title: 'Ingrediente Actualizado'
            })

        } catch (error) {
            console.log(error);
        }
    }

    const { obtenerIngrediente } = data;

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Editar Ingrediente</h1>

            <div className="flex justify-center mt-5">
                <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            </div>

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <Formik

                        enableReinitialize
                        initialValues = { obtenerIngrediente }
                        validationSchema = { schemaValidacion }
                        onSubmit = { valores => {
                            actualizarInfoIngrediente( valores );
                        } }
                    >
                        
                        {props => { 
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
                                            placeholder="Nombre del Ingrediente"
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
                                        <label className="block text-sm leading-5 font-medium text-gray-700 mb-2 mt-4" htmlFor="existencia">
                                            Cantidad
                                        </label>
                                        <input 
                                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-orange-300 focus:z-10 sm:text-sm sm:leading-5"
                                            id="existencia"
                                            type="number"
                                            placeholder="Cantidad del Ingrediente"
                                            value={props.values.existencia}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>

                                    { props.touched.existencia && props.errors.existencia ? (
                                        <div className="mb-2 bg-red-100 border-l-4 border-red-500 text-red-700">
                                            {/* <p className="font-bold">Error</p> */}
                                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">{ props.errors.existencia }</p>
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
                                        <label className="block text-sm leading-5 font-medium text-gray-700 mb-2 mt-4" htmlFor="elaboracion">
                                            Elaboración
                                        </label>
                                        <input 
                                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-orange-300 focus:z-10 sm:text-sm sm:leading-5"
                                            id="elaboracion"
                                            type="date"
                                            placeholder="Elaboración del Ingrediente"
                                            value={props.values.elaboracion}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>
                                    
                                    { props.touched.elaboracion && props.errors.elaboracion ? (
                                        <div className="mb-2 bg-red-100 border-l-4 border-red-500 text-red-700">
                                            {/* <p className="font-bold">Error</p> */}
                                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">{ props.errors.elaboracion }</p>
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
                                            value={props.values.vencimiento}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>

                                    { props.touched.vencimiento && props.errors.vencimiento ? (
                                        <div className="mb-2 bg-red-100 border-l-4 border-red-500 text-red-700">
                                            {/* <p className="font-bold">Error</p> */}
                                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">{ props.errors.vencimiento }</p>
                                        </div>
                                    ) : null }

                                    <input
                                        type="submit"
                                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-500 focus:outline-none focus:border-orange-700 focus:shadow-outline-orange active:bg-orange-700 transition duration-150 ease-in-out mt-10"
                                        value="Actualizar Ingrediente"
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
 
export default EditarIngrediente;