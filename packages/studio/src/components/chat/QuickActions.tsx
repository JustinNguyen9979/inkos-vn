import {
  Zap,
  Search,
  FileOutput,
  TrendingUp,
} from "lucide-react";
import { getAppLanguage } from "../../lib/app-language";

export interface QuickActionsProps {
  readonly onAction: (command: string, requestedIntent?: "write_next") => void;
  readonly disabled: boolean;
  readonly isZh: boolean;
}

interface ChipDef {
  readonly icon: React.ReactNode;
  readonly labelZh: string;
  readonly labelEn: string;
  readonly labelVi: string;
  readonly commandZh: string;
  readonly commandEn: string;
  readonly commandVi: string;
  readonly requestedIntent?: "write_next";
}

const CHIPS: ReadonlyArray<ChipDef> = [
  {
    icon: <Zap size={12} />,
    labelZh: "写下一章",
    labelEn: "Write next",
    labelVi: "Viết chương tiếp",
    commandZh: "写下一章",
    commandEn: "write next",
    commandVi: "viết chương tiếp theo",
    requestedIntent: "write_next",
  },
  {
    icon: <Search size={12} />,
    labelZh: "审计",
    labelEn: "Audit",
    labelVi: "Kiểm tra",
    commandZh: "审计",
    commandEn: "audit",
    commandVi: "kiểm tra chương",
  },
  {
    icon: <FileOutput size={12} />,
    labelZh: "导出",
    labelEn: "Export",
    labelVi: "Xuất truyện",
    commandZh: "导出全书",
    commandEn: "export book",
    commandVi: "xuất toàn bộ truyện",
  },
  {
    icon: <TrendingUp size={12} />,
    labelZh: "市场雷达",
    labelEn: "Market radar",
    labelVi: "Radar thị trường",
    commandZh: "扫描市场趋势",
    commandEn: "scan market trends",
    commandVi: "quét xu hướng thị trường",
  },
];

export function QuickActions({ onAction, disabled, isZh }: QuickActionsProps) {
  const isVi = getAppLanguage() === "vi";
  return (
    <div className="flex gap-2 overflow-x-auto px-1 py-1">
      {CHIPS.map((chip) => {
        const label = isVi ? chip.labelVi : isZh ? chip.labelZh : chip.labelEn;
        const command = isVi ? chip.commandVi : isZh ? chip.commandZh : chip.commandEn;
        return (
          <button
            key={label}
            onClick={() => onAction(command, chip.requestedIntent)}
            disabled={disabled}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border/30 text-xs font-medium text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all disabled:opacity-40 disabled:pointer-events-none group"
          >
            <span className="group-hover:scale-110 transition-transform">{chip.icon}</span>
            {label}
          </button>
        );
      })}
    </div>
  );
}
