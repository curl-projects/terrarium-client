// Unimplemented sorting functionality for the cards to maintain index across backend and frontend
function sort_by_key(array, key)
{
 return array.sort(function(a, b)
 {
  var x = a[key]; var y = b[key];
  return ((x < y) ? -1 : ((x > y) ? 1 : 0));
 });
}


export function processCardState(data){
  /**
  Takes in all cards and splits it up into three columns using its
  card state attribute
  */
  console.log("PROCESSING CARD STATE", data)


  var column1 = [];
 
  if(data !== []){
    for(const featureIndex in data){
      if(data[featureIndex].columnState === 1){
        column1.push(data[featureIndex])
      }
      else{
        console.log("Process Card State Error")
      }
    }

    column1.sort((a,b)=>a.rankState-b.rankState)


  return [column1]
  }
  return [[], [], []]
}
