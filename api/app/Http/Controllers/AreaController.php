<?php

namespace App\Http\Controllers;

use App\Http\Requests\ImageUploadRequest;
use App\Models\Area;
use App\Models\Route;
use App\Models\Trail;
use App\Models\Image;
use App\Models\Tag;
use Illuminate\Http\Request;
use App\User;

class AreaController extends Controller
{
    public function index()
    {
        return [
            'areas' => Area::roots()->with('mapTag')->get(),
            'routes' => Route::loadChunk(request()->all()),
            'moderators' => User::admins()->get()
        ];
    }

    public function store(Request $request)
    {
        $area = new Area($request->all());

        $area->save();

        return $area;
    }

    public function show(Area $area)
    {
        $area->load([
            'mapTag',
            'links',
            'moderators'
        ])->append([
            'altitude',
            'ancestors'
        ]);
        $area->setStatistics();
        $area->loadAreaAssets(request()->all());

        return response()->json($area);
    }

    public function update(Request $request, Area $area)
    {
        $this->canUserModify($area);

        $area->fill($request->all())->save();
    }

    public function destroy(Area $area)
    {
        $this->canUserModify($area);

        if ( $area->canBeDeleted() ) {
            $area->delete();
        } else {
            return response("Can't delete area while it has content, or is tagged!", 403);
        }
    }

    public function move(Request $request, Area $area)
    {
        $this->isAdmin();

        $area->parent_id = $request->get('id');
        $area->save();

        return $area->path;
    }

    public function addImage(Area $area, ImageUploadRequest $request)
    {
        return $area->addImage($request);
    }
}
