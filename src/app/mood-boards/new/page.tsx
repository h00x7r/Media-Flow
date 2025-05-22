// src/app/mood-boards/new/page.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { addMoodBoard } from "@/lib/mock-data"; // Simulated action
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const moodBoardFormSchema = z.object({
  name: z.string().min(3, "Mood board name must be at least 3 characters."),
  description: z.string().optional(),
});

type MoodBoardFormValues = z.infer<typeof moodBoardFormSchema>;

export default function NewMoodBoardPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<MoodBoardFormValues>({
    resolver: zodResolver(moodBoardFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function onSubmit(values: MoodBoardFormValues) {
    try {
      // Simulate API call / server action
      const newMoodBoard = addMoodBoard(values);
      toast({
        title: "Mood Board Created",
        description: `Mood board "${newMoodBoard.name}" has been successfully created.`,
      });
      router.push(`/mood-boards/${newMoodBoard.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create mood board. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to create mood board:", error);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Button variant="outline" size="sm" asChild className="mb-4">
        <Link href="/mood-boards">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Mood Boards
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Create New Mood Board</CardTitle>
          <CardDescription>Give your mood board a name and optional description.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mood Board Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Vintage Wedding Aesthetics" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A brief description of this mood board's theme or purpose."
                        className="resize-y min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                 <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Creating..." : "Create Mood Board"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
