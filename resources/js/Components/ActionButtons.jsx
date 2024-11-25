import React from "react";
import { Button } from "primereact/button";
import { FaEdit, FaTrash, FaEye, FaBoxOpen } from "react-icons/fa";

export default function FourActionButtons({ rowData, onView, onProducts, onEdit, onDelete }) {
    const handleView = () => onView(rowData);
    const handleProducts = () => onProducts(rowData);
    const handleEdit = () => onEdit(rowData);
    const handleDelete = () => onDelete(rowData);

    return (
        <div className="flex space-x-2">
            <Button
                icon={<FaEye />}
                className="p-button-rounded p-button-info text-green-700"
                onClick={handleView}
            />
            <Button
                icon={<FaBoxOpen />}
                className="p-button-rounded p-button-info text-yellow-300"
                onClick={handleProducts}
            />
            <Button
                icon={<FaEdit />}
                className="p-button-rounded p-button-warning text-blue-500"
                onClick={handleEdit}
            />
            <Button
                icon={<FaTrash />}
                className="p-button-rounded p-button-danger text-red-500"
                onClick={handleDelete}
            />
        </div>
    );
}
