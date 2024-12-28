import { Code2 } from 'lucide-react'
import { Link } from "react-router-dom"

const footerLinks = {
  Product: [
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "Documentation", href: "/docs" },
    { name: "Guides", href: "/guides" },
  ],
  Company: [
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
  ],
  Legal: [
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
    { name: "Security", href: "/security" },
  ],
  Social: [
    { name: "Twitter", href: "https://twitter.com" },
    { name: "GitHub", href: "https://github.com" },
    { name: "Discord", href: "https://discord.com" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <Code2 className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">SpecifyAI</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Transforming ideas into clear project specifications with the power of AI.
            </p>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SpecifyAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
