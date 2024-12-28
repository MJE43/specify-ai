'use client'

import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Code2, FileText, Shield, Users, Workflow, Zap } from 'lucide-react'

const features = [
  {
    icon: FileText,
    title: "Smart Documentation",
    description: "Generate comprehensive project documentation using AI-powered insights that understand your vision.",
  },
  {
    icon: Workflow,
    title: "Guided Process",
    description: "Follow our intuitive questionnaire that helps you define and clarify your project requirements.",
  },
  {
    icon: Code2,
    title: "AI-Ready Output",
    description: "Get documentation formatted perfectly for AI code generation tools, ready for immediate use.",
  },
  {
    icon: Zap,
    title: "Quick Implementation",
    description: "Transform your ideas into detailed specifications in under 30 minutes with our streamlined process.",
  },
  {
    icon: Shield,
    title: "Best Practices",
    description: "Ensure your project follows industry standards and security best practices from the start.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Share and collaborate on project specifications with your team members and stakeholders.",
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function FeatureSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Everything you need to specify your project
          </h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Powerful features to help you create detailed project specifications
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={item}>
              <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="relative z-10">
                    <feature.icon className="h-12 w-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
