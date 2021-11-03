<?php

use Illuminate\Support\Facades\Route;

Route::get('/guide', 'WebController@guide');
Route::get('/', 'WebController@index');

Route::get('email/verify/{id}', 'Auth\VerificationController@verify')->name('verification.verify');
Route::get('email/resend', 'Auth\VerificationController@resend')->name('verification.resend');

Route::get('/a/{path}/{area}/{imageInfo?}', 'WebController@area');
Route::get('/r/{path}/{route}/{imageInfo?}', 'WebController@route');
Route::get('/admin/{path}', 'WebController@index');