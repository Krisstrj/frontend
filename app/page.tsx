"use client";
import Link from "next/link";
import { 
  ArrowRightIcon, 
  ShieldCheckIcon,
  UserCircleIcon,
  ChevronDownIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-white font-semibold text-xl">DeFiShield</Link>
              <div className="hidden md:flex space-x-6">
                <Link href="/app" className="text-gray-300 hover:text-white transition-colors">DeFi App</Link>
                <Link href="/assets" className="text-gray-300 hover:text-white transition-colors">Assets</Link>
                <Link href="/features" className="text-gray-300 hover:text-white transition-colors">Features</Link>
                <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</Link>
                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors">FAQ</Link>
                <Link href="/protection" className="flex items-center text-gray-300 hover:text-white transition-colors">
                  <ShieldCheckIcon className="h-5 w-5 mr-1" />
                  Protection
                </Link>
              </div>
            </div>
            <Link 
              href="/auth" 
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
            >
              <UserCircleIcon className="h-5 w-5 mr-2" />
              Create Account
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
        
        {/* Floating Asset Nodes */}
        <div className="absolute inset-0">
          {[
            { name: "Cortex", value: "20,945", x: "20%", y: "30%" },
            { name: "Aelf", value: "15,782", x: "70%", y: "40%" },
            { name: "Quant", value: "12,456", x: "40%", y: "60%" },
            { name: "Meeton", value: "8,923", x: "80%", y: "20%" }
          ].map((node, index) => (
            <div
              key={index}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: node.x, top: node.y }}
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl group-hover:bg-blue-500/30 transition-all duration-300"></div>
                <div className="relative bg-gray-900/80 backdrop-blur-sm border border-white/10 rounded-lg p-4 shadow-lg">
                  <p className="text-white font-semibold">{node.name}</p>
                  <p className="text-blue-400">{node.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Call to Action Above Headline */}
            <div className="flex items-center justify-center space-x-2 mb-6 opacity-0 animate-[fadeIn_0.8s_ease-out_forwards]">
              <SparklesIcon className="h-5 w-5 text-blue-400" />
              <span className="text-blue-400 font-medium">Unlock Your Assets Spark!</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white opacity-0 animate-[fadeIn_0.8s_ease-out_0.2s_forwards]">
              One-click for Asset Defense
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl md:text-2xl mb-10 text-gray-300 max-w-2xl mx-auto opacity-0 animate-[fadeIn_0.8s_ease-out_0.4s_forwards]">
              Dive into the art assets, where innovative blockchain technology meets financial expertise
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-[fadeIn_0.8s_ease-out_0.6s_forwards]">
              <Link 
<<<<<<< HEAD
                href="/app" 
                className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Open App
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link 
=======
>>>>>>> 0ff9da5 (update)
                href="#features" 
                className="inline-flex items-center px-8 py-4 border border-white/20 text-lg font-medium rounded-lg text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-200"
              >
                Discover More
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Prompt */}
        <div className="absolute bottom-8 left-8 flex items-center space-x-2 text-gray-400 animate-pulse">
          <span>02/03</span>
          <span>·</span>
          <span>Scroll down</span>
          <ChevronDownIcon className="h-5 w-5" />
        </div>

        {/* Partner Logos */}
        <div className="absolute bottom-8 right-8 flex items-center space-x-8">
          {["Vercel", "Loom", "Cash App"].map((logo, index) => (
            <div key={index} className="text-gray-400 hover:text-white transition-colors">
              {logo}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}