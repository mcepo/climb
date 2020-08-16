<?php

Route::namespace('Auth')->group(function() {
  Route::post('login', 'LoginController@login');
  Route::post('register', 'RegisterController@register');
  Route::post('social_login/{provider}', 'LoginController@socialLogin');

  Route::post('forgot_password', 'PasswordController@forgotten');
  Route::post('change_password', 'PasswordController@change');

  Route::post('resend_verification', 'VerificationController@resend');

});

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

Route::middleware('admin')->prefix('admin')->group(function() {

  Route::get('user/search', 'UserController@search');
  Route::get('user/{user}/addArea/{areaId}', 'UserController@addArea');
  Route::get('user/{user}/removeArea/{areaId}', 'UserController@removeArea');
  
  Route::resource('user', 'UserController');
  
  Route::get('getNotApprovedActivities', 'AdminController@getNotApprovedActivities');
  Route::get('approveActivity/{activity}', 'AdminController@approveActivity');
  Route::get('revertActivity/{activity}', 'AdminController@revertActivity');
  
  Route::get('getImages', 'AdminController@getImages');
  Route::get('imageReviewed/{id}', 'AdminController@imageReviewed');
});
