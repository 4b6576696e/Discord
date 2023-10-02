import { AlertTriangle } from "lucide-react";

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";

export function AlertDestructive({ message }: { message: string; }) {
    return (
        <Alert variant="destructive">
            <AlertTriangle className="h-[4.5] w-[4.5" />
            {/* <br /> */}
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
                {message}
            </AlertDescription>
        </Alert>
    );
}
