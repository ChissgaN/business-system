import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import FourActionButtons from "@/Components/ActionButtons";
import StorePurchases from "@/Components/Purchases/StorePurchases";
import axios from "axios";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import StorePurchaseProduct from "@/Components/Purchases/StorePurchaseProducts";
import BillsPurchasesProducts from "@/Components/Purchases/BillsPurchasesProducts";

export default function Purchases({
    purchases = [],
    users = [],
    products = [],
}) {
    const [visibleCreateModal, setVisibleCreateModal] = useState(false);
    const [visibleProductsModal, setVisibleProductsModal] = useState(false);
    const [visibleEditModal, setVisibleEditModal] = useState(false);
    const [visibleDeleteModal, setVisibleDeleteModal] = useState(false);
    const [visibleViewModal, setVisibleViewModal] = useState(false);
    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [purchaseProducts, setPurchaseProducts] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");

    const orderStatusOptions = [
        { label: "No recibido", value: 0 },
        { label: "Recibido", value: 1 },
        { label: "Cancelado", value: 2 },
    ];
    const paymentStatusOptions = [
        { label: "Por pagar", value: 0 },
        { label: "Crédito", value: 1 },
        { label: "Pagado", value: 2 },
    ];
    const receivedStatusOptions = [
        { label: "No Recibido", value: 0 },
        { label: "Recibido", value: 1 },
        { label: "Cancelado", value: 2 },
    ];
    // Form states
    const handleSavePurchase = (purchaseData) => {
        Inertia.post(route("purchases.store"), purchaseData, {
            onSuccess: () => {
                setVisibleCreateModal(false);
            },
        });
    };
    const actionBodyTemplate = (rowData) => {
        const handleView = (purchase) => {
            axios
                .get(route("purchase-products.index", { purchase_id: purchase.id }))
                .then((response) => {
                    const { purchase, purchaseProducts } = response.data;
                    setSelectedPurchase(purchase); // Detalles de la compra
                    setPurchaseProducts(purchaseProducts); // Productos asociados
                    setVisibleViewModal(true);
                })
                .catch((error) => {
                    console.error("Error al cargar los datos:", error);
                });
        };
        
        const handleProducts = (purchase) => {
            setSelectedPurchase(purchase);
            setVisibleProductsModal(true);
            setPurchaseProducts([]); // Reset products
        };
        const handleEdit = (purchase) => {
            setSelectedPurchase(purchase);
            setNewPurchase({
                user_id: purchase.user_id,
                document_date: new Date(purchase.document_date),
                order_status: purchase.order_status,
                payment_status: purchase.payment_status,
                total: purchase.total,
            });
            setVisibleEditModal(true);
        };
        const handleDelete = (purchase) => {
            setSelectedPurchase(purchase);
            setVisibleDeleteModal(true);
        };
        return (
            <FourActionButtons
                rowData={rowData}
                onView={handleView}
                onProducts={handleProducts}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        );
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES"); // Formato: "dd/mm/yyyy"
    };
    return (
        <AuthenticatedLayout>
            <Head title="Purchases" />
            <div className="p-6">
                {/* Search and Create button */}
                <div className="flex justify-between items-center mb-4">
                    <InputText
                        placeholder="Buscar por ID o Usuario"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-inputtext w-[25%]"
                    />
                    <Button
                        label="Nueva Compra"
                        icon="pi pi-plus"
                        onClick={() => setVisibleCreateModal(true)}
                        className="p-2 rounded-md bg-[#007bff] text-white"
                    />
                    {/* Modal para crear compras */}
                    {visibleCreateModal && (
                        <StorePurchases
                            users={users}
                            products={products}
                            onSave={handleSavePurchase}
                            onClose={() => setVisibleCreateModal(false)}
                        />
                    )}
                    {visibleViewModal && (
                        <BillsPurchasesProducts
                            visible={visibleViewModal}
                            onHide={() => setVisibleViewModal(false)}
                            purchase={selectedPurchase}
                            purchaseProducts={purchaseProducts}
                        />
                    )}

                </div>
                {/* Main DataTable */}
                <DataTable value={purchases} paginator rows={5} header="Listado de Compras"
                rowClassName={(rowData) => (rowData.id % 2 === 0 ? 'bg-gray-800 text-white' : 'bg-gray-400 text-gray-700')}>
                    <Column field="id" header="ID" sortable />
                    <Column field="user.name" header="Usuario" sortable />
                    <Column field="document_date" header="Fecha" sortable body={(rowData) => formatDate(rowData.document_date)}/>
                    <Column
                        field="total"
                        header="Total"
                        sortable
                        body={(rowData) =>
                            `$${parseFloat(rowData.total).toFixed(2)}`
                        }
                    />
                    <Column
                        field="order_status"
                        header="Estado Orden"
                        sortable
                        body={(rowData) =>
                            orderStatusOptions.find(
                                (opt) => opt.value === rowData.order_status
                            )?.label
                        }
                    />
                    <Column
                        field="payment_status"
                        header="Estado Pago"
                        sortable
                        body={(rowData) =>
                            paymentStatusOptions.find(
                                (opt) => opt.value === rowData.payment_status
                            )?.label
                        }
                    />
                    <Column header="Acciones" body={actionBodyTemplate} />
                </DataTable>
                {visibleProductsModal && (
                    <StorePurchaseProduct
                        visible={visibleProductsModal}
                        onClose={() => setVisibleProductsModal(false)}
                        purchaseId={selectedPurchase?.id}
                        products={products}
                    />
                )}
            </div>
        </AuthenticatedLayout>
    );
}
