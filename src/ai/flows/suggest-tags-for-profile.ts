'use server';

/**
 * @fileOverview This file contains a Genkit flow for suggesting relevant skill tags for a tutor's profile based on their expertise description.
 *
 * - suggestTags - A function that takes a tutor's expertise description and returns suggested skill tags.
 * - SuggestTagsInput - The input type for the suggestTags function.
 * - SuggestTagsOutput - The return type for the suggestTags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTagsInputSchema = z.object({
  expertiseDescription: z
    .string()
    .describe('A description of the tutor\'s expertise and skills.'),
});
export type SuggestTagsInput = z.infer<typeof SuggestTagsInputSchema>;

const SuggestTagsOutputSchema = z.object({
  suggestedTags: z
    .array(z.string())
    .describe('An array of suggested skill tags for the tutor.'),
});
export type SuggestTagsOutput = z.infer<typeof SuggestTagsOutputSchema>;

export async function suggestTags(input: SuggestTagsInput): Promise<SuggestTagsOutput> {
  return suggestTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTagsPrompt',
  input: {schema: SuggestTagsInputSchema},
  output: {schema: SuggestTagsOutputSchema},
  prompt: `You are an AI assistant designed to suggest relevant skill tags for a tutor's profile.

  Based on the following description of the tutor's expertise, suggest 5-10 relevant skill tags that they can use to represent their abilities to potential students.

  Expertise Description: {{{expertiseDescription}}}

  Return the suggested tags as an array of strings. Do not return any explanation, only the array of tags.
  `,
});

const suggestTagsFlow = ai.defineFlow(
  {
    name: 'suggestTagsFlow',
    inputSchema: SuggestTagsInputSchema,
    outputSchema: SuggestTagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
