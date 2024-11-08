export function RightBar() {
  return (
    <aside className="sticky top-[5.25rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80">
      <WhoToFollow />
      <TrendingTopics />
    </aside>
  );
}

function WhoToFollow() {
  return (
    <div className="space-y-5 rounded-2xl bg-card bg-slate-900 p-5 shadow-sm">
      <div className="text-xl font-bold">Who to follow</div>
    </div>
  );
}

function TrendingTopics() {
  return (
    <div className="space-y-5 rounded-2xl bg-card bg-slate-900 p-5 shadow-sm">
      <div className="text-xl font-bold">Trending Topics</div>
    </div>
  );
}
