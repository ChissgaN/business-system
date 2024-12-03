import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import FourActionButtons from "@/Components/ActionButtons";
import StoreSales from "@/Components/Sales/StoreSales";
import axios from "axios";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import StorePurchaseProduct from "@/Components/Purchases/StorePurchaseProducts";
import BillsPurchasesProducts from "@/Components/Purchases/BillsPurchasesProducts";
import EditPurchases from "@/Components/Purchases/EditPurchases";

export default function Sales({
    sales = [],
    users = [],
    products = [],
}) {
    const [visibleCreateModal, setVisibleCreateModal] = useState(false);
    const [visibleProductsModal, setVisibleProductsModal] = useState(false);
    const [visibleEditModal, setVisibleEditModal] = useState(false);
    const [visibleViewModal, setVisibleViewModal] = useState(false);
    const [selectedSale, setSelectedSale] = useState(null);
    const [productSale, setProductSale] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const paymentStatusOptions = [
        { label: "Por pagar", value: 1 },
        { label: "Crédito", value: 2 },
        { label: "Pagado", value: 0 },
    ];

    const handleSaveSale = (saleData) => {
        Inertia.post(route("sales.store"), saleData, {
            onSuccess: () => {
                setVisibleCreateModal(false);
            },
        });
    };
    const actionBodyTemplate = (rowData) => {
        const handleView = (sale) => {
            axios
                .get(route("sales-products.index", { sale_id: sale.id }))
                .then((response) => {
                    const { sale, ProductSale  } = response.data;
                    setSelectedSale(sale); // Detalles de la compra
                    setProductSale(ProductSale); // Productos asociados
                    setVisibleViewModal(true);
                })
                .catch((error) => {
                    console.error("Error al cargar los datos:", error);
                });
        };
        // Form states
        
        const handleProducts = (purchase) => {
            setSelectedSale(purchase);
            setVisibleProductsModal(true);
            setProductSale([]); // Reset products
        };
        const handleEdit = (purchase) => {
            setSelectedSale(purchase); // Asignar la compra seleccionada
            setProductSale({
                user_id: purchase.user_id,
                document_date: new Date(purchase.document_date),
                order_status: purchase.order_status,
                payment_status: purchase.payment_status,
                total: purchase.total,
            });
            setVisibleEditModal(true); // Mostrar modal de edición
        };
        const handleDelete = (purchase) => {
            Inertia.delete(route("purchases.destroy", { purchase: purchase.id }), {
                onSuccess: () => {
                    console.log("Compra eliminada exitosamente");
                },
                onError: (errors) => {
                    console.error("Error al eliminar la compra:", errors);
                },
            });
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
            <Head title="Sales" />
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
                        label="Nueva Venta"
                        icon="pi pi-plus"
                        onClick={() => setVisibleCreateModal(true)}
                        className="p-2 rounded-md bg-[#007bff] text-white"
                    />
                    {/* Modal para crear compras */}
                    {visibleCreateModal && (
                        <StoreSales
                            users={users}
                            products={products}
                            onSave={handleSaveSale}
                            onClose={() => setVisibleCreateModal(false)}
                        />
                    )}
                    {visibleViewModal && (
                        <BillsPurchasesProducts
                            visible={visibleViewModal}
                            onHide={() => setVisibleViewModal(false)}
                            purchase={selectedSale}
                            productSale={productSale}
                        />
                    )}
                    {visibleEditModal && (
                        <EditPurchases
                            visible={visibleEditModal} 
                            onHide={() => setVisibleEditModal(false)} 
                            purchase={selectedSale} 
                            productSale={productSale.products} 
                            users={users}
                        />
                    )}
                </div>
                {/* Main DataTable */}
                <DataTable value={sales} paginator rows={5} header="Listado de Ventas"
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
                        purchaseId={selectedSale?.id}
                        products={products}
                    />
                )}
            </div>
        </AuthenticatedLayout>
    );
}
