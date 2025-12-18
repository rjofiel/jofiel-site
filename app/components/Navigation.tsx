import { Link, useLocation } from "react-router-dom";

const navItems = [
  { path: "/", label: "home" },
  { path: "/blog", label: "blog" },
  { path: "/projects", label: "projects" },
  { path: "/about", label: "about" },
];

export const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="flex items-center gap-6 text-sm">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`transition-colors hover:text-primary ${
            location.pathname === item.path 
              ? "text-primary" 
              : "text-muted-foreground"
          }`}
        >
          /{item.label}
        </Link>
      ))}
    </nav>
  );
};
