<?php

namespace App\Http\Controllers;

use App\Models\Products;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class ProductsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $products = Products::all();
            return Inertia::render('Auth/Products', [
                'products' => $products,
            ]);
        } catch (\Exception $e) {
            return Redirect::route('products')->with('error', 'Error al cargar los productos: ' . $e->getMessage());
        }
    }

    public function getStockProducts()
    {
        $products = Products::orderBy('qty', 'asc')->get();
        return response()->json($products);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Auth/CreateProduct');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:145',
            'description' => 'required|string|max:255',
            'cost' => 'required|numeric',
            'price' => 'required|numeric',
            'qty' => 'required|integer|min:0',
        ]);

        try {
            Products::create($request->all());
            return Redirect::route('products.index')->with('success', 'Producto creado exitosamente.');
        } catch (\Exception $e) {
            return Redirect::back()->with('error', 'Error al crear el producto: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Products $product) {}

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Products $product)
    {
        $request->validate([
            'name' => 'required|string|max:145',
            'description' => 'required|string|max:255',
            'cost' => 'required|numeric',
            'price' => 'required|numeric',
            'qty' => 'required|integer|min:0',
        ]);

        try {
            $product->update($request->all());
            return Redirect::route('products.index')->with('success', 'Producto actualizado exitosamente.');
        } catch (\Exception $e) {
            return Redirect::back()->with('error', 'Error al actualizar el producto: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Products $product)
    {
        try {
            $product->delete();
            return Redirect::route('products.index')->with('success', 'Producto eliminado exitosamente.');
        } catch (\Exception $e) {
            return Redirect::back()->with('error', 'Error al eliminar el producto: ' . $e->getMessage());
        }
    }
}