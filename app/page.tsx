export default function Home() {
  return (
    <main className="min-h-screen bg-yellow-300 flex items-center justify-center p-4 sm:p-8 font-mono">
      <div className="bg-white border-4 border-black p-8 sm:p-12 shadow-[8px_8px_0_0_#000] max-w-2xl w-full">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-black mb-4 sm:mb-6 leading-tight">
          Welcome to <span className="text-red-600">Project Apex</span>
        </h1>
        <p className="text-lg sm:text-xl text-black mb-6 sm:mb-8 border-b-2 border-black pb-4">
          Your journey into Neobrutalism-inspired development begins here. Get ready to build something bold!
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="/auth/signin"
            className="inline-block bg-black text-white text-lg sm:text-xl px-6 py-3 border-2 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] active:shadow-[0px_0px_0_0_#000] transition-all duration-100 ease-in-out text-center"
          >
            Sign In
          </a>
          <a
            href="/about"
            className="inline-block bg-white text-black text-lg sm:text-xl px-6 py-3 border-2 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] active:shadow-[0px_0px_0_0_#000] transition-all duration-100 ease-in-out text-center"
          >
            Learn More
          </a>
        </div>
      </div>
    </main>
  );
}