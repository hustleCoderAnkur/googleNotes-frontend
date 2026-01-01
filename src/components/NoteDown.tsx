import { useEffect, useRef, useState } from "react";
import { Dropdown, DropdownItem } from "./DropDown.tsx";
import FormatButton from "./fromatBtn.tsx";
import ToolButton from "./ToolBtn.tsx";
import {
    Bell,
    Clock,
    MoreVertical,
    Archive,
    Image,
    Palette,
    Redo2,
    Undo2,
    User,
    UserPlus,
    Type,
    Bold,
    Italic,
    Underline,
    RemoveFormatting,
    Check,
    Search,
} from "lucide-react";
import Button from "./Button.tsx";
import type { note } from "../pages/notesPage.tsx";

interface ColorOption {
    name: string;
    bgClass: string;
    borderClass: string;
    hex: string;
}

interface NoteDownProps {
    note?:note,
    editorRef: React.RefObject<HTMLDivElement | null>;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    onClose: () => void;
    bgColor: string;
    setBgColor: React.Dispatch<React.SetStateAction<string>>;
    isPinned: boolean;
    isArchived: boolean;
    setIsPinned: React.Dispatch<React.SetStateAction<boolean>>;
    setIsArchived: React.Dispatch<React.SetStateAction<boolean>>;
    history: string[];
    historyIndex: number;
    setHistory: React.Dispatch<React.SetStateAction<string[]>>;
    setHistoryIndex: React.Dispatch<React.SetStateAction<number>>;
    isDrawingDropDown: boolean;
    isListDropDown: boolean;
    setIsDrawingDropDown: React.Dispatch<React.SetStateAction<boolean>>;
    setIsListDropDown: React.Dispatch<React.SetStateAction<boolean>>;
    handleUndo: () => void;
    handleRedo: () => void;
    reminder: string | null;
    setReminder: (r: string | null) => void;
    collaborator: string | null;
    setCollaborator: (r: string | null) => void;
    label: string | null;
    setLabel: (r: string | null) => void;
    onUpdated?: (updatedNote: note) => void;
}

