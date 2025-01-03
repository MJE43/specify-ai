import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GeneratedDocuments } from '@/lib/types';
import { cn } from '@/lib/utils';

interface GeneratedDocumentDisplayProps {
  documents: GeneratedDocuments;
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const GeneratedDocumentDisplay: React.FC<GeneratedDocumentDisplayProps> = ({
  documents,
  headingLevel = 'h2',
}) => {
  const HeadingTag = headingLevel;

  return (
    <div className="mt-8 p-6">
       <HeadingTag className="text-2xl font-bold mb-4">Generated Documentation</HeadingTag>
      <Accordion type="single" collapsible>
        {Object.entries(documents).map(([key, value]) => (
          <AccordionItem key={key} value={key}>
            <AccordionTrigger className="capitalize flex items-center">
              {key.replace(/([A-Z])/g, ' $1').trim()}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 ml-2 shrink-0 transition-transform duration-300 [&[data-state=open]]:rotate-180"
              >
                <path d="M18 15l-6-6-6 6"/>
              </svg>
            </AccordionTrigger>
            <AccordionContent>
              <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded mt-2">
                {value}
              </pre>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default GeneratedDocumentDisplay;