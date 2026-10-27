<?php

declare(strict_types=1);

namespace App\Domain\Learning\ValueObjects;

/**
 * Pedagogical Cognitive Level based on Bloom's Revised Taxonomy.
 */
enum BloomTaxonomyLevel: string
{
    case Remember = 'remember';
    case Understand = 'understand';
    case Apply = 'apply';
    case Analyze = 'analyze';
    case Evaluate = 'evaluate';
    case Create = 'create';

    public function pedagogicalDirective(): string
    {
        return match ($this) {
            self::Remember => 'Focus on recalling facts, syntax conventions, and baseline definitions.',
            self::Understand => 'Focus on explaining concepts in plain language and using analogies to illustrate principles.',
            self::Apply => 'Focus on applying concepts to practical code snippets, scenarios, or standard algorithms.',
            self::Analyze => 'Focus on breaking down architectures, identifying edge cases, bugs, and performance trade-offs.',
            self::Evaluate => 'Focus on critiquing alternative implementations, architectural decisions, and error handling.',
            self::Create => 'Focus on synthesizing new solutions, designing robust abstractions, and authoring end-to-end modules.',
        };
    }
}
