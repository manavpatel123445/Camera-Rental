import { useState } from "react";

import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import {  Mail, Phone, MessageCircle, Search, Clock, FileText, Shield, Truck, Camera, Settings, ChevronRight, CheckCircle, HelpCircle, MessageSquare } from "lucide-react";
import CommonNavbar from "../../components/ui/CommonNavbar";
// Remove useCart for now, or replace with a selector if you have Redux
// import { useCart } from "@/contexts/CartContext";

export default function Support() {
  // const { state } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general"
  });

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission
    console.log("Contact form submitted:", contactForm);
    alert("Thank you for your message! We'll get back to you within 24 hours.");
    setContactForm({ name: "", email: "", subject: "", message: "", category: "general" });
  };

  const faqs = [
    {
      question: "How do I rent equipment?",
      answer: "Browse our catalog, select your desired equipment, choose rental dates, and add items to your cart. You can then proceed to checkout and complete your rental."
    },
    {
      question: "What's included with each rental?",
      answer: "Each rental includes the main item, all standard accessories (batteries, memory cards, cables), a protective case, and free shipping both ways."
    },
    {
      question: "How far in advance should I book?",
      answer: "We recommend booking at least 2-3 days in advance for standard items. For specialized or high-demand equipment, book 1-2 weeks ahead."
    },
    {
      question: "What if I damage the equipment?",
      answer: "We understand accidents happen. Minor wear is expected and covered. For significant damage, our damage protection plan covers up to the full replacement cost."
    },
    {
      question: "Can I extend my rental period?",
      answer: "Yes! You can extend your rental through your Orders page or by contacting us. Extensions are subject to availability and additional fees."
    },
    {
      question: "What's your cancellation policy?",
      answer: "Free cancellation up to 48 hours before your rental start date. Cancellations within 48 hours may incur a 25% fee."
    },
    {
      question: "Do you ship internationally?",
      answer: "Currently, we only ship within the United States. We're working on expanding to international markets soon."
    },
    {
      question: "How do I return equipment?",
      answer: "Use the prepaid return label included with your shipment. Drop off at any FedEx location or schedule a pickup. Returns must be postmarked by your return date."
    }
  ];

  const supportTopics = [
    {
      icon: Camera,
      title: "Equipment Issues",
      description: "Problems with camera, lens, or accessory functionality",
      category: "equipment"
    },
    {
      icon: Truck,
      title: "Shipping & Returns",
      description: "Questions about delivery, tracking, or return process",
      category: "shipping"
    },
    {
      icon: FileText,
      title: "Billing & Payments",
      description: "Invoice questions, payment issues, or account billing",
      category: "billing"
    },
    {
      icon: Shield,
      title: "Damage Protection",
      description: "Coverage questions and damage claim assistance",
      category: "damage"
    },
    {
      icon: Settings,
      title: "Account & Technical",
      description: "Website issues, account settings, or password help",
      category: "technical"
    },
    {
      icon: HelpCircle,
      title: "General Questions",
      description: "Other questions or rental policy inquiries",
      category: "general"
    }
  ];

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [activeTab, setActiveTab] = useState<'faq' | 'contact' | 'topics'>('faq');

  return (
    <div className="min-h-screen bg-slate-900">
    
<CommonNavbar/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-[#0F172A]">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">How can we help you?</h1>
          <p className="text-xl text-gray-300 mb-8">Get the support you need for your camera rental experience</p>
          {/* Quick Contact Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 text-center">
                <MessageCircle className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Live Chat</h3>
                <p className="text-gray-300 text-sm mb-4">Chat with our support team</p>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  Start Chat
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 text-center">
                <Phone className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Phone Support</h3>
                <p className="text-gray-300 text-sm mb-4">Call us: (555) 123-LENS</p>
                <Button variant="outline" className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white">
                  Call Now
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 text-center">
                <Mail className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Email Support</h3>
                <p className="text-gray-300 text-sm mb-4">support@lensrentals.com</p>
                <Button variant="outline" className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white">
                  Send Email
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Support Hours */}
        <Card className="mb-12 bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Clock className="h-6 w-6 text-purple-500 mr-3" />
              <h3 className="text-lg font-semibold text-white">Support Hours</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-white mb-2">Customer Support</h4>
                <p className="text-gray-300">Monday - Friday: 8:00 AM - 8:00 PM EST</p>
                <p className="text-gray-300">Saturday - Sunday: 9:00 AM - 5:00 PM EST</p>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">Technical Support</h4>
                <p className="text-gray-300">Monday - Friday: 9:00 AM - 7:00 PM EST</p>
                <p className="text-gray-300">Emergency repairs: 24/7</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section Navigation */}
        <div className="flex justify-center gap-4 mb-8">
          <button className={`px-4 py-2 rounded ${activeTab === 'faq' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-gray-300'}`} onClick={() => setActiveTab('faq')}>FAQ</button>
          <button className={`px-4 py-2 rounded ${activeTab === 'contact' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-gray-300'}`} onClick={() => setActiveTab('contact')}>Contact Us</button>
          <button className={`px-4 py-2 rounded ${activeTab === 'topics' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-gray-300'}`} onClick={() => setActiveTab('topics')}>Support Topics</button>
        </div>
        {activeTab === 'faq' && (
          <div className="mt-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Frequently Asked Questions</CardTitle>
                <CardDescription className="text-gray-300">
                  Find quick answers to common questions about our camera rental service
                </CardDescription>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search FAQs..."
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredFAQs.map((faq, index) => (
                    <div key={index} className="border-b border-slate-700 pb-4">
                      <div className="text-white font-semibold text-left w-full">{faq.question}</div>
                      <div className="text-gray-300 mt-2">{faq.answer}</div>
                    </div>
                  ))}
                  {filteredFAQs.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-400">No FAQs found matching your search.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {activeTab === 'contact' && (
          <div className="mt-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Contact Support</CardTitle>
                <CardDescription className="text-gray-300">
                  Send us a message and we'll respond within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Name</label>
                      <Input
                        value={contactForm.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Email</label>
                      <Input
                        type="email"
                        value={contactForm.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Category</label>
                    <select
                      value={contactForm.category}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setContactForm({ ...contactForm, category: e.target.value })}
                      className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md text-white"
                    >
                      <option value="general">General Question</option>
                      <option value="equipment">Equipment Issue</option>
                      <option value="shipping">Shipping & Returns</option>
                      <option value="billing">Billing & Payments</option>
                      <option value="damage">Damage Protection</option>
                      <option value="technical">Technical Support</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Subject</label>
                    <Input
                      value={contactForm.subject}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Message</label>
                    <Textarea
                      value={contactForm.message}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContactForm({ ...contactForm, message: e.target.value })}
                      rows={5}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
        {activeTab === 'topics' && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportTopics.map((topic, index) => (
              <Card key={index} className="bg-slate-800 border-slate-700 hover:border-purple-500 transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <topic.icon className="h-8 w-8 text-purple-500 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">{topic.title}</h3>
                  <p className="text-gray-300 text-sm mb-4">{topic.description}</p>
                  <div className="flex items-center text-purple-400 text-sm">
                    <span>Get Help</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Additional Resources */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 text-center">
                <FileText className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-2">User Guide</h3>
                <p className="text-gray-300 text-sm mb-4">Complete rental guide and tips</p>
                <Button variant="outline" size="sm" className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white">
                  Download
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 text-center">
                <Settings className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-2">Equipment Manuals</h3>
                <p className="text-gray-300 text-sm mb-4">User manuals for all equipment</p>
                <Button variant="outline" size="sm" className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white">
                  Browse
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 text-center">
                <MessageSquare className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-2">Community Forum</h3>
                <p className="text-gray-300 text-sm mb-4">Connect with other photographers</p>
                <Button variant="outline" size="sm" className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white">
                  Join
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-2">Status Page</h3>
                <p className="text-gray-300 text-sm mb-4">Check service status</p>
                <Button variant="outline" size="sm" className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white">
                  View Status
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 