<?php

namespace App\Http\Controllers;

use App\Models\Purchases;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class PurchasesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            // Cargar las compras junto con la relación del usuario
            $purchases = Purchases::with('user')->get();
        
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
        $users = User::all();
        
        return Inertia::render('Auth/purchases', [
            'users' => $users,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'document_date' => 'required|datetime,default:current',
            'order_status' => 'required|tinyint,default:0',
            'payment_status' => 'required|tinyint,default:0', 
            'total' => 'required|decimal,default:0.0',
        ]);

        try {
            Purchases::create($request->all());
            return Redirect::route('purchases.index')->with('success', 'compra creado exitosamente.');
        } catch (\Exception $e) {
            return Redirect::back()->with('error', 'Error al crear la compra: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Purchases $purchases)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Purchases $purchases)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Purchases $purchases)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'document_date' => 'required|datetime,default:current',
            'order_status' => 'required|tinyint,default:0',
            'payment_status' => 'required|tinyint,default:0', 
            'total' => 'required|decimal,default:0.0',
        ]);
        try {
            $purchases->update($request->all());
            return Redirect::route('purchases.index')->with('success', 'Compra actualizado exitosamente.');
        } catch (\Exception $e) {
            return Redirect::back()->with('error', 'Error al actualizar la compra: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Purchases $purchases)
    {
        try {
            $purchases->delete();
            return Redirect::route('purchases.index')->with('success', 'Compra eliminada exitosamente.');
        } catch (\Exception $e) {
            return Redirect::back()->with('error', 'Error al eliminar la compra: ' . $e->getMessage());
        }
    }
}
