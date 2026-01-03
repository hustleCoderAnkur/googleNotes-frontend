import { useEffect, useState } from "react";
import NoteCreate from "../layout/NoteCreate";
import type { note } from "./notesPage";
import NoteCard from "../components/noteCard";
import api from "../api/axios";

interface Reminder {
    _id: string;
    reminderDate: string;
    noteId: note;
}


function ReminderPage() {
    const [notes, setNotes] = useState<note[]>([])
    const [editing, setEditing] = useState<note | null>(null)
    const [loading,setLoading] = useState(true)

    const handleNoteCreated = (newNote: note) => {
        setNotes(prev => [newNote, ...prev]
        );
    };

    const handleArchiveNote = (archivedNote: note) => {
        setNotes(prev => prev.filter(n => n._id !== archivedNote._id)
        );
    };

    const handleUpdateNote = (updatedNote: note) => {
        setNotes(prev => prev.map(note => note._id === updatedNote._id ? updatedNote : note)
        );
    };

    const handleDelete = async (id: string) => {
        try {
            await api.put(`/notes/deleteNote/${id}`)
            setNotes(prev => prev.filter(note => note._id !== id));
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Failed to deletenote")
        }
    }

    useEffect(() => {
        const checkReminder = async () => {
            try {
                const res = await api.get<{ data: Reminder[] }>("/reminder/getAllReminder");

                const reminderNotes = res.data.data
                    .filter((r)=> r.noteId)
                    .map(r => r.noteId);

                setNotes(reminderNotes);
            } catch (error) {
                console.error("Cannot fetch reminder notes", error);
            } finally {
                setLoading(false);
            }
        };

        checkReminder();
    }, []);

    
    return (
        <div className="max-w-4xl mx-auto mt-6 px-4">
            <NoteCreate
                editing={editing}
                onClose={() => setEditing(null)}
                onNoteCreated={handleNoteCreated}
                onNoteUpdated={handleUpdateNote}
                />

            {loading ? (
                <p className="text-center mt-6">Loading notes...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                    {notes.map(note => (
                        <NoteCard
                        key={note._id}
                        note={note}
                        onEdit={(note) => setEditing(note)}
                        onUpdated={handleUpdateNote}
                        onArchived={handleArchiveNote}
                        onDelete={handleDelete}
                        />
                        
                    ))}
                </div>
            )}
        </div>
    );
}


export default ReminderPage;
