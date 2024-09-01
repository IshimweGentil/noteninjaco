import { Icon } from "@iconify/react";
import {SideNavItem} from "./types";
import { title } from "process";

export const SIDENAV_ITEMS: SideNavItem[] = [
    {
        title: "Generate",
        path: "/dashboard/generate",
        icon: <Icon icon="mingcute:ai-line" width="24" height="24" />,  
    },
    {
        title: "Study",
        path: "/dashboard/study",
        icon: <Icon icon="ion:book-outline" width="24" height="24" />,  
    }
]
