export const applyTheme = (isDark: boolean) => {
    const root = document.documentElement

    if (isDark) {
        root.classList.add("dark")
        localStorage.setItem("theme", "dark")
    } else {
        root.classList.remove("dark")
        localStorage.setItem("theme", "light")
    }
}
