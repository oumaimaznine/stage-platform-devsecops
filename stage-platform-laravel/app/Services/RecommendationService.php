<?php

namespace App\Services;

use App\Models\Student;
use App\Models\InternshipOffer;

class RecommendationService
{
    public function recommend(Student $student, int $limit = 10)
    {
        $offers = InternshipOffer::where('statut', 'ouverte')->get();

        $recommendations = $offers->map(function ($offer) use ($student) {

            $skillsScore = $this->calculateSkillsScore($student, $offer);
            $formationScore = $this->calculateFormationScore($student, $offer);
            $typeScore = $this->calculateTypeScore($student, $offer);
            $experienceScore = $this->calculateExperienceScore($student, $offer);

            $finalScore =
                ($skillsScore * 0.50) +
                ($formationScore * 0.20) +
                ($typeScore * 0.15) +
                ($experienceScore * 0.15);

            return [
                'offer' => $offer,

                'score' => round($finalScore),

                'details' => [
                    'competences' => round($skillsScore),
                    'formation' => round($formationScore),
                    'type' => round($typeScore),
                    'experience' => round($experienceScore),
                ],

                'missing_skills' => $this->getMissingSkills(
                    $student,
                    $offer
                ),
            ];
        });

        return $recommendations
            ->sortByDesc('score')
            ->take($limit)
            ->values();
    }

    /**
     * ==============================
     * COMPETENCES
     * ==============================
     */
    private function calculateSkillsScore(
        Student $student,
        InternshipOffer $offer
    ): float {

        $studentSkills = $this->getStudentSkills($student);

        $requiredSkills = $this->normalizeSkills(
            $offer->competences_requises
        );

        if (empty($requiredSkills)) {
            return 50;
        }

        if (empty($studentSkills)) {
            return 0;
        }

        $matched = 0;

        foreach ($requiredSkills as $requiredSkill) {

            foreach ($studentSkills as $studentSkill) {

                if (
                    $studentSkill === $requiredSkill ||
                    str_contains($studentSkill, $requiredSkill) ||
                    str_contains($requiredSkill, $studentSkill)
                ) {
                    $matched++;
                    break;
                }
            }
        }

        return ($matched / count($requiredSkills)) * 100;
    }

    /**
     * ==============================
     * FORMATION
     * ==============================
     */
    private function calculateFormationScore(
        Student $student,
        InternshipOffer $offer
    ): float {

        $offerText = strtolower(
            ($offer->titre ?? '') .
            ' ' .
            ($offer->description ?? '')
        );

        $niveau = strtolower(
            trim($student->niveau ?? '')
        );

        $specialite = strtolower(
            trim($student->specialite ?? '')
        );

        if (!$niveau && !$specialite) {
            return 50;
        }

        $score = 0;

        if (
            $niveau &&
            str_contains($offerText, $niveau)
        ) {
            $score += 60;
        }

        if (
            $specialite &&
            str_contains($offerText, $specialite)
        ) {
            $score += 40;
        }

        if ($score === 0) {
            return 50;
        }

        return min($score, 100);
    }

    /**
     * ==============================
     * TYPE DE STAGE
     * ==============================
     */
    private function calculateTypeScore(
        Student $student,
        InternshipOffer $offer
    ): float {

        if (!$student->type_stage_prefere) {
            return 50;
        }

        return $student->type_stage_prefere === $offer->type
            ? 100
            : 0;
    }

    /**
     * ==============================
     * EXPERIENCE
     * ==============================
     */
    private function calculateExperienceScore(
        Student $student,
        InternshipOffer $offer
    ): float {

        $experiences =
            $student->cv_extracted['experiences'] ?? [];

        if (
            !is_array($experiences) ||
            empty($experiences)
        ) {
            return 30;
        }

        $offerText = strtolower(
            ($offer->titre ?? '') .
            ' ' .
            ($offer->description ?? '') .
            ' ' .
            ($offer->competences_requises ?? '')
        );

        $matched = 0;

        foreach ($experiences as $experience) {

            $experienceText = strtolower(
                ($experience['poste'] ?? '') .
                ' ' .
                ($experience['entreprise'] ?? '') .
                ' ' .
                ($experience['description'] ?? '')
            );

            $words = preg_split(
                '/\s+/',
                $experienceText
            );

            foreach ($words as $word) {

                $word = trim(
                    preg_replace(
                        '/[^a-zA-Z0-9+#.]/',
                        '',
                        $word
                    )
                );

                if (
                    strlen($word) >= 4 &&
                    str_contains($offerText, $word)
                ) {
                    $matched++;
                    break;
                }
            }
        }

        if ($matched === 0) {
            return 30;
        }

        return min(
            100,
            50 + ($matched * 25)
        );
    }

    /**
     * ==============================
     * COMPETENCES MANQUANTES
     * ==============================
     */
    private function getMissingSkills(
        Student $student,
        InternshipOffer $offer
    ): array {

        $studentSkills = $this->getStudentSkills($student);

        $requiredSkills = $this->normalizeSkills(
            $offer->competences_requises
        );

        $missing = [];

        foreach ($requiredSkills as $requiredSkill) {

            $found = false;

            foreach ($studentSkills as $studentSkill) {

                if (
                    $studentSkill === $requiredSkill ||
                    str_contains($studentSkill, $requiredSkill) ||
                    str_contains($requiredSkill, $studentSkill)
                ) {
                    $found = true;
                    break;
                }
            }

            if (!$found) {
                $missing[] = $requiredSkill;
            }
        }

        return $missing;
    }

    /**
     * ==============================
     * SKILLS DU CV
     * ==============================
     */
    private function getStudentSkills(Student $student): array
    {
        $skills =
            $student->cv_extracted['competences'] ?? [];

        if (!is_array($skills)) {
            return [];
        }

        return $this->normalizeSkills($skills);
    }

    /**
     * ==============================
     * NORMALISATION
     * ==============================
     */
    private function normalizeSkills($skills): array
    {
        if (is_string($skills)) {

            $skills = preg_split(
                '/[,;|]+/',
                $skills
            );
        }

        if (!is_array($skills)) {
            return [];
        }

        return collect($skills)
            ->map(function ($skill) {

                if (is_array($skill)) {
                    $skill =
                        $skill['nom']
                        ?? $skill['name']
                        ?? '';
                }

                return strtolower(
                    trim((string) $skill)
                );
            })
            ->filter()
            ->unique()
            ->values()
            ->toArray();
    }
}