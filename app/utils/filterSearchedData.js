export function filterSearchedData(data, knnIDs, setTopLevelStreamDataObj, setSearchResults) {
  const filteredResults = knnIDs.filter(a => a['score'] > 0.25)
  console.log("FILTERED RESULTS", filteredResults)

  let dataIDs = filteredResults.map(a => a.id)

  console.log("DATA IDS", dataIDs)
  const filteredData = data.filter(({ fr_id }) => dataIDs.includes(fr_id))

  console.log("FILTERED SEARCH DATA!", filteredData)

  const sortedFilteredData = filteredData.slice().sort(function(a, b){
    return dataIDs.indexOf(a.fr_id) - dataIDs.indexOf(b.fr_id)
  }).map(function(a){
    const el = filteredResults.find(element => element.id === a.fr_id)
    return {...a, "score": el.score}
  })

  console.log("SORTED FILTERED DATA", sortedFilteredData)

  setTopLevelStreamDataObj(sortedFilteredData)
  setSearchResults(dataIDs)
}
