import { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import axios from "axios";

export default function Dashboard() {
    const [products, setProducts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        axios
            .get("/products/getStockProducts")
            .then((response) => {
                setProducts(response.data);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            });
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === products.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? products.length - 1 : prevIndex - 1
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Bienvenido a tu sistema de gestión, selecciona una opción en
                    el menú superior!
                </h2>
            }
        >
            <Head title="Dashboard" />
            <div className="py-12 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4">
                    <h1 className="text-center text-3xl font-bold text-indigo-600 mb-8">
                        Productos con menos stock
                    </h1>
                    <div className="relative overflow-hidden">
                        {/* Contenedor del carrusel */}
                        <div
                            className="flex transition-transform duration-500"
                            style={{
                                transform: `translateX(-${currentIndex * 100}%)`,
                            }}
                        >
                            {products.map((product, index) => (
                                <div
                                    key={product.id}
                                    className="min-w-full px-4"
                                >
                                    <div className="bg-white shadow-lg rounded-xl p-6 my-4 text-center border border-gray-100 h-full">
                                        <div className="bg-indigo-50 rounded-lg p-4 mb-4">
                                            <h3 className="text-xl font-bold text-indigo-600 mb-2">
                                                {product.name}
                                            </h3>
                                            <div className="h-px w-16 bg-indigo-200 mx-auto"></div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4 text-gray-600">
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <p className="font-semibold text-gray-400 text-sm mb-1">
                                                        Costo
                                                    </p>
                                                    <p className="text-lg font-bold text-gray-700">
                                                        ${product.cost}
                                                    </p>
                                                </div>
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <p className="font-semibold text-gray-400 text-sm mb-1">
                                                        Precio
                                                    </p>
                                                    <p className="text-lg font-bold text-gray-700">
                                                        ${product.price}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <div className="bg-red-50 rounded-lg p-3">
                                                    <p className="font-semibold text-gray-400 text-sm mb-1">
                                                        Stock Disponible
                                                    </p>
                                                    <p className="text-2xl font-bold text-red-500">
                                                        {product.qty}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Botones de navegación */}
                        <button
                            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-indigo-600 text-white p-2 rounded-full"
                            onClick={prevSlide}
                        >
                            &#9664;
                        </button>
                        <button
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-indigo-600 text-white p-2 rounded-full"
                            onClick={nextSlide}
                        >
                            &#9654;
                        </button>
                        {/* Indicadores */}
                        <div className="flex justify-center mt-4 space-x-2">
                            {products.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`w-2 h-2 rounded-full ${
                                        currentIndex === index
                                            ? "bg-indigo-600"
                                            : "bg-gray-300"
                                    }`}
                                ></button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
