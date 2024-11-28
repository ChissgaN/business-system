<?php

namespace App\Http\Controllers;

use App\Models\Products;
use App\Models\PurchaseProducts;
use App\Models\Purchases;
use Dotenv\Exception\ValidationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;


class PurchaseProductsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $purchaseId = $request->get('purchase_id');
        if (!$purchaseId) {
            return response()->json(['error' => 'purchase_id is required'], 400);
        }
        $purchase = Purchases::with('user')->find($purchaseId);
        if (!$purchase) {
            return response()->json(['error' => 'Purchase not found'], 404);
        }
        $purchaseProducts = PurchaseProducts::where('purchase_id', $purchaseId)
            ->with('product') // Incluye los detalles del producto asociado
            ->get();
        return response()->json([
            'purchase' => $purchase,
            'purchaseProducts' => $purchaseProducts,
        ]);
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
            'products' => 'required|array',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.qty' => 'required|integer|min:1',
            'products.*.cost' => 'required|numeric|min:0',
            'products.*.received' => 'required|integer|min:0|max:2',
            'purchase_id' => 'required|exists:purchases,id',
        ]);

        DB::beginTransaction(); // Iniciar transacción para asegurar consistencia de datos

        try {
            $totalToAdd = 0; // Variable para acumular el total a sumar
            foreach ($request->products as $product) {
                // Crear el registro en PurchaseProducts
                PurchaseProducts::create([
                    'purchase_id' => $request->input('purchase_id'),
                    'product_id' => $product['product_id'],
                    'qty' => $product['qty'],
                    'cost' => $product['cost'],
                    'received' => $product['received'],
                ]);

                // Calcular el costo total del producto
                $totalToAdd += $product['qty'] * $product['cost'];
            }

            // Actualizar el total en la tabla Purchases
            $purchase = Purchases::find($request->input('purchase_id'));
            $purchase->total += $totalToAdd; // Sumar el nuevo total
            $purchase->save();
            DB::commit(); // Confirmar transacción
            return Redirect::route('purchases.index')->with('success', 'Productos añadidos y total actualizado exitosamente.');
        } catch (\Exception $e) {
            DB::rollBack(); // Revertir transacción en caso de error
            return Redirect::back()->with('error', 'Error al agregar productos: ' . $e->getMessage());
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
    public function update(Request $request)
{
    $request->validate([
        'purchase_id' => 'required|exists:purchases,id',
        'data.products' => 'required|array',
        'data.products.*.id' => 'required|exists:purchase_products,id',
        'data.products.*.qty' => 'required|numeric|min:0',
        'data.products.*.cost' => 'required|numeric|min:0',
        'data.products.*.received' => 'required|integer|min:0|max:2',
    ]);

    DB::beginTransaction();
    try {
        $totalToUpdate = 0;
        foreach ($request->input('data.products') as $productData) {
            $purchaseProduct = PurchaseProducts::findOrFail($productData['id']);
            
            // Calcular diferencia para ajustar total de la compra
            $oldSubtotal = $purchaseProduct->qty * $purchaseProduct->cost;
            $newSubtotal = $productData['qty'] * $productData['cost'];
            $totalToUpdate += $newSubtotal - $oldSubtotal;

            $purchaseProduct->update([
                'qty' => $productData['qty'],
                'cost' => $productData['cost'],
                'received' => $productData['received']
            ]);
        }

        // Actualizar total de la compra
        $purchase = Purchases::findOrFail($request->input('purchase_id'));
        $purchase->total += $totalToUpdate;
        $purchase->save();

        DB::commit();

        return response()->json([
            'message' => 'Productos actualizados exitosamente',
            'total' => $purchase->total
        ]);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json(['error' => $e->getMessage()], 500);
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
