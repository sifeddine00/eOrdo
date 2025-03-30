<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Quantite;

class QuantiteController extends Controller
{
    public function index()
{
    return response()->json(Quantite::all());
}

}
