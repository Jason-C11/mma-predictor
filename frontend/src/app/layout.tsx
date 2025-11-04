// Root layout for the app
import "../styles/globals.css";
import { ReactNode } from "react";
import QueryClientProviderWrapper from "@/components/QueryClientProviderWrapper";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from "../themes/theme";
import Navbar from "../components/Navbar";


export const metadata = {
  title: "MMA Predictor",
  description: "Predict MMA fight outcomes",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <QueryClientProviderWrapper>
              <Navbar/>
              <main>{children}</main>
            </QueryClientProviderWrapper>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}