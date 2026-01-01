import {
    BellIcon,
    FolderDownIcon,
    Lightbulb,
    PencilIcon,
    Trash2,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

function Dashboard({ isOpen }:{ isOpen: boolean }) {
    const [isHovered, setIsHovered] = useState(false);

    const sidebarItems = [
        { icon: Lightbulb, label: "Notes", path: "/notes" },
        { icon: BellIcon, label: "Reminders", path: "/reminders" },
        { icon: PencilIcon, label: "Edit Labels", path: "/labels" },
        { icon: FolderDownIcon, label: "Archive", path: "/archive" },
        { icon: Trash2, label: "Trash", path: "/trash" },
    ];

    return (

        <div className="flex">
            
            <aside
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`bg-white border-r border-gray-200 h-screen transition-all duration-300
          ${isOpen || isHovered ? "w-64" : "w-20"}`}
            >
                <nav className="py-2">

                    {sidebarItems.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <Link
                                to={item.path}
                                key={index}
                                className="w-full flex items-center gap-4 px-6 py-3 hover:bg-gray-200 rounded-r-full transition-all duration-200 group"
                            >
                                <Icon
                                    size={20}
                                    className="text-gray-600 group-hover:text-gray-800 transition-colors shrink-0"
                                />
                                {(isOpen || isHovered) && (
                                    <h2 className="text-sm font-medium text-gray-700 group-hover:text-gray-900 whitespace-nowrap">
                                        {item.label}
                                    </h2>
                                )}
                            </Link>
                        )
                    })}
                </nav>
            </aside>
        </div>
    );
}

export default Dashboard;
