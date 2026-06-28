export default function ContributorPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white border-4 border-black p-8 shadow-neobrutalism max-w-lg w-full">
        <h1 className="text-4xl font-bold font-mono text-black mb-4">
          Welcome, Contributor!
        </h1>
        <p className="text-lg font-sans text-gray-800 mb-6">
          This is your dedicated onboarding page. Here you'll set up your profile
          and get started with contributing to the platform.
        </p>
        <div className="border-2 border-dashed border-gray-400 p-4 bg-gray-50">
          <p className="text-md font-mono text-gray-700">
            Further steps for contributor setup will be implemented here.
          </p>
        </div>
      </div>
    </div>
  );
}