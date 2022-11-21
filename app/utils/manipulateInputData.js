export function manipulateInputData(d){

  const data = d.slice(100).map((el) => ({ ...el, "region": Math.floor(Math.random() * 4) }))
  .map((el) => ({ ...el, "regionCluster": `${el.region}-${Math.floor(Math.random() * 6)}` }))
  .filter((arr, index, self) =>
    index === self.findIndex((t) => (t.fr_id === arr.fr_id))
  )

  return data
  }
