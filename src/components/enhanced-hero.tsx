'use client'

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight } from 'lucide-react'
import { Link } from "react-router-dom"

export default function EnhancedHero() {
  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-24 sm:py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              Transform Your Ideas into
              <div className="relative mt-2">
                <span className="relative inline-block animate-gradient bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent bg-[size:400%]">
                  Clear Project Specs
                </span>
              </div>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              From idea to detailed specs in under 30 minutes. Help AI understand your vision with our guided process.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-10 flex justify-center gap-4"
            >
              <Link to="/signup">
                <Button size="lg" className="gap-2 group">
                  Start Building
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/demo">
                <Button size="lg" variant="outline">
                  Watch Demo
                </Button>
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground"
            >
              <p className="flex items-center gap-2">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-yellow-400">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                4.9/5 average rating
              </p>
              <p>1000+ projects generated</p>
              <p>Trusted by 500+ founders</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
