import { useEffect, useState } from "react"
import api from "../api/axios"
import NoteCard from "../components/noteCard";

export interface Block {
    type: "paragraph" | "list" | "image" | "drawing";
    text?: string;
    listItems?: string[];
    url?: string;
}
export interface note {
    _id: string;
    title: string;
    content: Block[];
    isPinned?: boolean;
    isArchived?: boolean;
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

function ArchivePage() {

    const [notes, setNotes] = useState<note[]>([])
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState<note | null>(null);
    void editing
    useEffect(() => {
        const fetchArchived = async () => {
            try {
                const res = await api.get("/notes/getArchivedNotes");
                setNotes(res.data.data)
            } catch (error) {
                console.error("Failed to fetch archived notes", error);
            } finally {
                setLoading(false)
            }
        }
        fetchArchived()
    }, [])

    if (loading) {
        return <p className="text-center mt-6">Loading archived notes...</p>
    }

    return (
        <>
            <div className="max-w-4xl mx-auto mt-6 px-4">
                {notes.length === 0 ? (
                    <p className="text-center text-gray-500">
                        No archived notes
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {notes.map(note => (
                            <NoteCard
                                key={note._id}
                                note={note}
                                onEdit={(note) => setEditing(note)}
                                onUpdated={(updatedNote) =>
                                    setNotes(prev =>
                                        prev.map(n =>
                                            n._id === updatedNote._id ? updatedNote : n
                                        )
                                    )
                                }
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

export default ArchivePage