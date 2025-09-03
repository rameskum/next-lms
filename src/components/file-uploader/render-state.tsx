import { cn } from "@/lib/utils";
import { CloudUploadIcon, ImageIcon, Loader2Icon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";

export function RenderEmptyState({ isDragActive }: { isDragActive: boolean }) {
    return (
        <div className="text-center">
            <div className="bg-muted mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
                <CloudUploadIcon className={cn("text-muted-foreground size-6", isDragActive && "text-primary")} />
            </div>
            <p className="text-foreground text-base font-semibold">
                Drop your files here or <span className="text-primary cursor-pointer font-bold">click to upload</span>
            </p>
            <Button className="mt-4" type="button">
                Select Files
            </Button>
        </div>
    );
}

export function RenderErrorState() {
    return (
        <div className="text-center">
            <div className="bg-destructive/30 mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
                <ImageIcon className="text-destructive mx-auto size-6" />
            </div>
            <p className="text-base font-semibold">Upload Failed</p>
            <p className="text-muted-foreground text-s mt-1">Something went wrong</p>
            <Button type="button" className="mt-4">
                Retry File Selection
            </Button>
        </div>
    );
}

export function RenderUploadedState({
    previewUrl,
    isDeleting,
    handleRemoveFile,
}: {
    previewUrl: string;
    isDeleting: boolean;
    handleRemoveFile: () => void;
}) {
    return (
        <div>
            <Image src={previewUrl} alt="uploaded file" fill className="object-contain p-2" />
            <Button
                onClick={handleRemoveFile}
                disabled={isDeleting}
                type="button"
                variant="destructive"
                size="icon"
                className={cn("absolute top-4 right-4 cursor-pointer")}
            >
                {isDeleting ? <Loader2Icon className="size-4 animate-spin" /> : <XIcon className="size-4" />}
            </Button>
        </div>
    );
}

export function RenderUploadingState({ progress, file }: { progress: number; file: File }) {
    return (
        <div className="flex flex-col items-center justify-center text-center">
            <Progress value={progress} />
            <p className="text-foreground mt-2 text-sm font-medium">Uploading...</p>
            <p className="text-muted-foreground mt-1 max-w-xs truncate text-xs">{file.name}</p>
        </div>
    );
}
