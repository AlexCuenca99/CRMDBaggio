import React, { useContext } from 'react';
import PedidoContext from '../../context/pedidos/PedidoContext';
import AlimentoResumen from './AlimentoResumen';

const ResumenPedido = () => {

    // Context de pedidos
    const pedidoContext = useContext(PedidoContext);
    const { alimentos } = pedidoContext;

    // console.log( alimentos );

    return (
        <>
            <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">
                3.- Ajusta las cantidades de los alimentos.
            </p>
            { alimentos !== null && alimentos.length > 0 ? (
                <>
                    { alimentos.map( alimento => (
                        <AlimentoResumen
                            key = { alimento.id }
                            alimento = { alimento }
                        />
                    ))}
                </>
            ): (
                <>
                    <p className="mt-5 text-sm">Aún no hay alimentos</p>
                </>
            )}
        </>
    );
}
 
export default ResumenPedido;