export async function SplashScreen() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center justify-center space-x-2 dark:invert">
        <span className="sr-only">Loading...</span>
        <div className="h-5 w-5 animate-bounce rounded-full bg-black [animation-delay:-0.3s]"></div>
        <div className="h-5 w-5 animate-bounce rounded-full bg-black [animation-delay:-0.15s]"></div>
        <div className="h-5 w-5 animate-bounce rounded-full bg-black"></div>
      </div>
    </main>
  );
}
