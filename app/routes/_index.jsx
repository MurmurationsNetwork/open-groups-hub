export const meta = () => {
  return [{ title: 'Offers Wants Aggregator' }]
}

export default function Index() {
  return (
    <div className="flex flex-col justify-center h-screen gap-8">
      <div className="flex justify-center gap-4">
        <div className="w-3/4 bg-stone-700 rounded-lg p-4">
          <h1 className="text-3xl text-center">Offers Wants Aggregator</h1>
        </div>
      </div>
      <div className="flex justify-center gap-4">
        <div className="bg-orange-500 w-1/4 rounded-lg p-4 text-center text-5xl">
          A
        </div>
        <div className="bg-yellow-500 w-1/4 rounded-lg p-4 text-center text-5xl">
          B
        </div>
        <div className="bg-rose-500 w-1/4 rounded-lg p-4 text-center text-5xl">
          C
        </div>
      </div>
    </div>
  )
}
