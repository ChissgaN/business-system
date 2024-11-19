import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export default function Purchases({ purchases }) {
    const [visibleCreateModal, setVisibleCreateModal] = useState(false);
    const [visibleEditModal, setVisibleEditModal] = useState(false);
    const [visibleDeleteModal, setVisibleDeleteModal] = useState(false);
    const [visibleViewModal, setVisibleViewModal] = useState(false);
    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [newPurchase, setNewPurchase] = useState({
        id: "",
        document_date: "",
        total: "",
        order_status: "",
        payment_status: "",
        user_id: "",
    });
    const [searchTerm, setSearchTerm] = useState("");

    const handleDeletePurchase = () => {
        if (selectedPurchase) {
            Inertia.delete(
                route("purchases.destroy", { id: selectedPurchase.id }),
                {
                    onSuccess: () => {
                        console.log("Purchase deleted successfully");
                        setVisibleDeleteModal(false);
                    },
                    onError: (errors) => {
                        console.error("Error deleting purchase:", errors);
                    },
                }
            );
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const editPurchase = (purchase) => {
        setSelectedPurchase(purchase);
        setNewPurchase({
            id: purchase.id || "",
            user_id: purchase.user_id || "",
            document_date: purchase.document_date || "",
            total: purchase.total || "",
            order_status: purchase.order_status || 0,
            payment_status: purchase.payment_status || 0,
        });
        setVisibleEditModal(true);
    };

    const confirmDeletePurchase = (purchase) => {
        setSelectedPurchase(purchase);
        setVisibleDeleteModal(true);
    };

    const viewPurchase = (purchase) => {
        setSelectedPurchase(purchase);
        setVisibleViewModal(true);
    };

    // Filtrar compras por términos de búsqueda
    const filteredPurchases = purchases.filter(
        (purchase) =>
            (purchase.id && purchase.id.toString().includes(searchTerm)) ||
            (purchase.user_id &&
                purchase.user_id.toString().includes(searchTerm))
    );

    // Formatear fecha a DD/MM/AAAA
    const formatDate = (date) => {
        if (!date) return "";
        const options = { day: "2-digit", month: "2-digit", year: "numeric" };
        return new Date(date).toLocaleDateString("es-ES", options);
    };

    // Mapear estados de orden
    const mapOrderStatus = (status) => {
        switch (status) {
            case 0:
                return "Por recibir";
            case 1:
                return "Recibido";
            case 2:
                return "Cancelado";
            default:
                return "Desconocido";
        }
    };

    const mapPaymentStatus = (status) => {
        switch (status) {
            case 0:
                return "Por pagar";
            case 1:
                return "Crédito";
            case 2:
                return "Pagado";
            default:
                return "Desconocido";
        }
    };

    const actionBodyTemplate = (rowData) => (
        <div className="flex justify-center space-x-2">
            <Button
                icon={<FaEye />}
                className="p-button-rounded p-button-secondary text-xl text-green-500"
                onClick={() => viewPurchase(rowData)}
                tooltip="View"
            />
            <Button
                icon={<FaEdit />}
                className="p-button-rounded p-button-info text-xl text-blue-500"
                onClick={() => editPurchase(rowData)}
                tooltip="Edit"
            />
            <Button
                icon={<FaTrash />}
                className="p-button-rounded p-button-danger text-xl text-red-500"
                onClick={() => confirmDeletePurchase(rowData)}
                tooltip="Delete"
            />
        </div>
    );

    return (
        <AuthenticatedLayout>
            <Head title="Purchases" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <InputText
                        placeholder="Search by Purchase ID or User ID"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="p-inputtext w-[25%] rounded-md"
                    />
                    <Button
                        label="Nueva Compra"
                        className="p-button-primary bg-[#4169E1] text-white p-2 rounded-md"
                        onClick={() => setVisibleCreateModal(true)}
                    />
                </div>
                <DataTable
                    value={filteredPurchases}
                    responsiveLayout="scroll"
                    paginator
                    rows={5}
                    header="Listado de Compras"
                >
                    <Column field="id" header="ID" sortable />
                    <Column field="user.name" header="Usuario"
                        body={(rowData) =>
                            rowData.user?.name || "Usuario no disponible"
                        } sortable
                    />
                    <Column field="document_date" header="Fecha"
                        body={(rowData) => formatDate(rowData.document_date)} sortable
                    />
                    <Column field="total" header="Total"
                        body={(rowData) =>
                            `$${parseFloat(rowData.total).toFixed(2)}`
                        } sortable
                    />
                    <Column field="order_status" header="Estado de la Compra"
                        body={(rowData) => mapOrderStatus(rowData.order_status)} sortable
                    />
                    <Column field="payment_status" header="Estado del Pago"
                        body={(rowData) =>
                            mapPaymentStatus(rowData.payment_status)
                        } sortable
                    />
                    <Column body={actionBodyTemplate} header="Actions" />
                </DataTable>

                {/* Modals */}
                <Dialog
                    visible={visibleCreateModal}
                    onHide={() => setVisibleCreateModal(false)}
                >
                    <p>Formulario para crear nueva compra</p>
                </Dialog>
                <Dialog
                    visible={visibleEditModal}
                    onHide={() => setVisibleEditModal(false)}
                >
                    <p>Formulario para editar compra</p>
                </Dialog>
                <Dialog
                    visible={visibleViewModal}
                    onHide={() => setVisibleViewModal(false)}
                >
                    <p>Detalle de la compra seleccionada</p>
                </Dialog>
                <Dialog
                    visible={visibleDeleteModal}
                    onHide={() => setVisibleDeleteModal(false)}
                >
                    <p>¿Estás seguro de que quieres eliminar esta compra?</p>
                    <Button
                        label="Sí"
                        onClick={handleDeletePurchase}
                        className="p-button-danger"
                    />
                    <Button
                        label="No"
                        onClick={() => setVisibleDeleteModal(false)}
                        className="p-button-secondary"
                    />
                </Dialog>
            </div>
        </AuthenticatedLayout>
    );
}
