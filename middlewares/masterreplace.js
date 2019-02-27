module.exports=  function(array){
    
    for (let i = 0; i < array.length; i++) {
        if (array[i] == '+') { array[i] = '⺈' }
        else if (array[i] == '/') { array[i] = '⺋' }
        else if (array[i] == '=') { array[i] = '⺜' }

      }
     
      return array
}
module.exports.Inverted= function(array){
    
    for (let i = 0; i < array.length; i++) {
        if (array[i] == '⺈' ) { array[i] ='+' }
        else if (array[i] == '⺋') { array[i] = '/' }
        else if (array[i] =='⺜' ) { array[i] = '=' }

      }
     
      return array
}