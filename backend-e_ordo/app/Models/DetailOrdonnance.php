<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetailOrdonnance extends Model
{
    use HasFactory;

    protected $fillable = ['ordonnance_id', 'medicament_id', 'quantite_id', 'posologie_id'];

    public function ordonnance()
    {
        return $this->belongsTo(Ordonnance::class);
    }

    public function medicament()
    {
        return $this->belongsTo(Medicament::class);
    }

    public function quantite()
    {
        return $this->belongsTo(Quantite::class);
    }

    public function posologie()
    {
        return $this->belongsTo(Posologie::class);
    }
}
