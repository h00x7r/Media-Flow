// src/app/projects/[id]/page.tsx
"use client"; 

import { useState, useEffect, type ChangeEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getProjectById, MOCK_PROJECTS } from '@/lib/mock-data'; // Assuming MOCK_PROJECTS is exported for updates
import type { Project, Proof, Feedback } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, UploadCloud, MessageSquare, CheckCircle, XCircle, AlertTriangle, Paperclip, Download } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [newFeedback, setNewFeedback] = useState<{ [proofId: string]: string }>({});

  const projectId = typeof params.id === 'string' ? params.id : '';

  useEffect(() => {
    if (projectId) {
      const foundProject = getProjectById(projectId);
      if (foundProject) {
        setProject(foundProject);
      } else {
        toast({ title: "Error", description: "Project not found.", variant: "destructive" });
        router.push('/projects');
      }
      setLoading(false);
    }
  }, [projectId, router, toast]);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0] && project) {
      const file = event.target.files[0];
      const newProof: Proof = {
        id: `proof-${project.id}-${Date.now()}`,
        fileName: file.name,
        fileUrl: URL.createObjectURL(file), // Placeholder for actual upload
        uploadedAt: new Date().toISOString(),
        status: 'Pending Review',
      };
      
      const updatedProject = { ...project, proofs: [...(project.proofs || []), newProof] };
      setProject(updatedProject);
      
      // This would typically be a server action to update the backend
      const projectIndex = MOCK_PROJECTS.findIndex(p => p.id === project.id);
      if (projectIndex !== -1) {
        MOCK_PROJECTS[projectIndex] = updatedProject;
      }

      toast({ title: "Proof Uploaded", description: `${file.name} has been added for client review.` });
    }
  };

  const handleAddFeedback = (proofId: string) => {
    if (!project || !newFeedback[proofId]?.trim()) return;

    const feedbackText = newFeedback[proofId].trim();
    const newFeedbackItem: Feedback = {
      id: `fb-${proofId}-${Date.now()}`,
      comment: feedbackText,
      commenterName: "Client (Simulated)", // In a real app, this would be dynamic
      createdAt: new Date().toISOString(),
    };

    const updatedProject = {
      ...project,
      proofs: project.proofs?.map(p => 
        p.id === proofId 
        ? { ...p, feedback: [...(p.feedback || []), newFeedbackItem], status: 'Revisions Requested' as const } 
        : p
      )
    };
    setProject(updatedProject);
    
    const projectIndex = MOCK_PROJECTS.findIndex(p => p.id === project.id);
      if (projectIndex !== -1) {
        MOCK_PROJECTS[projectIndex] = updatedProject;
      }

    setNewFeedback(prev => ({ ...prev, [proofId]: '' }));
    toast({ title: "Feedback Added", description: `Feedback submitted for proof.` });
  };
  
  const handleFeedbackChange = (proofId: string, text: string) => {
    setNewFeedback(prev => ({ ...prev, [proofId]: text }));
  };

  const updateProofStatus = (proofId: string, status: Proof['status']) => {
    if (!project) return;
    const updatedProject = {
      ...project,
      proofs: project.proofs?.map(p => p.id === proofId ? { ...p, status } : p)
    };
    setProject(updatedProject);

    const projectIndex = MOCK_PROJECTS.findIndex(p => p.id === project.id);
    if (projectIndex !== -1) {
      MOCK_PROJECTS[projectIndex] = updatedProject;
    }
    toast({ title: "Proof Status Updated", description: `Status set to ${status}.` });
  };


  if (loading) {
    return <div className="flex justify-center items-center h-64"><p>Loading project details...</p></div>;
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
        <h2 className="mt-4 text-xl font-semibold">Project Not Found</h2>
        <p className="text-muted-foreground">The project you are looking for does not exist or has been moved.</p>
        <Button asChild className="mt-6">
          <Link href="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Projects
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Button variant="outline" size="sm" asChild className="mb-4">
        <Link href="/projects">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
            <div>
              <CardTitle className="text-3xl">{project.name}</CardTitle>
              <CardDescription>Client: {project.clientName}</CardDescription>
            </div>
            <div className="flex items-center gap-2 mt-2 md:mt-0">
                <Badge variant="secondary" className="text-sm">{project.type}</Badge>
                <Badge className="text-sm" variant={project.status === 'Completed' ? 'default' : 'outline'}>{project.status}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{project.description}</p>
          {project.dueDate && <p className="text-sm"><strong>Due Date:</strong> {new Date(project.dueDate).toLocaleDateString()}</p>}
          <p className="text-sm"><strong>Created:</strong> {new Date(project.createdAt).toLocaleDateString()}</p>
        </CardContent>
      </Card>

      <Separator />

      <section id="client-proofing">
        <Card>
          <CardHeader>
            <CardTitle>Client Proofing</CardTitle>
            <CardDescription>Upload proofs and manage client feedback.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label htmlFor="proofUpload" className="block text-sm font-medium text-gray-700 mb-1">Upload New Proof</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="proof-upload-input"
                      className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-ring"
                    >
                      <span>Upload a file</span>
                      <input id="proof-upload-input" name="proof-upload-input" type="file" className="sr-only" onChange={handleFileUpload} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                </div>
              </div>
            </div>

            {project.proofs && project.proofs.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Uploaded Proofs:</h3>
                {project.proofs.map((proof) => (
                  <Card key={proof.id} className="overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between bg-muted/50 p-4">
                      <div className="flex items-center gap-2">
                        <Paperclip className="h-5 w-5 text-muted-foreground" />
                        <p className="font-medium">{proof.fileName}</p>
                      </div>
                       <div className="flex items-center gap-2">
                        <Badge variant={
                          proof.status === 'Approved' ? 'default' :
                          proof.status === 'Revisions Requested' ? 'destructive' : 'outline'
                        }>
                          {proof.status === 'Approved' && <CheckCircle className="mr-1 h-3 w-3" />}
                          {proof.status === 'Revisions Requested' && <XCircle className="mr-1 h-3 w-3" />}
                          {proof.status}
                        </Badge>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={proof.fileUrl} download={proof.fileName} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4"/>
                          </a>
                        </Button>
                       </div>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                      {proof.fileUrl.match(/\.(jpeg|jpg|gif|png)$/) != null && ( // Basic image check
                        <Image src={proof.fileUrl} alt={`Proof: ${proof.fileName}`} width={200} height={150} className="rounded-md border object-cover" data-ai-hint="design proof" />
                      )}
                      <p className="text-xs text-muted-foreground">Uploaded: {new Date(proof.uploadedAt).toLocaleString()}</p>
                      
                      <div className="space-y-1">
                        <Label htmlFor={`feedback-${proof.id}`}>Add Feedback/Comment (Simulated Client):</Label>
                        <Textarea 
                          id={`feedback-${proof.id}`}
                          placeholder="Type client feedback here..."
                          value={newFeedback[proof.id] || ''}
                          onChange={(e) => handleFeedbackChange(proof.id, e.target.value)}
                          className="min-h-[80px]"
                        />
                        <Button size="sm" onClick={() => handleAddFeedback(proof.id)} className="mt-2">Submit Feedback</Button>
                      </div>

                      {proof.feedback && proof.feedback.length > 0 && (
                        <div className="space-y-2 mt-3 pt-3 border-t">
                          <h4 className="text-sm font-semibold">Feedback Log:</h4>
                          {proof.feedback.map(fb => (
                            <div key={fb.id} className="text-xs p-2 bg-secondary/50 rounded-md">
                              <p className="font-medium">{fb.commenterName}: <span className="text-muted-foreground">({new Date(fb.createdAt).toLocaleString()})</span></p>
                              <p>{fb.comment}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="bg-muted/50 p-4 flex justify-end gap-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" disabled={proof.status === 'Approved'}>
                              <CheckCircle className="mr-2 h-4 w-4" /> Approve
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Approve Proof?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will mark "{proof.fileName}" as approved. This action can be changed later.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => updateProofStatus(proof.id, 'Approved')}>Approve</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                         <AlertDialog>
                          <AlertDialogTrigger asChild>
                             <Button variant="destructive" size="sm" disabled={proof.status === 'Revisions Requested'}>
                                <XCircle className="mr-2 h-4 w-4" /> Request Revisions
                              </Button>
                          </AlertDialogTrigger>
                           <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Request Revisions?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will mark "{proof.fileName}" as needing revisions. Ensure feedback is provided.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => updateProofStatus(proof.id, 'Revisions Requested')} className="bg-destructive hover:bg-destructive/90">Request Revisions</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-center text-muted-foreground py-4">No proofs uploaded for this project yet.</p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

// Helper Label component if not globally available in this context
const Label = ({ htmlFor, children, className }: { htmlFor: string, children: React.ReactNode, className?: string }) => (
  <label htmlFor={htmlFor} className={`block text-sm font-medium text-foreground ${className}`}>
    {children}
  </label>
);
