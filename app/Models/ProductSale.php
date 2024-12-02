<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductSale extends Model
{
    /** @use HasFactory<\Database\Factories\ProductSaleFactory> */
    use HasFactory;

    protected $fillable = [
        'purchase_id',
        'product_id',
        'qty',
        'cost',
        'received',
    ];

    protected $casts = [
        'qty' => 'integer',
        'cost' => 'decimal:2',
        'received' => 'integer',
    ];

    public function sales()
    {
        return $this->belongsTo(Sales::class);
    }

    public function product()
    {
        return $this->belongsTo(Products::class);
    }
}
