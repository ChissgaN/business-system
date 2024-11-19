<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseProducts extends Model
{
    /** @use HasFactory<\Database\Factories\PurchaseProductsFactory> */
    use HasFactory;

    protected $fillable = [
        'purchase_id',
        'product_id',
        'qty',
        'cost',
        'received',
    ];

    public function purchase()
    {
        return $this->belongsTo(Purchases::class);
    }

    public function product()
    {
        return $this->belongsTo(Products::class);
    }
}
