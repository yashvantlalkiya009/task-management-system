<?php

use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| All routes here are prefixed with /api automatically.
|
| Registers:
|   GET    /api/tasks            → TaskController@index
|   POST   /api/tasks            → TaskController@store
|   GET    /api/tasks/{task}     → TaskController@show
|   PUT    /api/tasks/{task}     → TaskController@update
|   DELETE /api/tasks/{task}     → TaskController@destroy
|
*/

Route::apiResource('tasks', TaskController::class);