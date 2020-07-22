<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Activitylog\Models\Activity;
use App\Models\Image;
use App\Models\Tag;
use App\Models\Area;
use App\Models\Route;
use App\Models\Trail;

class AdminController extends Controller
{

    public function getNotApprovedActivities()
    {
        return Activity::with(['causer'])->whereNull('status')->orderBy('id', 'desc')->get();
    }

    public function approveActivity(Activity $activity)
    {

        $activity->reviewed_at = now();
        $activity->reviewed_by = auth()->user()->id;
        $activity->status = true;
        $activity->save();
    }

    public function revertActivity(Activity $activity)
    {

        $item = $activity->subject;

        switch ($activity->description) {
            case 'created':
                $item->delete();
                break;
            case 'updated':
                $item->fill($activity->properties['old']);
                $item->save();
                break;
            case 'deleted':
                $this->_revertDeleted($activity);
                break;
        }

        $activity->reviewed_at = now();
        $activity->reviewed_by = auth()->user()->id;
        $activity->status = false;
        $activity->save();
    }

    private function _revertDeleted($activity)
    {

        // item isn't restored in frontend store so it won't be displayed

        switch ($activity->subject_type) {
            case 'tag':
                (new Tag($activity->properties->get('attributes')))->save();
                break;
            case 'area':
                (new Area($activity->properties->get('attributes')))->save();
                break;
            case 'route':
                (new Route($activity->properties->get('attributes')))->save();
                break;
            case 'trail':
                (new Trail($activity->properties->get('attributes')))->save();
                break;
            case 'image':
                (new Image($activity->properties->get('attributes')))->save();
                break;
        }

        // TODO: if number od users grow change this
        // this will generate activity as well, but i don't want that activity so i am going to 
        // delete last activity, this is not good, but as long as there isn't that much users
        // there won't be any problems :D
    }

    public function getImages()
    {
        $images = Image::with(['owner'])->whereNull('reviewer_id')->get();
        return $images;
    }

    public function imageReviewed($id)
    {
        // TODO: add reverted_at field

        $image = Image::findOrFail($id);

        $user = auth()->user();

        $image->reviewer_id = $user->id;

        $image->save();

        return response('', 201);
    }
}
