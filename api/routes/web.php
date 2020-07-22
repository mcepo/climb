<?php

Route::get('/guide', 'WebController@guide');
Route::get('/', 'WebController@index');

Route::get('email/verify', 'AuthController@show')->name('verification.notice');
Route::get('email/verify/{id}', 'AuthController@verify')->name('verification.verify');
Route::get('email/resend', 'AuthController@resend')->name('verification.resend');