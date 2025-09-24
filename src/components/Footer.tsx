export const Footer = () => {
  return (
    <footer className="bg-muted border-t border-border mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              {/* Placeholder for PNG logo - replace src with your logo */}
              <img 
                src="/placeholder-logo.png" 
                alt="Logo" 
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  // Fallback to text if image doesn't exist
                  const imgElement = e.currentTarget as HTMLImageElement;
                  const spanElement = imgElement.nextElementSibling as HTMLElement;
                  imgElement.style.display = 'none';
                  spanElement.style.display = 'block';
                }}
              />
              <span className="text-primary-foreground font-bold text-lg hidden">L</span>
            </div>
          </div>

          {/* Designer Credit */}
          <div className="text-center md:text-right">
            <p className="text-muted-foreground text-sm">
              Design by <span className="font-medium text-foreground">Sophia Designer</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};