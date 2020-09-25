<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Trail;
use App\Models\Tag;

class TrailController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function store(Request $request)
    {
        $trail = new Trail();

        // packed area id in tagged_id, because it was the simplest solution
        // not the best one
        $trail->area_id = $request->get('tagged_id');

        $trail->save();

        // changing the tagged_id from the area id to the id of an item that is actually 
        // being tagged, trail
        $request->merge(['tagged_id' => $trail->id]);

        $tag = new Tag($request->all());

        $tag->save();

        $this->updateAreaStats($tag->path);

        $trail->load('mapTag');

        return response()->json($trail);
    }


    // TODO: trails never get deleted right now

    public function destroy(Trail $trail)
    {
        $this->canUserModify($trail);

        if (Tag::where(['tagged_type' => 'trail', 'tagged_id' => $trail->id])->count() == 0) {

            $trail->delete();

            $this->updateAreaStats($trail->path);
        } else {
            return response("Can't delete trail while it is tagged somewhere!", 403);
        }
    }
}
