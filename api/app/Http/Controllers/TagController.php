<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use App\Models\Trail;
use Illuminate\Http\Request;

class TagController extends Controller
{
    public function store(Request $request)
    {
        // the item being tagged doesn't exist in the database
        // so i need to create it before creating the tag it self
        // right now i am only doing this for trails
        if($request->get('tagged_type') == 'trail') {

            $trail = new Trail();

            // packed area id in tagged_id, because it was the simplest solution
            // not the best one
            $trail->area_id = $request->get('tagged_id');

            $trail->save();

            // changing the tagged_id from the area id to the id of an item that is actually 
            // being tagged, trail
            $request->merge(['tagged_id' => $trail->id]);
        }

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
