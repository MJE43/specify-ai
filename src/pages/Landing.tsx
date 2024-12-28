import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, FileText, Workflow } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex-shrink-0 flex items-center">
              <Code2 className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold">SpecifyAI</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-24 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Transform Your Ideas into
            <span className="text-primary block mt-2">Clear Project Specs</span>
          </h1>
          <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
            Help AI understand your vision. Create professional project specifications and documentation with our guided process.
          </p>
          <div className="mt-10">
            <Link to="/signup">
              <Button size="lg" className="gap-2">
                Start Building <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg border bg-card">
              <FileText className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Smart Documentation</h3>
              <p className="text-muted-foreground">
                Generate comprehensive project documentation using AI-powered insights.
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <Workflow className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Guided Process</h3>
              <p className="text-muted-foreground">
                Simple questionnaire that helps you define your project requirements.
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <Code2 className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI-Ready Output</h3>
              <p className="text-muted-foreground">
                Get documentation formatted perfectly for AI code generation tools.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;