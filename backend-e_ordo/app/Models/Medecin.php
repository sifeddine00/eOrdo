<?php

namespace App\Models;

use Illuminate\Contracts\Auth\CanResetPassword;
use Illuminate\Auth\Passwords\CanResetPassword as CanResetPasswordTrait;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Auth\Notifications\ResetPassword as LaravelResetPassword;
use Laravel\Sanctum\HasApiTokens;

use Illuminate\Foundation\Auth\User as Authenticatable;

class Medecin extends Authenticatable
{
    use HasApiTokens,Notifiable;
    use CanResetPasswordTrait;
    protected $fillable = [
        'prenom', 'nom', 'username', 'specialite', 'email', 'password', 'telephone', 'adresse',
        'prenom_ar', 'nom_ar', 'specialite_ar', 'adresse_ar'
    ];
    protected $hidden = ['password','remember_token'];

    public function patients()
    {
        return $this->hasMany(Patient::class, 'medecin_id');
    }

    public function ordonnances()
    {
        return $this->hasMany(Ordonnance::class, 'medecin_id');
    }

    public function sendPasswordResetNotification($token)
{
    $this->notify(new ResetPasswordNotification($token, $this->email));
}


   

}

