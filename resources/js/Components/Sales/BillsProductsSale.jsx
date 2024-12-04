import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
const BillsProductsSale = ({
    visible,
    onHide,
    sale,
    productSales,
}) => {
    const formatDate = (date) => {
        if (!date) return "";
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(date).toLocaleDateString(undefined, options);
    };
    return (
        <Dialog
            visible={visible}
            header={`Factura de la Venta`}
            onHide={onHide}
            className="w-2/4"
        >
            <div className="p-fluid">
                {/* Información de la Compra */}
                <section className="mb-4 flex justify-between items-center">
                    <div className="font-semibold text-green-700">
                        <p>Fecha: {formatDate(sale?.document_date)}</p>
                        <p>Estado del Pago: {sale?.payment_status === 0 ? 'Pagado' : sale?.payment_status === 1 ? 'Por Pagado' : 'Crédito'}</p>
                    </div>
                    <div className="font-bold text-[#191970]">
                        <h3>ID de Compra: {sale?.id}</h3>
                        <p>Usuario: {sale?.user?.name}</p>
                    </div>
                </section>
                {/* Tabla de Productos */}
                <DataTable
                    value={productSales}
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
                    <Column field="qty" header="Cantidad" />
                    <Column
                        field="cost"
                        header="Precio Unitario"
                        body={(rowData) =>
                            `$${parseFloat(rowData.price).toFixed(2)}`
                        }
                    />
                    <Column
                        header="Subtotal"
                        body={(rowData) =>
                            `$${(rowData.price * rowData.qty).toFixed(2)}`
                        }
                    />
                </DataTable>
                {/* Total */}
                <section className="flex justify-between mt-4 items-center">
                    <div>
                    <h4 className="font-bold text-[#191970] text-xl">Total: $
                        {productSales
                        .reduce(
                                (acc, item) =>
                                    acc + (item.price || 0) * item.qty,
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
export default BillsProductsSale;