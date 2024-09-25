import type { ThemeProviderProps } from "next-themes/dist/types";
import { ThemeProvider as NextThemesProvider } from "next-themes";

function ThemeProvider({ children, ...props }: ThemeProviderProps): JSX.Element {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
export default ThemeProvider;
