<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ordonnance extends Model
{
    use HasFactory;

    protected $fillable = ['date_visite', 'diagnostic', 'medecin_id', 'patient_id'];

    public function medecin()
    {
        return $this->belongsTo(Medecin::class);
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id', 'num_dossier');
    }

    public function details()
    {
        return $this->hasMany(DetailOrdonnance::class);
    }
}

