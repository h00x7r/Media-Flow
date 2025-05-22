// src/ai/flows/style-guide.ts
'use server';

/**
 * @fileOverview Generates a style guide (color palettes, typography) from a collection of images.
 *
 * - generateStyleGuide - A function that generates the style guide.
 * - StyleGuideInput - The input type for the generateStyleGuide function.
 * - StyleGuideOutput - The return type for the generateStyleGuide function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StyleGuideInputSchema = z.object({
  imageDataUris: z
    .array(z.string())
    .describe(
      'An array of image data URIs that must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
});
export type StyleGuideInput = z.infer<typeof StyleGuideInputSchema>;

const StyleGuideOutputSchema = z.object({
  colorPalette: z
    .array(z.string())
    .describe('A list of hex color codes representing the color palette.'),
  typography: z.object({
    fontFamily: z.string().describe('Recommended font family.'),
    fontSize: z.string().describe('Recommended font size.'),
  }),
  description: z.string().describe('Overall style description'),
});

export type StyleGuideOutput = z.infer<typeof StyleGuideOutputSchema>;

export async function generateStyleGuide(input: StyleGuideInput): Promise<StyleGuideOutput> {
  return generateStyleGuideFlow(input);
}

const prompt = ai.definePrompt({
  name: 'styleGuidePrompt',
  input: {schema: StyleGuideInputSchema},
  output: {schema: StyleGuideOutputSchema},
  prompt: `You are an AI style guide assistant. Analyze the images provided and suggest a style guide with color palettes and typography recommendations.

Images: 
{{#each imageDataUris}}
  {{media url=this}}
{{/each}}

Based on the provided images, suggest:

- A color palette (list of hex color codes).
- Typography recommendations (font family and font size).
- A short paragraph description of the style.

Ensure the style guide is consistent with the themes and styles detected in the images.

Output MUST be a JSON object that conforms to the StyleGuideOutputSchema schema: {{{outputSchema}}}.`,
});

const generateStyleGuideFlow = ai.defineFlow(
  {
    name: 'generateStyleGuideFlow',
    inputSchema: StyleGuideInputSchema,
    outputSchema: StyleGuideOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

