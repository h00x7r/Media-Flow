// src/app/mood-boards/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MOCK_MOOD_BOARDS } from '@/lib/mock-data';
import type { MoodBoard } from '@/lib/types';
import { PlusCircle, Eye, Image as ImageIconLucide } from 'lucide-react';
import Image from 'next/image';

function MoodBoardCard({ moodBoard }: { moodBoard: MoodBoard }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        {moodBoard.coverImage && (
          <div className="relative aspect-video mb-4 rounded-md overflow-hidden">
            <Image 
              src={moodBoard.coverImage} 
              alt={`Cover image for ${moodBoard.name}`} 
              layout="fill" 
              objectFit="cover"
              data-ai-hint="moodboard cover"
            />
          </div>
        )}
        <CardTitle className="text-xl">{moodBoard.name}</CardTitle>
        {moodBoard.description && <CardDescription className="line-clamp-2">{moodBoard.description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">
          {moodBoard.images.length} image{moodBoard.images.length !== 1 ? 's' : ''}
        </p>
        <p className="text-xs text-muted-foreground">
          Created: {new Date(moodBoard.createdAt).toLocaleDateString()}
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/mood-boards/${moodBoard.id}`}>
            View Mood Board <Eye className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function MoodBoardsPage() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mood Boards</h1>
          <p className="text-muted-foreground">
            Curate visual inspiration for your projects.
          </p>
        </div>
        <Button asChild>
          <Link href="/mood-boards/new">
            <PlusCircle className="mr-2 h-5 w-5" /> Create New Mood Board
          </Link>
        </Button>
      </header>

      {MOCK_MOOD_BOARDS.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {MOCK_MOOD_BOARDS.map((moodBoard) => (
            <MoodBoardCard key={moodBoard.id} moodBoard={moodBoard} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <ImageIconLucide className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-lg font-medium">No mood boards yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Get started by creating a new mood board.
          </p>
          <div className="mt-6">
            <Button asChild>
              <Link href="/mood-boards/new">
                <PlusCircle className="mr-2 h-4 w-4" /> Create Mood Board
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
