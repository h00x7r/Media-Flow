// src/app/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowUpRight, Briefcase, DollarSign, Image as ImageIcon, Users, Palette } from "lucide-react";

const quickStats = [
  { title: "Active Projects", value: "12", icon: Briefcase, change: "+2 this week", color: "text-primary" },
  { title: "Mood Boards", value: "28", icon: ImageIcon, change: "+5 this week", color: "text-accent" },
  { title: "Proofs Awaiting", value: "3", icon: Users, change: "1 new today", color: "text-yellow-500" },
  { title: "Styles Generated", value: "7", icon: Palette, change: "+1 this week", color: "text-green-500" },
];

const recentActivities = [
  { description: "New project 'Summer Wedding Gala' created.", time: "2 hours ago", type: "project" },
  { description: "Mood board 'Vintage Elegance' updated with 3 images.", time: "5 hours ago", type: "moodboard" },
  { description: "Client feedback received for 'Product Launch Campaign'.", time: "1 day ago", type: "proof" },
  { description: "AI Style Guide generated for 'Earthy Tones Palette'.", time: "2 days ago", type: "styleguide" },
  { description: "Project 'Corporate Headshots' marked as completed.", time: "3 days ago", type: "project" },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome to MediaFlow</h1>
        <p className="text-muted-foreground">
          Your central hub for managing photography and design projects.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>Overview of your latest project activities.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Summer Wedding Gala</TableCell>
                  <TableCell><Badge variant="outline">Planning</Badge></TableCell>
                  <TableCell className="text-right">Aug 15, 2024</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Product Launch Campaign</TableCell>
                  <TableCell><Badge variant="secondary">Awaiting Feedback</Badge></TableCell>
                  <TableCell className="text-right">Jul 30, 2024</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Corporate Headshots</TableCell>
                  <TableCell><Badge>Completed</Badge></TableCell>
                  <TableCell className="text-right">Jul 10, 2024</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="justify-end">
            <Button asChild variant="outline" size="sm">
              <Link href="/projects">View All Projects <ArrowUpRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates across your workspace.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                  {activity.type === "project" && <Briefcase className="h-4 w-4" />}
                  {activity.type === "moodboard" && <ImageIcon className="h-4 w-4" />}
                  {activity.type === "proof" && <Users className="h-4 w-4" />}
                  {activity.type === "styleguide" && <Palette className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium leading-none">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
