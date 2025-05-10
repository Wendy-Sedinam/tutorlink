'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a compatibility score between a student and a tutor.
 *
 * - generateCompatibilityScore - A function that takes student and tutor data and returns a compatibility score.
 * - CompatibilityScoreInput - The input type for the generateCompatibilityScore function.
 * - CompatibilityScoreOutput - The return type for the generateCompatibilityScore function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CompatibilityScoreInputSchema = z.object({
  studentLearningPreferences: z
    .string()
    .describe('The learning preferences of the student.'),
  studentSubjectInterests: z.string().describe('The subject interests of the student.'),
  tutorSubjectMatterExpertise: z
    .string()
    .describe('The subject matter expertise of the tutor.'),
  tutorTeachingStyle: z.string().describe('The teaching style of the tutor.'),
});
export type CompatibilityScoreInput = z.infer<typeof CompatibilityScoreInputSchema>;

const CompatibilityScoreOutputSchema = z.object({
  compatibilityScore: z
    .number()
    .describe(
      'A score between 0 and 1 indicating the compatibility between the student and tutor.'
    ),
  justification: z
    .string()
    .describe('The justification for the calculated compatibility score.'),
});
export type CompatibilityScoreOutput = z.infer<typeof CompatibilityScoreOutputSchema>;

export async function generateCompatibilityScore(
  input: CompatibilityScoreInput
): Promise<CompatibilityScoreOutput> {
  return generateCompatibilityScoreFlow(input);
}

const compatibilityScorePrompt = ai.definePrompt({
  name: 'compatibilityScorePrompt',
  input: {
    schema: CompatibilityScoreInputSchema,
  },
  output: {
    schema: CompatibilityScoreOutputSchema,
  },
  prompt: `You are an expert at determining the compatibility between a student and a tutor.

  Based on the student's learning preferences and subject interests, and the tutor's subject matter expertise and teaching style, determine a compatibility score between 0 and 1 (inclusive), and justify the score.

  Student Learning Preferences: {{{studentLearningPreferences}}}
  Student Subject Interests: {{{studentSubjectInterests}}}
  Tutor Subject Matter Expertise: {{{tutorSubjectMatterExpertise}}}
  Tutor Teaching Style: {{{tutorTeachingStyle}}}
  \nSet the compatibilityScore appropriately. Provide the justification for the score in the justification field.
  `,
});

const generateCompatibilityScoreFlow = ai.defineFlow(
  {
    name: 'generateCompatibilityScoreFlow',
    inputSchema: CompatibilityScoreInputSchema,
    outputSchema: CompatibilityScoreOutputSchema,
  },
  async input => {
    const {output} = await compatibilityScorePrompt(input);
    return output!;
  }
);
