import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";
import { Inertia } from "@inertiajs/inertia";
import { InputText } from "primereact/inputtext";

const EditPurchasesProduct = ({ purchaseId, onTotalChange }) => {
    const [editedProducts, setEditedProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const receivedStatusOptions = [
        { label: "No Recibido", value: 0 },
        { label: "Recibido", value: 1 },
        { label: "Cancelado", value: 2 },
    ];
    const closeEditDialog = () => {
        setSelectedProduct(null);
        setShowEditDialog(false);
    };
    useEffect(() => {
        axios.get(route("purchase-products.index", { purchase_id: purchaseId }))
            .then((response) => {
                const products = response.data.purchaseProducts || [];
                setEditedProducts(products);
                updateTotal(products);
            });
    }, [purchaseId]);
    const updateTotal = (products) => {
        const total = products.reduce(
            (acc, product) => acc + product.qty * product.cost,
            0
        );
        onTotalChange(total);
    };
    const handleEditSave = () => {
        Inertia.put(route("purchase-products.update", { purchaseProducts: selectedProduct.id }),
            {
                qty: selectedProduct.qty,
                received: selectedProduct.received,
            },
            {
                onSuccess: () => {
                    const updatedProducts = editedProducts.map((product) =>
                        product.id === selectedProduct.id ? { ...product, ...selectedProduct } : product
                    );
                    setEditedProducts(updatedProducts);
                    updateTotal(updatedProducts);
                    closeEditDialog();
                },
            }
        );
    };
    const handleDelete = (id) => {
        Inertia.delete(route("purchase-products.destroy", { purchaseProduct: id }), {
            onSuccess: () => {
                const remainingProducts = editedProducts.filter(product => product.id !== id);
                setEditedProducts(remainingProducts);
                updateTotal(remainingProducts);
            },
        });
    };
    return (
        <>
            <DataTable value={editedProducts} dataKey="id" paginator rows={5}>
                <Column field="product.name" header="Producto" />
                <Column field="qty" header="Cantidad" />
                <Column
                    field="received"
                    header="Estado de Recepción"
                    body={(rowData) =>
                        receivedStatusOptions.find(status => status.value === rowData.received)?.label || "N/A"
                    }
                />
                <Column
                    field="cost"
                    header="Costo Unitario"
                    body={(rowData) => `$${parseFloat(rowData.cost).toFixed(2)}`}
                />
                <Column
                    header="Subtotal"
                    body={(rowData) => `$${(rowData.cost * rowData.qty).toFixed(2)}`}
                />
                <Column
                    header="Acciones"
                    body={(rowData) => (
                        <>
                            <Button
                                icon="pi pi-pencil"
                                className="p-button-rounded p-button-success p-mr-2 text-[#007bff]"
                                onClick={() => openEditDialog(rowData)}
                            />
                            <Button
                                icon="pi pi-trash"
                                className="p-button-rounded p-button-danger text-red-500"
                                onClick={() => handleDelete(rowData.id)}
                            />
                        </>
                    )}
                />
            </DataTable>

            <Dialog
                header="Editar Producto"
                visible={showEditDialog}
                style={{ width: '450px' }}
                modal
                onHide={closeEditDialog}
            >
                {selectedProduct && (
                    <div className="p-fluid">
                        <div className="p-field">
                            <label htmlFor="id">ID del producto a comprar</label>
                            <InputNumber value={selectedProduct.id} disabled />
                        </div>
                        <div className="p-field">
                            <label htmlFor="productName">Nombre del Producto</label>
                            <InputText value={selectedProduct.product?.name} disabled />
                        </div>
                        <div className="p-field">
                            <label htmlFor="qty">Cantidad</label>
                            <InputNumber
                                value={selectedProduct.qty}
                                onValueChange={(e) => handleEditChange("qty", e.value)}
                            />
                        </div>
                        <div className="p-field">
                            <label htmlFor="cost">Costo Unitario</label>
                            <InputNumber value={selectedProduct.cost} disabled />
                        </div>
                        <div className="p-field">
                            <label htmlFor="received">Estado de Recepción</label>
                            <Dropdown
                                value={selectedProduct.received}
                                options={receivedStatusOptions}
                                onChange={(e) => handleEditChange("received", e.value)}
                                placeholder="Seleccione"
                            />
                        </div>
                    </div>
                )}

                <div className="p-dialog-footer mt-4 flex justify-around">
                    <Button label="Cancelar" icon="pi pi-times" onClick={closeEditDialog} className="p-button-text bg-red-500 p-2 rounded-md text-white" />
                    <Button label="Guardar" icon="pi pi-check" onClick={handleEditSave} autoFocus className="p-button-text bg-[#007bff] p-2 rounded-md text-white" />
                </div>
            </Dialog>
        </>
    );
};

export default EditPurchasesProduct;
