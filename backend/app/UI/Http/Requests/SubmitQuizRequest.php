<?php

declare(strict_types=1);

namespace App\UI\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class SubmitQuizRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'course_id' => ['required', 'string'],
            'lesson_id' => ['required', 'string'],
            'topic_id' => ['required', 'string'],
            'question_id' => ['required', 'string'],
            'selected_option' => ['required', 'integer'],
            'time_spent_seconds' => ['sometimes', 'integer'],
        ];
    }
}
