<?php

namespace App\Http\Controllers;

use App\Models\Products;
use App\Models\ProductSale;
use App\Models\Sales;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class ProductSaleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $saleId = $request->get('purchase_id');
        if (!$saleId) {
            return response()->json(['error' => 'purchase_id is required'], 400);
        }
        $sale = Sales::with('user')->find($saleId);
        if (!$sale) {
            return response()->json(['error' => 'Sales not found'], 404);
        }
        $saleProducts = ProductSale::where('purchase_id', $saleId)
            ->with('product') // Incluye los detalles del producto asociado
            ->get();
        return response()->json([
            'sale' => $sale,
            'saleProducts' => $saleProducts,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        try {
            // Obtener todas las compras y productos
            $sales = Sales::all();
            $products = Products::all();
            // Retornar ambas variables a la vista
            return Inertia::render('Auth/sales', [
                'sales' => $sales,
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
                ProductSale::create([
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
            $sale = Sales::find($request->input('sale_id'));
            $sale->total += $totalToAdd; // Sumar el nuevo total
            $sale->save();
            DB::commit(); // Confirmar transacción
            return Redirect::route('sales.index')->with('success', 'Productos añadidos y total actualizado exitosamente.');
        } catch (\Exception $e) {
            DB::rollBack(); // Revertir transacción en caso de error
            return Redirect::back()->with('error', 'Error al agregar productos: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductSale $product_sale)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductSale $product_sale)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'qty' => 'required|integer',
            'received' => 'required|integer',
        ]);
        $purchase = ProductSale::findOrFail($id);
        $purchase->update($validatedData);
        return Redirect::route('sales.index')->with('success', 'Venta editada exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductSale $productSale)
    {
        try {
            $productSale->delete();
            return Redirect::route('sales.index')->with('success', 'Producto de venta eliminado exitosamente.');
        } catch (\Exception $e) {
            return Redirect::back()->with('error', 'Error al eliminar el producto en una venta: ' . $e->getMessage());
        }
    }
}
