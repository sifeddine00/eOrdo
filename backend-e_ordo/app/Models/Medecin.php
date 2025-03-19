<?php

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Medecin extends Authenticatable
{
    use HasApiTokens;

    protected $fillable = ['nom', 'prenom', 'email', 'password', 'specialite'];

    protected $hidden = ['password'];
}