function NoteDown({
    onClose,
    bgColor,
    setBgColor,
    fileInputRef,
    editorRef,
    history,
    reminder,
    setReminder,
    isArchived,
    setIsArchived,
    // collaborator
    setCollaborator,
    label,
    setLabel,
    historyIndex,
    handleUndo,
    handleRedo,
    isDrawingDropDown,
    setIsDrawingDropDown,
    isListDropDown,
    setIsListDropDown,
    // onUpdated
}: NoteDownProps) {
    void label;
    void isArchived;
    void isDrawingDropDown;
    void isListDropDown;
    const [isReminderOpen, setIsReminderOpen] = useState(false);
    const [isCollaboratorOpen, setIsCollaboratorOpen] = useState(false);
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const [isTextFormatOpen, setIsTextFormatOpen] = useState(false);
    const [isColorOpen, setIsColorOpen] = useState(false);
    const [islabelopen, setIsLabelOpen] = useState(false)
    const [customReminder, setCustomReminder] = useState(false);
    const collabInputRef = useRef<HTMLInputElement | null>(null);
    const labelInputRef = useRef<HTMLInputElement | null>(null);
    
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
        setIsTextFormatOpen(false);
        setIsColorOpen(false);
    };

    const handleColorSelect = (color: ColorOption) => {
        setBgColor(color.bgClass);
        setIsColorOpen(false);
    };

    const handleArchive = () => {
        setIsArchived(prev => !prev);  
    };

    const apply = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
    };

    useEffect(() => {
        document.execCommand("defaultParagraphSeparator", false, "p");
    }, []);

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

    const saveCollaborator = () => {
        if (collabInputRef.current === null) return
        const email = collabInputRef.current?.value.trim();

        if (!email) {
            alert("Enter a valid email");
            return
        }
        setCollaborator(email)
        
        if (collabInputRef.current) {
            collabInputRef.current.value = "";
        }
        
    }
    


    const saveLabel = () => {
        const labeling = labelInputRef.current?.value.trim()
        if (!labeling) {
            alert("enter label");
            return
        }
        setLabel(labeling)
    }

    return (
        <>
            <div className="flex items-center gap-1">
                <div className="relative">
                    <ToolButton
                        icon={Type}
                        onClick={() => {
                            closeAllDropdowns();
                            setIsTextFormatOpen(!isTextFormatOpen);
                        }}
                        label="Text formatting"
                    />

                    {isTextFormatOpen && (
                        <Dropdown onClose={() => setIsTextFormatOpen(false)}>
                            <div className="p-2">
                                <div className="flex items-center gap-1">
                                    <FormatButton
                                        onClick={() => apply("bold")}
                                        icon={Bold}
                                        label="Bold"
                                    />
                                    <FormatButton
                                        onClick={() => apply("italic")}
                                        icon={Italic}
                                        label="Italic"
                                    />
                                    <FormatButton
                                        onClick={() => apply("underline")}
                                        icon={Underline}
                                        label="Underline"
                                    />
                                    <FormatButton
                                        onClick={() => apply("removeFormat")}
                                        icon={RemoveFormatting}
                                        label="Remove formatting"
                                    />
                                </div>
                            </div>
                        </Dropdown>
                    )}
                </div>

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
                                            <option className="py-2 px-3 hover:bg-blue-50 bg-white text-gray-700 " value="Morning">Morning</option>
                                            <option className="py-2 px-3 hover:bg-blue-50 bg-white text-gray-700 " value="Afternoon">Afternoon</option>
                                            <option className="py-2 px-3 hover:bg-blue-50 bg-white text-gray-700 " value="Evening">Evening</option>
                                            <option className="py-2 px-3 hover:bg-blue-50 bg-white text-gray-700 " value="Night">Night</option>
                                            <option className="py-2 px-3 hover:bg-blue-50 bg-white text-gray-700 " value="All day">All day</option>
                                            <option className="py-2 px-3 hover:bg-blue-50 bg-white text-gray-700 " value="Custom">Custom</option>
                                        </select>
                                        <select
                                            className="w-full border rounded-md px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-400 hover:border-gray-400 transition cursor-pointer"
                                            defaultValue="none"
                                        >
                                            <option className="py-2 px-3 hover:bg-blue-50 bg-white text-gray-700" value="none">Does not repeat</option>
                                            <option className="py-2 px-3 hover:bg-blue-50 bg-white text-gray-700" value="daily">Daily</option>
                                            <option className="py-2 px-3 hover:bg-blue-50 bg-white text-gray-700" value="monthly">Monthly</option>
                                            <option className="py-2 px-3 hover:bg-blue-50 bg-white text-gray-700" value="yearly">Yearly</option>
                                        </select>

                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => {
                                                    setCustomReminder(false);
                                                }}
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
                                        <p className="text-xs text-gray-500">username123@.com</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 border-t pt-3 cursor-pointer">
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
                                        onClick={() => {
                                            saveCollaborator();
                                            setIsCollaboratorOpen(false);
                                        }}
                                        className="px-4 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
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
                    onClick={() => {handleArchive()}}
                    label="Archive" />

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

                                <DropdownItem onClick={() => setIsLabelOpen(!islabelopen)}
                                >Add label</DropdownItem>
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
                                    onClick={() => setIsDrawingDropDown(true)}
                                >Add drawing
                                </DropdownItem>
                                {/* <DropdownItem>Make a copy</DropdownItem> */}
                                <DropdownItem
                                    onClick={() => setIsListDropDown(true)}
                                >Show checkboxes</DropdownItem>
                                {/* <DropdownItem>Copy to Google Docs</DropdownItem> */}
                                {/* <DropdownItem>Version history</DropdownItem> */}
                            </div>
                        </Dropdown>
                    )}
                </div>

                <ToolButton
                    icon={Undo2}
                    onClick={handleUndo}
                    disabled={historyIndex === 0}
                    label="Undo (Ctrl+Z)"
                />
                <ToolButton
                    icon={Redo2}
                    onClick={handleRedo}
                    disabled={historyIndex >= history.length - 1}
                    label="Redo (Ctrl+Y)"
                />

                <button
                    onClick={onClose}
                    className="text-sm text-gray-800 hover:bg-gray-100 hover:bg-opacity-10 font-medium px-4 py-1.5 rounded transition-colors ml-38"
                >
                    Close
                </button>
            </div>

            {isArchived && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm px-6 py-3 rounded shadow-xl z-50 animate-fade-in">
                    Note will be archived
                </div>
            )}
        
        </>
    );
}

export default NoteDown;