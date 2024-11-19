<?php

namespace App\Http\Controllers;

use App\Models\Products;
use App\Models\PurchaseProducts;
use App\Models\Purchases;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class PurchaseProductsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $purchases = PurchaseProducts::all();
            return Inertia::render('Auth/Purchases', [
                'purchases' => $purchases,
            ]);
        } catch (\Exception $e) {
            return Redirect::route('purchases')->with('error', 'Error al cargar las compras: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        try {
            // Obtener todas las compras y productos
            $purchases = Purchases::all();
            $products = Products::all();
    
            // Retornar ambas variables a la vista
            return Inertia::render('Auth/purchases', [
                'purchases' => $purchases,
                'products' => $products,
            ]);
        } catch (\Exception $e) {
            return Redirect::back()->with('error', 'Error al cargar datos: ' . $e->getMessage());
        }
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'purchase_id' => 'required|exists:purchases,id',
            'product_id' => 'required|exists:products,id',
            'qty' => 'required|number,default:1',
            'cost' => 'required|number,default:0.0',
            'received' => 'required|integer,default:0', 
        ]);

        try {
            PurchaseProducts::create($request->all());
            return Redirect::route('purchases.index')->with('success', 'compra creado exitosamente.');
        } catch (\Exception $e) {
            return Redirect::back()->with('error', 'Error al crear la compra: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(PurchaseProducts $purchaseProducts)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PurchaseProducts $purchaseProducts)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PurchaseProducts $purchaseProducts)
    {
        $request->validate([
            'purchase_id' => 'required|exists:purchases,id',
            'product_id' => 'required|exists:products,id',
            'qty' => 'required|number,default:1',
            'cost' => 'required|number,default:0.0',
            'received' => 'required|integer,default:0', 
        ]);
        try {
            $purchaseProducts->update($request->all());
            return Redirect::route('purchases.index')->with('success', 'Compra actualizado exitosamente.');
            } catch (\Exception $e) {
                return Redirect::back()->with('error', 'Error al actualizar la compra: ' . $e->getMessage());
            }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PurchaseProducts $purchaseProducts)
    {
        try {
            $purchaseProducts->delete();
            return Redirect::route('purchases.index')->with('success', 'Compra eliminado exitosamente.');
        } catch (\Exception $e) {
            return Redirect::back()->with('error', 'Error al eliminar la compra: ' . $e->getMessage());
        }
    }
}
