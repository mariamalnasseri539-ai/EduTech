<?php

declare(strict_types=1);

namespace App\Infrastructure\ExternalServices;

/**
 * Service for optimizing and preparing text for speech synthesis (TTS).
 * Interfaces with frontend Web Speech API and backend Cloud TTS streaming.
 */
final class TextToSpeechService
{
    /**
     * Prepares spoken text by optimizing acronyms, punctuation cadence, and pronunciation cues.
     */
    public function formatForSpeech(string $rawText): string
    {
        $sanitized = strip_tags($rawText);

        // Strip raw Markdown formatting (bold, italic, backticks, code blocks)
        $sanitized = preg_replace('/```[\s\S]*?```/', 'Refer to code snippet on screen.', $sanitized);
        $sanitized = preg_replace('/`([^`]+)`/', '$1', $sanitized);
        $sanitized = preg_replace('/[*_~#]/', '', $sanitized);

        // Expand common engineering acronyms for natural phonetic delivery
        $replacements = [
            '/\bDOM\b/' => 'D-O-M',
            '/\bAPI\b/' => 'A-P-I',
            '/\bCLI\b/' => 'C-L-I',
            '/\bSQL\b/' => 'Sequel',
            '/\bCSS\b/' => 'C-S-S',
            '/\bJSON\b/' => 'Jason',
            '/\bZPD\b/' => 'Zone of Proximal Development',
            '/\bCPU\b/' => 'C-P-U',
            '/\bRAM\b/' => 'Ram',
            '/\bI\/O\b/' => 'Input Output',
            '/\bi\.e\./i' => 'that is',
            '/\be\.g\./i' => 'for example',
        ];

        return trim(preg_replace(array_keys($replacements), array_values($replacements), $sanitized));
    }

    /**
     * Wraps speech transcript into SSML (Speech Synthesis Markup Language) for advanced TTS engines.
     */
    public function toSSML(string $plainSpeechText, string $pitch = '+0%', string $rate = '1.0'): string
    {
        $escaped = htmlspecialchars($this->formatForSpeech($plainSpeechText), ENT_XML1, 'UTF-8');
        return <<<SSML
<speak>
    <prosody pitch="{$pitch}" rate="{$rate}">
        {$escaped}
    </prosody>
</speak>
SSML;
    }
}
