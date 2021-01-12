import React from "react";
import Head from "next/head";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useRouter } from "next/router";

const Layout = ({ children }) => {
	//Hook de routing
	const router = useRouter();
	return (
		<>
			<Head>
				<title>CRM - D'Baggios Pizzería</title>
				<link
					rel="stylesheet"
					href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css"
					integrity="sha512-NhSC1YmyruXifcj/KFRWoC561YpHpc5Jtzgvbuzx5VozKpWvQ+4nXhPdFgmx8xqexRcpAglTj9sIBWINXa8x5w=="
					crossOrigin="anonymous"
				/>
				<link
					href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css"
					rel="stylesheet"
				/>
				{/* <link href="https://fonts.googleapis.com/css2?family=Work+Sans&display=swap" rel="stylesheet"/> */}
			</Head>
			{router.pathname === "/login" ||
			router.pathname === "/nuevacuenta" ? (
				<div className="relative bg-white overflow-hidden min-h-screen">
					<div className="max-w-screen-xl mx-auto ">
						<div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
							<svg
								className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
								fill="currentColor"
								viewBox="0 0 100 100"
								preserveAspectRatio="none"
							>
								<polygon points="50,0 100,0 50,100 0,100" />
							</svg>

							<div className="relative pt-6 px-4 sm:px-6 lg:px-8"></div>

							<main class="mt-10 mx-auto max-w-screen-xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
								<div class="sm:text-center lg:text-left">
									{children}
								</div>
							</main>
						</div>
					</div>
					<div class="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
						<img
							class="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
							src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80"
							alt=""
						/>
					</div>
				</div>
			) : (
				<div className="bg-gray-50 min-h-screen">
					<div className="sm:flex min-h-screen">
						<Sidebar />
						<main className="sm:w-2/3 xl:w-4/5 sm:min-h-screen p-5">
							<Header />
							{children}
						</main>
					</div>
				</div>
			)}
		</>
	);
};

export default Layout;
