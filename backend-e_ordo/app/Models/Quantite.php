<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Model;
class Quantite extends Model
{
    use HasFactory;

    protected $fillable = ['valeur', 'unite'];
}