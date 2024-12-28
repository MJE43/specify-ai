'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "How does SpecifyAI work?",
    answer: "SpecifyAI guides you through a series of questions about your project, using AI to generate comprehensive documentation that can be used by AI code generators to build your application."
  },
  {
    question: "Can I use SpecifyAI with any AI code generator?",
    answer: "Yes! SpecifyAI generates documentation that's compatible with popular AI code generators like GPT-4, Claude, and Gemini. Our output is formatted to get the best results from these tools."
  },
  {
    question: "Do I need technical knowledge to use SpecifyAI?",
    answer: "No technical knowledge is required. Our guided process is designed to help non-technical founders clearly specify their project requirements without needing to understand the technical details."
  },
  {
    question: "Can I collaborate with my team?",
    answer: "Yes! Our Pro and Enterprise plans include team collaboration features that allow you to share and work on project specifications together."
  },
  {
    question: "How accurate is the AI-generated documentation?",
    answer: "Our AI has been trained on thousands of successful project specifications and follows industry best practices. You can review and adjust the generated documentation at any time."
  }
]

export function FAQ() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Everything you need to know about SpecifyAI
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
