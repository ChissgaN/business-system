import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";

export default function StorePurchases({ 
    users = [], 
    products = [], 
    onSave,
    onClose
}) {
    const [newPurchase, setNewPurchase] = useState({
        user_id: "",
        document_date: null,
        order_status: "",
        payment_status: "",
        total: 0,
    });
    const [purchaseProducts, setPurchaseProducts] = useState([]);
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
    // Función para calcular el total
    const calculateTotal = () => {
        return purchaseProducts.reduce((total, item) => {
            const product = products.find((p) => p.id === item.product_id);
            return total + (product?.price || 0) * item.qty;
        }, 0);
    };
    const handleSavePurchase = () => {
        const purchaseData = {
            ...newPurchase,
            total: calculateTotal(),
            products: purchaseProducts,
        };
        onSave(purchaseData);
        setNewPurchase({
            user_id: "",
            document_date: null,
            order_status: "",
            payment_status: "",
            total: 0,
        });
        setPurchaseProducts([]);
        onClose();
    };

    return (
        <div>
            <Dialog visible={true} header="Crear Nueva Compra" className="w-2/4" onHide={onClose}>
                <div className="p-fluid">
                    {/* Datos de la compra */}
                    <div className="mb-4">
                        <label className="block mb-2 font-semibold text-[#191970]">Usuario</label>
                        <Dropdown
                            value={newPurchase.user_id}
                            options={users.map((user) => ({
                                label: user.name,
                                value: user.id,
                            }))}
                            onChange={(e) =>
                                setNewPurchase({
                                    ...newPurchase,
                                    user_id: e.value,
                                })
                            }
                            placeholder="Seleccione un Usuario"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-semibold text-[#191970]">Fecha</label>
                        <Calendar
                            value={newPurchase.document_date}
                            onChange={(e) =>
                                setNewPurchase({
                                    ...newPurchase,
                                    document_date: e.value,
                                })
                            }
                            showIcon
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-semibold text-[#191970]">Estado de la Orden</label>
                        <Dropdown
                            value={newPurchase.order_status}
                            options={orderStatusOptions}
                            onChange={(e) =>
                                setNewPurchase({
                                    ...newPurchase,
                                    order_status: e.value,
                                })
                            }
                            placeholder="Seleccione un Estado"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-semibold text-[#191970]">Estado del Pago</label>
                        <Dropdown
                            value={newPurchase.payment_status}
                            options={paymentStatusOptions}
                            onChange={(e) =>
                                setNewPurchase({
                                    ...newPurchase,
                                    payment_status: e.value,
                                })
                            }
                            placeholder="Seleccione un Estado"
                        />
                    </div>
                </div>
                <div className="flex justify-center mt-4 "> 
                    <Button label="Guardar Compra" onClick={handleSavePurchase} className="bg-[#007bff] p-2 rounded-md text-white w-1/4"/>
                </div>
            </Dialog>
        </div>
    );
}
