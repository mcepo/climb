<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Trail;
use App\Models\Tag;

class TrailController extends Controller
{
    public function store(Request $request)
    {
        $trail = new Trail($request->all());
        $trail->name = 'test';
        $trail->save();
        $trail->tag($request->all());

        return response()->json($trail);
    }

    public function show(Trail $trail)
    {
        return response()->json(
            [
                'trail' => $trail
            ]
        );
    }

    public function update(Request $request, Trail $trail)
    {
        $this->canUserModify($trail);

        $trail->fill($request->all());
        $trail->save();

        return response()->json($trail);
    }

    public function destroy(Trail $trail)
    {
        $this->canUserModify($trail);
        
        if(Tag::where(['tagged_type' => 'trail', 'tagged_id' => $trail->id])->count() == 0) {
        
            $trail->delete();
        } else {
            return response("Can't delete trail while it is tagged somewhere!", 403);
        }
    }
}
