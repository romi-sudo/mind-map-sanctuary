import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { User, Sparkles, Building2 } from "lucide-react";

type Role = "consumer" | "practitioner" | "company";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSelect: (role: Role) => void;
}

const OPTIONS: { role: Role; title: string; desc: string; Icon: typeof User }[] = [
  { role: "consumer", title: "אני מחפש/ת מסלול", desc: "גישה אישית להמלצות וליווי", Icon: User },
  { role: "practitioner", title: "אני מומחה/ית", desc: "להצטרף כמטפל/ת או מנחה", Icon: Sparkles },
  { role: "company", title: "חברה / ארגון", desc: "פתרונות רווחה לעובדים", Icon: Building2 },
];

const RolePickerModal = ({ open, onOpenChange, onSelect }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-right">איך תרצו להירשם?</DialogTitle>
          <DialogDescription className="text-right font-body">
            בחרו את סוג החשבון לפני המשך ההרשמה
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 mt-4">
          {OPTIONS.map(({ role, title, desc, Icon }) => (
            <button
              key={role}
              onClick={() => onSelect(role)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border border-border bg-card/70 hover:border-primary hover:bg-card transition-all text-right"
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
