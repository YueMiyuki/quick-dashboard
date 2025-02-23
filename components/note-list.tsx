"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { NoteWithUser } from "@/types";
import { format } from "date-fns";

type NoteListProps = {
  notes: NoteWithUser[];
  userId: string;
};

export default function NoteList({
  notes: initialNotes,
  userId,
}: NoteListProps) {
  const [notes, setNotes] = useState(initialNotes);

  const deleteNote = async (id: string) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setNotes(notes.filter((note) => note.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">All Notes</h2>
      {notes.map((note) => (
        <Card key={note.id}>
          <CardHeader>
            <CardTitle>{note.title}</CardTitle>
            <CardDescription>
              <div className="flex justify-between">
                <span>@{note.user.username}</span>
                <span>
                  Last updated:{" "}
                  {format(new Date(note.updatedAt), "MMM d, yyyy HH:mm")}
                </span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>{note.content}</p>
          </CardContent>
          <CardFooter>
            <Button
              variant="destructive"
              onClick={() => deleteNote(note.id)}
              disabled={note.user.id !== userId}
            >
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
