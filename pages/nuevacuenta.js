import React, { useState } from 'react';
import { useRouter } from 'next/router'
import Layout from '../components/Layout';
import { useFormik } from 'formik'
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';
import Swal from 'sweetalert2';

const NUEVA_CUENTA = gql`
    mutation nuevoUsuario($input: UsuarioInput){
        nuevoUsuario(input: $input){
                id
                nombre
                apellido
                email
        }
    }
`;

const NuevaCuenta = () => {

    //State para el mensaje
    const [mensaje, guardarMensaje] = useState(null);

    //Mutation para crear nuevos usuarios
    const [ nuevoUsuario ]  = useMutation(NUEVA_CUENTA);
    
    //Routing
    const router = useRouter();


    //Validacion del formulario
    const formik = useFormik({
        initialValues: {
            nombre: '',
            apellido: '',
            email:'',
            password:''
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                        .required('El nombre es obligatorio'),
            apellido: Yup.string()
                        .required('El apellido es obligatorio'),
            email: Yup.string()
                        .email('El e-mail no es válido')
                        .required('El e-mail es obligatorio'),
            password: Yup.string()
                        .required('La contraseña es obligatoria')
                        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        }),
        onSubmit: async valores => {
            //console.log('Enviando');
            //console.log(valores);
            const { nombre, apellido, email, password } = valores;

            try {
                const { data } = await nuevoUsuario({
                    variables : {
                        input: {
                            nombre,
                            apellido,
                            email,
                            password
                        }
                    }
                });
                
                //console.log(data);
                //Usuario creado correctamente
                guardarMensaje(`El usuario ${data.nuevoUsuario.nombre} se ha creado correctamente.`);
                
                Swal.fire({
                    icon: 'success',
                    text: `El usuario ${data.nuevoUsuario.nombre} se ha creado correctamente.`,
                    // footer: '<a href>Why do I have this issue?</a>'
                })

                //Quitar el mensaje de la pantalla
                setTimeout(() => {
                    guardarMensaje(null);

                    //Redirigir usuario para iniciar sesion
                    router.push('/login');
                    
                }, 3000);

            } catch (error) {
                
                guardarMensaje(error.message);

                Swal.fire({
                    icon: 'error',
                    text: error.message,
                    // footer: '<a href>Why do I have this issue?</a>'
                })
                
                //Quitar el mensaje de la pantalla
                setTimeout(() => {
                    guardarMensaje(null);
                }, 3000);
            }
        }
    });

    // if(loading) return 'Cargando...';
    const mostrarMensaje = () => {
        return(
            <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{ mensaje }</p>
            </div>
        )
    }

    return ( 
        <>
            <Layout>

                {/* { mensaje && mostrarMensaje() } */}
 
                <img className="mx-auto h-20 w-auto" src="data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjUxMXB0IiB2aWV3Qm94PSItNDYgMCA1MTEgNTExLjk5NzY3IiB3aWR0aD0iNTExcHQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTg3LjgyNDIxOSAzODguOTA2MjV2NTMuNjQ4NDM4YzAgMTAuNTkzNzUgOC41ODk4NDMgMTkuMTgzNTkzIDE5LjE4MzU5MyAxOS4xODM1OTNzMTkuMTgzNTk0LTguNTg5ODQzIDE5LjE4MzU5NC0xOS4xODM1OTN2LTEzMy42NjAxNTdsNDYuMTc5Njg4IDMxLjQ2ODc1djY0LjYwMTU2M2MwIDEwLjU5Mzc1IDguNTg5ODQ0IDE5LjE3OTY4NyAxOS4xODM1OTQgMTkuMTc5Njg3czE5LjE3OTY4Ny04LjU4NTkzNyAxOS4xNzk2ODctMTkuMTc5Njg3di0zOC40NTcwMzJsOTcuOTAyMzQ0IDY2LjcxMDkzOHY0OS4zMjgxMjVjMCAxMC41OTc2NTYgOC41ODk4NDMgMTkuMTgzNTk0IDE5LjE4MzU5MyAxOS4xODM1OTRzMTkuMTc5Njg4LTguNTg5ODQ0IDE5LjE3OTY4OC0xOS4xODM1OTR2LTIzLjE4MzU5NGw2Mi42MzY3MTkgNDIuNjc1Nzgxdi00MjMuNjA5Mzc0Yy0xNDUuNDc2NTYzIDAtMjczLjgyMDMxMyA3My4zMzU5MzctMzUwLjA5Mzc1IDE4NS4wNTA3ODFsMjguMjgxMjUgMTkuMjY5NTMxdjI2LjE0ODQzOCIgZmlsbD0iI2ZmZTE5MiIvPjxwYXRoIGQ9Im00MDkuNjM2NzE5IDc4LjQyOTY4OHYtNDguMzU1NDY5YzAtMTEuNDE0MDYzLTkuNTE1NjI1LTIwLjUzOTA2My0yMC45MjE4NzUtMjAuMDU0Njg4LTczLjA1NDY4OCAzLjA5NzY1Ny0xNDQuNjA1NDY5IDIyLjM5NDUzMS0yMDkuNDEwMTU2IDU2LjU4NTkzOC02NC43OTI5NjkgMzQuMTgzNTkzLTEyMS4wNzAzMTMgODIuMzI4MTI1LTE2NC44MDA3ODIgMTQwLjgzNTkzNy02Ljg0Mzc1IDkuMTUyMzQ0LTQuNjY3OTY4IDIyLjE2Nzk2OSA0Ljc3NzM0NCAyOC42MDE1NjNsNDAuMjY1NjI1IDI3LjQzNzVjNzYuMjY5NTMxLTExMS43MTQ4NDQgMjA0LjYxMzI4MS0xODUuMDUwNzgxIDM1MC4wODk4NDQtMTg1LjA1MDc4MXptMCAwIiBmaWxsPSIjZmY2ZTM3Ii8+PGcgZmlsbD0iI2ZmNWE1YSI+PHBhdGggZD0ibTIyNi41NDI5NjkgMjI3LjU4OTg0NGMtOS42ODM1OTQtMjIuNTA3ODEzLTM1Ljc3NzM0NC0zMi45MDIzNDQtNTguMjg1MTU3LTIzLjIxODc1LTIyLjUwNzgxMiA5LjY4MzU5NC0zMi45MDIzNDMgMzUuNzc3MzQ0LTIzLjIxODc1IDU4LjI4NTE1NiA5LjY3OTY4OCAyMi41MDc4MTIgMzUuNzc3MzQ0IDMyLjkwMjM0NCA1OC4yODUxNTcgMjMuMjE4NzUgMjIuNTA3ODEyLTkuNjc5Njg4IDMyLjkwMjM0My0zNS43NzczNDQgMjMuMjE4NzUtNTguMjg1MTU2em0wIDAiLz48cGF0aCBkPSJtMzc0LjY3NTc4MSAyNDguMDg1OTM4Yy05LjY3OTY4Ny0yMi41MDc4MTMtMzUuNzc3MzQzLTMyLjkwMjM0NC01OC4yODUxNTYtMjMuMjE4NzUtMjIuNTA3ODEzIDkuNjgzNTkzLTMyLjkwMjM0NCAzNS43NzczNDMtMjMuMjE4NzUgNTguMjg1MTU2IDkuNjgzNTk0IDIyLjUwNzgxMiAzNS43NzczNDQgMzIuOTA2MjUgNTguMjg1MTU2IDIzLjIyMjY1NiAyMi41MDc4MTMtOS42ODM1OTQgMzIuOTAyMzQ0LTM1Ljc4MTI1IDIzLjIxODc1LTU4LjI4OTA2MnptMCAwIi8+PHBhdGggZD0ibTM5OS43NTc4MTIgMzUwLjYxMzI4MWMtMjIuNTAzOTA2IDkuNjgzNTk0LTMyLjkwMjM0MyAzNS43NzczNDQtMjMuMjE4NzUgNTguMjg1MTU3IDYuMTM2NzE5IDE0LjI2NTYyNCAxOC44NjcxODggMjMuNjU2MjUgMzMuMDk3NjU3IDI2LjE2MDE1NnYtODcuMzkwNjI1Yy0zLjMyODEyNS41ODU5MzctNi42NDA2MjUgMS41NTA3ODEtOS44Nzg5MDcgMi45NDUzMTJ6bTAgMCIvPjxwYXRoIGQ9Im0zMTguNTc4MTI1IDM3NS41MDc4MTJjLTkuNjgzNTk0LTIyLjUwMzkwNi0zNS43NzczNDQtMzIuOTAyMzQzLTU4LjI4NTE1Ni0yMy4yMTg3NS0xMy4zOTg0MzggNS43NjU2MjYtMjIuNSAxNy4zNDM3NS0yNS42MzY3MTkgMzAuNTE1NjI2bDY4LjQ5MjE4OCA0Ni42NzE4NzRjMTYuOTg0Mzc0LTExLjc3NzM0MyAyMy45MTQwNjItMzQuMjUgMTUuNDI5Njg3LTUzLjk2ODc1em0wIDAiLz48cGF0aCBkPSJtMzM5LjkxNzk2OSA4NC4xNTIzNDRjLTIzLjk0MTQwNyAzLjk2NDg0NC00Ny4yMDMxMjUgOS45Mzc1LTY5LjYwOTM3NSAxNy43MzgyODEtNC4xNzk2ODggMTAuNTM1MTU2LTQuMzUxNTYzIDIyLjY2NDA2My40ODQzNzUgMzMuODk0NTMxIDkuNjgzNTkzIDIyLjUwNzgxMyAzNS43NzczNDMgMzIuOTA2MjUgNTguMjg1MTU2IDIzLjIyMjY1NiAyMi41MDc4MTMtOS42ODM1OTMgMzIuOTAyMzQ0LTM1Ljc4MTI1IDIzLjIxODc1LTU4LjI4OTA2Mi0yLjg2MzI4MS02LjY1MjM0NC03LjE2NDA2My0xMi4yMzQzNzUtMTIuMzc4OTA2LTE2LjU2NjQwNnptMCAwIi8+PC9nPjxwYXRoIGQ9Im00MTAuMzcxMDk0IDguMzYzMjgxYy01Ljk3MjY1Ni01LjcyNjU2Mi0xMy44MTI1LTguNjgzNTkzLTIyLjA3ODEyNS04LjMzNTkzNzItNzQuMTUyMzQ0IDMuMTQ4NDM3Mi0xNDguMDM1MTU3IDIzLjEwOTM3NTItMjEzLjY1NjI1IDU3LjczNDM3NTItNjUuNjA5Mzc1IDM0LjYxNzE4Ny0xMjMuNzUzOTA3IDg0LjMwNDY4Ny0xNjguMTQ0NTMxIDE0My42OTE0MDYtNC45NTcwMzIgNi42Mjg5MDYtNi45Mzc1IDE0Ljc4MTI1LTUuNTc0MjE5IDIyLjk0OTIxOSAxLjM2NzE4NyA4LjE3MTg3NSA1Ljg4NjcxOSAxNS4yNDIxODcgMTIuNzMwNDY5IDE5LjkwNjI1bDQwLjI2NTYyNCAyNy40Mzc1cy4wMDM5MDcuMDAzOTA2LjAwMzkwNy4wMDM5MDZsMjMuOTA2MjUgMTYuMjg5MDYydjIwLjg2MzI4MmMwIDUuNTIzNDM3IDQuNDc2NTYyIDEwIDEwIDEwIDUuNTIzNDM3IDAgMTAtNC40NzY1NjMgMTAtMTB2LTI2LjE0ODQzOGMwLTMuMzA4NTk0LTEuNjM2NzE5LTYuNDAyMzQ0LTQuMzY3MTg4LTguMjY1NjI1bC0xOS44OTg0MzctMTMuNTU4NTkzYzguODIwMzEyLTEyLjI3NzM0NCAxOC4zMTI1LTI0LjA0Mjk2OSAyOC40MDIzNDQtMzUuMzAwNzgyIDEwLjM3MTA5My0xMS41NzQyMTggMjEuNDE3OTY4LTIyLjU5NzY1NiAzMy4wNzgxMjQtMzIuODgyODEyIDExLjIyMjY1Ny05Ljg5ODQzOCAyMi45MTAxNTctMTkuMjUgMzUuMTEzMjgyLTI3LjkxNzk2OSAxMi42Nzk2ODctOS4wMDM5MDYgMjUuODY3MTg3LTE3LjIzODI4MSAzOS40NTMxMjUtMjQuODA0Njg3IDEzLjYwOTM3NS03LjU4NTkzOCAyNy43MjY1NjItMTQuMzI4MTI2IDQyLjEzMjgxMi0yMC4yNjU2MjYgMS44MDQ2ODgtLjc0MjE4NyAzLjYxNzE4OC0xLjQ3NjU2MiA1LjQzMzU5NC0yLjE5OTIxOC0uMDk3NjU2IDcuNTMxMjUgMS4zNzEwOTQgMTUuMDU4NTk0IDQuNDMzNTk0IDIyLjE3OTY4NyA1LjczODI4MSAxMy4zMzk4NDQgMTYuMzI4MTI1IDIzLjY0ODQzOCAyOS44MjAzMTIgMjkuMDE5NTMxIDYuNTExNzE5IDIuNTk3NjU3IDEzLjMyNDIxOSAzLjg5MDYyNiAyMC4xMjg5MDcgMy44OTA2MjYgNy4yOTI5NjggMCAxNC41NzgxMjQtMS40ODgyODIgMjEuNDc2NTYyLTQuNDUzMTI2IDEzLjMzOTg0NC01Ljc0MjE4NyAyMy42NDQ1MzEtMTYuMzMyMDMxIDI5LjAxOTUzMS0yOS44MjAzMTIgNS4zNzUtMTMuNDkyMTg4IDUuMTcxODc1LTI4LjI2NTYyNS0uNTY2NDA2LTQxLjYwNTQ2OS0uNzY1NjI1LTEuNzg1MTU2LTEuNjM2NzE5LTMuNTE5NTMxLTIuNTg1OTM3LTUuMjEwOTM3IDEzLjUxOTUzMS0xLjY3MTg3NSAyNy4xMjEwOTMtMi42Njc5NjkgNDAuNzM4MjgxLTIuOTk2MDk0djI1MS40MDYyNWMtMTYuMjM4MjgxIDUuNTcwMzEyLTI5LjAwNzgxMyAxOC42ODM1OTQtMzQuMTk1MzEzIDM1LjA1MDc4MS01Ljc0MjE4NyAxOC4xMjEwOTQtMS4zNDc2NTYgMzguNDIxODc1IDExLjMxNjQwNiA1Mi41ODIwMzEgNi4xNzU3ODIgNi45MDYyNSAxNC4xMTcxODggMTIuMTUyMzQ0IDIyLjg3ODkwNyAxNS4xNTIzNDR2NDAuMzcxMDk0bC00Ny0zMi4wMjczNDRjLTMuMDY2NDA3LTIuMDg1OTM3LTcuMDMxMjUtMi4zMTI1LTEwLjMwODU5NC0uNTc4MTI1LTMuMjczNDM3IDEuNzM0Mzc1LTUuMzI0MjE5IDUuMTM2NzE5LTUuMzI0MjE5IDguODQzNzV2MjMuMTgzNTk0YzAgNS4wNjY0MDYtNC4xMjEwOTQgOS4xODM1OTQtOS4xODM1OTQgOS4xODM1OTRzLTkuMTgzNTkzLTQuMTIxMDk0LTkuMTgzNTkzLTkuMTgzNTk0di00OS4zMjgxMjVjMC0xLjIyNjU2Mi0uMjI2NTYzLTIuNDIxODc1LS42NDQ1MzEtMy41MzUxNTYgMTQuMDgyMDMxLTE1LjQ4MDQ2OSAxOC4zMjAzMTItMzguMjYxNzE5IDkuNzczNDM3LTU4LjEyNS0xMS44NDM3NS0yNy41MzUxNTYtNDMuODg2NzE5LTQwLjMwMDc4Mi03MS40MjU3ODEtMjguNDUzMTI1LTExLjM4NjcxOSA0Ljg5ODQzNy0yMC42NzE4NzUgMTMuNjAxNTYyLTI2LjQzNzUgMjQuMzU5Mzc1bC0xMy41MzUxNTYtOS4yMjI2NTZjLTMuMDYyNS0yLjA4NTkzOC03LjAyNzM0NC0yLjMwODU5NC0xMC4zMDQ2ODgtLjU3ODEyNi0zLjI3NzM0NCAxLjczNDM3Ni01LjMyODEyNSA1LjEzNjcxOS01LjMyODEyNSA4LjgzOTg0NHYzOC40NjA5MzhjMCA1LjA2MjUtNC4xMTcxODcgOS4xNzk2ODctOS4xNzk2ODcgOS4xNzk2ODdzLTkuMTgzNTk0LTQuMTIxMDkzLTkuMTgzNTk0LTkuMTc5Njg3di02NC42MDE1NjNjMC0zLjMwODU5My0xLjYzNjcxOS02LjQwMjM0My00LjM2NzE4OC04LjI2NTYyNWwtNDYuMTgzNTk0LTMxLjQ2NDg0NGMtMy4wNTg1OTMtMi4wODU5MzctNy4wMjczNDMtMi4zMTI1LTEwLjMwNDY4Ny0uNTc4MTI0LTMuMjc3MzQ0IDEuNzMwNDY4LTUuMzI0MjE5IDUuMTM2NzE4LTUuMzI0MjE5IDguODM5ODQzdjEzMy42NjAxNTdjMCA1LjA2NjQwNi00LjEyMTA5NCA5LjE4MzU5My05LjE4MzU5NCA5LjE4MzU5M3MtOS4xNzk2ODctNC4xMjEwOTMtOS4xNzk2ODctOS4xODM1OTN2LTUzLjY0ODQzOGMwLTUuNTIzNDM4LTQuNDgwNDY5LTEwLTEwLjAwMzkwNi0xMC01LjUyMzQzOCAwLTEwIDQuNDc2NTYyLTEwIDEwdjUzLjY0ODQzOGMwIDE2LjA5Mzc1IDEzLjA5Mzc1IDI5LjE4MzU5MyAyOS4xODM1OTMgMjkuMTgzNTkzIDE2LjA4OTg0NCAwIDI5LjE4MzU5NC0xMy4wODk4NDMgMjkuMTgzNTk0LTI5LjE4MzU5M3YtMTE0Ljc0MjE4OGwyNi4xNzk2ODggMTcuODM1OTM4djU5LjMxNjQwNmMwIDE2LjA4OTg0NCAxMy4wODk4NDQgMjkuMTc5Njg3IDI5LjE4MzU5NCAyOS4xNzk2ODcgMTYuMDg5ODQzIDAgMjkuMTgzNTkzLTEzLjA4OTg0MyAyOS4xODM1OTMtMjkuMTc5Njg3di0xOS41NDI5NjlsOC4yODEyNSA1LjY0NDUzMWMuMDAzOTA3IDAgLjAwMzkwNy4wMDM5MDYuMDA3ODEzLjAwMzkwNmw2OC40OTIxODcgNDYuNjcxODc2IDEuMTE3MTg4Ljc2MTcxOHY0NC4wNDI5NjljMCAxNi4wODk4NDQgMTMuMDg5ODQzIDI5LjE4MzU5NCAyOS4xODM1OTMgMjkuMTgzNTk0IDE2LjA4OTg0NCAwIDI5LjE4MzU5NC0xMy4wOTM3NSAyOS4xODM1OTQtMjkuMTgzNTk0di00LjI3MzQzN2w0Ny4wMDM5MDYgMzIuMDMxMjVjNi41MjM0MzggNC40NDUzMTIgMTUuNjMyODEzLS40MDYyNSAxNS42MzI4MTMtOC4yNjU2MjZ2LTQ3MS45NjA5MzdjLS4wMDM5MDYtOC4yNzczNDQtMy4yOTI5NjktMTUuOTg4MjgxLTkuMjY5NTMxLTIxLjcxNDg0NHptLTE2My44MzIwMzIgMzcwLjQzNzVjMy40OTIxODgtNy43MzgyODEgOS43MDMxMjYtMTMuODgyODEyIDE3LjcwMzEyNi0xNy4zMjQyMTkgMTcuNDEwMTU2LTcuNDg4MjgxIDM3LjY2MDE1Ni41NzgxMjYgNDUuMTUyMzQzIDE3Ljk4NDM3NiA1LjUzOTA2MyAxMi44ODI4MTIgMi41ODU5MzggMjcuNzA3MDMxLTYuODcxMDkzIDM3LjQ4ODI4MWwtMzctMjUuMjEwOTM4em0tMjI1Ljg5MDYyNC0xNTcuNjg3NWMtLjQ1NzAzMi0yLjczODI4MS4yMDcwMzEtNS40NjQ4NDMgMS44NjMyODEtNy42ODc1IDQyLjYyNS01Ny4wMjM0MzcgOTguNDU3MDMxLTEwNC43MzQzNzUgMTYxLjQ1NzAzMS0xMzcuOTc2NTYyIDYzLjAxOTUzMS0zMy4yNSAxMzMuOTYwOTM4LTUyLjQxNzk2OSAyMDUuMTY3OTY5LTU1LjQzNzUuMTQ4NDM3LS4wMDc4MTMuMjk2ODc1LS4wMTE3MTkuNDQxNDA2LS4wMTE3MTkgMi42MDE1NjMgMCA1LjA1ODU5NC45ODQzNzUgNi45NTMxMjUgMi44MDA3ODEgMiAxLjkyMTg3NSAzLjEwMTU2MiA0LjUwMzkwNyAzLjEwMTU2MiA3LjI3MzQzOHYzOC40Njg3NWMtMTUuOTg4MjgxLjM2MzI4MS0zMS45NjA5MzcgMS42Mjg5MDYtNDcuODA4NTkzIDMuNzUzOTA2LTQuNTE5NTMxLjYwOTM3NS05LjA0Njg3NSAxLjI0NjA5NC0xMy41NDI5NjkgMS45ODgyODEtMjQuMTc5Njg4IDQuMDAzOTA2LTQ4LjE1NjI1IDEwLjExMzI4Mi03MS4yNjE3MTkgMTguMTYwMTU2LTE2LjM0NzY1NiA1LjY5MTQwNy0zMi4zMzk4NDMgMTIuNTM5MDYzLTQ3LjkxNDA2MiAyMC4wODIwMzItMTUuODA0Njg4IDcuNjQ4NDM3LTMxLjE0NDUzMSAxNi4zOTQ1MzEtNDUuODQzNzUgMjUuOTk2MDk0LTE0LjQ1NzAzMSA5LjQ0NTMxMi0yOC4zNDM3NSAxOS43MDMxMjQtNDEuNjE3MTg4IDMwLjc0NjA5My0xMy4zOTA2MjUgMTEuMTQ0NTMxLTI2LjAyMzQzNyAyMy4xNzE4NzUtMzcuOTkyMTg3IDM1LjgyNDIxOS0xMS43NSAxMi40MjU3ODEtMjIuNjg3NSAyNS42NDA2MjUtMzIuODU5Mzc1IDM5LjM3ODkwNi0xLjI3MzQzOCAxLjcxODc1LTIuNTM1MTU3IDMuNDQ1MzEzLTMuNzgxMjUgNS4xNzk2ODhsLTMyLjEwMTU2My0yMS44NzVjLTIuMjg5MDYyLTEuNTU4NTk0LTMuODA0Njg3LTMuOTI1NzgyLTQuMjYxNzE4LTYuNjY0MDYzem0zMjIuODIwMzEyLTkwLjE0NDUzMWMtMy4zOTg0MzggOC41MjczNDQtOS45MTAxNTYgMTUuMjIyNjU2LTE4LjM0Mzc1IDE4Ljg1MTU2Mi04LjQzMzU5NCAzLjYyNS0xNy43Njk1MzEgMy43NTM5MDctMjYuMjk2ODc1LjM1NTQ2OS04LjUyNzM0NC0zLjM5NDUzMS0xNS4yMjI2NTYtOS45MTAxNTYtMTguODUxNTYzLTE4LjM0Mzc1LTMuMDE5NTMxLTcuMDIzNDM3LTMuNjA5Mzc0LTE0LjY3OTY4Ny0xLjc1NzgxMi0yMS45Njg3NSAxNS4wMDM5MDYtNS4wMzEyNSAzMC4zMTY0MDYtOS4yNjE3MTkgNDUuODEyNS0xMi40ODA0NjkgNC4yMzQzNzUtLjg3ODkwNiA4LjQ3MjY1Ni0xLjcxODc1IDEyLjcyNjU2Mi0yLjQ4MDQ2OCAyLjY1NjI1IDIuODUxNTYyIDQuNzg1MTU3IDYuMTIxMDk0IDYuMzUxNTYzIDkuNzY5NTMxIDMuNjI4OTA2IDguNDMzNTk0IDMuNzUzOTA2IDE3Ljc2OTUzMS4zNTkzNzUgMjYuMjk2ODc1em00Mi4yNTc4MTIgMjczLjk3NjU2MmMtMy42Mjg5MDYtOC40Mjk2ODctMy43NTM5MDYtMTcuNzY5NTMxLS4zNTkzNzQtMjYuMjk2ODc0IDIuODI4MTI0LTcuMDk3NjU3IDcuODE2NDA2LTEyLjkyMTg3NiAxNC4yNjk1MzEtMTYuNzY5NTMydjU4Ljk3MjY1NmMtNi4xMDkzNzUtMy42NTIzNDMtMTEuMDA3ODEzLTkuMTYwMTU2LTEzLjkxMDE1Ny0xNS45MDYyNXptMCAwIi8+PHBhdGggZD0ibTE2NS42NzE4NzUgMjk1LjYyNWM2LjUxMTcxOSAyLjU5Mzc1IDEzLjMyNDIxOSAzLjg4NjcxOSAyMC4xMjg5MDYgMy44ODY3MTkgNy4yOTI5NjkgMCAxNC41NzgxMjUtMS40ODQzNzUgMjEuNDc2NTYzLTQuNDUzMTI1IDI3LjUzNTE1Ni0xMS44NDc2NTYgNDAuMzAwNzgxLTQzLjg5MDYyNSAyOC40NTMxMjUtNzEuNDI1NzgyLTUuNzM4MjgxLTEzLjMzOTg0My0xNi4zMjgxMjUtMjMuNjQ4NDM3LTI5LjgyMDMxMy0yOS4wMTk1MzEtMTMuNDg4MjgxLTUuMzc1LTI4LjI2NTYyNS01LjE3NTc4MS00MS42MDU0NjguNTY2NDA3LTEzLjMzOTg0NCA1LjczODI4MS0yMy42NDQ1MzIgMTYuMzI4MTI0LTI5LjAxOTUzMiAyOS44MjAzMTItNS4zNzUgMTMuNDg4MjgxLTUuMTcxODc1IDI4LjI2NTYyNS41NjY0MDYgNDEuNjA1NDY5IDUuNzM4MjgyIDEzLjMzOTg0MyAxNi4zMjgxMjYgMjMuNjQ0NTMxIDI5LjgyMDMxMyAyOS4wMTk1MzF6bS0xMS44MDQ2ODctNjMuMjIyNjU2YzMuMzk0NTMxLTguNTI3MzQ0IDkuOTEwMTU2LTE1LjIyMjY1NiAxOC4zNDM3NS0xOC44NTE1NjMgNC4zNTkzNzQtMS44NzUgOC45NjQ4NDMtMi44MTY0MDYgMTMuNTc0MjE4LTIuODE2NDA2IDQuMzAwNzgyIDAgOC42MDU0NjkuODIwMzEzIDEyLjcyMjY1NiAyLjQ2MDkzNyA4LjUyNzM0NCAzLjM5NDUzMiAxNS4yMjI2NTcgOS45MTAxNTcgMTguODUxNTYzIDE4LjMzOTg0NCA3LjQ4ODI4MSAxNy40MDYyNS0uNTgyMDMxIDM3LjY2MDE1Ni0xNy45ODgyODEgNDUuMTQ4NDM4LTguNDI5Njg4IDMuNjI4OTA2LTE3Ljc2OTUzMiAzLjc1MzkwNi0yNi4yOTY4NzUuMzU5Mzc1LTguNTI3MzQ0LTMuMzk4NDM4LTE1LjIyMjY1Ny05LjkxNDA2My0xOC44NDc2NTctMTguMzQzNzUtMy42Mjg5MDYtOC40MzM1OTQtMy43NTc4MTItMTcuNzczNDM4LS4zNTkzNzQtMjYuMjk2ODc1em0wIDAiLz48cGF0aCBkPSJtMzEzLjgwNDY4OCAzMTYuMTE3MTg4YzYuNTExNzE4IDIuNTk3NjU2IDEzLjMyNDIxOCAzLjg5MDYyNCAyMC4xMjg5MDYgMy44OTA2MjQgNy4yOTI5NjggMCAxNC41NzgxMjUtMS40ODgyODEgMjEuNDc2NTYyLTQuNDU3MDMxIDEzLjMzOTg0NC01LjczODI4MSAyMy42NDQ1MzItMTYuMzI4MTI1IDI5LjAxOTUzMi0yOS44MTY0MDYgNS4zNzUtMTMuNDkyMTg3IDUuMTc1NzgxLTI4LjI2NTYyNS0uNTY2NDA3LTQxLjYwOTM3NS01LjczODI4MS0xMy4zMzU5MzgtMTYuMzI4MTI1LTIzLjY0NDUzMS0yOS44MTY0MDYtMjkuMDE5NTMxLTEzLjQ5MjE4Ny01LjM3NS0yOC4yNjk1MzEtNS4xNzE4NzUtNDEuNjA1NDY5LjU2NjQwNi0xMy4zMzk4NDQgNS43MzgyODEtMjMuNjQ4NDM3IDE2LjMyODEyNS0yOS4wMjM0MzcgMjkuODIwMzEzLTUuMzcxMDk0IDEzLjQ5MjE4Ny01LjE3MTg3NSAyOC4yNjU2MjQuNTY2NDA2IDQxLjYwNTQ2OHMxNi4zMjgxMjUgMjMuNjQ4NDM4IDI5LjgyMDMxMyAyOS4wMTk1MzJ6bS0xMS44MDQ2ODgtNjMuMjIyNjU3YzMuMzk0NTMxLTguNTI3MzQzIDkuOTEwMTU2LTE1LjIxODc1IDE4LjM0Mzc1LTE4Ljg0NzY1NiA0LjM1OTM3NS0xLjg3NSA4Ljk2NDg0NC0yLjgxNjQwNiAxMy41NzQyMTktMi44MTY0MDYgNC4zMDA3ODEgMCA4LjYwNTQ2OS44MTY0MDYgMTIuNzIyNjU2IDIuNDU3MDMxIDguNTI3MzQ0IDMuMzk4NDM4IDE1LjIyMjY1NiA5LjkxNDA2MiAxOC44NTE1NjMgMTguMzQzNzUgMy42MjUgOC40MzM1OTQgMy43NTM5MDYgMTcuNzczNDM4LjM1NTQ2OCAyNi4zMDA3ODEtMy4zOTg0MzcgOC41MjM0MzgtOS45MTAxNTYgMTUuMjE4NzUtMTguMzQzNzUgMTguODQ3NjU3LTguNDI5Njg3IDMuNjI1LTE3Ljc2OTUzMSAzLjc1MzkwNi0yNi4yOTY4NzUuMzU1NDY4LTguNTI3MzQzLTMuMzk0NTMxLTE1LjIyMjY1Ni05LjkxMDE1Ni0xOC44NTE1NjItMTguMzM5ODQ0LTMuNjI1LTguNDMzNTkzLTMuNzUtMTcuNzczNDM3LS4zNTU0NjktMjYuMzAwNzgxem0wIDAiLz48cGF0aCBkPSJtODcuODMyMDMxIDM1OC45MTAxNTZjNC4yMzA0NjkgMCA4LjA4MjAzMS0yLjc3NzM0NCA5LjQ1MzEyNS02Ljc2NTYyNSAxLjM3NS0zLjk5NjA5My4wMDc4MTMtOC42MTMyODEtMy4zNjcxODctMTEuMTc5Njg3LTMuMjM4MjgxLTIuNDYwOTM4LTcuNzMwNDY5LTIuNzA3MDMyLTExLjIyNjU2My0uNjMyODEzLTMuNjE3MTg3IDIuMTQ0NTMxLTUuNTAzOTA2IDYuNDkyMTg4LTQuNjQ4NDM3IDEwLjYwNTQ2OS45NTcwMzEgNC41ODIwMzEgNS4xMDE1NjIgNy45NzI2NTYgOS43ODkwNjIgNy45NzI2NTZ6bTAgMCIvPjwvc3ZnPg==" />

                <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
                    Crear una Nueva Cuenta 
                </h2>

                <p class="mt-2 text-center text-sm leading-5 text-gray-600">
                    <a href="" className="font-medium text-orange-600 hover:text-orange-500 focus:outline-none focus:underline transition ease-in-out duration-150"> 
                        D'Baggios Pizzería
                    </a>
                </p>

                <div className="flex justify-center mt-5">
                    <div className="w-full max-w-sm">
                        <form 
                            // className="bg-white rounder shadow-md px-8 pt-6 pb-8 mb-4"
                            onSubmit={ formik.handleSubmit }
                        >
                            
                            <div>
                                <label className="block text-sm leading-5 font-medium text-gray-700 mb-2 mt-4" htmlFor="nombre">
                                   Nombre
                                </label>
                                <input 
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-orange-300 focus:z-10 sm:text-sm sm:leading-5"
                                    id="nombre"
                                    type="text"
                                    placeholder="Nombre de Usuario"
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
                                    placeholder="Apellido de Usuario"
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
                                <label className="block text-sm leading-5 font-medium text-gray-700 mb-2 mt-4" htmlFor="email">
                                    E-mail
                                </label>
                                <input 
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-orange-300 focus:z-10 sm:text-sm sm:leading-5"
                                    id="email"
                                    type="email"
                                    placeholder="E-mail de Usuario"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            { formik.touched.email && formik.errors.email ? (
                                <div className="mb-2 bg-red-100 border-l-4 border-red-500 text-red-700">
                                    {/* <p className="font-bold">Error</p> */}
                                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">{ formik.errors.email }</p>
                                </div>
                            ) : null }

                            <div>
                                <label className="block text-sm leading-5 font-medium text-gray-700 mb-2 mt-4" htmlFor="password">
                                    Contraseña
                                </label>
                                <input 
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-orange-300 focus:z-10 sm:text-sm sm:leading-5"
                                    id="password"
                                    type="password"
                                    placeholder="Contraseña de Usuario"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            { formik.touched.password && formik.errors.password ? (
                                <div className="mb-2 bg-red-100 border-l-4 border-red-500 text-red-700">
                                    {/* <p className="font-bold">Error</p> */}
                                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">{ formik.errors.password }</p>
                                </div>
                            ) : null }

                            <input
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-500 focus:outline-none focus:border-orange-700 focus:shadow-outline-orange active:bg-orange-700 transition duration-150 ease-in-out mt-10"
                                value="Crear Nueva Cuenta"
                            />
                        </form>
                    </div>
                </div>
            </Layout>
        </>
     );
}
 
export default NuevaCuenta;