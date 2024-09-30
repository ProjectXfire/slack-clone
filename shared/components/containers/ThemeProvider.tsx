import type { ThemeProviderProps } from "next-themes/dist/types";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "../ui/Toaster";

function ThemeProvider({ children, ...props }: ThemeProviderProps): JSX.Element {
  return (
    <NextThemesProvider {...props}>
      {children}
      <Toaster />
    </NextThemesProvider>
  );
}
export default ThemeProvider;
