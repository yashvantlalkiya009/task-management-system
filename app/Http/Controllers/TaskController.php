<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\TaskResource;

class TaskController extends Controller
{
    /**
     * GET /api/tasks
     */
    public function index(Request $request)
    {
        try {

            $query = Task::query()
                ->orderBy('is_completed', 'asc')
                ->orderBy('created_at', 'desc');

            // Filter
            if ($request->has('filter')) {

                if ($request->filter === 'completed') {
                    $query->where('is_completed', true);
                } elseif ($request->filter === 'incomplete') {
                    $query->where('is_completed', false);
                }
            }

            // Search
            if ($request->search) {

                $query->where(function ($q) use ($request) {

                    $q->where('title', 'LIKE', '%' . $request->search . '%')
                        ->orWhere('description', 'LIKE', '%' . $request->search . '%');
                });
            }

            // Pagination
            $tasks = $query->paginate(5);

            return TaskResource::collection($tasks);
        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch tasks.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * POST /api/tasks
     */
    public function store(Request $request)
    {
        DB::beginTransaction();

        try {

            $validated = $request->validate([
                'title'       => 'required|string|max:255',
                'description' => 'nullable|string',
            ]);

            $task = Task::create($validated);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Task created successfully.',
                'data'    => new TaskResource($task)
            ], 201);
        } catch (Exception $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to create task.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * GET /api/tasks/{id}
     */
    public function show(Task $task)
    {
        try {

            return response()->json([
                'success' => true,
                'data'    => new TaskResource($task)
            ]);
        } catch (Exception $e) {

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch task.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * PUT /api/tasks/{id}
     */
    public function update(Request $request, Task $task)
    {
        DB::beginTransaction();

        try {

            $validated = $request->validate([
                'title'        => 'sometimes|required|string|max:255',
                'description'  => 'nullable|string',
                'is_completed' => 'sometimes|boolean',
            ]);

            $task->update($validated);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Task updated successfully.',
                'data'    => new TaskResource($task)
            ]);
        } catch (Exception $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to update task.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * DELETE /api/tasks/{id}
     */
    public function destroy(Task $task)
    {
        DB::beginTransaction();

        try {

            $task->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Task deleted successfully.'
            ]);
        } catch (Exception $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete task.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}
