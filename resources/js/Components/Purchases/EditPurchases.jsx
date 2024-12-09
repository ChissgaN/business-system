import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import EditPurchasesProduct from "./EditPurchasesProducts";
const EditPurchases = ({ visible, onHide, purchase, users }) => {
    const [editedPurchase, setEditedPurchase] = useState({ ...purchase });
    const [purchaseTotal, setPurchaseTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (purchase?.document_date) {
            const formattedDate = purchase.document_date.split(" ")[0];
            setEditedPurchase({
                ...purchase,
                document_date: formattedDate,
            });
        }
        // Inicializa el total desde el backend
        setPurchaseTotal(parseFloat(purchase.total || 0).toFixed(2));
    }, [purchase]);

    const updateTotal = (newTotal) => {
        setPurchaseTotal(newTotal.toFixed(2));
    };

    const handleSavePurchase = () => {
        const backendDate = `${editedPurchase.document_date} 00:00:00`;
        const purchasePayload = {
            user_id: editedPurchase.user_id,
            document_date: backendDate,
            order_status: editedPurchase.order_status,
            payment_status: editedPurchase.payment_status,
            total: parseFloat(purchaseTotal).toFixed(2), // Usa el total actualizado
        };

        Inertia.put(route("purchases.update", { purchase: purchase.id }), purchasePayload, {
            onSuccess: () => {
                alert("Compra actualizada exitosamente.");
                onHide();
            },
            onError: (errors) => {
                console.error("Errores al actualizar la compra:", errors);
            },
        });
    };

    return (
        <Dialog visible={visible} header="Editar Compra" onHide={onHide} className="w-3/4">
            {/* Información de la Compra */}
            <section className="mb-4 p-fluid">
                <div className="flex justify-around mb-4 text-center items-center">
                    <div>
                        <label className="block font-bold mt-4 mb-2 text-[#191970]">
                            ID de la Compra
                        </label>
                        <InputText
                            type="text"
                            value={editedPurchase.id}
                            disabled
                            className="w-3/4 border-2 border-gray-400 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block font-bold mt-4 mb-2 text-[#191970]">
                            Usuario
                        </label>
                        <Dropdown
                            value={editedPurchase.user_id}
                            options={users.map((user) => ({
                                label: user.name,
                                value: user.id,
                            }))}
                            onChange={(e) =>
                                setEditedPurchase({ ...editedPurchase, user_id: e.value })
                            }
                            className="w-full border-2 border-gray-400 rounded-md"
                        />
                    </div>
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
                                setEditedPurchase({ ...editedPurchase, order_status: e.value })
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
                </div>
            </section>

            {/* Componente de Productos */}
            <EditPurchasesProduct
                purchaseId={purchase.id}
                onTotalChange={updateTotal} // Prop para manejar el total
            />

            {/* Mostrar Total Actualizado */}
            <section className="flex justify-center mt-4">
                <h3 className="font-bold text-xl text-gray-700">Total: ${purchaseTotal}</h3>
            </section>

            {/* Botón Guardar Compra */}
            <section className="flex justify-center mt-4">
                <Button
                    label="Guardar Compra"
                    icon="pi pi-save"
                    onClick={handleSavePurchase}
                    disabled={loading}
                    className="bg-blue-500 text-white p-2 rounded-md"
                />
            </section>
        </Dialog>
    );
};
export default EditPurchases;