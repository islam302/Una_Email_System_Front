import { useLayoutEffect } from "react";
import { useGetActiveThemeQuery } from "@/app/functions/api/themeApi";
import LoadingScreen from "@/components/website-loading";

const fallbackTheme = {
  primary_color: "#be27ce",
  secondary_color: "#2e2e2e",
  accent_color: "#be27ce33",
  text_color: "#1F2937",
};

export const ThemeUpdater = () => {
  const { data: activeTheme, isLoading, isError } = useGetActiveThemeQuery();

  useLayoutEffect(() => {
    const selectedTheme = Array.isArray(activeTheme)
      ? activeTheme.find((theme) => theme.is_active) || fallbackTheme
      : fallbackTheme;

    document.documentElement.style.setProperty(
      "--primary",
      selectedTheme.primary_color || fallbackTheme.primary_color
    );
    document.documentElement.style.setProperty(
      "--secondary",
      selectedTheme.secondary_color || fallbackTheme.secondary_color
    );
    // document.documentElement.style.setProperty(
    //   "--text",
    //   selectedTheme.text_color || fallbackTheme.text_color
    // );
    document.documentElement.style.setProperty(
      "--accent",
      selectedTheme.accent_color || fallbackTheme.accent_color
    );
  }, [activeTheme]);

  if (isLoading) {
    return (
      <div className="hidden inset-0 bg-white items-center justify-center">
        <LoadingScreen />
      </div>
    );
  }

  if (isError) {
    return null;
  }

  return null;
};
