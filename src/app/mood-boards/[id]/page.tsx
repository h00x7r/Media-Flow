// src/app/mood-boards/[id]/page.tsx
"use client";

import { useState, useEffect, type ChangeEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getMoodBoardById, MOCK_MOOD_BOARDS } from '@/lib/mock-data'; // Assuming MOCK_MOOD_BOARDS is exported for updates
import type { MoodBoard, MoodBoardImage } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, PlusCircle, Trash2, Search, UploadCloud, AlertTriangle, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';

export default function MoodBoardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [moodBoard, setMoodBoard] = useState<MoodBoard | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageNotes, setImageNotes] = useState('');
  const [isAddImageDialogOpen, setIsAddImageDialogOpen] = useState(false);

  const moodBoardId = typeof params.id === 'string' ? params.id : '';

  useEffect(() => {
    if (moodBoardId) {
      const foundMoodBoard = getMoodBoardById(moodBoardId);
      if (foundMoodBoard) {
        setMoodBoard(foundMoodBoard);
      } else {
        toast({ title: "Error", description: "Mood board not found.", variant: "destructive" });
        router.push('/mood-boards');
      }
      setLoading(false);
    }
  }, [moodBoardId, router, toast]);

  const handleAddImage = () => {
    if (!moodBoard || (!imageUrl.trim() && !tempUploadedFile)) return;

    let newImage: MoodBoardImage;

    if (tempUploadedFile) {
      newImage = {
        id: `img-${moodBoard.id}-${Date.now()}`,
        url: URL.createObjectURL(tempUploadedFile), // Use object URL for display
        altText: imageAlt.trim() || tempUploadedFile.name,
        addedAt: new Date().toISOString(),
        notes: imageNotes.trim(),
        dataAiHint: "custom image" // Generic hint for uploaded images
      };
    } else {
       newImage = {
        id: `img-${moodBoard.id}-${Date.now()}`,
        url: imageUrl.trim(),
        altText: imageAlt.trim() || 'Mood board image',
        addedAt: new Date().toISOString(),
        notes: imageNotes.trim(),
        dataAiHint: "web image" // Generic hint for URL images
      };
    }


    const updatedMoodBoard = { ...moodBoard, images: [...moodBoard.images, newImage] };
    setMoodBoard(updatedMoodBoard);

    // This would typically be a server action to update the backend
    const moodBoardIndex = MOCK_MOOD_BOARDS.findIndex(mb => mb.id === moodBoard.id);
    if (moodBoardIndex !== -1) {
      MOCK_MOOD_BOARDS[moodBoardIndex] = updatedMoodBoard;
    }

    setImageUrl('');
    setImageAlt('');
    setImageNotes('');
    setTempUploadedFile(null);
    setIsAddImageDialogOpen(false);
    toast({ title: "Image Added", description: "New image added to your mood board." });
  };

  const handleRemoveImage = (imageId: string) => {
    if (!moodBoard) return;
    const updatedImages = moodBoard.images.filter(img => img.id !== imageId);
    const updatedMoodBoard = { ...moodBoard, images: updatedImages };
    setMoodBoard(updatedMoodBoard);

    const moodBoardIndex = MOCK_MOOD_BOARDS.findIndex(mb => mb.id === moodBoard.id);
    if (moodBoardIndex !== -1) {
      MOCK_MOOD_BOARDS[moodBoardIndex] = updatedMoodBoard;
    }

    toast({ title: "Image Removed", description: "Image removed from your mood board." });
  };

  const [tempUploadedFile, setTempUploadedFile] = useState<File | null>(null);

  const handleImageFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setTempUploadedFile(event.target.files[0]);
      setImageUrl(''); // Clear URL if file is chosen
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><p>Loading mood board...</p></div>;
  }

  if (!moodBoard) {
    return (
       <div className="text-center py-12">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
        <h2 className="mt-4 text-xl font-semibold">Mood Board Not Found</h2>
        <p className="text-muted-foreground">The mood board you are looking for does not exist or has been moved.</p>
        <Button asChild className="mt-6">
          <Link href="/mood-boards">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Mood Boards
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Button variant="outline" size="sm" asChild className="mb-4">
        <Link href="/mood-boards">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Mood Boards
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{moodBoard.name}</CardTitle>
          {moodBoard.description && <CardDescription>{moodBoard.description}</CardDescription>}
          <p className="text-sm text-muted-foreground">Created: {new Date(moodBoard.createdAt).toLocaleDateString()}</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
            <Dialog open={isAddImageDialogOpen} onOpenChange={setIsAddImageDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-5 w-5" /> Add Image
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Add New Image to Mood Board</DialogTitle>
                  <DialogDescription>
                    Upload an image or provide a URL. Add optional alt text and notes.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="image-upload">Upload Image</Label>
                    <Input id="image-upload" type="file" accept="image/*" onChange={handleImageFileChange} />
                    {tempUploadedFile && <p className="text-xs text-muted-foreground">Selected: {tempUploadedFile.name}</p>}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image-url">Image URL</Label>
                    <Input 
                      id="image-url" 
                      placeholder="https://example.com/image.jpg" 
                      value={imageUrl} 
                      onChange={(e) => { setImageUrl(e.target.value); setTempUploadedFile(null); }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image-alt">Alt Text (Optional)</Label>
                    <Input id="image-alt" placeholder="Brief description of the image" value={imageAlt} onChange={(e) => setImageAlt(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image-notes">Notes (Optional)</Label>
                    <Textarea id="image-notes" placeholder="Any notes about this image" value={imageNotes} onChange={(e) => setImageNotes(e.target.value)} className="min-h-[80px]" />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                     <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="button" onClick={handleAddImage} disabled={!imageUrl.trim() && !tempUploadedFile}>Add Image</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <div className="relative w-full sm:max-w-xs">
              <Input type="search" placeholder="Search Unsplash (coming soon)..." className="pl-10" disabled />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          {moodBoard.images.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {moodBoard.images.map((image) => (
                <Card key={image.id} className="group relative overflow-hidden">
                  <div className="aspect-square relative">
                    <Image
                      src={image.url}
                      alt={image.altText || 'Mood board image'}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={image.dataAiHint || "moodboard photo"}
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-2">
                       <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleRemoveImage(image.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove image"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  {(image.altText || image.notes) && (
                    <div className="p-3 text-xs bg-card border-t">
                      {image.altText && <p className="font-medium truncate" title={image.altText}>{image.altText}</p>}
                      {image.notes && <p className="text-muted-foreground truncate" title={image.notes}>{image.notes}</p>}
                       <a href={image.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center mt-1">
                        View Original <ExternalLink className="ml-1 h-3 w-3" />
                       </a>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed rounded-md">
              <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-medium">This mood board is empty</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Start by adding some images for inspiration.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
