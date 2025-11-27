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
} from "lucide-react";
import Button from "./Button.tsx";

interface ColorOption {
    name: string;
    bgClass: string;
    borderClass: string;
    hex: string;
}

interface NoteDownProps {
    onClose: () => void;
    bgColor: string;
    setBgColor: React.Dispatch<React.SetStateAction<string>>;
    isPinned: boolean;
    setIsPinned: React.Dispatch<React.SetStateAction<boolean>>;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    editorRef: React.RefObject<HTMLDivElement | null>;
    history: string[];
    setHistory: React.Dispatch<React.SetStateAction<string[]>>;
    historyIndex: number;
    setHistoryIndex: React.Dispatch<React.SetStateAction<number>>;
    handleUndo: () => void;
    handleRedo: () => void;
    reminder: string | null;
    setReminder: (r: string | null) => void;
    collaborator: string | null;
    setCollaborator: (r: string | null) => void;
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
    collaborator: _collaborator,
    setCollaborator,
    historyIndex,
    handleUndo,
    handleRedo
}: NoteDownProps) {
    void _collaborator;
    const [isReminderOpen, setIsReminderOpen] = useState(false);
    const [isCollaboratorOpen, setIsCollaboratorOpen] = useState(false);
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const [isTextFormatOpen, setIsTextFormatOpen] = useState(false);
    const [isColorOpen, setIsColorOpen] = useState(false);
    const [showArchived, setShowArchived] = useState(false);
    const [customReminder, setCustomReminder] = useState(false);
    const collabInputRef = useRef<HTMLInputElement | null>(null);


    const colors: ColorOption[] = [
        { name: 'Default', bgClass: 'bg-black', borderClass: 'border-gray-300', hex: '#000000' },
        { name: 'Red', bgClass: 'bg-red-500', borderClass: 'border-red-600', hex: '#ff5252' },
        { name: 'Orange', bgClass: 'bg-orange-500', borderClass: 'border-orange-600', hex: '#ffbc00' },
        { name: 'Yellow', bgClass: 'bg-yellow-500', borderClass: 'border-yellow-600', hex: '#fef9c3' },
        { name: 'Green', bgClass: 'bg-green-500', borderClass: 'border-green-600', hex: '#00c853' },
        { name: 'Blue', bgClass: 'bg-blue-500', borderClass: 'border-blue-600', hex: '#00b0ff' },
        { name: 'Purple', bgClass: 'bg-purple-500', borderClass: 'border-purple-600', hex: '#d500f9' },
        { name: 'Gray', bgClass: 'bg-gray-500', borderClass: 'border-gray-600', hex: '#8d6e63' },
        { name: 'White', bgClass: 'bg-white', borderClass: 'border-gray-300', hex: '#ffffff' },
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
        setShowArchived(true);
        setTimeout(() => {
            setShowArchived(false);
            onClose();
        }, 2000);
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
        

        setCollaborator(email);
        collabInputRef.current.value = ''
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
                                                <Check size={18} className="text-gray-700" />
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
                <ToolButton icon={Archive} onClick={handleArchive} label="Archive" />

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
                                <DropdownItem>Delete note</DropdownItem>
                                <DropdownItem>Add label</DropdownItem>
                                <DropdownItem>Add drawing</DropdownItem>
                                <DropdownItem>Make a copy</DropdownItem>
                                <DropdownItem>Show checkboxes</DropdownItem>
                                <DropdownItem>Copy to Google Docs</DropdownItem>
                                <DropdownItem>Version history</DropdownItem>
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
                    className="text-sm text-gray-700 hover:bg-gray-100 hover:bg-opacity-10 px-4 py-1.5 rounded transition-colors ml-52"
                >
                    Close
                </button>
            </div>

            {showArchived && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm px-6 py-3 rounded shadow-xl z-50 animate-fade-in">
                    Note archived
                </div>
            )}
        </>
    );
}

export default NoteDown;