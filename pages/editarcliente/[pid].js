import React from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Formik } from 'formik'
import * as Yup from 'yup';
import Swal from 'sweetalert2';

const OBTENER_CLIENTE = gql`
query obtenerCliente($id: ID!){
    obtenerCliente(id: $id){
      nombre
      apellido
      cedula
      direccion
    }
  }
`;

const ACTUALIZAR_CLIENTE = gql`
mutation actualizarCliente($id: ID!, $input: ClienteInput) {
    actualizarCliente(id: $id, input: $input){
        nombre
        apellido
        cedula
        direccion
    }
}
`;

const EditarCliente = () => {
    
    //Obtener el ID actual
    const router = useRouter();

    const { query: { id } } = router;
    
    //console.log(id);

    //Consultar para obtener el cliente
    const { data, loading, error } = useQuery(OBTENER_CLIENTE, {
        variables: {
            id
        }
    });

    //console.log(data);

    //Actualizar el cliente
     const [ actualizarCliente ] = useMutation(ACTUALIZAR_CLIENTE);

    //Schema de validacion
    const schemaValidacion = Yup.object({
        nombre: Yup.string()
                .required('El nombre es obligatorio'),
        apellido: Yup.string()
                    .required('El apellido es obligatorio'),
        cedula: Yup.string()
                    .required('La cédula es obligatoria')
                    .length(10, 'El número de caracteres no es válido'),
        direccion: Yup.string()
                        .required('La cédula es obligatoria')
    });

    if(loading) return 'Cargando...';

    //console.log(data.obtenerCliente);

    const { obtenerCliente } = data;

    //Modificar el cliente en la DB
    const actualizarInfoCliente = async valores => {
        const { nombre, apellido, cedula, direccion } = valores;

        try {
            const { data } = await actualizarCliente({
                variables: {
                    id,
                    input: {
                        nombre,
                        apellido,
                        cedula,
                        direccion
                    }
                }
            });

            //console.log(data);
            //Redireccionar hacia clientes
            router.push('/');

            //Alerta SWAL
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
                title: 'Cliente Actualizado'
            })

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Editar Cliente</h1>

            <div className="flex justify-center mt-5">
                <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
            </div>

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">

                    <Formik
                        validationSchema={ schemaValidacion }
                        enableReinitialize
                        initialValues={obtenerCliente}
                        onSubmit={( valores ) => {
                            actualizarInfoCliente(valores)
                        }}
                    >
                        {props => {

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
                                            placeholder="Nombre del Cliente"
                                            value={props.values.nombre}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>

                                    { props.touched.nombre && props.errors.nombre ? (
                                            <div className="mb-2 bg-red-100 border-l-4 border-red-500 text-red-700">
                                                {/* <p className="font-bold">Error</p> */}
                                                <p>{ props.errors.nombre }</p>
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
                                            value={props.values.apellido}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>
                                    
                                    { props.touched.apellido && props.errors.apellido ? (
                                            <div className="mb-2 bg-red-100 border-l-4 border-red-500 text-red-700">
                                                {/* <p className="font-bold">Error</p> */}
                                                <p>{ props.errors.apellido }</p>
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
                                            value={props.values.cedula}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>

                                    { props.touched.cedula && props.errors.cedula ? (
                                            <div className="mb-2 bg-red-100 border-l-4 border-red-500 text-red-700">
                                                {/* <p className="font-bold">Error</p> */}
                                                <p>{ props.errors.cedula }</p>
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
                                            value={props.values.direccion}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>
                                    
                                    { props.touched.direccion && props.errors.direccion ? (
                                            <div className="mb-2 bg-red-100 border-l-4 border-red-500 text-red-700">
                                                {/* <p className="font-bold">Error</p> */}
                                                <p>{ props.errors.direccion }</p>
                                            </div>
                                    ) : null }

                                    <input
                                        type="submit"
                                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-500 focus:outline-none focus:border-orange-700 focus:shadow-outline-orange active:bg-orange-700 transition duration-150 ease-in-out mt-10"
                                        value="Actualizar Cliente"
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
 
export default EditarCliente;