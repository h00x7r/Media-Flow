// src/ai/flows/image-prompt.ts
'use server';

/**
 * @fileOverview Flow for generating image prompts based on user descriptions.
 *
 * - generateImagePrompt - A function that takes a description and returns an AI-generated prompt.
 * - GenerateImagePromptInput - The input type for the generateImagePrompt function.
 * - GenerateImagePromptOutput - The return type for the generateImagePrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImagePromptInputSchema = z.object({
  description: z
    .string()
    .describe(
      'A description of the desired image, e.g., \'a modern wedding photo with a focus on natural light\' or \'an advertisement design with a minimalist aesthetic\'.'
    ),
});
export type GenerateImagePromptInput = z.infer<typeof GenerateImagePromptInputSchema>;

const GenerateImagePromptOutputSchema = z.object({
  prompt: z
    .string()
    .describe(
      'An AI-generated prompt tailored for DALL-E or similar tools, optimized for creating visual assets based on the input description.'
    ),
});
export type GenerateImagePromptOutput = z.infer<typeof GenerateImagePromptOutputSchema>;

export async function generateImagePrompt(
  input: GenerateImagePromptInput
): Promise<GenerateImagePromptOutput> {
  return generateImagePromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateImagePromptPrompt',
  input: {schema: GenerateImagePromptInputSchema},
  output: {schema: GenerateImagePromptOutputSchema},
  prompt: `You are an AI assistant specialized in creating detailed and effective prompts for image generation tools like DALL-E.
  Based on the user's description, create a prompt that will generate a high-quality image that closely matches their vision. Be specific and creative.

  User Description: {{{description}}}

  Generated Prompt:`, // Ensure the AI responds ONLY with the generated prompt.
});

const generateImagePromptFlow = ai.defineFlow(
  {
    name: 'generateImagePromptFlow',
    inputSchema: GenerateImagePromptInputSchema,
    outputSchema: GenerateImagePromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
