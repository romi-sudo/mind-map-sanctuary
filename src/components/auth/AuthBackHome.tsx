import { Link } from "react-router-dom";

const AuthBackHome = () => {
  return (
    <div className="mb-5 flex justify-start">
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/85 px-4 py-2 font-body text-sm font-medium text-foreground shadow-sm transition-all hover:bg-muted/60 hover:shadow-warm"
      >
        <span aria-hidden="true">←</span>
        <span>חזרה לדף הבית</span>
      </Link>
    </div>
  );
};

export default AuthBackHome;
