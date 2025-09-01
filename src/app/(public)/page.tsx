import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface featureProps {
    title: string;
    description: string;
    icon: string;
}

const features: featureProps[] = [
    {
        title: "Interactive Courses",
        description:
            "Engage with dynamic content, quizzes, and assignments designed to enhance your learning experience.",
        icon: "📕",
    },
    {
        title: "Progress Tracking",
        description: "Monitor your learning journey with detailed progress reports and analytics.",
        icon: "📈",
    },
    {
        title: "Community Support",
        description: "Join a vibrant community of learners and educators to share knowledge and collaborate.",
        icon: "🤝",
    },
    {
        title: "Mobile Access",
        description: "Learn on the go with our fully responsive platform, accessible from any device.",
        icon: "📱",
    },
];

export default function Home() {
    return (
        <>
            <section className="relative py-20">
                <div className="flex flex-col items-center space-y-8 text-center">
                    <Badge variant="outline">The future of Online Education</Badge>
                    <h1 className="text-4xl font-bold tracking-tight md:text-6xl">Elevate your learning experience</h1>
                    <p className="text-muted-foreground max-w-[700px] md:text-xl">
                        Discover new way to learn with our modern, interactive learning management system. Access
                        high-quality courses anytime, anywhere
                    </p>
                    <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                        <Link
                            href="/courses"
                            className={buttonVariants({
                                size: "lg",
                            })}
                        >
                            Explore Courses
                        </Link>
                        <Link
                            href="/login"
                            className={buttonVariants({
                                variant: "outline",
                                size: "lg",
                            })}
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>
            <section className="mb-32 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {features.map((feature) => (
                    <Card key={feature.title} className="transition-shadow hover:shadow-lg">
                        <CardHeader>
                            <div className="mb-4 text-4xl">{feature.icon}</div>
                            <CardTitle>{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </section>
        </>
    );
}
