// Unimplemented sorting functionality for the cards to maintain index across backend and frontend
function sort_by_key(array, key)
{
 return array.sort(function(a, b)
 {
  var x = a[key]; var y = b[key];
  return ((x < y) ? -1 : ((x > y) ? 1 : 0));
 });
}


function processCardState(data){
  /**
  Takes in all cards and splits it up into three columns using its
  card state attribute
  */
  var column1 = [];
  var column2 = [];
  var column3 = [];
  if(data !== []){
    for(const taskIndex in data){
      if(data[taskIndex].cardState === 1){
        column1.push(data[taskIndex])
      }
      else if(data[taskIndex].cardState === 2){
        column2.push(data[taskIndex])
      }
      else if(data[taskIndex].cardState === 3){
        column3.push(data[taskIndex])
      }
      else{
        console.log("Process Card State Error")
      }
    }

  return [column1, column2, column3]
  }
  return [[], [], []]
}

export default processCardState
