"use client";
import { useCallback, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { createId } from "@paralleldrive/cuid2";
import { FileRejection, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { RenderEmptyState, RenderErrorState } from "./render-state";

interface UploaderState {
    id: string | null;
    file: File | null;
    uploading: boolean;
    progress: number;
    key?: string;
    isDeleting: boolean;
    error: boolean;
    objectUrl?: string;
    fileType: "image" | "video";
}

export function Uploader() {
    const [fileState, setFileState] = useState<UploaderState>({
        error: false,
        file: null,
        id: null,
        uploading: false,
        progress: 0,
        isDeleting: false,
        fileType: "image",
    });

    async function uploadFile(file: File) {
        setFileState((prev) => ({
            ...prev,
            uploading: true,
            progress: 0,
        }));

        try {
            // get presigned url
            const presignedUrlResponse = await fetch("/api/s3/upload", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fileName: file.name,
                    contentType: file.type,
                    size: file.size,
                    isImage: true,
                }),
            });

            if (!presignedUrlResponse.ok) {
                toast.error("Failed to get presigned URL");
                setFileState((prev) => ({
                    ...prev,
                    uploading: false,
                    error: true,
                    progress: 0,
                }));

                return;
            }

            const { presignedUrl, key } = await presignedUrlResponse.json();

            await new Promise<void>((resolve, reject) => {
                const xhr = new XMLHttpRequest();

                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const percentageCompleted = (event.loaded / event.total) * 100;

                        setFileState((prev) => ({
                            ...prev,
                            progress: Math.round(percentageCompleted),
                        }));
                    }
                };

                xhr.onload = () => {
                    if (xhr.status === 200 || xhr.status === 204) {
                        setFileState((prev) => ({
                            ...prev,
                            uploading: false,
                            progress: 100,
                            key: key,
                        }));

                        toast.success("File uploaded successfully");

                        resolve();
                    } else {
                        reject(new Error("Upload failed..."));
                    }
                };

                xhr.onerror = () => {
                    reject(new Error("Upload failed"));
                };

                xhr.open("PUT", presignedUrl);
                xhr.setRequestHeader("Content-Type", file.type);
                xhr.send(file);
            });
        } catch (error) {
            toast.error("Something went wrong");

            setFileState((prev) => ({
                ...prev,
                error: true,
                uploading: false,
                progress: 0,
            }));
        }
    }

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];

            setFileState({
                file: file,
                uploading: false,
                progress: 0,
                objectUrl: URL.createObjectURL(file),
                error: false,
                id: createId(),
                isDeleting: false,
                fileType: "image",
            });

            uploadFile(file);
        }
    }, []);

    function rejectedFiles(fileRejection: FileRejection[]) {
        if (fileRejection.length) {
            const tooManyFiles = fileRejection.find((rejection) => rejection.errors[0].code === "too-many-files");

            const fileSizeTooBig = fileRejection.find((rejection) => rejection.errors[0].code === "file-too-large");

            const invalidType = fileRejection.find((rejection) => rejection.errors[0].code === "file-invalid-type");

            if (tooManyFiles) {
                toast.error("Too many files selected");
            }

            if (fileSizeTooBig) {
                toast.error("File size is too big");
            }

            if (invalidType) {
                toast.error("Invalid file type");
            }

            console.log(fileRejection);
        }
    }

    function renderContent() {
        if (fileState.uploading) {
            return <h1>uploading...</h1>;
        }

        if (fileState.error) {
            return <RenderErrorState />;
        }

        if (fileState.objectUrl) {
            return <h1>uploaded file</h1>;
        }

        return <RenderEmptyState isDragActive={isDragActive} />;
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [],
        },
        maxFiles: 1,
        multiple: false,
        maxSize: 5 * 1024 * 1024,
        onDropRejected: rejectedFiles,
    });

    return (
        <Card
            {...getRootProps()}
            className={cn(
                "relative h-64 w-full border-2 border-dashed transition-colors duration-200 ease-in-out",
                isDragActive ? "border-primary bg-primary/10 border-solid" : "border-border hover:border-primary"
            )}
        >
            <CardContent className="flex h-full w-full items-center justify-center p-4">
                <input {...getInputProps()} />
                {renderContent()}
            </CardContent>
        </Card>
    );
}
