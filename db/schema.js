//Schema
const { gql } = require('apollo-server')

const typeDefs = gql`
    
    type Usuario{
        id: ID
        nombre: String
        apellido: String
        email: String
        creado: String
    }

    type Token{
        token: String
    }

    type Ingrediente {
        id: ID
        nombre: String
        existencia: Int
        precio: Float
        elaboracion: String
        vencimiento: String
        creado: String
    }

    type Alimento {
        id: ID
        nombre: String
        tipo: String
        descripcion: String
        precio: Float
        creado: String
    }

    type Cliente {
        id: ID
        nombre: String
        apellido: String
        cedula: String
        direccion: String
        creado: String
    }

    type Equipo { 
        id: ID
        nombre: String
        marca: String
        cantidad: Int
        precio: Float
        creado: String
    }

    type Pedido {
        id: ID
        pedido: [PedidoGrupo]
        total: Float
        cliente: Cliente
        creado: String
        estado: EstadoPedido
    }

    type PedidoGrupo {
        id: ID
        cantidad: Int
        nombre: String
        precio: Float
    }

    #Inputs
    input UsuarioInput{
        nombre: String!
        apellido: String!
        email: String!
        password: String!
    }

    input AutenticarInput{
        email: String!
        password: String!
    }

    input IngredienteInput {
        nombre: String!
        existencia: Int!
        precio: Float!
        elaboracion: String!
        vencimiento: String!
    }

    input AlimentoInput {
        nombre: String!
        tipo: String!
        descripcion: String
        precio: Float!
    }

    input ClienteInput {
        nombre: String!
        apellido: String!
        cedula: String!
        direccion: String!
    }

    input EquipoInput {
        nombre: String!
        marca: String!
        cantidad: Int!
        precio: Float!
    }

    input PedidoAlimentoInput {
        id: ID,
        cantidad: Int
        nombre: String
        precio: Float
    }

    input PedidoInput {
        pedido: [PedidoAlimentoInput]
        total: Float
        cliente: ID
        estado: EstadoPedido
    }

    enum EstadoPedido { 
        PENDIENTE
        COMPLETADO
        CANCELADO
    }

    #Querys
    type Query{
        #Usuarios
        obtenerUsuario : Usuario
        
        #Cliente
        obtenerClientes: [Cliente]
        obtenerCliente(id: ID!) : Cliente

        #Ingredientes
        obtenerIngredientes: [Ingrediente]
        obtenerIngrediente(id: ID!) : Ingrediente

        #Alimentos
        obtenerAlimentos: [Alimento]
        obtenerAlimento(id: ID!) : Alimento

        #Equipos
        obtenerEquipos: [Equipo]
        obtenerEquipo(id: ID!) : Equipo

        #Pedidos
        obtenerPedidos: [Pedido]
        obtenerPedido(id: ID!) : Pedido
        obtenerPedidosEstado(estado: String!) : [Pedido]

        #Busquedas Avanzadas
        buscarAlimento(texto: String!) : [Alimento]
    }

    #Mutations
    type Mutation{
        #Usuarios
        nuevoUsuario(input: UsuarioInput) : Usuario
        autenticarUsuario(input: AutenticarInput) : Token

        #Ingredientes
        nuevoIngrediente(input: IngredienteInput) : Ingrediente
        actualizarIngrediente(id: ID!, input: IngredienteInput) : Ingrediente
        eliminarIngrediente(id: ID!) : String

        #Alimentos
        nuevoAlimento(input: AlimentoInput) : Alimento
        actualizarAlimento(id: ID!, input: AlimentoInput) : Alimento
        eliminarAlimento(id: ID!) : String

        #Cliente
        nuevoCliente(input: ClienteInput) : Cliente
        actualizarCliente(id: ID!, input: ClienteInput) : Cliente
        eliminarCliente(id: ID!) : String

        #Equipo
        nuevoEquipo(input: EquipoInput) : Equipo
        actualizarEquipo(id: ID!, input: EquipoInput) : Equipo
        eliminarEquipo(id: ID!) : String

        #Pedido
        nuevoPedido(input: PedidoInput): Pedido
        actualizarPedido(id: ID!, input: PedidoInput) : Pedido
        eliminarPedido(id: ID!): String
        
    }
`;

module.exports = typeDefs;