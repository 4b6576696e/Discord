import { ShieldAlert, ShieldCheck } from "lucide-react";

export const roleIconMap = {
    "ADMIN": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
    "MOD": <ShieldAlert className="h-4 w-4 text-rose-500" />,
    "GUEST": null
};