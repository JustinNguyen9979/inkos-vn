import { useState } from "react";
import { setUiLocale, useUiLocale, type UiLocale } from "../i18n/ui-locale";

export function LanguageSelector({ onSelect }: { onSelect: (lang: "zh" | "en") => void }) {
  const uiLocale = useUiLocale();
  const [hovering, setHovering] = useState<"zh" | "en" | null>(null);
  const [selected, setSelected] = useState<"zh" | "en" | null>(null);

  const handleSelect = (lang: "zh" | "en") => {
    setSelected(lang);
    // Brief pause for the selection animation before transitioning
    setTimeout(() => onSelect(lang), 400);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-8">
      <div className="absolute right-6 top-6 flex gap-1 rounded-lg bg-muted/50 p-1">
        {(["zh", "en", "vi"] as const).map((locale: UiLocale) => (
          <button
            key={locale}
            type="button"
            onClick={() => setUiLocale(locale)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${uiLocale === locale ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
          >
            {locale === "zh" ? "中" : locale.toUpperCase()}
          </button>
        ))}
      </div>
      {/* Logo — cinematic scale */}
      <div className="mb-16 text-center">
        <div className="flex items-baseline justify-center gap-1.5 mb-4">
          <span className="font-serif text-6xl italic text-primary">Ink</span>
          <span className="text-5xl font-semibold tracking-tight text-foreground">OS</span>
        </div>
        <div className="text-base text-muted-foreground tracking-widest uppercase">Studio</div>
      </div>

      {/* Language cards — generous, distinct, immersive */}
      <div className="flex gap-8 mb-16">
        <button
          onClick={() => handleSelect("zh")}
          onMouseEnter={() => setHovering("zh")}
          onMouseLeave={() => setHovering(null)}
          className={`group w-80 border rounded-lg p-10 text-left transition-all duration-300 ${
            selected === "zh"
              ? "border-primary bg-primary/10 scale-[1.02]"
              : hovering === "zh"
                ? "border-primary/50 bg-card"
                : "border-border bg-card/50"
          }`}
        >
          <div className="font-serif text-3xl mb-4 text-foreground">中文创作</div>
          <div className="text-base text-foreground/70 leading-relaxed mb-6">
            玄幻 · 仙侠 · 都市 · 恐怖 · 通用
          </div>
          <div className="text-sm text-muted-foreground">
            番茄小说 · 起点中文网 · 飞卢
          </div>
        </button>

        <button
          onClick={() => handleSelect("en")}
          onMouseEnter={() => setHovering("en")}
          onMouseLeave={() => setHovering(null)}
          className={`group w-80 border rounded-lg p-10 text-left transition-all duration-300 ${
            selected === "en"
              ? "border-primary bg-primary/10 scale-[1.02]"
              : hovering === "en"
                ? "border-primary/50 bg-card"
                : "border-border bg-card/50"
          }`}
        >
          <div className="font-serif text-3xl italic mb-4 text-foreground">English Writing</div>
          <div className="text-base text-foreground/70 leading-relaxed mb-6">
            LitRPG · Progression · Romantasy · Sci-Fi · Isekai
          </div>
          <div className="text-sm text-muted-foreground">
            Royal Road · Kindle Unlimited · Scribble Hub
          </div>
        </button>
      </div>

      <div className="text-sm text-muted-foreground">
        {uiLocale === "vi"
          ? "Chọn ngôn ngữ dùng để sáng tác. Bạn có thể thay đổi sau trong phần cài đặt."
          : uiLocale === "en"
            ? "Choose the language used for writing. You can change it later in Settings."
            : "选择创作语言，可稍后在设置中更改。"}
      </div>
    </div>
  );
}
