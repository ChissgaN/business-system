import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';


export default function Products({ products }) {
    const [visibleCreateModal, setVisibleCreateModal] = useState(false);
    const [visibleEditModal, setVisibleEditModal] = useState(false);
    const [visibleDeleteModal, setVisibleDeleteModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({ name: '', description: '', cost: '', price: '', qty: 0 });
    const [searchTerm, setSearchTerm] = useState('');

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex justify-center">
                <Button
                    icon={<FaEdit />}
                    className="p-button-rounded p-button-info mr-2 text-indigo-600 text-xl"
                    onClick={() => editProduct(rowData)}
                    tooltip="Edit"
                />
                <Button
                    icon={<FaTrash />}
                    className="p-button-rounded p-button-danger text-red-600 text-xl"
                    onClick={() => confirmDeleteProduct(rowData)}
                    tooltip="Delete"
                />
            </div>
        );
    };

    const priceBodyTemplate = (rowData) => {
        return `$${rowData.price}`;
    };

    const costBodyTemplate = (rowData) => {
        return `$${rowData.cost}`;
    };

    const editProduct = (product) => {
        setSelectedProduct(product);
        setNewProduct({
            name: product.name,
            description: product.description,
            cost: product.cost,
            price: product.price,
            qty: product.qty,
        });
        setVisibleEditModal(true);
    };

    const confirmDeleteProduct = (product) => {
        setSelectedProduct(product);
        setVisibleDeleteModal(true);
    };

    const handleCreateProduct = () => {
        Inertia.post(route('products.store'), newProduct, {
            onSuccess: () => {
                setVisibleCreateModal(false);
                setNewProduct({ name: '', description: '', cost: '', price: '', qty: '' }); 
            },
            onError: (errors) => {
                console.error('Error al crear el producto:', errors);
            },
        });
    };

    const handleEditProduct = () => {
        Inertia.put(`/products/${selectedProduct.id}`, newProduct, {
            onSuccess: () => {
                console.log('Producto editado exitosamente');
                setVisibleEditModal(false);
            },
            onError: (errors) => {
                console.error('Error al editar el producto:', errors);
            },
        });
    };
    
    const handleDeleteProduct = () => {
        Inertia.delete(`/products/${selectedProduct.id}`, {
            onSuccess: () => {
                console.log('Producto eliminado exitosamente');
                setVisibleDeleteModal(false);
            },
            onError: (errors) => {
                console.error('Error al eliminar el producto:', errors);
            },
        });
    };
    

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AuthenticatedLayout>
            <Head title="Products" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className=" flex justify-between mb-4">
                            <div className="w-full flex justify-between space-x-4">
                                <InputText
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    placeholder="Buscar productos"
                                    className="p-inputtext-sm rounded-md border-color-[#4169E1] p-2"
                                />
                                <Button
                                    label="Nuevo Producto"
                                    icon="pi pi-plus"
                                    onClick={() => setVisibleCreateModal(true)}
                                    className="p-button-success bg-[#4169E1] text-white p-2 rounded-md"
                                />
                            </div>
                        </div>
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">

                        <DataTable
                            value={filteredProducts}
                            paginator
                            rows={10}
                            responsiveLayout="scroll"
                             
                        >
                            <Column field="id" header="ID" sortable />
                            <Column field="name" header="Nombre" sortable filter />
                            <Column field="description" header="Descripción" />
                            <Column field="cost" header="Costo" body={costBodyTemplate} sortable />
                            <Column field="price" header="Precio" body={priceBodyTemplate} sortable />
                            <Column field="qty" header="Cantidad" sortable />
                            <Column body={actionBodyTemplate} header="Acciones" />
                        </DataTable>
                    </div>
                </div>
            </div>
            {/* Create Product Modal */}
            <Dialog
                visible={visibleCreateModal}
                onHide={() => setVisibleCreateModal(false)}
                header="Crear Producto"
                footer={
                    <div className="flex justify-center space-x-2">
                        <Button label="Cancelar" icon="pi pi-times" className="p-button-danger bg-red-500 text-white p-2 rounded-md" onClick={() => setVisibleCreateModal(false)} />
                        <Button label="Crear" icon="pi pi-check" className="p-button-primary bg-[#4169E1] text-white p-2 rounded-md" onClick={handleCreateProduct} />
                    </div>
                }
            >
                <div className="field">
                    <label htmlFor="name">Nombre</label>
                    <InputText className='w-full px-2 rounded-md mb-2' id="name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
                </div>
                <div className="field">
                    <label htmlFor="description">Descripción</label>
                    <InputText className='w-full px-2 rounded-md mb-2' id="description" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
                </div>
                <div className="field">
                    <label htmlFor="cost">Costo</label>
                    <InputText className='w-full px-2 rounded-md mb-2' id="cost" value={newProduct.cost} onChange={(e) => setNewProduct({ ...newProduct, cost: e.target.value })} />
                </div>
                <div className="field">
                    <label htmlFor="price">Precio</label>
                    <InputText className='w-full px-2 rounded-md mb-2' id="price" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
                </div>
                <div className="field">
                    <label htmlFor="qty">Cantidad</label>
                    <InputText className='w-full px-2 rounded-md mb-2' id="qty" value={newProduct.qty} onChange={(e) => setNewProduct({ ...newProduct, qty: e.target.value })} />
                </div>
            </Dialog>

            <Dialog
                visible={visibleEditModal}
                onHide={() => setVisibleEditModal(false)}
                header="Editar Producto"
                footer={
                    <div className="flex justify-center space-x-2">
                        <Button label="Cancelar" icon="pi pi-times" className="p-button-danger bg-red-500 text-white p-2 rounded-md" onClick={() => setVisibleEditModal(false)} />
                        <Button label="Editar" icon="pi pi-check" className="p-button-primary bg-[#4169E1] text-white p-2 rounded-md" onClick={handleEditProduct} />
                    </div>
                }
            >
                <div className="field">
                    <label htmlFor="editName">Nombre</label>
                    <InputText className='w-full px-2 rounded-md mb-2' id="editName" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
                </div>
                <div className="field">
                    <label htmlFor="editDescription">Descripción</label>
                    <InputText className='w-full px-2 rounded-md mb-2' id="editDescription" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
                </div>
                <div className="field">
                    <label htmlFor="editCost">Costo</label>
                    <InputText className='w-full px-2 rounded-md mb-2' id="editCost" value={newProduct.cost} onChange={(e) => setNewProduct({ ...newProduct, cost: e.target.value })} />
                </div>
                <div className="field">
                    <label htmlFor="editPrice">Precio</label>
                    <InputText className='w-full px-2 rounded-md mb-2' id="editPrice" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
                </div>
                <div className="field">
                    <label htmlFor="editQty">Cantidad</label>
                    <InputText className='w-full px-2 rounded-md mb-2' id="editQty" value={newProduct.qty} onChange={(e) => setNewProduct({ ...newProduct, qty: e.target.value })} />
                </div>
            </Dialog>

            <Dialog
                visible={visibleDeleteModal}
                onHide={() => setVisibleDeleteModal(false)}
                header="Confirmar Eliminación"
                footer={
                    <div className="flex justify-end space-x-2">
                        <Button label="Cancelar" icon="pi pi-times" className="p-button-danger bg-red-500 text-white p-2 rounded-md" onClick={() => setVisibleDeleteModal(false)} />
                        <Button label="Borrar" icon="pi pi-check" className="p-button-danger bg-[#4169E1] text-white p-2 rounded-md" onClick={handleDeleteProduct} />
                    </div>
                }
            >
                <p>¿Esta seguro de que desea eliminar este producto?</p>
            </Dialog>
        </AuthenticatedLayout>
    );
}