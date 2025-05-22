// src/app/projects/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MOCK_PROJECTS } from '@/lib/mock-data';
import type { Project } from '@/lib/types';
import { PlusCircle, ArrowRight, Eye } from 'lucide-react';
import Image from 'next/image';

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        {project.coverImage && (
          <div className="relative aspect-video mb-4 rounded-md overflow-hidden">
            <Image 
              src={project.coverImage} 
              alt={`Cover image for ${project.name}`} 
              layout="fill" 
              objectFit="cover" 
              data-ai-hint="project cover" 
            />
          </div>
        )}
        <CardTitle className="text-xl">{project.name}</CardTitle>
        <CardDescription>{project.clientName}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-2 line-clamp-3">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="secondary">{project.type}</Badge>
          <Badge variant={project.status === 'Completed' ? 'default' : 'outline'}>{project.status}</Badge>
        </div>
        {project.dueDate && (
          <p className="text-xs text-muted-foreground">Due: {new Date(project.dueDate).toLocaleDateString()}</p>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/projects/${project.id}`}>
            View Details <Eye className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function ProjectsPage() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage all your photography and design projects.
          </p>
        </div>
        <Button asChild>
          <Link href="/projects/new">
            <PlusCircle className="mr-2 h-5 w-5" /> Create New Project
          </Link>
        </Button>
      </header>

      {MOCK_PROJECTS.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {MOCK_PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-lg font-medium">No projects yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Get started by creating a new project.
          </p>
          <div className="mt-6">
            <Button asChild>
              <Link href="/projects/new">
                <PlusCircle className="mr-2 h-4 w-4" /> Create Project
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
