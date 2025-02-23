"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NotesTab from "@/components/notes-tab";
import FileManagerTab from "@/components/file-manager-tab";
import GraphTab from "@/components/graph-tab";
import type { NoteWithUser, FileWithUser } from "@/types";

interface MainTabsProps {
  initialNotes: NoteWithUser[];
  initialFiles: FileWithUser[];
  userId: string;
  username: string;
}

export default function MainTabs({
  initialNotes,
  initialFiles,
  userId,
}: MainTabsProps) {
  return (
    <Tabs defaultValue="notes" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="notes">Notes</TabsTrigger>
        <TabsTrigger value="files">Files</TabsTrigger>
        <TabsTrigger value="graph">Graph</TabsTrigger>
      </TabsList>
      <TabsContent value="notes" className="mt-6">
        <NotesTab initialNotes={initialNotes} userId={userId} />
      </TabsContent>
      <TabsContent value="files" className="mt-6">
        <FileManagerTab initialFiles={initialFiles} userId={userId} />
      </TabsContent>
      <TabsContent value="graph" className="mt-6">
        <GraphTab />
      </TabsContent>
    </Tabs>
  );
}
