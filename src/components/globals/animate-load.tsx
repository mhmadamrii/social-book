export function AnimateLoad() {
  return (
    <div className="flex items-center justify-center space-x-2 dark:invert">
      <span className="sr-only">Loading...</span>
      <div className="h-5 w-5 animate-bounce rounded-full bg-black [animation-delay:-0.3s]"></div>
      <div className="h-5 w-5 animate-bounce rounded-full bg-black [animation-delay:-0.15s]"></div>
      <div className="h-5 w-5 animate-bounce rounded-full bg-black"></div>
    </div>
  );
}
