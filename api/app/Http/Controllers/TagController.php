<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;

class TagController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function store(Request $request)
    {
        $tag = new Tag($request->all());

        $tag->save();

        $this->updateAreaStats($tag->path);

        return $tag->id;
    }

    public function update(Request $request, Tag $tag)
    {
        $this->canUserModify($tag);

        $tag->fill($request->all())->save();

        $this->updateAreaStats($tag->path);
    }

    public function destroy(Tag $tag)
    {
        $this->canUserModify($tag);
        
        $tag->delete();

        $this->updateAreaStats($tag->path);
    }
}
