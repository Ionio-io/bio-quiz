import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold text-foreground">
              <span className="text-primary">|||</span> BioFit
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <a href="#home" className="text-foreground hover:text-primary transition-colors">
                Home
              </a>
              <a href="#about" className="text-foreground hover:text-primary transition-colors">
                About Us
              </a>
              <a href="#programs" className="text-foreground hover:text-primary transition-colors">
                Programs & Services
              </a>
              <a href="#science" className="text-foreground hover:text-primary transition-colors">
                Science & Insights
              </a>
              <a href="#contact" className="text-foreground hover:text-primary transition-colors">
                Contact Us
              </a>
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button variant="hero" size="lg">
              Check Your Eligibility
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-card rounded-lg mt-2">
              <a href="#home" className="block px-3 py-2 text-foreground hover:text-primary transition-colors">
                Home
              </a>
              <a href="#about" className="block px-3 py-2 text-foreground hover:text-primary transition-colors">
                About Us
              </a>
              <a href="#programs" className="block px-3 py-2 text-foreground hover:text-primary transition-colors">
                Programs & Services
              </a>
              <a href="#science" className="block px-3 py-2 text-foreground hover:text-primary transition-colors">
                Science & Insights
              </a>
              <a href="#contact" className="block px-3 py-2 text-foreground hover:text-primary transition-colors">
                Contact Us
              </a>
              <div className="px-3 py-2">
                <Button variant="hero" size="lg" className="w-full">
                  Check Your Eligibility
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};