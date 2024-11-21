import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";

export default function StorePurchases({ 
    users = [], 
    products = [], 
    onSave 
}) {
    // Estados locales
    const [newPurchase, setNewPurchase] = useState({
        user_id: "",
        document_date: null,
        order_status: "",
        payment_status: "",
        total: 0,
    });
    const [purchaseProducts, setPurchaseProducts] = useState([]);

    // Opciones para dropdowns
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

    // Función para calcular el total
    const calculateTotal = () => {
        return purchaseProducts.reduce((total, item) => {
            const product = products.find((p) => p.id === item.product_id);
            return total + (product?.price || 0) * item.qty;
        }, 0);
    };

    // Función para guardar la compra
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
    };

    return (
        <div>
            <Dialog visible={true} header="Crear Nueva Compra" className="w-3/4">
                <div className="p-fluid">
                    {/* Datos de la compra */}
                    <div className="mb-4">
                        <label className="block mb-2">Usuario</label>
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
                        <label className="block mb-2">Fecha</label>
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
                        <label className="block mb-2">Estado de la Orden</label>
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
                        <label className="block mb-2">Estado del Pago</label>
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
                {/* Productos de la compra */}
                
                <div className="flex justify-end mt-4">
                    <Button label="Guardar Compra" onClick={handleSavePurchase} />
                </div>
            </Dialog>
        </div>
    );
}
