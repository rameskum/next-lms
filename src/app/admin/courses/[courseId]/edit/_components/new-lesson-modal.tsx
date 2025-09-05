import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { tryCatch } from "@/hooks/try-catch";
import { lessonSchema, LessonSchemaType } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createLesson } from "../actions";

export default function NewLessonModal({ courseId, chapterId }: { courseId: string; chapterId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [pending, startTransition] = useTransition();

    const form = useForm<LessonSchemaType>({
        resolver: zodResolver(lessonSchema as any),
        defaultValues: {
            name: "",
            courseId,
            chapterId,
        },
    });

    async function onSubmit(values: LessonSchemaType) {
        startTransition(async () => {
            const { data: result, error } = await tryCatch(createLesson(values));

            if (error) {
                toast.error("An unexpected error occurred. Please try again.");
                return;
            }

            if (result.status === "error") {
                toast.error(result.message);
                return;
            }

            toast.success(result.message);
            form.reset();
            setIsOpen(false);
        });
    }

    function handleOpenChange(open: boolean) {
        setIsOpen(open);
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-center gap-1">
                    <PlusIcon className="size-4" /> New Lesson
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[425px] md:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Create New Lesson</DialogTitle>
                    <DialogDescription>What would you like to name your lesson?</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Lesson name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button disabled={pending} type="submit">
                                {pending ? "Creating..." : "Save Change"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
