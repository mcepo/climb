<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ImageUploadRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $minSize = 1024; // minimal file size in kilobytes, i.e. 1MB
        $maxSize = $minSize * 30; // maximal file size in kilobytes, i.e. 30MB

        return [
            'image' => "required|mimes:jpg,jpeg,png,webp|min:{$minSize}|max:{$maxSize}"
        ];
    }
}