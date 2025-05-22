// src/app/style-guide/page.tsx
"use client";

import { useState, type ChangeEvent, type FormEvent } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { generateStyleGuide, type StyleGuideOutput } from '@/ai/flows/style-guide';
import { UploadCloud, Palette, Type, FileText, Wand2, Loader2, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ImagePreview {
  id: string;
  name: string;
  dataUrl: string;
  file: File;
}

export default function AIStyleGuidePage() {
  const { toast } = useToast();
  const [selectedImages, setSelectedImages] = useState<ImagePreview[]>([]);
  const [styleGuide, setStyleGuide] = useState<StyleGuideOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      const imagePreviewsPromises = filesArray.map(file => {
        return new Promise<ImagePreview>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              id: `${file.name}-${Date.now()}`,
              name: file.name,
              dataUrl: reader.result as string,
              file: file,
            });
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      Promise.all(imagePreviewsPromises).then(newPreviews => {
        setSelectedImages(prev => [...prev, ...newPreviews].slice(0, 5)); // Limit to 5 images for example
        if (filesArray.length + selectedImages.length > 5) {
            toast({ title: "Limit Reached", description: "You can select up to 5 images.", variant: "default"});
        }
      }).catch(error => {
        console.error("Error reading files:", error);
        toast({ title: "Error", description: "Could not load images.", variant: "destructive" });
      });
      
      // Reset file input to allow selecting the same file again if removed
      event.target.value = '';
    }
  };
  
  const removeImage = (imageId: string) => {
    setSelectedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedImages.length === 0) {
      toast({ title: "No Images Selected", description: "Please select at least one image to generate a style guide.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setStyleGuide(null);

    try {
      const imageDataUris = selectedImages.map(img => img.dataUrl);
      const result = await generateStyleGuide({ imageDataUris });
      setStyleGuide(result);
      toast({ title: "Style Guide Generated", description: "AI has successfully generated style recommendations." });
    } catch (error) {
      console.error("Error generating style guide:", error);
      toast({ title: "Generation Failed", description: "Could not generate style guide. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Wand2 className="h-8 w-8 text-primary" />
          AI-Powered Style Guide
        </h1>
        <p className="text-muted-foreground">
          Upload images to get AI-driven suggestions for color palettes and typography.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Upload Inspiration Images</CardTitle>
          <CardDescription>Select up to 5 images that represent the style you're aiming for.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="image-upload" className="sr-only">Upload images</label>
               <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="ai-image-upload-input"
                      className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-ring"
                    >
                      <span>Upload files</span>
                      <input id="ai-image-upload-input" name="ai-image-upload-input" type="file" className="sr-only" multiple accept="image/*" onChange={handleImageChange} disabled={isLoading} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each. Max 5 images.</p>
                </div>
              </div>
            </div>

            {selectedImages.length > 0 && (
              <ScrollArea className="h-48 w-full">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-1">
                  {selectedImages.map((imgPreview) => (
                    <div key={imgPreview.id} className="relative group aspect-square">
                      <Image
                        src={imgPreview.dataUrl}
                        alt={imgPreview.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md border"
                        data-ai-hint="style inspiration"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(imgPreview.id)}
                        disabled={isLoading}
                        aria-label={`Remove ${imgPreview.name}`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                        {imgPreview.name}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}

            <Button type="submit" disabled={isLoading || selectedImages.length === 0} className="w-full sm:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Style Guide
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {styleGuide && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Style Guide</CardTitle>
            <CardDescription>Here are the AI's suggestions based on your images.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                <Palette className="h-5 w-5 text-primary" />
                Color Palette
              </h3>
              <div className="flex flex-wrap gap-3">
                {styleGuide.colorPalette.map((color, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className="h-16 w-16 rounded-md border shadow-md"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                    <span className="mt-1 text-xs text-muted-foreground">{color}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                <Type className="h-5 w-5 text-primary" />
                Typography
              </h3>
              <p><strong>Font Family:</strong> {styleGuide.typography.fontFamily}</p>
              <p><strong>Font Size:</strong> {styleGuide.typography.fontSize}</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-primary" />
                Overall Style Description
              </h3>
              <p className="text-sm text-muted-foreground">{styleGuide.description}</p>
            </section>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
