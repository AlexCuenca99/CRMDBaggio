import React from "react";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";

const OBTENER_USUARIO = gql`
	query obtenerUsuario {
		obtenerUsuario {
			id
			nombre
			apellido
		}
	}
`;

const Header = () => {
	//Routing de cerrar sesión
	const router = useRouter();

	//Quety de Apollo
	const { data, loading, client } = useQuery(OBTENER_USUARIO);

	// console.log(data);
	// console.log(loading);
	//console.log(error);

	//Proteger que no accedamos a data antes que loading
	if (loading) {
		return <p>Cargando...</p>;
	}

	//Si no hay información
	if (!data) {
		client.clearStore();
		router.push("/login");
		return <p>Cargando...</p>;
	}

	const { nombre, apellido } = data.obtenerUsuario;

	const cerrarSesion = () => {
		localStorage.removeItem("token");
		client.clearStore();
		router.push("/login");
		return <p>Cargando...</p>;
	};

	return (
		<div className="flex justify-between flex items-center container sm-auto mb-6">
			<p className="py-2 px-2 ml-8 rounded-md bg-white shadow-xs block text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out">
				Bienvenido/a: {nombre} {apellido}{" "}
			</p>
			<button
				onClick={() => cerrarSesion()}
				className="mb-3 mt-3 inline-block py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-500 focus:outline-none focus:border-orange-700 focus:shadow-outline-orange active:bg-orange-700 transition duration-150 ease-in-out"
				type="button"
			>
				Cerrar Sesión
			</button>
		</div>
	);
};

export default Header;
