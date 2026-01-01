import {
    Archive,
    Bell,
    Check,
    Clock,
    Image,
    MoreVertical,
    Palette,
    Pin,
    Search,
    User,
    UserPlus,
    X
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ToolButton from "./ToolBtn";
import { Dropdown, DropdownItem } from "./DropDown";
import Button from "./Button";
import api from "../api/axios";
import type { note } from "../pages/notesPage";
import type { Block } from "../pages/notesPage";
import type { ColorOption } from "../layout/NoteCreate";
import axios from "axios";

export interface CardBlock {
    _id: string;
    title: string;
    isPinned?: boolean;
    content: Block[];
}

interface NoteCardProps {
    note: CardBlock
    onEdit: (note: CardBlock) => void;
    onUpdated?: (updatedNote: note) => void;
    onArchived?: (ArchivedNote: note) => void;
    onDelete?: (id: string) => void;
}

interface collaborator {
    user: {
        _id: string;
        username: string;
        email: string;
    };
    permission: "view" | "edit";
}

function NoteCard({
    note,
    onEdit,
    onUpdated,
    onArchived,
    onDelete,
}: NoteCardProps) {
    const [isReminderOpen, setIsReminderOpen] = useState(false);
    const [isCollaboratorOpen, setIsCollaboratorOpen] = useState(false);
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const [isColorOpen, setIsColorOpen] = useState(false);
    const [islabelopen, setIsLabelOpen] = useState(false);
    const [showArchived, setShowArchived] = useState(false);
    const [customReminder, setCustomReminder] = useState(false);
    const [collaborator, setCollaborator] = useState<collaborator[]>([]);
    const [hover, setHover] = useState(false);
    const [collaboratorHover, setCollaboratorHover] = useState<string | null>(null);
    const [isPinned, setIsPinned] = useState(note.isPinned || false);
    const collabInputRef = useRef<HTMLInputElement | null>(null);
    const labelInputRef = useRef<HTMLInputElement | null>(null);
    const [bgColor, setBgColor] = useState("bg-white");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [reminder, setReminder] = useState<string | null>(null);
    const [label, setLabel] = useState<string | null>(null);
    const [isDrawingDropDown, setIsDrawingDropDown] = useState(false);
    const [isListDropDown, setIsListDropDown] = useState(false);

    void label
    void isDrawingDropDown
    void isListDropDown

    const colors: ColorOption[] = [
        { name: 'Default', bgClass: 'bg-white', borderClass: 'border-gray-300', hex: '#ffffff' },
        { name: 'Coral', bgClass: 'bg-[#f28b82]', borderClass: 'border-[#f28b82]', hex: '#f28b82' },
        { name: 'Peach', bgClass: 'bg-[#fbbc04]', borderClass: 'border-[#fbbc04]', hex: '#fbbc04' },
        { name: 'Sand', bgClass: 'bg-[#fff475]', borderClass: 'border-[#fff475]', hex: '#fff475' },
        { name: 'Mint', bgClass: 'bg-[#ccff90]', borderClass: 'border-[#ccff90]', hex: '#ccff90' },
        { name: 'Sage', bgClass: 'bg-[#a7ffeb]', borderClass: 'border-[#a7ffeb]', hex: '#a7ffeb' },
        { name: 'Fog', bgClass: 'bg-[#cbf0f8]', borderClass: 'border-[#cbf0f8]', hex: '#cbf0f8' },
        { name: 'Storm', bgClass: 'bg-[#aecbfa]', borderClass: 'border-[#aecbfa]', hex: '#aecbfa' },
        { name: 'Dusk', bgClass: 'bg-[#d7aefb]', borderClass: 'border-[#d7aefb]', hex: '#d7aefb' },
        { name: 'Blossom', bgClass: 'bg-[#fdcfe8]', borderClass: 'border-[#fdcfe8]', hex: '#fdcfe8' },
        { name: 'Clay', bgClass: 'bg-[#e6c9a8]', borderClass: 'border-[#e6c9a8]', hex: '#e6c9a8' },
        { name: 'Chalk', bgClass: 'bg-[#e8eaed]', borderClass: 'border-[#e8eaed]', hex: '#e8eaed' },
    ];

    const closeAllDropdowns = () => {
        setIsReminderOpen(false);
        setIsCollaboratorOpen(false);
        setIsMoreMenuOpen(false);
        setIsColorOpen(false);
    };

    const handleColorSelect = (color: ColorOption) => {
        setBgColor(color.bgClass);
        setIsColorOpen(false);
    };

    const handleArchive = async () => {
        try {
            const res = await api.put(`/notes/updateNote/${note._id}`, {
                isArchived: true,
            })

            onUpdated?.(res.data.data)
            setShowArchived(true);
            onArchived?.(res.data.data)

            setTimeout(() => setShowArchived(false), 3000);

        } catch (error) {
            console.error("Archive failed:", error);
            alert("Failed to archive note");
        }
    };

    const handlePin = async () => {
        const newState = !isPinned;
        setIsPinned(newState);

        try {
            const res = await api.put(`/notes/updateNote/${note._id}`, {
                isPinned: newState,
            });
            onUpdated?.(res.data.data);
        } catch (error) {
            setIsPinned(!newState);
            console.error("Pin failed:", error);
            alert("Failed to toggle pin status");
        }
    };

    const saveCustomReminder = () => {
        const date = (document.querySelector('input[type="date"]') as HTMLInputElement)?.value;
        const time = (document.querySelector('input[type="time"]') as HTMLInputElement)?.value;

        if (!date || !time) {
            alert("Enter date and time");
            return;
        }
        const format = `${date} at ${time}`;
        setReminder(format);
        setCustomReminder(false);
        setIsReminderOpen(false);
    };

    const saveCollaborator = async (id: string) => {
        if (collabInputRef.current === null) return;
        const email = collabInputRef.current?.value.trim();

        if (!email) {
            alert("Enter a valid email");
            return;
        }

        try {
            const res = await api.post(`/notes/addCollaborator/${id}`, {
                email,
                permission: "edit",
            });

            const updatedNote = res.data.data;
            setCollaborator(updatedNote.collaborators);

            if (collabInputRef.current) {
                collabInputRef.current.value = "";
            }
            setIsCollaboratorOpen(false);
        }
        catch (error) {
            if (axios.isAxiosError(error)) {             
                console.error("ERROR:", error);
                alert("Unexpected frontend error");
            }
        }
    }

    const removeCollaborator = async (userId: string) => {        
        try {
            const res = await api.delete(`/notes/removeCollaborator/${note._id}/${userId}`);

            setCollaborator(res.data.data.collaborators);

        } catch (error) {
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.message || "Failed to remove collaborator");
            } else {
                alert("Failed to remove collaborator");
            }
        }
    };

    useEffect(() => {
        if (!note._id) return;

        api.get(`/notes/collaborators/${note._id}`)
            .then(res => {
                if (res.data.data && Array.isArray(res.data.data)) {
                    setCollaborator(res.data.data);
                } else {
                    setCollaborator([]);
                }
            })
            .catch(err => {
                console.error("Failed to fetch collaborators:", err);
                setCollaborator([]);
            });
    }, [note._id])

    const saveLabel = () => {
        const labeling = labelInputRef.current?.value.trim();
        if (!labeling) {
            alert("enter label");
            return;
        }
        setLabel(labeling);
        setIsLabelOpen(false);
    };

    return (
        <div
            className={`group relative p-4 rounded-lg border border-gray-300 ${bgColor} hover:shadow-lg transition-all duration-200 ${hover ? 'pb-12' : ''}`}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handlePin()
                }}
                className="absolute top-2 right-2 p-1.5 opacity-0 group-hover:opacity-100 hover:bg-gray-100 rounded-full transition-opacity duration-200 z-10"
                title={isPinned ? "Unpin" : "Pin"}
            >
                <Pin
                    size={16}
                    className={`${isPinned ? "fill-gray-700" : ""} text-gray-600`}
                />
            </button>

            {note.title && (
                <h3
                    className="text-base font-medium text-gray-900 mb-3 pr-6 cursor-text"
                    onClick={() => onEdit(note)}
                >
                    {note.title}
                </h3>
            )}

            {collaborator.length > 0 && (
                <div className="flex gap-2 mb-3 flex-wrap">
                    {collaborator.map((collab) => (
                        <div
                            key={collab.user._id}
                            className="relative inline-block"
                            onMouseEnter={() => setCollaboratorHover(collab.user._id)}
                            onMouseLeave={() => setCollaboratorHover(null)}
                        >
                            <div
                                className="inline-flex items-center justify-center w-8 h-8 border border-blue-300 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition cursor-pointer"
                                title={`${collab.user.email} (${collab.permission})`}

                            >
                                <User size={16} />
                            </div>

                            {collaboratorHover === collab.user._id && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeCollaborator(collab.user._id);
                                    }}
                                    className="absolute -top-1 -right-1 bg-white border border-gray-300 rounded-full p-0.5 hover:bg-red-50 hover:border-red-300 transition z-10"
                                    title="Remove collaborator"
                                >
                                    <X size={12} className="text-gray-700" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div
                className="text-sm text-gray-800 space-y-2 cursor-text"
                onClick={() => onEdit(note)}
            >
                {note.content.map((block, index) => {
                    if (block.type === "paragraph") {
                        return (
                            <p key={index} className="leading-relaxed">
                                {block.text}
                            </p>
                        );
                    }

                    if (block.type === "list") {
                        return (
                            <ul key={index} className="list-disc ml-5 space-y-1">
                                {block.listItems?.map((item, i) => (
                                    <li key={i} className="leading-relaxed">{item}</li>
                                ))}
                            </ul>
                        );
                    }

                    if (block.type === "image" || block.type === "drawing") {
                        return (
                            <img
                                key={index}
                                src={block.url}
                                alt=""
                                className="rounded-lg w-full object-cover mt-3"
                            />
                        );
                    }

                    return null;
                })}
            </div>

            {reminder && (
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                    <Clock size={14} />
                    <span>{reminder}</span>
                </div>
            )}

            {hover && (
                <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 rounded-b-lg p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="flex items-center gap-3">

                        <div className="relative">
                            <ToolButton
                                icon={Palette}
                                onClick={() => {
                                    closeAllDropdowns();
                                    setIsColorOpen(!isColorOpen);
                                }}
                                label="Background options"
                            />

                            {isColorOpen && (
                                <Dropdown onClose={() => setIsColorOpen(false)}>
                                    <div className="p-3 min-w-[280px]">
                                        <h3 className="text-sm text-gray-700 mb-3">Background color</h3>
                                        <div className="grid grid-cols-5 gap-2">
                                            {colors.map((color) => (
                                                <button
                                                    key={color.name}
                                                    onClick={() => handleColorSelect(color)}
                                                    className={`w-12 h-12 rounded-full ${color.bgClass} border-2 ${bgColor === color.bgClass
                                                        ? 'border-blue-500 ring-2 ring-blue-300'
                                                        : 'border-gray-300 hover:border-gray-400'
                                                        } transition-all hover:scale-110 flex items-center justify-center`}
                                                    title={color.name}
                                                >
                                                    {bgColor === color.bgClass && (
                                                        <Check
                                                            size={18}
                                                            className={
                                                                color.name === 'Default'
                                                                    ? 'text-blue-500'
                                                                    : 'text-gray-800'
                                                            }
                                                            strokeWidth={3}
                                                        />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </Dropdown>
                            )}
                        </div>

                        <div className="relative">
                            <ToolButton
                                icon={Bell}
                                onClick={() => {
                                    closeAllDropdowns();
                                    setIsReminderOpen(!isReminderOpen);
                                }}
                                label="Remind me"
                            />

                            {isReminderOpen && (
                                <Dropdown onClose={() => {
                                    setIsReminderOpen(false);
                                    setCustomReminder(false);
                                }}>
                                    <div className="p-3 min-w-[280px]">
                                        <h3 className="text-sm text-gray-700 mb-2">Remind me</h3>
                                        <p className="text-xs text-gray-500 mb-3">Saved in Google Reminders</p>

                                        {reminder === null && !customReminder ? (
                                            <div className="space-y-1">
                                                <DropdownItem
                                                    icon={Clock}
                                                    onClick={() => {
                                                        setReminder("Today, 8:00 PM");
                                                        setIsReminderOpen(false);
                                                    }}
                                                >
                                                    Today, 8:00 PM
                                                </DropdownItem>

                                                <DropdownItem
                                                    icon={Clock}
                                                    onClick={() => {
                                                        setReminder("Tomorrow, 8:00 AM");
                                                        setIsReminderOpen(false);
                                                    }}
                                                >
                                                    Tomorrow, 8:00 AM
                                                </DropdownItem>

                                                <DropdownItem
                                                    icon={Clock}
                                                    onClick={() => {
                                                        setReminder("Next week, Mon 8:00 AM");
                                                        setIsReminderOpen(false);
                                                    }}
                                                >
                                                    Next week, Mon 8:00 AM
                                                </DropdownItem>
                                                <DropdownItem
                                                    icon={Clock}
                                                    onClick={() => setCustomReminder(true)}
                                                >
                                                    Pick date & time
                                                </DropdownItem>
                                            </div>
                                        ) : customReminder ? (
                                            <div className="space-y-3 mt-2">
                                                <h2 className="text-sm font-semibold text-gray-700">Pick date & time</h2>

                                                <input
                                                    type="date"
                                                    className="w-full border rounded-md px-3 py-2 text-sm outline-none bg-white focus:ring-2 focus:ring-blue-400 hover:border-gray-400 transition"
                                                />

                                                <select
                                                    className="w-full border rounded-md px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-400 hover:border-gray-400 transition cursor-pointer"
                                                    defaultValue="none"
                                                >
                                                    <option value="Morning">Morning</option>
                                                    <option value="Afternoon">Afternoon</option>
                                                    <option value="Evening">Evening</option>
                                                    <option value="Night">Night</option>
                                                    <option value="All day">All day</option>
                                                    <option value="Custom">Custom</option>
                                                </select>

                                                <select
                                                    className="w-full border rounded-md px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-400 hover:border-gray-400 transition cursor-pointer"
                                                    defaultValue="none"
                                                >
                                                    <option value="none">Does not repeat</option>
                                                    <option value="daily">Daily</option>
                                                    <option value="monthly">Monthly</option>
                                                    <option value="yearly">Yearly</option>
                                                </select>

                                                <div className="flex gap-2">
                                                    <Button
                                                        onClick={() => setCustomReminder(false)}
                                                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-md transition"
                                                    >
                                                        Back
                                                    </Button>
                                                    <Button
                                                        onClick={saveCustomReminder}
                                                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition"
                                                    >
                                                        Save
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mt-2 space-y-2">
                                                <div className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                                                    {reminder}
                                                </div>
                                                <Button
                                                    onClick={() => {
                                                        setReminder(null);
                                                        setIsReminderOpen(false);
                                                    }}
                                                    className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md transition"
                                                >
                                                    Clear Reminder
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </Dropdown>
                            )}
                        </div>

                        <div className="relative">
                            <ToolButton
                                icon={UserPlus}
                                onClick={() => {
                                    closeAllDropdowns();
                                    setIsCollaboratorOpen(!isCollaboratorOpen);
                                }}
                                label="Collaborator"
                            />

                            {isCollaboratorOpen && (
                                <Dropdown onClose={() => setIsCollaboratorOpen(false)}>
                                    <div className="p-4 min-w-[320px]">
                                        <h3 className="text-sm text-gray-700 mb-3">Collaborators</h3>

                                        <div className="flex items-center gap-2 mb-3">
                                            <User size={20} className="text-gray-600" />
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-800">You (Owner)</p>
                                                <p className="text-xs text-gray-500">username123@gmail.com</p>
                                            </div>
                                        </div>

                                        {collaborator.length > 0 && (
                                            <div className="mb-3 space-y-2">
                                                {collaborator.map((collab) => (
                                                    <div key={collab.user._id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                                        <User size={18} className="text-blue-600" />
                                                        <div className="flex-1">
                                                            <p className="text-sm text-gray-800">{collab.user.username}</p>
                                                            
                                                            <p className="text-xs text-gray-500">{collab.user.email}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => removeCollaborator(collab.user._id)}
                                                            className="text-gray-400 hover:text-red-500 transition"
                                                            title="Remove"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2 border-t pt-3">
                                            <UserPlus size={20} className="text-gray-600" />
                                            <input
                                                ref={collabInputRef}
                                                type="email"
                                                placeholder="Person or email to share with"
                                                className="flex-1 text-sm outline-none"
                                            />
                                        </div>

                                        <div className="flex justify-end gap-2 mt-4">
                                            <button
                                                onClick={() => setIsCollaboratorOpen(false)}
                                                className="px-4 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => saveCollaborator(note._id)}
                                                className="px-4 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </Dropdown>
                            )}
                        </div>

                        <ToolButton
                            icon={Image}
                            onClick={() => fileInputRef.current?.click()}
                            label="Add image"
                        />

                        <ToolButton
                            icon={Archive}
                            onClick={handleArchive}
                            label="Archive"
                        />

                        <div className="relative">
                            <ToolButton
                                icon={MoreVertical}
                                onClick={() => {
                                    closeAllDropdowns();
                                    setIsMoreMenuOpen(!isMoreMenuOpen);
                                }}
                                label="More"
                            />

                            {isMoreMenuOpen && (
                                <Dropdown onClose={() => setIsMoreMenuOpen(false)}>
                                    <div className="py-2 min-w-[200px]">
                                        <DropdownItem
                                            onClick={() => onDelete?.(note._id)}
                                        >
                                            Delete note
                                        </DropdownItem>

                                        <DropdownItem onClick={() => setIsLabelOpen(!islabelopen)}>
                                            Add label
                                        </DropdownItem>

                                        {islabelopen && (
                                            <div className="p-4 border border-gray-200 rounded-lg bg-white mt-2 w-72 shadow-lg">
                                                <h1 className="text-sm font-medium text-gray-800 mb-3">Label note</h1>

                                                <div className="relative mb-3">
                                                    <input
                                                        ref={labelInputRef}
                                                        type="text"
                                                        placeholder="Enter label name"
                                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                                    />
                                                    <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded-full transition-colors">
                                                        <Search size={16} />
                                                    </button>
                                                </div>

                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setIsLabelOpen(false);
                                                            setLabel(null);
                                                        }}
                                                        className="text-sm font-medium px-2 py-2 text-gray-700 rounded hover:bg-gray-100 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={saveLabel}
                                                        className="text-sm font-medium px-2 py-2 text-gray-700 rounded hover:bg-gray-100 transition-colors"
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        <DropdownItem
                                            onClick={() => setIsDrawingDropDown(true)}>
                                            Add drawing
                                        </DropdownItem>

                                        <DropdownItem>Make a copy</DropdownItem>

                                        <DropdownItem
                                            onClick={() => setIsListDropDown(true)}>
                                            Show checkboxes
                                        </DropdownItem>

                                        <DropdownItem>Copy to Google Docs</DropdownItem>
                                        <DropdownItem>Version history</DropdownItem>
                                    </div>
                                </Dropdown>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showArchived && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm px-6 py-3 rounded shadow-xl z-50 animate-fade-in">
                    Note archived
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
            />
        </div>
    );
}

export default NoteCard;