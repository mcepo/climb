<?php

Route::post('login', 'AuthController@login');
Route::post('register', 'AuthController@register');
Route::post('social_login/{provider}', 'AuthController@socialLogin');
Route::post('forgot_password', 'AuthController@forgotPassword');
Route::post('reset_password', 'AuthController@resetPassword');

Route::post('area/{area}/image', 'AreaController@addImage');
Route::put('area/{area}/move', 'AreaController@move');
Route::resource('area', 'AreaController');

Route::resource('route', 'RouteController');
Route::put('route/{route}/move', 'RouteController@move');

Route::resource('pitch', 'PitchController');

Route::resource('tag', 'TagController');

Route::get('image/{image}/tags', 'ImageController@tags');
Route::get('image/{image}/thumbnail', 'ImageController@thumbnail');
Route::resource('image', 'ImageController');

Route::resource('trail', 'TrailController');

// admin routes
// TODO: protect these routes that a user must be admin to access them

Route::get('user/search', 'UserController@search');
Route::get('user/{user}/addArea/{areaId}', 'UserController@addArea');
Route::get('user/{user}/removeArea/{areaId}', 'UserController@removeArea');

Route::resource('user', 'UserController');

Route::get('getNotApprovedActivities', 'AdminController@getNotApprovedActivities');
Route::get('approveActivity/{activity}', 'AdminController@approveActivity');
Route::get('revertActivity/{activity}', 'AdminController@revertActivity');

Route::get('getImages', 'AdminController@getImages');
Route::get('imageReviewed/{id}', 'AdminController@imageReviewed');
