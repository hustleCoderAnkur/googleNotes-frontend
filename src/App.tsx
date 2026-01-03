import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./layout/Dashboard.tsx";
import Navbar from "./layout/Navbar.tsx";
import NotePage from "./pages/notesPage.tsx";
import ReminderPage from "./pages/reminderPage.tsx";
import LabelPage from "./pages/labelPage.tsx";
import ArchivePage from "./pages/archivePage.tsx";
import TrashPage from "./pages/trashPage.tsx";
import LoginPage from "./pages/loginPage.tsx";
import UserPage from "./pages/userPage.tsx";
import SettingPage from "./pages/settingPage.tsx";

function App() {
  const [isSideOpen, setIsSideOpen] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark")
    }
  }, [])

  return (
    <>
      <div className="flex flex-col h-screen">
        <Navbar
          isSideOpen={isSideOpen}
          setIsSideOpen={setIsSideOpen}
        />
        <div className="flex flex-1 overflow-hidden">
          <Dashboard isOpen={isSideOpen} />
          <main className="flex-1 p-4 overflow-y-auto">
            <Routes>
              <Route path="/notes" element={<NotePage />} />
              <Route path="/reminders" element={<ReminderPage />} />
              <Route path="/labels" element={<LabelPage />} />
              <Route path="/settings" element={<SettingPage/>}/>
              <Route path="/archive" element={<ArchivePage />} />
              <Route path="/trash" element={<TrashPage />} />
              <Route path="/" element={<LoginPage />} />
              <Route path="/user" element={<UserPage/>}/>
            </Routes>
          </main>
        </div>
      </div>
    </>
  )
}

export default App;
