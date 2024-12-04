<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductSale extends Model
{
    /** @use HasFactory<\Database\Factories\ProductSaleFactory> */
    use HasFactory;

    protected $fillable = [
        'sale_id',
        'product_id',
        'qty',
        'price',
    ];

    protected $casts = [
        'qty' => 'integer',
        'cost' => 'decimal:2',
    ];

    public function sale()
    {
        return $this->belongsTo(Sales::class);
    }

    public function product()
    {
        return $this->belongsTo(Products::class);
    }
}
