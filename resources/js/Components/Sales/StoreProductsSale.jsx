import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useForm } from "@inertiajs/react";
export default function StoreProductSale({
    visible,
    onClose,
    saleId,
    products,
}) {
    const [productsSale, setProductsSale] = useState([]);
    const [newProduct, setNewProduct] = useState({
        product_id: "",
        qty: 1,
        price: 0,
    });
    const [editingIndex, setEditingIndex] = useState(null); // Índice del producto que se está editando
    const { post, processing } = useForm({
        products: [],
    });
    const handleAddOrUpdateProduct = () => {
        const product = products.find((p) => p.id === newProduct.product_id);
        if (product) {
            if (editingIndex !== null) {
                // Actualizar producto existente
                const updatedProducts = [...productsSale];
                updatedProducts[editingIndex] = {
                    ...newProduct,
                    price: product.price,
                };
                setProductsSale(updatedProducts);
                setEditingIndex(null); // Terminar edición
            } else {
                // Agregar nuevo producto
                setProductsSale([
                    ...productsSale,
                    { ...newProduct, price: product.price },
                ]);
            }
            setNewProduct({ product_id: "", qty: 1, price: 0, received: 0 });
        }
    };
    const handleEditProduct = (index) => {
        const productToEdit = productsSale[index];
        setNewProduct(productToEdit);
        setEditingIndex(index); // Guardar índice del producto a editar
    };
    const handleDeleteProduct = (index) => {
        const updatedProducts = productsSale.filter((_, i) => i !== index);
        setProductsSale(updatedProducts);
    };
    const handleSaveProducts = () => {
        const formattedProducts = productsSale.map((product) => ({
            product_id: parseInt(product.product_id),
            qty: parseInt(product.qty),
            price: parseFloat(product.price),
        }));
        if (formattedProducts.length === 0) {
            alert("No hay productos para guardar. Agrega al menos uno.");
            return;
        }
        const payload = {
            products: formattedProducts,
            sale_id: saleId,
        };
        Inertia.post(route("sales-products.store"), payload, {
            onSuccess: () => {
                setProductsSale([]);
                onClose();
            },
            onError: (errors) => {
                console.error("Errores en la solicitud:", errors);
            },
        });
    };
    return (
        <Dialog
            visible={visible}
            header="Añadir Productos"
            onHide={onClose}
            className="p-4 w-2/4"
        >
            <div className="p-fluid">
                <div className="mb-4">
                    <label className="block mb-2 font-semibold text-[#191970]">
                        Producto
                    </label>
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
                                price: product?.price || 0,
                            });
                        }}
                        placeholder="Seleccione un Producto"
                        className="w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 font-semibold text-[#191970]">
                        Cantidad
                    </label>
                    <InputText
                        type="number"
                        value={newProduct.qty}
                        onChange={(e) => {
                            const value = e.target.value;
                            setNewProduct({
                                ...newProduct,
                                qty:
                                    value === ""
                                        ? ""
                                        : Math.max(0, parseInt(value)),
                            });
                        }}
                        onBlur={() => {
                            setNewProduct((prev) => ({
                                ...prev,
                                qty:
                                    prev.qty === "" || prev.qty < 1
                                        ? 1
                                        : prev.qty,
                            }));
                        }}
                        className="w-full"
                        min={0}
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 font-semibold text-[#191970]">
                        Precio Unitario
                    </label>
                    <InputText
                        value={newProduct.price || 0}
                        disabled
                        className="w-full"
                    />
                </div>
                <Button
                    label={
                        editingIndex !== null
                            ? "Actualizar Producto"
                            : "Agregar Producto"
                    }
                    onClick={handleAddOrUpdateProduct}
                    className="mb-4 w-full bg-green-500 text-white p-2 rounded-md"
                    disabled={!newProduct.product_id}
                />
                {productsSale.length > 0 && (
                    <div className="mb-4">
                        <DataTable value={productsSale}>
                            <Column
                                field="product_id"
                                header="Producto"
                                body={(rowData) =>
                                    products.find(
                                        (p) => p.id === rowData.product_id
                                    )?.name
                                }
                            />
                            <Column field="qty" header="Cantidad" />
                            <Column field="price" header="Precio Unitario" />
                            <Column
                                header="Total"
                                body={(rowData) =>
                                    `$${(rowData.qty * rowData.price).toFixed(
                                        2
                                    )}`
                                }
                            />
                            <Column
                                header="Acciones"
                                body={(_, { rowIndex }) => (
                                    <div className="flex gap-2">
                                        <Button
                                            icon="pi pi-pencil"
                                            className="p-button-rounded p-button-warning"
                                            onClick={() =>
                                                handleEditProduct(rowIndex)
                                            }
                                        />
                                        <Button
                                            icon="pi pi-trash"
                                            className="p-button-rounded p-button-danger"
                                            onClick={() =>
                                                handleDeleteProduct(rowIndex)
                                            }
                                        />
                                    </div>
                                )}
                            />
                        </DataTable>
                        <div className="w-full flex justify-center items-center ">
                        <Button
                            label="Guardar Productos"
                            onClick={handleSaveProducts}
                            disabled={processing}
                            className="mt-4 w-1/3 bg-[#007bff] text-white p-2 rounded-md"
                        />
                        </div>
                    </div>
                )}
            </div>
        </Dialog>
    );
}
