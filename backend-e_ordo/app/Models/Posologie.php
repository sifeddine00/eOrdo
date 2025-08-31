<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;use Illuminate\Database\Eloquent\Factories\HasFactory;

class Posologie extends Model
{
    use HasFactory;

    protected $fillable = ['frequence', 'moment_prise'];
}

