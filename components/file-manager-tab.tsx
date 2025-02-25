"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { FileIcon, DownloadIcon, TrashIcon } from "lucide-react";
import type { FileWithUser } from "@/types";
import { format } from "date-fns";

interface FileManagerTabProps {
  initialFiles: FileWithUser[];
  userId: string; // Current user's ID
}

export default function FileManagerTab({
  initialFiles,
  userId,
}: FileManagerTabProps) {
  const [files, setFiles] = useState(initialFiles);
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const { file: newFile } = await response.json();
        setFiles([newFile, ...files]);
        setFile(null);
        toast.success("File uploaded successfully");
      } else {
        toast.error("Failed to upload file");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred during upload");
    }
  };

  const handleDelete = async (fileId: string) => {
    try {
      const response = await fetch(`/api/files/${fileId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setFiles(files.filter((f) => f.id !== fileId));
        toast.success("File deleted successfully");
      } else {
        toast.error("Failed to delete file");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred during deletion");
    }
  };

  return (
    <Tabs defaultValue="browse" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="browse">Browse Files</TabsTrigger>
        <TabsTrigger value="upload">Upload</TabsTrigger>
      </TabsList>

      <TabsContent value="browse" className="mt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {files.map((file) => (
            <Card key={file.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileIcon className="h-5 w-5" />
                  <span className="truncate text-sm">{file.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    @{file.user.username}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(file.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a href={'/api/files/' + file.id} download>
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Download
                  </a>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(file.id)}
                  disabled={file.user.id !== userId}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="upload" className="mt-6">
        <Card>
          <form onSubmit={handleUpload}>
            <CardHeader>
              <CardTitle>Upload New File</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={!file}>
                Upload
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
