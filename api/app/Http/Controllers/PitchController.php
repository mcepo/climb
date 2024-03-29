<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Pitch;
use App\Models\Tag;

class PitchController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('flush-cache');
    }
    
    public function store(Request $request)
    {
        $pitch = new Pitch($request->all());
        
        $pitch->save();

        $this->updateAreaStats($pitch->path);

        return $pitch->id;
    }

    public function update(Request $request, Pitch $pitch)
    {
        // $this->canUserModify($pitch);

        $pitch->fill($request->all())->save();

        $this->updateAreaStats($pitch->path);
    }

    public function destroy(Pitch $pitch)
    {
        $this->canUserModify($pitch);

        if(Tag::where(['tagged_type' => 'pitch', 'tagged_id' => $pitch->id])->count() == 0) {
        
            $pitch->delete();

            $this->updateAreaStats($pitch->path);

        } else {
            return response("Can't delete a pitch while it is tagged!", 403);
        }
    }
}
