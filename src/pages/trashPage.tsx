import { useEffect, useState } from "react";
import api from "../api/axios";
import type { note } from "./notesPage";
import ToolButton from "../components/ToolBtn";
import { Trash2, RotateCcw } from "lucide-react";
import Button from "../components/Button";

function TrashPage() {
    const [trash, setTrash] = useState<note[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkTrash = async () => {
            try {
                const res = await api.get("/notes/trashNote");
                setTrash(res.data.data);
            } catch (error) {
                console.error("Failed to fetch trash notes", error);
            } finally {
                setLoading(false);
            }
        };
        checkTrash();
    }, []);

    const handleDelete = async (noteId: string) => {
        try {
            await api.delete(`/notes/permanentDelete/${noteId}`);
            setTrash(prev => prev.filter(note => note._id !== noteId));
        } catch (error) {
            console.error("Failed to delete note permanently", error);
            alert("Failed to delete note");
        }
    };
    const handleEmptyTrash = async () => {
        try {
            await api.delete("/notes/emptyTrash");
            setTrash([]);
        } catch (error) {
            console.error("Failed to empty trash", error);
            alert("Failed to empty trash");
        }
    };

    const handleRestore = async (noteId: string) => {
        try {
            await api.put(`/notes/restoreNote/${noteId}`);
            setTrash(prev => prev.filter(note => note._id !== noteId));
        } catch (error) {
            console.error("Failed to restore note", error);
            alert("Failed to restore note");
        }
    };

    if (loading) return <p className="text-center text-gray-600 mt-10">Loading trash...</p>;

    return (
        <div className="w-full px-4 py-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-center pb-10 relative">
                    <p className="text-lg text-gray-500">
                        Notes in Trash are deleted after 7 days
                    </p>

                    {trash.length !== 0 && (
                        <Button
                            onClick={handleEmptyTrash}
                            className="absolute right-0 text-blue-500 hover:text-blue-600 hover:bg-blue-100 font-medium px-4 py-2 rounded-lg transition-colors duration-200"
                        >
                            Empty Trash
                        </Button>
                    )}
                </div>

                {trash.length === 0 ? (
                    <div className="text-center py-16">
                        <Trash2 size={52} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-600">Trash is empty</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {trash.map(note => (
                            <div
                                key={note._id}
                                className="group relative rounded-lg border border-gray-300 bg-white hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col"
                            >
                                <div className="p-4 flex-1">
                                    {note.title && (
                                        <h3 className="text-base font-medium text-gray-900 mb-3 line-clamp-2">
                                            {note.title}
                                        </h3>
                                    )}

                                    <div className="text-sm text-gray-800 space-y-2">
                                        {note.content.map((block, index) => {
                                            if (block.type === "paragraph") {
                                                return (
                                                    <p key={index} className="leading-relaxed line-clamp-4">
                                                        {block.text}
                                                    </p>
                                                );
                                            }

                                            if (block.type === "list") {
                                                return (
                                                    <ul key={index} className="list-disc ml-5 space-y-1">
                                                        {block.listItems?.slice(0, 3).map((item, i) => (
                                                            <li key={i} className="leading-relaxed line-clamp-1">
                                                                {item}
                                                            </li>
                                                        ))}
                                                        {block.listItems && block.listItems.length > 3 && (
                                                            <li className="text-gray-500">...</li>
                                                        )}
                                                    </ul>
                                                );
                                            }

                                            if (block.type === "image" || block.type === "drawing") {
                                                return (
                                                    <img
                                                        key={index}
                                                        src={block.url}
                                                        alt=""
                                                        className="rounded-lg w-full h-32 object-cover mt-3"
                                                    />
                                                );
                                            }
                                            return null;
                                        })}
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 bg-white p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <div className="flex items-center justify-center gap-2">
                                        <ToolButton
                                            icon={Trash2}
                                            label="Delete forever"
                                            onClick={() => handleDelete(note._id)}
                                        />
                                        <ToolButton
                                            icon={RotateCcw}
                                            label="Restore"
                                            onClick={() => handleRestore(note._id)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default TrashPage;

