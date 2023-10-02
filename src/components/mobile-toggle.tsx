"use client";

import { Menu } from "lucide-react";

import { Button } from "./ui/button";
import { Sheet, SheetTrigger, SheetContent } from "./ui/sheet";
import NavigationSidebar from "./navigation/navigation-sidebar";
import { useUser } from "@/store/user-details";
import ServerSidebar from "./server/server-sidebar";

// export const sheetIsOpen = signal(false);

export const MobileToggle = ({
    serverId,
    profileId
}: {
    serverId: string;
    profileId: string;
}) => {
    // const clickHandler = () => {
    //     sheetIsOpen.value = true;
    // };
    return (
        <Sheet
        // open={sheetIsOpen.value}
        //  onOpenChange={(open) => sheetIsOpen.value = open}
        >
            <SheetTrigger asChild >
                <Button variant="ghost" size="icon" className="md:hidden"
                // onClick={clickHandler}
                >
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent
                side="left"
                className="p-0 flex gap-0"
                onOpenAutoFocus={(e) => { e.preventDefault(); }}
            // forceMount={true}
            >
                <div className="w-[72px]">
                    <NavigationSidebar profileId={profileId} />
                </div>
                <ServerSidebar serverId={serverId} profileId={profileId} />
            </SheetContent>
        </Sheet>
    );
};