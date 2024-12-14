import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

export default function Expenses({ expenses, users }) {
    const [visibleCreateModal, setVisibleCreateModal] = useState(false);
    const [visibleEditModal, setVisibleEditModal] = useState(false);
    const [visibleDeleteModal, setVisibleDeleteModal] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [newExpense, setNewExpense] = useState({user_id: '', name: '', description: '', date: '', amount: ''});
    const [searchTerm, setSearchTerm] = useState('');

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex justify-center">
                <Button
                    icon={<FaEdit />}
                    className="p-button-rounded p-button-info mr-2 text-indigo-600 text-xl"
                    onClick={() => editProduct(rowData)}
                    tooltip="Edit"
                />
                <Button
                    icon={<FaTrash />}
                    className="p-button-rounded p-button-danger text-red-600 text-xl"
                    onClick={() => confirmDeleteProduct(rowData)}
                    tooltip="Delete"
                />
            </div>
        );
    };

    const costBodyTemplate = (rowData) => {
        return `$${rowData.amount}`;
    };

    const editProduct = (expense) => {
        setSelectedExpense(expense);
        setNewExpense({
            user_id: expense.user_id,
            name: expense.name,
            description: expense.description,
            amount: parseFloat(expense.amount).toFixed(2),
            date: new Date(expense.date) ,
        });
        setVisibleEditModal(true);
    };

    const confirmDeleteProduct = (product) => {
        setSelectedExpense(product);
        setVisibleDeleteModal(true);
    };

    const handleCreateExpense = () => {
        Inertia.post(route('expenses.store'), newExpense, {
            onSuccess: () => {
                setVisibleCreateModal(false);
                setNewExpense({user_id: '', name: '', description: '', date: '', amount: ''}); 
            },
            onError: (errors) => {
                console.error('Error al crear el gasto:', errors);
            },
        });
    };

    const handleEditExpense = () => {
        console.log(selectedExpense)
        Inertia.put(`/expenses/${selectedExpense.id}`, newExpense, {
            onSuccess: () => {
                console.log('Gasto editado exitosamente');
                setVisibleEditModal(false);
            },
            onError: (errors) => {
                console.error('Error al editar el gasto:', errors);
            },
        });
    };
    
    const handleDeleteProduct = () => {
        Inertia.delete(`/expenses/${selectedExpense.id}`, {
            onSuccess: () => {
                console.log('Producto eliminado exitosamente');
                setVisibleDeleteModal(false);
            },
            onError: (errors) => {
                console.error('Error al eliminar el producto:', errors);
            },
        });
    };
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };
    const filteredExpenses = expenses.filter(expenses =>
        expenses.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AuthenticatedLayout>
            <Head title="Gastos" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className=" flex justify-between mb-4">
                            <div className="w-full flex justify-between space-x-4">
                                <InputText
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    placeholder="Buscar Gastos"
                                    className="p-inputtext-sm rounded-md border-color-[#4169E1] p-2"
                                />
                                <Button
                                    label="Nuevo Gasto"
                                    icon="pi pi-plus"
                                    onClick={() => setVisibleCreateModal(true)}
                                    className="p-button-success bg-[#4169E1] text-white p-2 rounded-md"
                                />
                            </div>
                        </div>
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">

                        <DataTable
                            value={filteredExpenses}
                            paginator
                            rows={10}
                            responsiveLayout="scroll"
                        >
                            <Column field="id" header="ID" sortable />
                            <Column field="user_id" header="Usuario" sortable body={(rowData) => users.find(user => user.id === rowData.user_id)?.name} />
                            <Column field="name" header="Nombre" sortable filter />
                            <Column field="description" header="Descripción" />
                            <Column field="amount" header="Gasto" body={costBodyTemplate} sortable />
                            <Column field="date" header="Fecha" sortable body={(rowData) => new Date(rowData.date).toLocaleDateString("es-ES")} />
                            <Column body={actionBodyTemplate} header="Acciones" />
                        </DataTable>
                    </div>
                </div>
            </div>
            {/* Create Expense Modal */}
            <Dialog
                visible={visibleCreateModal}
                onHide={() => setVisibleCreateModal(false)}
                header="Crear Gasto"
                footer={
                    <div className="flex justify-center space-x-2">
                        <Button label="Cancelar" icon="pi pi-times" className="p-button-danger bg-red-500 text-white p-2 rounded-md" onClick={() => setVisibleCreateModal(false)} />
                        <Button label="Crear" icon="pi pi-check" className="p-button-primary bg-[#4169E1] text-white p-2 rounded-md" onClick={handleCreateExpense} />
                    </div>
                }
            >
                <div className="mb-2">
                    <label className="block mb-2 font-semibold text-[#191970]">Usuario</label>
                        <Dropdown
                            value={newExpense.user_id}
                            options={users.map((user) => ({
                                label: user.name,
                                value: user.id,
                        }))}
                        onChange={(e) =>
                            setNewExpense({
                                ...newExpense,
                                user_id: e.value,
                            })
                        }
                        placeholder="Seleccione un Usuario" className="border border-gray-500 rounded-md p-2 w-full"
                    />
                </div>
                <div className="field">
                    <label className='text-[#191970]' htmlFor="name">Nombre</label>
                    <InputText className='w-full px-2 rounded-md mb-2' id="name" value={newExpense.name} onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })} />
                </div>
                <div className="field">
                    <label className='text-[#191970]' htmlFor="description">Descripción</label>
                    <InputText className='w-full px-2 rounded-md mb-2' id="description" value={newExpense.description} onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })} />
                </div>
                <div className="field">
                    <label className='text-[#191970]' htmlFor="cost">Gasto</label>
                    <InputText className='w-full px-2 rounded-md mb-2' id="cost" value={newExpense.cost} onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })} />
                </div>
                <div className="mb-2">
                    <label className="block mb-2 font-semibold text-[#191970]">Fecha</label>
                    <Calendar showTime
                        value={newExpense.date} onChange={(e) => setNewExpense({...newExpense, date: e.value,})}
                        showIcon className="border border-gray-500 rounded-md p-2 w-full"/>
                </div>
            </Dialog>
            {/* Edit Expense Modal */}
            <Dialog
                visible={visibleEditModal}
                onHide={() => setVisibleEditModal(false)}
                header="Editar Gasto"
                footer={
                    <div className="flex justify-center space-x-2">
                        <Button label="Cancelar" icon="pi pi-times" className="p-button-danger bg-red-500 text-white p-2 rounded-md" onClick={() => setVisibleEditModal(false)} />
                        <Button label="Editar" icon="pi pi-check" className="p-button-primary bg-[#4169E1] text-white p-2 rounded-md" onClick={handleEditExpense} />
                    </div>}>
                    <div className="mb-2">
                    <label className="block mb-2 font-semibold text-[#191970]">Usuario</label>
                        <Dropdown
                            value={newExpense.user_id}
                            options={users.map((user) => ({
                                label: user.name,
                                value: user.id,
                        }))}
                        onChange={(e) =>
                            setNewExpense({
                                ...newExpense,
                                user_id: e.value,
                            })
                        }
                        placeholder="Seleccione un Usuario" className="border border-gray-500 rounded-md p-2 w-full"
                    />
                </div>
                <div className="field">
                    <label htmlFor="editName">Nombre</label>
                    <InputText className='w-full px-2 rounded-md mb-2' id="editName" value={newExpense.name} onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })} />
                </div>
                <div className="field">
                    <label htmlFor="editDescription">Descripción</label>
                    <InputText className='w-full px-2 rounded-md mb-2' id="editDescription" value={newExpense.description} onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })} />
                </div>
                <div className="field">
                    <label htmlFor="editAmount">Gasto</label>
                    <InputText className='w-full px-2 rounded-md mb-2' id="editCost" value={newExpense.amount} onChange={(e) => setNewExpense  ({ ...newExpense, amount: e.target.value })} />
                </div>
                <div className="mb-2">
                        <label className="block mb-2 font-semibold text-[#191970]">Fecha</label>
                        <Calendar
                            value={newExpense.date}
                            onChange={(e) =>
                                setNewExpense({
                                    ...newExpense,
                                    date: e.value,
                                })
                            }
                            showIcon className="border border-gray-500 rounded-md p-2 w-full"/>
                </div>
            </Dialog>
            {/* Delete Expense Modal */}
            <Dialog
                visible={visibleDeleteModal}
                onHide={() => setVisibleDeleteModal(false)}
                header="Confirmar Eliminación"
                footer={
                    <div className="flex justify-end space-x-2">
                        <Button label="Cancelar" icon="pi pi-times" className="p-button-danger bg-red-500 text-white p-2 rounded-md" onClick={() => setVisibleDeleteModal(false)} />
                        <Button label="Borrar" icon="pi pi-check" className="p-button-danger bg-[#4169E1] text-white p-2 rounded-md" onClick={handleDeleteProduct} />
                    </div>
                }
            >
                <p>¿Esta seguro de que desea eliminar este gasto?</p>
            </Dialog>
        </AuthenticatedLayout>
    );
}
