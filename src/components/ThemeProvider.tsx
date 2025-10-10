import React, { createContext, useContext, useState, useEffect } from "react";
import { ConfigProvider, theme as antdTheme } from "antd";
import {SysTheme} from "../shared/enums.ts";
import API from "../request/api.ts";

// 定义上下文类型
type ThemeType = "light" | "dark" | "auto";

interface ThemeContextType {
    theme: ThemeType;
    toggleTheme: (val: SysTheme) => (val: SysTheme) => void;
}

// 创建上下文
const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<SysTheme>(SysTheme.LIGHT);
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    async function themeChange(theme: SysTheme) {
        const res = await API.setSysTheme({ theme })
        setTheme(res.data)
    }


    function handleThemeChange(e: any) {
        console.warn(e)
        if (e.matches) {
            themeChange(SysTheme.DARK);
        } else {
            themeChange(SysTheme.LIGHT);
        }
    }



    // 切换主题
    const toggleTheme = (val: SysTheme) => {
        if(val === SysTheme.AUTO){
            handleThemeChange(media)
            // 监听系统主题变化
            media.addEventListener("change", handleThemeChange);
            return
        }

        themeChange(val);
    };



    // 设置到 HTML 的 data-theme（自定义 CSS 变量用）
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{theme, toggleTheme} as ThemeContextType}>
            <ConfigProvider
                theme={{
                    algorithm: theme === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
                    cssVar: true,
                    token: {
                        colorPrimary:  theme === "dark" ? '#7479FF' : '#4d53e8',
                        borderRadius: 6,
                        borderRadiusSM: 6,
                        controlHeightSM: 28,
                        // contentFontSizeSM: 13,
                    },
                }}
            >
                {children}
            </ConfigProvider>
        </ThemeContext.Provider>
    );
};

// 提供 Hook
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme 必须在 ThemeProvider 内使用");
    }
    return context;
};
