<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;

    protected $primaryKey = 'num_dossier'; // Clé primaire personnalisée
    public $incrementing = false; // Désactiver l'auto-incrémentation
    protected $keyType = 'string';
    
    protected $fillable = [
        'num_dossier', 'nom', 'prenom', 'téléphone', 'adresse',
        'genre', 'profession', 'status_familiale', 'allergies',
        'note', 'groupe_sanguin','date_naissance','email'
    ];

    public function medecin()
{
    return $this->belongsTo(Medecin::class, 'medecin_id');
}

    public function ordonnances()
    {
        return $this->hasMany(Ordonnance::class, 'patient_id');
    }
}
