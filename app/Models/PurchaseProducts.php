<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseProducts extends Model
{
    use HasFactory;

    protected $table = 'purchase_products';
    
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
    public function purchase()
    {
        return $this->belongsTo(Purchases::class);
    }

    public function product()
    {
        return $this->belongsTo(Products::class);
    }
}