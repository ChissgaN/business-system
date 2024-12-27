import React, { useState } from "react";
import { router } from "@inertiajs/react";
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
        if (
            month >= 1 &&
            month <= 12 &&
            year >= 2000 &&
            year <= new Date().getFullYear()
        ) {
            router.get(`/balance`, { month, year });
        } else {
            alert("Por favor, introduce un mes y un año válidos.");
        }
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

    // Función para formatear números a dos decimales
    const formatCurrency = (value) => {
        const number = parseFloat(value || 0);
        return number.toFixed(2);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Balance" />

            <Card className="m-4 shadow-lg rounded-lg bg-white p-4">
                <div className="flex justify-between items-center">
                    <p className="text-xl font-semibold text-[#0d47a1]">
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
                            className="rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
                        />

                        <input
                            type="number"
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
                            min="2020"
                            max={new Date().getFullYear()}
                            placeholder="Año"
                            className="rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500"
                        />

                        <button
                            onClick={handleUpdateClick}
                            className="bg-blue-600 text-white rounded-md px-6 py-2 hover:bg-blue-700 transition-colors"
                        >
                            Actualizar
                        </button>
                    </div>
                </div>
            </Card>

            {isLoading ? (
                <div className="m-4 text-center">
                    <p className="text-xl text-gray-600">Cargando datos...</p>
                    <div className="spinner-border animate-spin border-4 border-t-4 border-blue-500 rounded-full w-16 h-16 mx-auto mt-4"></div>
                </div>
            ) : (
                <div className="m-4 space-y-6">
                    {/* Tabla de Ventas */}
                    <DataTable
                        value={data.sales}
                        header={
                            <div className="bg-green-600 text-white text-lg font-bold p-3 rounded-t-lg">
                                Listado de Ventas
                            </div>
                        }
                        className="shadow-md rounded-lg"
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
                        <Column field="total" header="Total Venta" />
                    </DataTable>

                    {/* Tabla de Compras */}
                    <DataTable
                        value={data.purchases}
                        header={
                            <div className="bg-orange-600 text-white text-lg font-bold p-3 rounded-t-lg">
                                Listado de Compras
                            </div>
                        }
                        className="shadow-md rounded-lg"
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

                    {/* Tabla de Gastos */}
                    <DataTable
                        value={data.expenses}
                        header={
                            <div className="bg-red-600 text-white text-lg font-bold p-3 rounded-t-lg">
                                Listado de Gastos
                            </div>
                        }
                        className="shadow-md rounded-lg"
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

                    <Card
                        title="Balance"
                        className="mt-6 p-4 shadow-lg bg-gradient-to-r from-blue-100 to-blue-50"
                    >
                        <div className="flex w-full">
                            <p className="text-xl font-semibold">
                                Total Ventas:
                            </p>
                            <p className="text-green-600 text-xl text-center font-semibold w-[90%]">
                                ${formatCurrency(data.totals?.sales)}
                            </p>
                        </div>
                        <div className="flex w-full justify-between">
                            <p className="text-xl font-semibold">
                                Total Compras:
                            </p>
                            <p className="text-orange-600 text-xl text-end font-semibold">
                                ${formatCurrency(data.totals?.purchases)}
                            </p>
                        </div>
                        <div className="flex w-full justify-between">
                            <p className="text-xl font-semibold">
                                Total Gastos:
                            </p>
                            <p className="text-red-600 text-xl text-end font-semibold">
                                ${formatCurrency(data.totals?.expenses)}
                            </p>
                        </div>
                        <p className="text-xl font-bold text-[#0d47a1] text-center">
                            <strong>Balance: ${calculateBalance()}</strong>
                        </p>
                    </Card>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
