class ReportUtils {

    saveAs(uri, filename) {
	    var  link = document.createElement('a');
	    if (typeof link.download === 'string') {
	        link.href = uri;
	        link.download = filename;

	        document.body.appendChild(link);

	        link.click();

	        document.body.removeChild(link);
	    } else {
	        window.open(uri);
	    }
    }

    saveAsCSV(data, filename) {
        this.saveAs('data:text,' + data, filename);
    }

    convertToCSV(objArray) {
        let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;

        let fields = [];
        let result = '';
        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {
                // collect field column
                if (i == 0) {
                    fields.push(index);
                }

                if (line != '') line += ','
                line += array[i][index];
            }

            //result += line + '\r\n';
            result += line + '%0A';
        }

        // gen field column
        let fieldLine = "";
        for (let k = 0; k < fields.length; k++) {
            fieldLine += fields[k] + ',';
        }
        
        return fieldLine + '%0A' + result;
    }

    convertAndSaveAsCSV(data, filename) {
        let re = this.convertToCSV(data);
        this.saveAsCSV(re, filename);
    }
}

export default ReportUtils;