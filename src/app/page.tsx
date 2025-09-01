import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

export default function Home() {
    return (
        <div className="p-4 pt-2">
            <Button variant="default" size="default">
                Welcome button!
            </Button>
            <ModeToggle />
        </div>
    );
}
