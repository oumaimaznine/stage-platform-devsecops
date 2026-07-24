<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index()
    {
        return response()->json(Student::with('user')->latest()->get());
    }

    public function show(Student $student)
    {
        return response()->json($student->load('user', 'applications.offer'));
    }

    public function update(Request $request, Student $student)
    {
        $data = $request->validate([
            'filiere' => 'sometimes|string|max:255',
            'niveau' => 'sometimes|string|max:255',
            'telephone' => 'nullable|string|max:30',
        ]);

        $student->update($data);
        return response()->json($student);
    }
}
