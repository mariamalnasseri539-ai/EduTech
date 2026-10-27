<?php

declare(strict_types=1);

namespace App\UI\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class SubmitCodeRequest extends FormRequest
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
            'code' => ['required', 'string'],
            'language' => ['sometimes', 'string'],
        ];
    }
}
