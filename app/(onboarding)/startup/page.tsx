import Link from 'next/link';

export default function StartupPage() {
  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center p-4">
      <div className="bg-yellow-300 border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] p-8 md:p-12 w-full max-w-lg text-center font-mono">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 uppercase tracking-tight leading-tight">
          Welcome Aboard!
        </h1>
        <p className="text-lg md:text-xl mb-8 leading-relaxed">
          Your journey begins now. Let's get you set up and ready to go.
        </p>
        <Link
          href="/onboarding/profile"
          className="inline-block bg-black text-white text-xl md:text-2xl font-extrabold px-8 py-4 border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] transition-all duration-100 ease-in-out cursor-pointer uppercase no-underline hover:bg-gray-800"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}