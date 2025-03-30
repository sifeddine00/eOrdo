<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Posologie;

class PosologieController extends Controller
{
    public function index()
{
    return response()->json(Posologie::all());
}

}
