import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";

export default function StoreSales({ 
    users = [], 
    products = [], 
    onSave,
    onClose
}) {
    const [newSale, setNewSale] = useState({
        user_id: "",
        document_date: null,
        payment_status: "",
        total: 0,
    });
    const [productSale, setProductSale] = useState([]);
    const paymentStatusOptions = [
        { label: "Pagado", value: 0 },
        { label: "Por pagar", value: 1 },
        { label: "Crédito", value: 2 },
    ];
    // Función para calcular el total
    const calculateTotal = () => {
        return productSale.reduce((total, item) => {
            const product = products.find((p) => p.id === item.product_id);
            return total + (product?.price || 0) * item.qty;
        }, 0);
    };
    const handleSaveSale = () => {
        const saleData = {
            ...newSale,
            total: calculateTotal(),
            products: productSale,
        };
        onSave(saleData);
        setNewSale({
            user_id: "",
            document_date: null,
            payment_status: "",
            total: 0,
        });
        setProductSale([]);
        onClose();
    };

    return (
        <div>
            <Dialog visible={true} header="Crear Nueva Venta" className="w-2/4" onHide={onClose}>
                <div className="p-fluid">
                    <section className=" mb-4 items-center">
                    <div className="mb-4 text-center w-2/4 mx-auto">
                        <label className="block mb-2 font-semibold text-[#191970]">Usuario</label>
                        <Dropdown
                            value={newSale.user_id}
                            options={users.map((user) => ({
                                label: user.name,
                                value: user.id,
                            }))}
                            onChange={(e) =>
                                setNewSale({
                                    ...newSale,
                                    user_id: e.value,
                                })
                            }
                            placeholder="Seleccione un Usuario" className="border border-gray-500 rounded-md p-2 "
                        />
                    </div>
                    <div className="mb-4 text-center w-2/4 mx-auto">
                        <label className="block mb-2 font-semibold text-[#191970]">Fecha</label>
                        <Calendar
                            value={newSale.document_date}
                            onChange={(e) =>
                                setNewSale({
                                    ...newSale,
                                    document_date: e.value,
                                })
                            }
                            showIcon className="border border-gray-500 rounded-md p-2"
                        />
                    </div>
                    </section>
                    <section className="flex justify-around mb-4"> 
                    
                    <div className="mb-4 text-center w-2/4">
                        <label className="block mb-2 font-semibold text-[#191970]">Estado del Pago</label>
                        <Dropdown
                            value={newSale.payment_status}
                            options={paymentStatusOptions}
                            onChange={(e) =>
                                setNewSale({
                                    ...newSale,
                                    payment_status: e.value,
                                })
                            }
                            placeholder="Seleccione un Estado" className="border border-gray-500 rounded-md p-2  mx-auto"
                        />
                    </div>
                </section>
                </div>
                <div className="flex justify-center mt-4 "> 
                    <Button label="Guardar Venta" onClick={handleSaveSale} className="bg-[#007bff] p-2 rounded-md text-white w-1/4"/>
                </div>
            </Dialog>
        </div>
    );
}
