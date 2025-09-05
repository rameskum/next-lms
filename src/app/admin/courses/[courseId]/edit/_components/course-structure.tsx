"use client";
import { AdminCourseSingularType } from "@/app/data/admin/admin-get-course";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import {
    DndContext,
    DraggableSyntheticListeners,
    KeyboardSensor,
    PointerSensor,
    rectIntersection,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    ChevronDownIcon,
    ChevronRightIcon,
    ChevronUpIcon,
    FileTextIcon,
    GripVerticalIcon,
    Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";
import { id } from "zod/v4/locales";
import { reorderLessons } from "../actions";

interface CourseStructureProps {
    data: AdminCourseSingularType;
}

interface SortableItemProps {
    id: string;
    children: (listeners: DraggableSyntheticListeners) => React.ReactNode;
    className?: string;
    data?: {
        type: "chapter" | "lesson";
        chapterId?: string; // only relevant for lessons
    };
}

export default function CourseStructure({ data }: CourseStructureProps) {
    const initialItems =
        data.chapter.map((chapter) => ({
            id: chapter.id,
            title: chapter.title,
            order: chapter.position,
            isOpen: true, // default open
            lessons: chapter.lesson.map((lesson) => ({
                id: lesson.id,
                title: lesson.title,
                order: lesson.position,
            })),
        })) || [];

    const [items, setItems] = useState(initialItems);

    function SortableItem({ id, children, className, data }: SortableItemProps) {
        const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
            id: id,
            data: data,
        });

        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
        };

        return (
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                className={cn("touch-none", className, isDragging && "z-10")}
            >
                {children(listeners)}
            </div>
        );
    }

    function handleDragEnd(event) {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const activeId = active.id;
        const overId = over.id;
        const activeType = active.data.current?.type as "chapter" | "lesson";
        const overType = over.data.current?.type as "chapter" | "lesson";
        const courseId = data.id;

        if (activeType == "chapter") {
            let targetChapterId = null;

            if (overType == "chapter") {
                targetChapterId = overId;
            } else if (overType == "lesson") {
                targetChapterId = over.data.current?.chapterId;
            }

            if (!targetChapterId) {
                toast.error("Could not determine the chapter for reordering");
                return;
            }

            const oldIndex = items.findIndex((item) => item.id === activeId);
            const newIndex = items.findIndex((item) => item.id === targetChapterId);

            if (oldIndex === -1 || newIndex === -1) {
                toast.error("Could not determine the chapter for reordering");
                return;
            }

            const reorderedLocalChapter = arrayMove(items, oldIndex, newIndex);
            const updatedChapterForState = reorderedLocalChapter.map((chapter, index) => ({
                ...chapter,
                order: index + 1,
            }));

            const previousItems = [...items];

            setItems(updatedChapterForState);
        }

        if (activeType == "lesson" && overType == "lesson") {
            const chapterId = active.data.current?.chapterId;
            const overChapterId = over.data.current?.chapterId;

            if (!chapterId || chapterId !== overChapterId) {
                toast.error("Lessons can only be reordered within the same chapter");
                return;
            }

            const chapterIndex = items.findIndex((chapter) => chapter.id === chapterId);
            if (chapterIndex == -1) {
                toast.error("Could not determine the chapter for reordering");
                return;
            }

            const chapterToUpdate = items[chapterIndex];
            const oldLessonIndex = chapterToUpdate.lessons.findIndex((lesson) => lesson.id === activeId);
            const newLessonIndex = chapterToUpdate.lessons.findIndex((lesson) => lesson.id === overId);

            if (oldLessonIndex === -1 || newLessonIndex === -1) {
                toast.error("Could not determine the lesson for reordering");
                return;
            }

            const reorderedLocalLessons = arrayMove(chapterToUpdate.lessons, oldLessonIndex, newLessonIndex);
            const updatedLessonForState = reorderedLocalLessons.map((lesson, index) => ({
                ...lesson,
                order: index + 1,
            }));

            const newItems = [...items];
            newItems[chapterIndex] = {
                ...chapterToUpdate,
                lessons: updatedLessonForState,
            };

            const previousItems = [...items];

            setItems(newItems);

            if (courseId) {
                const lessonsToUpdate = updatedLessonForState.map((lesson) => ({
                    id: lesson.id,
                    position: lesson.order,
                }));

                const reorderLessonPromise = () => reorderLessons(chapterId, lessonsToUpdate, courseId);

                toast.promise(reorderLessonPromise, {
                    loading: "Reordering lessons...",
                    success: (result) => {
                        if (result.status === "success") return result.message;
                        throw new Error(result.message);
                    },
                    error: (error) => {
                        setItems(previousItems);
                        return error.message;
                    },
                });
            }

            return;
        }
    }

    function toggleChapter(chapterId: string) {
        setItems(
            items.map((item) => {
                if (item.id === chapterId) {
                    return {
                        ...item,
                        isOpen: !item.isOpen,
                    };
                }
                return item;
            })
        );
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    return (
        <DndContext collisionDetection={rectIntersection} onDragEnd={handleDragEnd} sensors={sensors}>
            <Card>
                <CardHeader className="border-border flex flex-row items-center justify-between border-b">
                    <CardTitle>Chapters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    <SortableContext strategy={verticalListSortingStrategy} items={items}>
                        {items.map((item) => (
                            <SortableItem key={item.id} id={item.id} data={{ type: "chapter" }}>
                                {(listeners) => (
                                    <Card>
                                        <Collapsible
                                            open={item.isOpen}
                                            onOpenChange={() => {
                                                toggleChapter(item.id);
                                            }}
                                        >
                                            <div className="border-border flex items-center justify-between border-b p-3">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="cursor-grab opacity-60 hover:opacity-100"
                                                        {...listeners}
                                                    >
                                                        <GripVerticalIcon className="size-4" />
                                                    </Button>
                                                    <CollapsibleTrigger asChild>
                                                        <Button size="icon" variant="ghost">
                                                            {item.isOpen ? (
                                                                <ChevronDownIcon className="size-4" />
                                                            ) : (
                                                                <ChevronRightIcon className="size-4" />
                                                            )}
                                                        </Button>
                                                    </CollapsibleTrigger>
                                                    <p className="hover:text-primary cursor-pointer pl-2">
                                                        {item.title}
                                                    </p>
                                                </div>
                                                <Button size="icon" variant="outline">
                                                    <Trash2Icon className="size-4" />
                                                </Button>
                                            </div>
                                            <CollapsibleContent>
                                                <div className="p-1">
                                                    <SortableContext
                                                        items={item.lessons.map((lesson) => lesson.id)}
                                                        strategy={verticalListSortingStrategy}
                                                    >
                                                        {item.lessons.map((lesson) => (
                                                            <SortableItem
                                                                key={lesson.id}
                                                                id={lesson.id}
                                                                data={{ type: "lesson", chapterId: item.id }}
                                                            >
                                                                {(lessonListeners) => (
                                                                    <div className="hover:bg-accent flex items-center justify-between rounded-sm p-2">
                                                                        <div className="flex items-center gap-2">
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                {...lessonListeners}
                                                                            >
                                                                                <GripVerticalIcon className="size-4" />
                                                                            </Button>
                                                                            <FileTextIcon className="size-4" />
                                                                            <Link
                                                                                href={`/admin/courses/${data.id}/${item.id}/${lesson.id}`}
                                                                            >
                                                                                {lesson.title}
                                                                            </Link>
                                                                        </div>
                                                                        <Button variant="outline" size="icon">
                                                                            <Trash2Icon className="size-4" />
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                            </SortableItem>
                                                        ))}
                                                    </SortableContext>
                                                    <div className="p-2">
                                                        <Button variant="outline" className="w-full">
                                                            Create New Lesson
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    </Card>
                                )}
                            </SortableItem>
                        ))}
                    </SortableContext>
                </CardContent>
            </Card>
        </DndContext>
    );
}
function setItems(arg0: (items: any) => any) {
    throw new Error("Function not implemented.");
}
