export default function TestCSSPage() {
  return (
    <div className="min-h-screen bg-red-500 flex items-center justify-center">
      <div className="bg-blue-500 text-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4">CSS Test</h1>
        <p className="text-lg">If you can see this styled, TailwindCSS is working!</p>
        <div className="mt-4 space-y-2">
          <div className="bg-green-500 p-2 rounded">Green box</div>
          <div className="bg-yellow-500 p-2 rounded">Yellow box</div>
          <div className="bg-purple-500 p-2 rounded">Purple box</div>
        </div>
      </div>
    </div>
  );
} 