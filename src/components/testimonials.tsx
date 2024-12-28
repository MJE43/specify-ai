'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

const testimonials = [
  {
    quote: "SpecifyAI transformed how I communicate my project ideas. The AI-generated documentation is incredibly detailed and clear.",
    author: "Alex Chen",
    role: "Startup Founder",
    avatar: "/placeholder.svg"
  },
  {
    quote: "The guided process helped me think through all aspects of my project. It's like having a technical co-founder guiding you.",
    author: "Sarah Miller",
    role: "Product Manager",
    avatar: "/placeholder.svg"
  },
  {
    quote: "Using SpecifyAI cut our project specification time by 70%. The AI integration is seamless and the output is excellent.",
    author: "Michael Brown",
    role: "Tech Lead",
    avatar: "/placeholder.svg"
  }
]

export function Testimonials() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Loved by founders and teams
          </h2>
          <p className="mt-4 text-xl text-muted-foreground">
            See what our users have to say about SpecifyAI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <CardContent className="p-6 flex flex-col justify-between h-full">
                  <div className="mb-4">
                    <p className="text-lg italic">&ldquo;{testimonial.quote}&rdquo;</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                      <AvatarFallback>{testimonial.author[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
