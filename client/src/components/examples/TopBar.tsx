import { TopBar } from "../TopBar";
import { ThemeProvider } from "../ThemeProvider";

export default function TopBarExample() {
  return (
    <ThemeProvider>
      <TopBar
        documentTitle="My Amazing Story"
        autosaveStatus="saved"
        onToggleAI={() => console.log("Toggle AI")}
        onExport={(format) => console.log("Export as:", format)}
        onImport={() => console.log("Import file")}
        onToggleSidebar={() => console.log("Toggle sidebar")}
        userEmail="writer@novawrite.com"
        onLogout={() => console.log("Logout")}
      />
    </ThemeProvider>
  );
}
