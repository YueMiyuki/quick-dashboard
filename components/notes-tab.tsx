"use client";

import type React from "react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { NoteWithUser } from "@/types";
import { format } from "date-fns";

interface NotesTabProps {
  initialNotes: NoteWithUser[];
  userId: string;
}

export default function NotesTab({ initialNotes, userId }: NotesTabProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (response.ok) {
        const newNote: NoteWithUser = await response.json();
        setNotes([newNote, ...notes]);
        setTitle("");
        setContent("");
        toast.success("Note created successfully");
      } else {
        toast.error("Failed to create note");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while creating the note");
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setNotes(notes.filter((note) => note.id !== id));
        toast.success("Note deleted successfully");
      } else {
        toast.error("Failed to delete note");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while deleting the note");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Create New Memo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="min-h-[100px]"
            />
          </CardContent>
          <CardFooter>
            <Button type="submit">Save Memo</Button>
          </CardFooter>
        </form>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <Card key={note.id}>
            <CardHeader>
              <CardTitle className="flex items-baseline justify-between">
                <span>{note.title}</span>
                <span className="text-sm text-muted-foreground">
                  @{note.user.username}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{note.content}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                {format(new Date(note.updatedAt), "MMM d, yyyy HH:mm")}
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteNote(note.id)}
                disabled={note.user.id !== userId}
              >
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
