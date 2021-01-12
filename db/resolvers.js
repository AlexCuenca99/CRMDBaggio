const Usuario = require('../modelos/Usuario');
const Ingrediente = require('../modelos/Ingrediente');
const Alimento = require('../modelos/Alimento');
const Cliente = require('../modelos/Cliente');
const Equipo = require('../modelos/Equipo');
const Pedido = require('../modelos/Pedido');

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

require ('dotenv').config({ path: 'variables.env' });


const crearToken = ( usuario, secreta) => {
    
    const { id,email, nombre, apellido } = usuario;

    return jwt.sign( { id, email, nombre, apellido }, secreta, { expiresIn: 2000 } );
}

//Resolvers
const resolvers = {
    Query:{

        //USUARIOS
        obtenerUsuario: async (_, {}, ctx) => {
            return ctx.usuario;
        },

        //CLIENTES
        obtenerClientes: async () => {
            try{
                const clientes = await Cliente.find({});
                return clientes;
            }catch(error){
                console.log(error);
            }
        },
        obtenerCliente: async (_, { id }) => {
            //Revisar si el cliente existe
            const cliente = await Cliente.findById(id);
            if(!cliente){
                throw new Error ('El cliente no se ha encontrado');
            }

            return cliente;
        },

        //INGREDIENTES
        obtenerIngredientes: async () => {
            try {

                const ingredientes = await Ingrediente.find({});
                
                return ingredientes;
            } catch (error) {
                console.log(error);
            }
        },
        obtenerIngrediente: async (_, { id }) => {
            //Revisar si el ingrediente existe
            const ingrediente = await Ingrediente.findById(id);
            if(!ingrediente){
                throw new Error('El ingrediente no se ha encontrado');
            }

            return ingrediente;
        },

        //ALIMENTOS
        obtenerAlimentos: async () => {
            try {
                const alimentos = await Alimento.find({});
                return alimentos;
            } catch (error) {
                console.log(error);
            }
        },
        obtenerAlimento: async (_, { id }) => {
            //Revisar si el alimento existe
            const alimento = await Alimento.findById(id);
            
            if(!alimento){
                throw new Error('El alimento no se ha encontrado');
            }

            return alimento;
        },

        //EQUIPOS
        obtenerEquipos: async () => {
            try {
                const equipos = await Equipo.find({});
                return equipos;
            } catch (error) {
                console.log(error);
            }
        },
        obtenerEquipo: async (_, { id }) => {
            const equipo = await Equipo.findById(id);
            
            if(!equipo){
                throw new Error('El equipo no se ha encontrado');
            }

            return equipo;
        },

        //PEDIDOS
        obtenerPedidos: async () => {
            try {
                const pedidos = await Pedido.find({}).populate('cliente');
                //console.log(pedidos);
                return pedidos;
            } catch (error) {
                console.log(error);
            }
        },
        obtenerPedido: async (_, { id }) => {
            //Verificar si el pedido existe
            const pedido = await Pedido.findById(id);
            if(!pedido){
                throw new Error('El pedido no se ha encontrado');
            }
            //Retornar el resultado
            return pedido;
        },
        obtenerPedidosEstado: async (_, { estado }) => {
            const pedidos = await Pedido.find({ estado });

            return pedidos;
        },

        //BUSQUEDAS AVANZADAS
        buscarAlimento: async (_,{ texto }) => {
            const alimentos = await Alimento.find({ $text: { $search: texto } }).limit(5);

            return alimentos;
        }
    },

    Mutation: {

        //USUARIOS
        nuevoUsuario: async (_, { input }) => {
            
            const { email, password } = input;

            //Revisar si el usuario ya esta registrado
            const existeUsuario = await Usuario.findOne({ email });
            
            if(existeUsuario){
                throw new Error('El usuario ya esta registrado');
            }
            //console.log(existeUsuario);
            //Hashear password
            const salt = bcryptjs.genSaltSync(10);
            input.password = bcryptjs.hashSync(password, salt);
            
            //Guardarlo en la base de datos
            try {
                const usuario = new Usuario(input);
                usuario.save();
                return usuario;
            } catch (error) {
                console.log(error);
            }
        },
        autenticarUsuario: async (_, { input }) => {
            
            const { email, password } = input;

            //Si el usuario existe
            const existeUsuario = await Usuario.findOne({ email });
            
            if(!existeUsuario){
                throw new Error('El usuario no existe');
            }

            //Revisar si el password es correcto
            const passwordCorrecto = await bcryptjs.compare( password, existeUsuario.password );
            if(!passwordCorrecto){
                throw new Error('El password no es correcto');
            }

            //Crear el token
            return{
                token: crearToken( existeUsuario, process.env.SECRETA, '24' )
            }
        },

        //INGREDIENTES
        nuevoIngrediente: async (_, { input }) => {
            const { nombre } = input;

             //Revisar si el ingrediente ya esta registrado
             const existeIngrediente = await Ingrediente.findOne({ nombre });
                
             if(existeIngrediente){
                 throw new Error('El ingrediente ya esta registrado');
             }

            try {
                
                var date = new Date(input.elaboracion);  // dateStr you get from mongodb

                var d = date.getDate();
                var m = date.getMonth()+1;

                const nuevoIngrediente = new Ingrediente( input );

                //Almacenar en BD
                const resultado = await nuevoIngrediente.save();

                return resultado;
            } catch (error) {
                console.log(error);
            }
            
        },
        actualizarIngrediente: async (_, { id, input }) => {
            //Revisar si el ingrediente existe
            let ingrediente = await Ingrediente.findById(id);
            if(!ingrediente){
                throw new Error('El ingrediente no se ha encontrado');
            }

            //Guardarlo en la base de datos
            ingrediente = await Ingrediente.findOneAndUpdate({ _id: id }, input, { new: true });
            
            return ingrediente;
        },
        eliminarIngrediente: async (_, { id }) => {
            //Revisar si el ingrediente existe
            let ingrediente = await Ingrediente.findById(id);
            if(!ingrediente){
                throw new Error('El ingrediente no se ha encontrado');
            }

            //Eliminar
            await Ingrediente.findOneAndDelete( { _id: id } );

            return 'Producto Eliminado'
        },

        //ALIMENTOS
        nuevoAlimento: async (_, { input }) => {
            const { nombre } = input;

             //Revisar si el usuario ya esta registrado
             const existeAlimento = await Alimento.findOne({ nombre });
                
             if(existeAlimento){
                 throw new Error('El alimento ya esta registrado');
             }

            try {
                
                const nuevoAlimento = new Alimento( input );

                //Almacenar en BD
                const resultado = await nuevoAlimento.save();

                return resultado;
            } catch (error) {
                console.log(error);
            }
        },
        actualizarAlimento: async (_, { id, input }) => {
            //Revisar si el alimento existe
            let alimento = await Alimento.findById(id);
            if(!alimento){
                throw new Error('El alimento no se ha encontrado');
            }

            //Guardar en la base de datos
            alimento = await Alimento.findOneAndUpdate({ _id: id }, input, { new: true });

            return alimento;
        },
        eliminarAlimento: async (_, { id }) => {
            //Revisar si el alimento existe
            let alimento = await Alimento.findById(id);
            if(!alimento){
                throw new Error('El alimento no se ha encontrado');
            }

            //Eliminar
            await Alimento.findOneAndDelete({ _id: id });
            
            return 'Alimento Eliminado'
        },

        //CLIENTES
        nuevoCliente: async (_, { input }) => {
            
            const { cedula } = input;

            //Verificar si el cliente ya esta registrado
            const cliente = await  Cliente.findOne({ cedula });
            if(cliente){
                throw new Error('El cliente ya esta registrado');
            }

            try {
                const nuevoCliente = new Cliente( input );

                //Almacenar en BD
                const resultado = await nuevoCliente.save();

                return resultado;
            } catch (error) {
                console.log(error);
            }
        },
        actualizarCliente: async (_, { id, input }) => {
            //Revisar si el cliente existe
            let cliente = await Cliente.findById(id);
            if(!cliente){
                throw new Error('El cliente no se ha encontrado');
            }

            //Guardar en la BD
            cliente = await Cliente.findOneAndUpdate({ _id: id }, input, { new: true });

            return cliente;
        },
        eliminarCliente: async (_, { id }) => {
            //Revisar si el alimento existe
            let cliente = await Cliente.findById(id);
            if(!cliente){
                throw new Error('El cliente no se ha encontrado');
            }

            //Eliminar
            await Cliente.findOneAndDelete({ _id: id });
            
            return 'Cliente Eliminado'
        },

        //EQUIPOS
        nuevoEquipo: async (_, { input }) => {
            
            const { nombre } = input;

             //Revisar si el usuario ya esta registrado
             const existeEquipo = await Equipo.findOne({ nombre });
                
             if(existeEquipo){
                 throw new Error('El equipo ya esta registrado');
             }

            try {
                const nuevoEquipo = new Equipo( input );

                //Almacenar en BD
                const resultado = await nuevoEquipo.save();

                return resultado;
            } catch (error) {
                console.log(error);
            }
        },
        actualizarEquipo: async (_, { id, input }) => {
            //Revisar si el equipo existe
            let equipo = await Equipo.findById(id);
            
            if(!equipo){
                throw new Error('El equipo no se ha encontrado');
            }

            //Guardar en la base de datos
            equipo = await Equipo.findOneAndUpdate({ _id: id }, input, { new: true });

            return equipo;
        },
        eliminarEquipo: async (_, { id }) => {
            //Revisar si el equipo existe
            let equipo = await Equipo.findById(id);
            
            if(!equipo){
                throw new Error('El equipo no se ha encontrado');
            }

            //Eliminar
            await Equipo.findOneAndDelete({ _id: id });
            return 'Equipo Eliminado';
        },

        //PEDIDOS
        nuevoPedido: async (_, { input }, ctx) => {
            const { cliente } = input;
            //Verificar si el cliente existe
            let clienteExiste = await Cliente.findById(cliente);

            if(!clienteExiste){
                throw new Error('El cliente no se ha encontrado');
            }

            //Crear nuevo pedido
            const nuevoPedido = new Pedido(input);

            //Guardar en la BD
            const resultado = await nuevoPedido.save();
            
            return resultado;
        },
        actualizarPedido: async(_, { id, input }) => {

            const { cliente } = input;

            //verificar si el pedido existe
            const existePedido = await Pedido.findById(id);
            if(!existePedido){
                throw new Error('El pedido no se ha encontrado');
            }

            //Verificar si el cliente existe
            const existeCiente = await Cliente.findById(cliente);
            if(!existeCiente){
                throw new Error('El cliente no se ha encontrado');
            }

            //Guardar el pedido
            const resultado = await Pedido.findOneAndUpdate({ _id: id }, input, { new: true });
            
            return resultado;
        },
        eliminarPedido: async(_, {id}) => {
            //Verificar si el pedido existe
            const pedido = await Pedido.findById(id);

            if(!pedido){
                throw new Error('El pedido no se ha encontrado');
            }

            //Eliminar de la BD
            await Pedido.findOneAndDelete({ _id:id });

            return "Pedido Eliminado";
        }
    }
}

module.exports = resolvers;