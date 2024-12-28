'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Check } from 'lucide-react'

const tiers = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for trying out SpecifyAI",
    features: [
      "3 project specifications per month",
      "Basic AI documentation",
      "Community support",
      "Basic templates"
    ]
  },
  {
    name: "Pro",
    price: "$29",
    description: "For founders serious about their projects",
    features: [
      "Unlimited project specifications",
      "Advanced AI documentation",
      "Priority support",
      "Custom templates",
      "Team collaboration",
      "API access"
    ]
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For larger teams and organizations",
    features: [
      "Everything in Pro",
      "Custom integrations",
      "Dedicated support",
      "SSO authentication",
      "Advanced security features",
      "Custom contracts"
    ]
  }
]

export function Pricing() {
  return (
    <section className="py-24">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Choose the plan that's right for you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    {tier.price !== "Custom" && <span className="text-muted-foreground">/month</span>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{tier.description}</p>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-2">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant={index === 1 ? "default" : "outline"}>
                    {tier.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
