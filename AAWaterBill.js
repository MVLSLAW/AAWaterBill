var casper = require('casper').create();

casper.options.waitTimeout = 3000;
var address = "7807 Maple Run Ct";
address = address.replace(/_/g," ");
function splitAddress(address){
  var sAddy = address.split(' '); //splits address
  var jAddy = [];//this will be the array that will hold the number in index 0 and the adress in index 1

  jAddy.push(sAddy[0]);// pushes the number to index 0
  //jAddy.split(" ");
  sAddy.shift();// removes number from index 0
  var sjA = sAddy.join(" ");//joins the rest of the address together
  jAddy.push(sAddy.join(" "));//pushes it to index 1

  return jAddy;
}

var addressSplit=splitAddress(address);

console.log(addressSplit);//Console check to see if the address was split correctly

casper.start('https://aacounty.munisselfservice.com/citizens/UtilityBilling/Default.aspx', function() {
   // Wait for the page to be loaded
   this.waitForSelector('ctl00_ctl00_PrimaryPlaceHolder_ContentPlaceHolderMain_Control_AddressSearchFieldLayout_ctl01_StreetNumberTextBox');
   this.waitForSelector('ctl00_ctl00_PrimaryPlaceHolder_ContentPlaceHolderMain_Control_StreetNameSearchFieldLayoutItem_ctl01_StreetNameTextBox');
   this.waitForSelector('ctl00_ctl00_PrimaryPlaceHolder_ContentPlaceHolderMain_Control_FormLayoutItem7_ctl01_Button1');
});
console.log("Waiting on page...");//
casper.then(function() {
	//var fixed_address = fixAddress(address);
	this.sendKeys('ctl00_ctl00_PrimaryPlaceHolder_ContentPlaceHolderMain_Control_AddressSearchFieldLayout_ctl01_StreetNumberTextBox', addressSplit[0]);
  this.sendKeys('#ctl00_ctl00_rootMasterContent_LocalContentPlaceHolder_ucServiceAddress_txtServiceAddress', addressSplit[1]);
	this.click('ctl00_ctl00_PrimaryPlaceHolder_ContentPlaceHolderMain_Control_FormLayoutItem7_ctl01_Button1');
});
console.log("Navigating to second page...");//
casper.then(function() {
	//var fixed_address = fixAddress(address);
	this.click('ctl00_ctl00_PrimaryPlaceHolder_ContentPlaceHolderMain_AccountsGridView_ctl02_BillsLink');
});
console.log("Navigating to third page...");//
//Capture Information

casper.then(function() {
	//var fixed_address = fixAddress(address);
	this.click('ctl00_ctl00_PrimaryPlaceHolder_ContentPlaceHolderMain_OutstandingBillsGrid_ctl02_OutstandingDetailsButton');
});

console.log("Navigating to fourth and final page...");//


casper.then(function() {

	this.wait(5000, function() {
		var currentwaterbill = "UNKNOWN";
    console.log("2");
		if(this.exists('ctl00_ctl00_PrimaryPlaceHolder_ContentPlaceHolderMain_TotalLabel')){
			currentwaterbill = this.fetchText('ctl00_ctl00_PrimaryPlaceHolder_ContentPlaceHolderMain_TotalLabel');
      console.log("3");
      console.log("The Current water bill is: $"+currentwaterbill);
			//this.echo("Current Water Bill: " + currentwaterbill);
			var screenshot_name = "Water_Bill_" + address.replace(/ /g,"_") + '.pdf';
			casper.capture("/var/www/html/API_Backend/Screenshots/" + screenshot_name);
			var info = {'CurrentWaterBill':currentwaterbill};
			returnarray['info'] = info;
			returnarray['result']['result'] = 'Success';
			returnarray['screenshot'] = screenshot_name;
		}else{
			//this.echo("House not found");
			returnarray['result']['reason'] = 'Water bill id did not load on second page.';

		}

		this.echo(JSON.stringify(returnarray));

	});

});
/*
function fixAddress(address){
	address[1] = address[1].trim();
	var addressarray = address[1].split(" ");
	for(var x = 0;x < addressarray[1].length;x++){
		switch(addressarray[x]){
			case "Avenue":
				addressarray[x] = "Ave";
				break;
			case "Street":
				addressarray[x] = "St";
				break;
			case "Road":
				addressarray[x] = "Rd";
				break;
			case "Drive":
				addressarray[x] = "Dr";
				break;
			case "Circle":
				addressarray[x] = "Cr";
				break;
			case "Terrace":
				addressarray[x] = "Terr";
				break;
			case "Boulevard":
				addressarray[x] = "Bvld";
				break;
			case "Court":
				addressarray[x] = "Ct";
				break;
			case "North":
				addressarray[x] = "N";
				break;
			case "South":
				addressarray[x] = "S";
				break;
			case "West":
				addressarray[x] = "W";
				break;
			case "East":
				addressarray[x] = "E";
				break;
		}
	}
	return addressarray.join(" ");
}*/

casper.run();
