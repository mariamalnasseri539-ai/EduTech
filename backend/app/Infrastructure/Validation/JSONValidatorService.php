<?php

declare(strict_types=1);

namespace App\Infrastructure\Validation;

use JsonException;
use Psr\Log\LoggerInterface;
use RuntimeException;

/**
 * High-integrity JSON Schema Draft 2020-12 Validator with automated silent self-healing retry loop.
 */
final class JSONValidatorService
{
    public function __construct(
        private readonly ?LoggerInterface $logger = null
    ) {}

    /**
     * Executes a generation callable with automatic schema validation and silent self-healing retry.
     *
     * @template T
     * @param callable(string|null): string $generatorFn Callable receiving optional correction prompt and returning raw JSON
     * @param string $schemaPath Path to JSON Schema Draft 2020-12
     * @param int $maxRetries Maximum repair iterations
     * @return array<string, mixed>
     */
    public function validateWithAutoRetry(
        callable $generatorFn,
        string $schemaPath,
        int $maxRetries = 3
    ): array {
        if (!file_exists($schemaPath)) {
            throw new RuntimeException("JSON Schema file not found at: {$schemaPath}");
        }

        $schemaJson = file_get_contents($schemaPath);
        $schema = json_decode($schemaJson, true, 512, JSON_THROW_ON_ERROR);

        $correctionPrompt = null;
        $attempt = 0;
        $lastErrors = [];

        while ($attempt <= $maxRetries) {
            $rawOutput = $generatorFn($correctionPrompt);
            $parsed = $this->sanitizeAndParseJson($rawOutput);

            if ($parsed !== null) {
                $errors = $this->validateAgainstSchema($parsed, $schema);
                if (empty($errors)) {
                    if ($attempt > 0) {
                        $this->logger?->info("Silent self-healing succeeded on attempt {$attempt}.");
                    }
                    return $parsed;
                }
                $lastErrors = $errors;
            } else {
                $lastErrors = ['Invalid JSON syntax. Payload could not be parsed as a valid JSON object.'];
            }

            $attempt++;
            $errorList = implode("\n- ", $lastErrors);

            $this->logger?->warning("AI output schema validation failed (Attempt {$attempt}/{$maxRetries}):", [
                'errors' => $lastErrors,
            ]);

            $correctionPrompt = <<<PROMPT
CRITICAL SCHEMA CORRECTION REQUIRED:
The previous response failed JSON Schema Draft 2020-12 validation with the following structural errors:
- {$errorList}

Repair the JSON payload immediately. Ensure ALL required fields, enums, array structures, and types match the schema exactly.
Return ONLY raw valid JSON without markdown wrapping or commentary.
PROMPT;
        }

        throw new RuntimeException(
            'Failed to produce schema-compliant AI output after ' . ($maxRetries + 1) . ' attempts. Last errors: ' .
            implode('; ', $lastErrors)
        );
    }

    /**
     * Strips backticks/markdown fences and parses JSON safely.
     *
     * @param string $raw
     * @return array<string, mixed>|null
     */
    public function sanitizeAndParseJson(string $raw): ?array
    {
        $trimmed = trim($raw);

        // Strip markdown fences ```json ... ```
        if (str_starts_with($trimmed, '```')) {
            $trimmed = preg_replace('/^```(?:json)?\s*/i', '', $trimmed);
            $trimmed = preg_replace('/\s*```$/', '', $trimmed);
            $trimmed = trim($trimmed);
        }

        try {
            $data = json_decode($trimmed, true, 512, JSON_THROW_ON_ERROR);
            return is_array($data) ? $data : null;
        } catch (JsonException) {
            return null;
        }
    }

    /**
     * Validates data array against Draft 2020-12 requirements (structural check).
     *
     * @param array<string, mixed> $data
     * @param array<string, mixed> $schema
     * @return array<string> List of validation error messages
     */
    public function validateAgainstSchema(array $data, array $schema): array
    {
        $errors = [];

        // Check required root properties
        if (!empty($schema['required']) && is_array($schema['required'])) {
            foreach ($schema['required'] as $requiredKey) {
                if (!array_key_exists($requiredKey, $data) || $data[$requiredKey] === null) {
                    $errors[] = "Missing required root property: '{$requiredKey}'";
                }
            }
        }

        // Check property-level constraints
        if (!empty($schema['properties']) && is_array($schema['properties'])) {
            foreach ($schema['properties'] as $propKey => $propRule) {
                if (!array_key_exists($propKey, $data) || $data[$propKey] === null) {
                    continue;
                }

                $val = $data[$propKey];

                // Enum validation
                if (!empty($propRule['enum']) && is_array($propRule['enum'])) {
                    if (!in_array($val, $propRule['enum'], true)) {
                        $expected = implode(', ', $propRule['enum']);
                        $errors[] = "Property '{$propKey}' has invalid value '{$val}'. Expected one of: [{$expected}]";
                    }
                }

                // Array items validation
                if (($propRule['type'] ?? '') === 'array' && is_array($val)) {
                    if (isset($propRule['minItems']) && count($val) < $propRule['minItems']) {
                        $errors[] = "Property '{$propKey}' requires at least {$propRule['minItems']} items, given " . count($val);
                    }

                    if (!empty($propRule['items']['required']) && is_array($propRule['items']['required'])) {
                        foreach ($val as $idx => $item) {
                            if (!is_array($item)) {
                                $errors[] = "Item at index {$idx} in '{$propKey}' must be an object.";
                                continue;
                            }
                            foreach ($propRule['items']['required'] as $itemReq) {
                                if (!array_key_exists($itemReq, $item) || $item[$itemReq] === null) {
                                    $errors[] = "Item at index {$idx} in '{$propKey}' is missing required property '{$itemReq}'.";
                                }
                            }
                        }
                    }
                }
            }
        }

        return $errors;
    }
}
