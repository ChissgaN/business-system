import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Balance({
    sales = [],
    purchases = [],
    expenses = [],
    totals = { sales: 0, purchases: 0, expenses: 0 },
    users = [],
}) {
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({
        sales: sales || [],
        purchases: purchases || [],
        expenses: expenses || [],
        totals: totals || { sales: 0, purchases: 0, expenses: 0 },
    });

    const fetchData = async () => {
        window.location.reload(); // Actualizar la página para mostrar los nuevos datos
        setIsLoading(true);
        try {
            const response = await axios.get(`/balance`, {
                params: { month, year },
            });
            const responseData = response.data || {};
            setData((prevData) => ({
                ...prevData,
                sales: responseData.sales || prevData.sales,
                purchases: responseData.purchases || prevData.purchases,
                expenses: responseData.expenses || prevData.expenses,
                totals: responseData.totals || prevData.totals,
            }));
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleUpdateClick = () => {
        fetchData(); // Llama a la función fetchData cuando el usuario hace clic en "Actualizar"
    };
    

    const calculateBalance = () => {
        const { sales = 0, purchases = 0, expenses = 0 } = data.totals || {};
        return (sales - (purchases + expenses)).toFixed(2);
    };

    const getUserName = (user_id) => {
        const user = users.find((user) => user.id === user_id);
        return user ? user.name : "Usuario no encontrado";
    };

    const formatDate = (date) => {
        if (!date) return "";
        const options = { day: "numeric", month: "long", year: "numeric" };
        return new Date(date).toLocaleDateString("es-ES", options);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Balance" />

            <Card className="m-2">
                <div className="flex justify-between items-center">
                    <p className="text-lg text-[#0d47a1]">
                        Seleccionar Mes y Año:
                    </p>
                    <div className="flex gap-4">
                        <input
                            type="number"
                            value={month}
                            onChange={(e) => setMonth(Number(e.target.value))}
                            min="1"
                            max="12"
                            placeholder="Mes"
                            className="rounded-md"
                        />

                        <input
                            type="number"
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
                            min="2020"
                            max={new Date().getFullYear()}
                            placeholder="Año"
                            className="rounded-md"
                        />

                        <button
                            onClick={handleUpdateClick}
                            className="bg-blue-500 text-white rounded-md px-4 py-2"
                        >
                            Actualizar
                        </button>
                    </div>
                </div>
            </Card>

            {isLoading ? (
                <p>Cargando datos...</p>
            ) : (
                <div className="m-2">
                    <DataTable value={data.sales} header="Listado de Ventas">
                        <Column field="id" header="ID" />
                        <Column
                            header="Usuario"
                            body={(rowData) => getUserName(rowData.user_id)}
                        />
                        <Column
                            field="document_date"
                            header="Fecha"
                            body={(rowData) =>
                                formatDate(rowData.document_date)
                            }
                        />
                        <Column field="total" header="Total Venta" />
                    </DataTable>

                    <DataTable
                        value={data.purchases}
                        header="Listado de Compras"
                        className="mt-4"
                    >
                        <Column field="id" header="ID" />
                        <Column
                            header="Usuario"
                            body={(rowData) => getUserName(rowData.user_id)}
                        />
                        <Column
                            field="document_date"
                            header="Fecha"
                            body={(rowData) =>
                                formatDate(rowData.document_date)
                            }
                        />
                        <Column field="total" header="Total Compra" />
                    </DataTable>

                    <DataTable
                        value={data.expenses}
                        header="Listado de Gastos"
                        className="mt-4"
                    >
                        <Column field="id" header="ID" />
                        <Column
                            header="Usuario"
                            body={(rowData) => getUserName(rowData.user_id)}
                        />
                        <Column field="name" header="Nombre" />
                        <Column
                            field="date"
                            header="Fecha"
                            body={(rowData) => formatDate(rowData.date)}
                        />
                        <Column field="amount" header="Monto" />
                    </DataTable>

                    <Card title="Balance" className="mt-4">
                        <p>
                            Total Ventas: ${data.totals?.sales || 0} <br />
                            Total Compras: ${data.totals?.purchases || 0} <br />
                            Total Gastos: ${data.totals?.expenses || 0} <br />
                            <strong>Balance: ${calculateBalance()}</strong>
                        </p>
                    </Card>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
