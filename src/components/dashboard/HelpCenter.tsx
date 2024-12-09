import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function HelpCenter() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const faqs = [
    {
      question: "How do I get started with Creatorships?",
      answer: "Getting started is easy! First, create an account and specify whether you're a creator or a brand. Complete your profile with relevant information, and you can start exploring partnerships right away."
    },
    {
      question: "How does the payment process work?",
      answer: "We ensure secure payments through our platform. Brands deposit funds into an escrow account, and creators receive payment once the deliverables are approved. We handle all payment processing and invoicing."
    },
    {
      question: "What types of collaborations are supported?",
      answer: "We support various collaboration types including sponsored posts, product reviews, brand ambassadorships, content creation, and long-term partnerships across different social media platforms."
    },
    // Add more FAQs as needed
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Implement your form submission logic here
    console.log('Form submitted:', formData)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Help Center</h1>
      
      {/* FAQ Section */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Contact Form */}
      <div className="bg-card p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Contact Support</h2>
        <p className="text-muted-foreground mb-6">
          Need more help? Our account representatives are here to assist you.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium">Subject</label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">Message</label>
            <Textarea
              id="message"
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              required
            />
          </div>

          <Button type="submit" className="w-full text-white">
            Send Message
          </Button>
        </form>
      </div>
    </div>
  )
} 