  
  //var myArray = []
    //buildTable(myArray);

	fetch("https://api.rawg.io/api/games?key=8d8b50415fd74e3baf7e69ac2f959516", {
		"method": "GET",
	  })
	  /*
	  .then(response => {
		console.log(response);
	  })
	  */
	  .then(response => response.json())
	  .then(data => {
		console.log(data), myArray = data
	   // buildTable(myArray)
	  })
	  .catch(err => {
		console.error(err);
  
		
	  });
	  /*
	  function buildTable(data){
		  var table = document.getElementById('myTable')
  
		  for (var i = 0; i < data.length; i++){
			  var row = `<tr>
							  <td>${data[i].name}</td>
							  <td>${data[i].id}</td>
						</tr>`
			  table.innerHTML += row
		  }
	  }
  */
  
	  