export const meta = () => {
  return [{ title: 'Offers Wants Aggregator' }]
}

export default function Index() {
  return (
    <div className="flex h-screen flex-col justify-center gap-8">
      <div className="flex justify-center gap-4">
        <div className="w-3/4 rounded-lg bg-stone-700 p-4">
          <h1 className="text-center text-3xl">Offers Wants Aggregator</h1>
        </div>
      </div>
      <div className="flex justify-center gap-4">
        <div className="w-1/4 rounded-lg bg-orange-500 p-4 text-center text-5xl">
          A
        </div>
        <div className="w-1/4 rounded-lg bg-yellow-500 p-4 text-center text-5xl">
          B
        </div>
        <div className="w-1/4 rounded-lg bg-rose-500 p-4 text-center text-5xl">
          C
        </div>
      </div>
    </div>
  )
}
