/***
	JQuery application to read a CSV with students and notes and export another with the score obtained by applying the Gaussian bell.
***/

function sortByCol(arr, colIndex){		// Sort by column
    arr.sort(sortFunction);
	
    function sortFunction(a, b) {
        a = parseFloat(a[colIndex].replace(',', '.'));		// Make sure it compares "95,5" right
        b = parseFloat(b[colIndex].replace(',', '.'));
        return (a === b) ? 0 : (a < b) ? 1 : -1;
    }
}

$(function () {
    $("#upload").on("click", function () {
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
		
        if (regex.test($("#fileUpload").val().toLowerCase())) {
            if (typeof (FileReader) != "undefined") {
                var reader = new FileReader();
				
				$(".spinner").toggleClass("hidden show");
				
                reader.onload = function (e) {
					var result = [];								// Matrix with results
					var result_row;
                    var rows = e.target.result.split("\n");
					
					// Read file
                    for (var i = 1; i < rows.length; i++) {			// Skip first row
                        var cells = rows[i].split(/[,;]+/);			// Delimeter can be comma or semicolon
						result_row = []
						
                        for (var j = 0; j < cells.length; j++) {
							cells[j] = String(cells[j]).replace(/[^A-Z0-9a-zñÑ.,;:-_@ ]/ig,'');	// Clean
							
							if(cells[j] != ""){
								result_row.push(cells[j]);
							}
                        }
                        
						if (result_row.length > 0){
							result.push(result_row);
						}
                    }
					
					// Sort matrix by notes from higher to lower
					sortByCol(result, 1);
					
					// Assing notes
					var result_len = result.length;
					for(var i = 0; i < result_len; i++){
						if(i < result_len * 0.1){			// A
							result[i].push("A");
							result[i].push("100");
						}
						else if(i < result_len * 0.2){		// B+
							result[i].push("B+");
							result[i].push("85");
						}
						else if(i < result_len * 0.9){		// B
							result[i].push("B");
							result[i].push("75");
						}
						else if(i < result_len * 0.95){		// B-
							result[i].push("B-");
							result[i].push("65");
						}
						else{								// C
							result[i].push("C");
							result[i].push("25");
						}
					}
					
					// Build CSV
					var result_csv = "Identificador Alumno;Puntuación Obtenida; Letra Obtenida; Puntuación Campana;\r\n";
					for(var i = 0; i < result_len; i++){
						for(var j = 0; j < result[i].length; j++){
							result_csv += result[i][j] + ";";
						}
						result_csv += "\r\n";
					}
					
					$(".spinner").toggleClass("hidden show");
					
					// Build and serve file
					var filename = "resultado_camapana.csv";
					var blob = new Blob([result_csv], {type: 'text/csv; charset=utf-8;'});
					if(window.navigator.msSaveOrOpenBlob) {
						window.navigator.msSaveBlob(blob, filename);
					}
					else{									// if browser does not support Blob
						var elem = window.document.createElement('a');
						elem.href = window.URL.createObjectURL(blob);
						elem.download = filename;        
						document.body.appendChild(elem);
						elem.click();        
						document.body.removeChild(elem);
					}
                }
				
                reader.readAsText($("#fileUpload")[0].files[0]);
            } else {
                alert("This browser does not support HTML5.");
            }
        } else {
            alert("Please upload a valid CSV file.");
        }
    });
});
