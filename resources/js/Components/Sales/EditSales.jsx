import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import EditProductsSale from "./EditProductsSale";
const EditSales = ({ visible, onHide, sale, users }) => {
    const [editedSale, setEditedSale] = useState({ ...sale });
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0); 
    useEffect(() => {
        if (sale?.document_date) {
            const formattedDate = sale.document_date.split(" ")[0];
            setEditedSale({
                ...sale,
                document_date: formattedDate,
            });
        }
    }, [sale]);
    const handleEditSale = () => {
        const backendDate = `${editedSale.document_date} 00:00:00`;
        const salePayload = {
            user_id: editedSale.user_id,
            document_date: backendDate,
            payment_status: editedSale.payment_status,
            total: parseFloat(total || 0).toFixed(2), // Usa el total calculado
        };
        Inertia.put(route("sales.update", { sale: sale.id }), salePayload, {
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
        <Dialog
            visible={visible}
            header="Editar Venta"
            onHide={onHide}
            className="w-3/4"
        >
            {/* Información de la Venta */}
            <section className="mb-4 p-fluid">
                <div className="flex justify-around mb-4 text-center items-center">
                    <div>
                        <label className="block font-bold mt-4 mb-2 text-[#191970]">
                            ID de la Venta
                        </label>
                        <InputText
                            type="text"
                            value={editedSale.id}
                            disabled
                            className="w-3/4 border-2 border-gray-400 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block font-bold mt-4 mb-2 text-[#191970]">
                            Usuario
                        </label>
                        <Dropdown
                            value={editedSale.user_id}
                            options={users.map((user) => ({
                                label: user.name,
                                value: user.id,
                            }))}
                            onChange={(e) =>
                                setEditedSale({ ...editedSale, user_id: e.value })
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
                            value={editedSale.document_date}
                            onChange={(e) =>
                                setEditedSale({
                                    ...editedSale,
                                    document_date: e.target.value,
                                })
                            }
                            className="w-full border-2 border-gray-400 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block font-bold mt-4 mb-2 text-[#191970]">
                            Estado del Pago
                        </label>
                        <Dropdown
                            value={editedSale.payment_status}
                            options={[
                                { label: "Pagado", value: 0 },
                                { label: "Por pagar", value: 1 },
                                { label: "Crédito", value: 2 },
                            ]}
                            onChange={(e) =>
                                setEditedSale({
                                    ...editedSale,
                                    payment_status: e.value,
                                })
                            }
                            className="w-full border-2 border-gray-400 rounded-md"
                        />
                    </div>
                </div>
            </section>
            {/* Componente de Productos */}
            <EditProductsSale
                saleId={sale.id}
                onTotalChange={(calculatedTotal) => setTotal(calculatedTotal)}
            />
            {/* Botón Guardar Venta y Total */}
            <section className="flex justify-around mt-4 items-center">
                <h4 className="text-xl font-bold text-[#191970]">
                    Total: ${total}
                </h4>
                <Button
                    label="Guardar Venta"
                    icon="pi pi-save"
                    onClick={handleEditSale}
                    disabled={loading}
                    className="bg-blue-500 text-white p-2 rounded-md"
                />
            </section>
        </Dialog>
    );
};


export default EditSales;
