"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      setFile(null);
      toast.success("File uploaded successfully");
    } else {
      toast.error("Failed to upload file");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold">Upload File</h2>
      <Input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        required
      />
      <Button type="submit" disabled={!file}>
        Upload
      </Button>
    </form>
  );
}
