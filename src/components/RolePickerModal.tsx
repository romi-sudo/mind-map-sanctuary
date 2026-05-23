import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { User, Sparkles, Building2 } from "lucide-react";
import { useTranslation } from "react-i18next";

type Role = "consumer" | "practitioner" | "company";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSelect: (role: Role) => void;
}

const RolePickerModal = ({ open, onOpenChange, onSelect }: Props) => {
  const { t, i18n } = useTranslation();
  const dir = i18n.language === "he" ? "rtl" : "ltr";
  const textAlign = dir === "rtl" ? "text-right" : "text-left";

  const options: { role: Role; title: string; desc: string; Icon: typeof User }[] = [
    { role: "consumer", title: t("auth.rolePicker.consumerTitle"), desc: t("auth.rolePicker.consumerDesc"), Icon: User },
    { role: "practitioner", title: t("auth.rolePicker.practitionerTitle"), desc: t("auth.rolePicker.practitionerDesc"), Icon: Sparkles },
    { role: "company", title: t("auth.rolePicker.companyTitle"), desc: t("auth.rolePicker.companyDesc"), Icon: Building2 },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir={dir} className="max-w-md">
        <DialogHeader>
          <DialogTitle className={`font-display text-2xl ${textAlign}`}>{t("auth.rolePicker.title")}</DialogTitle>
          <DialogDescription className={`${textAlign} font-body`}>
            {t("auth.rolePicker.subtitle")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 mt-4">
          {options.map(({ role, title, desc, Icon }) => (
            <button
              key={role}
              onClick={() => onSelect(role)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border border-border bg-card/70 hover:border-primary hover:bg-card transition-all ${textAlign}`}
            >
              <Icon className="h-6 w-6 text-primary shrink-0" />
              <div className="flex-1">
                <div className="font-display font-bold text-foreground">{title}</div>
                <div className="font-body text-sm text-muted-foreground">{desc}</div>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RolePickerModal;
