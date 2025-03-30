<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Medecin extends Authenticatable
{
    use HasApiTokens;

    protected $fillable = [
        'prenom', 'nom', 'username', 'specialite', 'email', 'password', 'telephone', 'adresse'
    ];
    protected $hidden = ['password'];

    public function patients()
    {
        return $this->hasMany(Patient::class, 'medecin_id');
    }

    public function ordonnances()
    {
        return $this->hasMany(Ordonnance::class, 'medecin_id');
    }

}

