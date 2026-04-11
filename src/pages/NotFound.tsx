import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background" dir="rtl">
      <div className="text-center">
        <h1 className="mb-4 font-display text-6xl font-bold text-foreground">404</h1>
        <p className="mb-4 text-xl font-body text-muted-foreground">העמוד לא נמצא</p>
        <Link to="/" className="font-body text-sm hover:underline text-primary">
          חזרה לדף הבית
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
