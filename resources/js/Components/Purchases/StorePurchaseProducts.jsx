import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useForm } from "@inertiajs/react";

export default function StorePurchaseProduct({
    visible,
    onClose,
    purchaseId,
    products,
}) {
    const [purchaseProducts, setPurchaseProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        product_id: "",
        qty: 1,
        cost: 0,
        received: 0,
    });

    const { post, processing } = useForm({
        products: [],
    });

    const receivedStatusOptions = [
        { label: "No Recibido", value: 0 },
        { label: "Recibido", value: 1 },
        { label: "Cancelado", value: 2 },
    ];

    const handleAddProduct = () => {
        const product = products.find((p) => p.id === newProduct.product_id);
        if (product) {
            setPurchaseProducts([
                ...purchaseProducts,
                { ...newProduct, cost: product.price },
            ]);
            setNewProduct({ product_id: "", qty: 1, cost: 0, received: 0 });
        }
    };

    const handleSaveProducts = () => {
        // Formatear los productos para enviar
        const formattedProducts = purchaseProducts.map((product) => ({
            product_id: parseInt(product.product_id),
            qty: parseInt(product.qty),
            cost: parseFloat(product.cost),
            received: parseInt(product.received),
        }));
    
        console.log("Productos formateados para enviar:", formattedProducts);
    
        if (formattedProducts.length === 0) {
            alert("No hay productos para guardar. Agrega al menos uno.");
            return;
        }
    
        // Enviar el objeto con el purchase_id y los productos
        const payload = {
            purchase_id: purchaseId, // Asegúrate de que purchaseId tenga un valor válido
            products: formattedProducts // Este es el array de productos
        };
    
        // Crear un nuevo objeto para asegurar el orden
        const orderedPayload = {
            purchase_id: payload.purchase_id,
            products: payload.products
        };
    
        console.log("Payload a enviar:", orderedPayload); // Verifica el payload antes de enviar
    
        post(
            "/purchase-product/bulk-create",
            orderedPayload,
            {
                onSuccess: () => {
                    console.log("Productos guardados con éxito:", formattedProducts);
                    setPurchaseProducts([]); // Limpiar la lista
                    onClose();
                },
                onError: (errors) => {
                    console.error("Errores en la solicitud:", errors);
                },
            }
        );
    };
    return (
        <Dialog
            visible={visible}
            header="Añadir Productos"
            onHide={onClose}
            className="p-4"
        >
            <div className="p-fluid">
                <div className="mb-4">
                    <label className="block mb-2">Producto</label>
                    <Dropdown
                        value={newProduct.product_id}
                        options={products.map((product) => ({
                            label: product.name,
                            value: product.id,
                        }))}
                        onChange={(e) => {
                            const product = products.find(
                                (p) => p.id === e.value
                            );
                            setNewProduct({
                                ...newProduct,
                                product_id: e.value,
                                cost: product?.price || 0,
                            });
                        }}
                        placeholder="Seleccione un Producto"
                        className="w-full"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Cantidad</label>
                    <InputText
                        type="number"
                        value={newProduct.qty}
                        onChange={(e) => {
                            const value = parseInt(e.target.value) || 1;
                            setNewProduct({
                                ...newProduct,
                                qty: value > 0 ? value : 1,
                            });
                        }}
                        className="w-full"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Precio Unitario</label>
                    <InputText
                        value={newProduct.cost}
                        disabled
                        className="w-full"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Estado de Recepción</label>
                    <Dropdown
                        value={newProduct.received}
                        options={receivedStatusOptions}
                        onChange={(e) =>
                            setNewProduct({
                                ...newProduct,
                                received: e.value,
                            })
                        }
                        placeholder="Seleccione un Estado"
                        className="w-full"
                    />
                </div>

                <Button
                    label="Agregar Producto"
                    onClick={handleAddProduct}
                    className="mb-4 w-full"
                    disabled={!newProduct.product_id}
                />

                {purchaseProducts.length > 0 && (
                    <div className="mb-4">
                        <DataTable value={purchaseProducts}>
                            <Column
                                field="product_id"
                                header="Producto"
                                body={(rowData) =>
                                    products.find((p) => p.id === rowData.product_id)
                                        ?.name
                                }
                            />
                            <Column field="qty" header="Cantidad" />
                            <Column field="cost" header="Costo Unitario" />
                            <Column
                                header="Total"
                                body={(rowData) =>
                                    `$${(rowData.qty * rowData.cost).toFixed(2)}`
                                }
                            />
                        </DataTable>

                        <Button
                            label="Guardar Productos"
                            onClick={handleSaveProducts} // Asegúrate de que esté aquí
                            disabled={processing}
                            className="mt-4 w-full"
                        />
                    </div>
                )}
            </div>
        </Dialog>
    );
}
