import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Products from "@/Pages/Auth/Products";

const BillsPurchasesProducts = ({
    visible,
    onHide,
    purchase,
    purchaseProducts,
}) => {
    const formatDate = (date) => {
        if (!date) return "";
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(date).toLocaleDateString(undefined, options);
    };

    // Calcula el total dinámicamente
    const total = purchaseProducts.reduce(
        (acc, item) => acc + (item.cost || 0) * item.qty,
        0
    );

    return (
        <Dialog
            visible={visible}
            header={`Factura de Compra`}
            onHide={onHide}
            className="w-2/4"
        >
            <div className="p-fluid">
                {/* Información de la Compra */}
                <section className="mb-4 flex justify-between items-center">
                    <div className="font-semibold text-green-700">
                        <p>Fecha: {formatDate(purchase?.document_date)}</p>
                        <p>Estado de la Orden: {purchase?.order_status === 0 ? 'No recibido' : purchase?.order_status === 1 ? 'Recibido' : 'Cancelado'}</p>
                        <p>Estado del Pago: {purchase?.payment_status === 0 ? 'Por pagar' : purchase?.payment_status === 1 ? 'Pagado' : 'Crédito'}</p>
                    </div>
                    <div className="font-bold text-[#191970]">
                        <h3>ID de Compra: {purchase?.id}</h3>
                        <p>Usuario: {purchase?.user?.name}</p>
                    </div>
                </section>
                {/* Tabla de Productos */}
                <DataTable
                    value={purchaseProducts}
                    className="mt-4"
                    rowClassName={(rowData ) => (rowData.id % 2 === 0 ? 'bg-gray-800 text-white' : 'bg-gray-400 text-gray-700')}
                    tableStyle={{ minWidth: "38rem" }}
                    paginator rows={4}
                >
                    <Column
                        field="product.name"
                        header="Producto"
                        body={(rowData) => rowData.product?.name || "N/A"}
                    />
                    <Column field="received" header="Recibido" body={(rowData) => rowData.received === 1 ? 'Sí' : rowData.received === 2 ? 'Cancelado' : 'No'} />
                    <Column field="qty" header="Cantidad" />
                    <Column
                        field="cost"
                        header="Precio Unitario"
                        body={(rowData) =>
                            `$${parseFloat(rowData.cost).toFixed(2)}`
                        }
                    />
                    <Column
                        header="Subtotal"
                        body={(rowData) =>
                            `$${(rowData.cost * rowData.qty).toFixed(2)}`
                        }
                    />
                </DataTable>

                {/* Total */}
                <section className="flex justify-between mt-4 items-center">
                    <div>
                    <h4 className="font-bold text-[#191970] text-xl">Total: $
                        {purchaseProducts
                            .reduce(
                                (acc, item) =>
                                    acc + (item.cost || 0) * item.qty,
                                0
                            ).toFixed(2)}
                    </h4>
                    </div>
                    <div>
                    <Button
                        label="Cerrar"
                        icon="pi pi-times"
                        onClick={onHide}
                        className="bg-red-500 text-white p-2 rounded-md"
                    />
                    </div>
                </section>
            </div>
        </Dialog>
    );
};

export default BillsPurchasesProducts;
