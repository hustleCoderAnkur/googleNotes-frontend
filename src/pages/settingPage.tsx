import { applyTheme } from "../utils/theme"
import { useEffect, useState } from "react"
import Button from "../components/Button"
import api from "../api/axios"

type UserSettings = {
    notesAndLists: boolean
    addItemsBottom: boolean
    moveCheckedBottom: boolean
    richLinkPreview: boolean
    darkTheme: boolean
    sharing: boolean
}

const defaultSettings: UserSettings = {
    notesAndLists: true,
    addItemsBottom: false,
    moveCheckedBottom: false,
    richLinkPreview: true,
    darkTheme: false,
    sharing: false
}

function SettingPage() {
    const [settings, setSettings] = useState<UserSettings>(defaultSettings)
    const [loading, setLoading] = useState(true)
    const [isNewUser, setIsNewUser] = useState(false)

    useEffect(() => {
        initializeSettings()
    }, [])

    const initializeSettings = async () => {
        try {
            setLoading(true)
            const res = await api.get("/setting/getUserSetting")

            if (res.data.data) {
                setSettings(res.data.data)
                setIsNewUser(false)
            } else {
                setSettings(defaultSettings)
                setIsNewUser(true)
            }
        } catch (error) {
            console.log("No existing settings found, using defaults",error)
            setSettings(defaultSettings)
            setIsNewUser(true)
        } finally {
            setLoading(false)
        }
    }


    const toggleSetting = (key: keyof UserSettings) => {
        if (!settings) return

        const updated = { ...settings, [key]: !settings[key] }
        setSettings(updated)

        if (key === "darkTheme") {
            applyTheme(updated.darkTheme)
        }
    }

    const updateSetting = async () => {

        if (!settings) {
            console.error("settings is NULL");
            alert("Settings missing");
            return;
        }

        try {
            if (isNewUser) {
            await api.post("/setting/createSetting", settings);
            } else {
            await api.put("/setting/updateSetting", settings);
                
                alert("Settings updated successfully");
            }
        } catch (err) {
                console.error("Error", err);
        } 
    };

    return (
        <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
        >
            <div className="p-6 w-full max-w-90 bg-white rounded-2xl shadow-xl space-y-6">
                <h1 className="text-xl font-semibold text-blue-600">Settings</h1>

                {loading ? (
                    <div className="text-center text-gray-600 py-8">Loading...</div>
                ) : (
                    <>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.notesAndLists}
                                    onChange={() => toggleSetting("notesAndLists")}
                                    className="w-4 h-4 cursor-pointer"
                                />
                                Notes and Lists
                            </label>

                            <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.addItemsBottom}
                                    onChange={() => toggleSetting("addItemsBottom")}
                                    className="w-4 h-4 cursor-pointer"
                                />
                                Add new items to the bottom
                            </label>

                            <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.moveCheckedBottom}
                                    onChange={() => toggleSetting("moveCheckedBottom")}
                                    className="w-4 h-4 cursor-pointer"
                                />
                                Move checked items to bottom
                            </label>

                            <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.richLinkPreview}
                                    onChange={() => toggleSetting("richLinkPreview")}
                                    className="w-4 h-4 cursor-pointer"
                                />
                                Display rich link previews
                            </label>

                            <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.darkTheme}
                                    onChange={() => toggleSetting("darkTheme")}
                                    className="w-4 h-4 cursor-pointer"
                                />
                                Enable dark theme
                            </label>

                            <h2 className="text-lg font-semibold text-blue-600 pt-4">
                                Sharing
                            </h2>

                            <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.sharing}
                                    onChange={() => toggleSetting("sharing")}
                                    className="w-4 h-4 cursor-pointer"
                                />
                                Enable sharing
                            </label>
                        </div>

                        <div className="flex gap-3 pt-4">
                                <Button onClick={()=>window.history.back()}
                                    className="flex-1 text-base font-semibold bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-md transition">
                                Back
                            </Button>

                            <Button
                                onClick={updateSetting}
                                disabled={loading}
                                className="flex-1 text-base font-semibold bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Save
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default SettingPage