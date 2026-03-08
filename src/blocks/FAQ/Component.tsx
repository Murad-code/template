import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { RichText } from '@/components/RichText'
import type { FAQBlock as FAQBlockProps } from '@/payload-types'

export const FAQBlock: React.FC<FAQBlockProps> = (props) => {
  const { title, items } = props
  if (!items?.length) return null
  return (
    <div className="container my-16">
      {title && <h2 className="text-2xl font-medium mb-6">{title}</h2>}
      <Accordion type="single" collapsible className="w-full">
        {items.map((item, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>
              {item.answer && <RichText data={item.answer} enableGutter={false} />}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
