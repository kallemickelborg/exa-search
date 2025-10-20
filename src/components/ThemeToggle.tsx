import { Moon, Sun, Zap } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { BaseButton } from "@/components/buttons/BaseButton";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed top-2 right-2 flex items-center gap-2">
      <BaseButton
        variant={theme === "light" ? "default" : "outline"}
        size="sm"
        onClick={() => setTheme("light")}
        title="Light theme"
        className="w-9 h-9 p-0"
      >
        <Sun className="h-4 w-4" />
      </BaseButton>
      <BaseButton
        variant={theme === "dark" ? "default" : "outline"}
        size="sm"
        onClick={() => setTheme("dark")}
        title="Dark theme"
        className="w-9 h-9 p-0"
      >
        <Moon className="h-4 w-4" />
      </BaseButton>
      <BaseButton
        variant={theme === "auto" ? "default" : "outline"}
        size="sm"
        onClick={() => setTheme("auto")}
        title="Auto theme (system/time-based)"
        className="w-9 h-9 p-0"
      >
        <Zap className="h-4 w-4" />
      </BaseButton>
    </div>
  );
}
