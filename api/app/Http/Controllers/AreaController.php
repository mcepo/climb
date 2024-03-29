<?php

namespace App\Http\Controllers;

use App\Http\Requests\ImageUploadRequest;
use App\Models\Area;
use Illuminate\Http\Request;
class AreaController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth', ['except' => ['index', 'show']]);
        $this->middleware('check-cache', ['only' => ['index', 'show']]);
        $this->middleware('flush-cache', ['except' => ['index', 'show']]);
    }

    public function index(Request $request)
    {
        $query = Area::with('mapTag');

        if($request->has('query') && $request->get('query') != '') {
            $query = $query->filter($request->all())->limit(20);
        } else {
            $query = $query->countries();
        }

        return [
            'areas' => $query->get()
        ];
    }

    public function store(Request $request)
    {
        $area = new Area($request->all());

        $area->save();

        $this->updateAreaStats($area->id);

        return $area;
    }

    public function show(Area $area)
    {
        $area->load(
            [
            'mapTag',
            'links',
            'moderators',
            'areas.mapTag',
            'routes.mapTag'
            ]
        )->append(
            [
                'altitude',
                'ancestors'
                ]
        );
        $area->loadAreaAssets(request()->all());

        return $area->toJson();
    }

    public function update(Request $request, Area $area)
    {
        // $this->canUserModify($area);
        
        $area->fill($request->all());

        $area->save();

        $this->updateAreaStats($area->id);
    }

    public function destroy(Area $area)
    {
        $this->canUserModify($area);

        if ($area->canBeDeleted() ) {

            $area->delete();

            $this->updateAreaStats($area->parent_id);

        } else {
            return response("Can't delete area while it has content, or is tagged!", 408);
        }
    }

    public function move(Request $request, Area $area)
    {
        $this->isAdmin();

        $oldParentId = $area->parent_id;

        $area->parent_id = $request->get('id');
        $area->save();

        $this->updateAreaStats($area->id);
        
        $this->updateAreaStats($oldParentId);

        return $area->path;
    }

    public function addImage(Area $area, ImageUploadRequest $request)
    {
        $image = $area->addImage($request);

        $this->updateAreaStats($area->id);

        return $image;
    }
}
