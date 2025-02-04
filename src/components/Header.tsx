import { Mail } from "lucide-react";

export const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Mail className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">TempMail</span>
          </div>
          <nav className="hidden sm:flex items-center space-x-6">
            <a href="#" className="text-sm text-gray-600 hover:text-primary">Features</a>
            <a href="#" className="text-sm text-gray-600 hover:text-primary">FAQ</a>
            <a href="#" className="text-sm text-gray-600 hover:text-primary">Blog</a>
          </nav>
        </div>
      </div>
    </header>
  );
};