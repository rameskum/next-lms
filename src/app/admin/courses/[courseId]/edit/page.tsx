import { adminGetCourse } from "@/app/data/admin/admin-get-course";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import EditCourseForm from "./_components/edit-course";
import CourseStructure from "./_components/course-structure";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type Params = Promise<{
    courseId: string;
}>;

export default async function EditCoursePage({ params }: { params: Params }) {
    const { courseId } = await params;
    const data = await adminGetCourse(courseId);

    return (
        <div>
            <div className="mb-8 flex items-center gap-x-4">
                <Link
                    href="/admin/courses"
                    className={buttonVariants({
                        variant: "outline",
                        size: "icon",
                    })}
                >
                    <ArrowLeft className="size-4" />
                </Link>
                <h1 className="text-3xl font-bold">
                    Edit Course: <span className="text-primary underline">{data.title}</span>
                </h1>
            </div>

            <Tabs defaultValue="basic-info" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
                    <TabsTrigger value="course-structure">Course Structure</TabsTrigger>
                </TabsList>
                <TabsContent value="basic-info">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Info</CardTitle>
                            <CardDescription>Basic information about the course</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <EditCourseForm data={data} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="course-structure">
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Structure</CardTitle>
                            <CardDescription>Here you can update the course structure.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CourseStructure data={data} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
