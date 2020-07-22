<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;

class TagController extends Controller
{
    public function store(Request $request)
    {
        $tag = new Tag($request->all());

        $tag->save();

        return $tag->id;
    }

    public function update(Request $request, Tag $tag)
    {

        $this->canUserModify($tag);

        $tag->fill($request->all())->save();
    }


    public function destroy(Tag $tag)
    {
        $this->canUserModify($tag);
        
        $tag->delete();
    }
}
