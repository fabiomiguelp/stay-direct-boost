import prrBlackLogo from "@/assets/prrBlack.png";

export const Footer = () => {
    return (
        <footer className="bg-muted border-t border-border mt-16">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Logo Section */}
                    <div className="flex items-center gap-3">
                        <div className="w-96 h-16 relative">
                            <img
                                src={prrBlackLogo}
                                alt="Logo"
                                className="h-full w-full object-contain filter grayscale"
                            />
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