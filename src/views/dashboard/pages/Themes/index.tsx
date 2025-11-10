import { useState } from "react";
import {
  useGetThemesQuery,
  useAddThemeMutation,
  useDeleteThemeMutation,
  useActivateThemeMutation,
} from "@/app/functions/api/themeApi";
import Input from "@/components/elements/Input";
import Button from "@/components/elements/Button";
import { SoAddNote, SoCheckBadge, SoTrash } from "solom-icon";
import { cn } from "@/lib/utils";
import LoadingScreen from "@/components/website-loading";

export const ThemesControlPage = () => {
  const { data: themes = [], isLoading: isThemesLoading } = useGetThemesQuery();
  const [addTheme] = useAddThemeMutation();
  const [deleteTheme] = useDeleteThemeMutation();
  const [activateTheme] = useActivateThemeMutation();
  const [newTheme, setNewTheme] = useState({
    name: "",
    primary_color: "#be27ce",
    secondary_color: "#2e2e2e",
    accent_color: "#be27ce33",
  });

  const handleAddTheme = () => {
    addTheme(newTheme).then(() => {
      setNewTheme({
        name: "",
        primary_color: "#be27ce",
        secondary_color: "#2e2e2e",
        accent_color: "#be27ce33",
      });
    });
  };

  if (isThemesLoading)
    return (
      <div className="w-full h-[50vh] flex items-center justify-center">
        <LoadingScreen />
      </div>
    );

  return (
    <main className="p-4 max-w-7xl mx-auto mb-5">
      <div className="mb-8 p-6 border rounded-lg shadow-sm bg-white">
        <h2 className="text-xl font-semibold pb-5">إضافة ثيم جديد</h2>
        <div className="flex items-center justify-between">
          <div className="w-1/2 space-y-2">
            <label>إسم الثيم</label>
            <Input
              type="text"
              value={newTheme.name}
              onChange={(e) =>
                setNewTheme({ ...newTheme, name: e.target.value })
              }
              placeholder="إسم الثيم"
              className="mb-5 py-0.5 w-full"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block mb-1 font-medium">اللون الرئيسي</label>
              <input
                type="color"
                value={newTheme.primary_color}
                onChange={(e) =>
                  setNewTheme({ ...newTheme, primary_color: e.target.value })
                }
                className="w-16 h-10 rounded-md border"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">اللون الثانوي</label>
              <input
                type="color"
                value={newTheme.secondary_color}
                onChange={(e) =>
                  setNewTheme({ ...newTheme, secondary_color: e.target.value })
                }
                className="w-16 h-10 rounded-md border"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">اللون المميز</label>
              <input
                type="color"
                value={newTheme.accent_color}
                onChange={(e) =>
                  setNewTheme({ ...newTheme, accent_color: e.target.value })
                }
                className="w-16 h-10 rounded-md border"
              />
            </div>
          </div>
        </div>
        <Button
          fullWidth
          onClick={handleAddTheme}
          className="bg-primary text-white px-4 py-2 rounded mt-2 hover:bg-accent"
        >
          إضافة ثيم جديد <SoAddNote />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <div
            key={theme.id}
            className="p-4 border rounded-lg shadow-sm bg-white"
          >
            <h3
              className={cn(
                "text-lg font-semibold mb-3",
                theme.is_active && "text-green-600"
              )}
            >
              {theme.name} {theme.is_active && "(نشط)"}
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center">
                <div
                  className="w-10 h-10 rounded-full border"
                  style={{ backgroundColor: theme.primary_color }}
                ></div>
                <span className="mt-1 text-sm">رئيسي</span>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className="w-10 h-10 rounded-full border"
                  style={{ backgroundColor: theme.secondary_color }}
                ></div>
                <span className="mt-1 text-sm">ثانوي</span>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className="w-10 h-10 rounded-full border"
                  style={{ backgroundColor: theme.accent_color }}
                ></div>
                <span className="mt-1 text-sm">مميز</span>
              </div>
            </div>
            <div className="w-full mt-7 flex items-center gap-3">
              {!theme?.is_active && (
                <Button
                  fullWidth
                  onClick={() => activateTheme(theme.id)}
                  className="bg-green-600 py-2 hover:bg-green-600 disabled:bg-gray-400"
                  disabled={theme?.is_active}
                >
                  تفعيل <SoCheckBadge />
                </Button>
              )}
              <Button
                fullWidth
                onClick={() => deleteTheme(theme.id)}
                className="bg-red-500 py-2 hover:bg-red-600"
              >
                حذف <SoTrash />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};
