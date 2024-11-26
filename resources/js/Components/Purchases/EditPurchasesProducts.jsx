import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useForm } from "@inertiajs/react";
import axios from "axios";

const EditPurchasesProducts = ({ visible, onHide, purchase }) => {
    const [editedPurchase, setEditedPurchase] = useState({ ...purchase });
    const [editedProducts, setEditedProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (purchase?.id) {
            setLoading(true);
            axios
                .get(
                    route("purchase-products.index", {
                        purchase_id: purchase.id,
                    })
                )
                .then((response) => {
                    setEditedProducts(response.data.purchaseProducts || []);
                })
                .catch((error) => {
                    console.error("Error al cargar productos:", error);
                })
                .finally(() => setLoading(false));
        }
    }, [purchase?.id]);
    useEffect(() => {
        if (purchase?.document_date) {
            const formattedDate = purchase.document_date.split(" ")[0];
            setEditedPurchase({
                ...purchase,
                document_date: formattedDate,
            });
        }
    }, [purchase]);
    const calculateTotal = () => {
        return editedProducts.reduce(
            (sum, product) => sum + (product.qty || 0) * (product.cost || 0),
            0
        );
    };
    const receivedStatusOptions = [
        { label: "No Recibido", value: 0 },
        { label: "Recibido", value: 1 },
        { label: "Cancelado", value: 2 },
    ];

    const handleSavePurchase = () => {
        const backendDate = `${editedPurchase.document_date} 00:00:00`;
        const purchasePayload = {
            ...editedPurchase,
            document_date: backendDate,
        };
        Inertia.put(route("purchases.update", { purchase: purchase.id }), {
            data: purchasePayload,
            onSuccess: () => {
                alert("Compra actualizada exitosamente.");
                onHide();
            },
            onError: (errors) => console.error(errors),
        });
    };
    const handleProductUpdate = (updatedProduct) => {
        const updatedProducts = editedProducts.map((product) =>
            product.id === updatedProduct.id ? updatedProduct : product
        );
        setEditedProducts(updatedProducts);
        setSelectedProduct(null);
    };

    const handleSaveProducts = () => {
        if (!editedProducts || editedProducts.length === 0) {
            alert("No hay productos para actualizar.");
            return;
        }
        // Preparar los datos para enviar
        const dataToUpdate = editedProducts.map((product) => ({
            id: product.id,
            qty: product.qty,
            cost: product.cost,
            received: product.received,
            product_id: product.product_id,
        }));
        Inertia.put(
            route("purchase-products.update", { purchase_id: purchase.id }),
            {
                data: { products: dataToUpdate },
                onSuccess: () => {
                    alert("Productos actualizados exitosamente.");
                    console.log("Productos actualizados:", dataToUpdate);
                },
                onError: (errors) => {
                    console.error(
                        "Errores al actualizar los productos:",
                        errors
                    );
                },
            }
        );
        onHide();
    };
    return (
        <Dialog
            visible={visible}
            header="Editar Compra y Productos comprados"
            onHide={onHide}
            className="w-3/4"
        >
            {/* Información de la Compra */}
            <section className="mb-4">
                <div className="p-fluid">
                    <section className="flex justify-around mb-4 text-center items-center">
                        <div>
                            <label className="block font-bold mt-4 mb-2 text-[#191970]">
                                Fecha
                            </label>
                            <InputText
                                type="date"
                                value={editedPurchase.document_date}
                                onChange={(e) =>
                                    setEditedPurchase({
                                        ...editedPurchase,
                                        document_date: e.target.value,
                                    })
                                }
                                className="w-full border-2 border-gray-400 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block font-bold mt-4 mb-2 text-[#191970]">
                                Estado de la Orden
                            </label>
                            <Dropdown
                                value={editedPurchase.order_status}
                                options={[
                                    { label: "No recibido", value: 0 },
                                    { label: "Recibido", value: 1 },
                                    { label: "Cancelado", value: 2 },
                                ]}
                                onChange={(e) =>
                                    setEditedPurchase({
                                        ...editedPurchase,
                                        order_status: e.value,
                                    })
                                }
                                className="w-full border-2 border-gray-400 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block font-bold mt-4 mb-2 text-[#191970]">
                                Estado del Pago
                            </label>
                            <Dropdown
                                value={editedPurchase.payment_status}
                                options={[
                                    { label: "Por pagar", value: 0 },
                                    { label: "Crédito", value: 1 },
                                    { label: "Pagado", value: 2 },
                                ]}
                                onChange={(e) =>
                                    setEditedPurchase({
                                        ...editedPurchase,
                                        payment_status: e.value,
                                    })
                                }
                                className="w-full border-2 border-gray-400 rounded-md"
                            />
                        </div>
                    </section>
                </div>
            </section>

            {/* Tabla de Productos */}
            <section>
                <DataTable
                    value={editedProducts}
                    editMode="cell"
                    dataKey="id"
                    onRowEditComplete={(e) => {
                        const { rowData, field, newValue } = e;
                        const updatedProducts = editedProducts.map((product) =>
                            product.id === rowData.id
                                ? { ...product, [field]: newValue }
                                : product
                        );
                        setEditedProducts(updatedProducts);
                    }}
                    paginator
                    rows={5}
                    rowClassName={(rowData) =>
                        rowData.id % 2 === 0
                            ? "bg-gray-200 text-gray-900"
                            : "bg-white text-gray-700"
                    }
                >
                    <Column
                        field="product.name"
                        header="Producto"
                        body={(rowData) => rowData.product?.name || "N/A"}
                    />
                    <Column
                        field="received"
                        header="Estado de Recepción"
                        body={(rowData) =>
                            receivedStatusOptions.find(
                                (status) => status.value === rowData.received
                            )?.label || "N/A"
                        }
                        editor={(options) => (
                            <Dropdown
                                value={options.rowData.received}
                                options={receivedStatusOptions}
                                onChange={(e) => {
                                    options.editorCallback(e.value);
                                }}
                            />
                        )}
                    />
                    <Column
                        field="qty"
                        header="Cantidad"
                        editor={(options) => (
                            <InputText
                                type="number"
                                value={options.rowData.qty}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value) || 0;
                                    options.editorCallback(value);
                                }}
                            />
                        )}
                    />
                    <Column
                        field="cost"
                        header="Costo Unitario"
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
            </section>

            <section className="mt-4">
                <div className="text-right font-bold text-lg">
                    Total: ${calculateTotal().toFixed(2)}
                </div>
            </section>

            {/* Botones */}
            <section className="flex justify-between mt-4">
                <Button
                    label="Guardar Compra"
                    icon="pi pi-save"
                    onClick={handleSavePurchase}
                    disabled={loading}
                    className="bg-blue-500 text-white p-2 rounded-md"
                />
                <Button
                    label="Guardar Productos"
                    icon="pi pi-save"
                    onClick={handleSaveProducts}
                    disabled={loading}
                    className="bg-green-500 text-white p-2 rounded-md"
                />
            </section>
        </Dialog>
    );
};

export default EditPurchasesProducts;
