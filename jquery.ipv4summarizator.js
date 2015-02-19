/*
jQuery IPv4 Summarizator
	* Version 1.0
	* 2014-05-23 08:30
	* Description: IPv4 Summarizator
	* Author: Cristiano Ferioli
	* Copyright: Copyright 2014 Cristiano Ferioli.
	* 
	* 
	* This program is free software: you can redistribute it and/or modify
    * it under the terms of the GNU General Public License as published by
    * the Free Software Foundation, either version 3 of the License, or
    *(at your option) any later version.
	*
    * This program is distributed in the hope that it will be useful,
    * but WITHOUT ANY WARRANTY; without even the implied warranty of
    * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    * GNU General Public License for more details.
	*
    * You should have received a copy of the GNU General Public License
    * along with this program.  If not, see <http://www.gnu.org/licenses/>.
	* 
	* 
*/
	function validate(fieldValue,type="none",mandatory=false){
	
		if(!mandatory)
		{
			if(fieldValue == "")
			{
				return true;	
			}	
		}
		
		var res = /^[0-9]+$/g.test(fieldValue);
	
		if(!res){
			return false;
		}else{
			if(type == "netmask")
			{
				if(fieldValue >	32){
					return false;	
				}else{
					return true;	
				}
			}
			else
			{	
				if(fieldValue >	255){
					return false;	
				}else{
					return true;	
				}
			}		
		}	
	}

	function decTobin(number){
		
		var result = Math.floor(number / 2);
		var mod = String(number % 2);
		
		while(result != 0){
			mod = String(result % 2)+mod
			result = Math.floor(result / 2);
		}	
		
		while(mod.length != 8){
			mod = "0"+mod	
		}
		
		return mod;
	}
	
	function binTodec(binary){
		
		//reverse binay string
		binary = binary.split("").reverse().join("");
		decimal = 0;
		
		for(i=0;i<binary.length;i++)
		{
			if(binary[i] == 1)
			{
				decimal = decimal + Math.pow(2,i)
			}	
		}
		
		return decimal;
	}

	function dottedDecToBin(dottedDec){
		
		dottedArray = dottedDec.split(".");
		finalres = "";
		for (var i = 0; i < dottedArray.length; i++) {
			if(i < dottedArray.length -1){
				finalres = finalres+decTobin(dottedArray[i])+".";
			}else{
				finalres = finalres+decTobin(dottedArray[i]);
			}	
		}
		
		return finalres
	}	
	
	function dottedBinToDec(dottedBin){
		
		dottedArray = dottedBin.split(".");
		finalres = "";
		for (var i = 0; i < dottedArray.length; i++) {
			if(i < dottedArray.length -1){
				finalres = finalres+binTodec(dottedArray[i])+".";
			}else{
				finalres = finalres+binTodec(dottedArray[i]);
			}	
		}
		
		return finalres
	}

	function addDots(binaryString){
		
		var newString = "";
		
		for(i=0;i<binaryString.length;i++)
		{
			if(i == 8 || i == 16 || i == 24)
			{
				newString = newString+"."
			}	
			
			newString = newString+binaryString[i]
		}
	
		return newString
	}
	
	function removeDots(string){
		string = string.replace(/\./g,'');
		return string
	}

	function summarizeNow(networks){
		
		$('#ipsum_resultbox').html("");
		
		var searchedChar = "";
		var commonChars = "";
		var searchedFound = false;
		
		for(var i=1; i <= 32;i++){

			searchedChar = removeDots(dottedDecToBin(networks[0][0])).charAt(i-1);
			for(var j=0;j < networks.length;j++){

				if(searchedChar == removeDots(dottedDecToBin(networks[j][0])).charAt(i-1)){
					searchedFound = true;
				}
				else{
					searchedFound = false;	
				}		
			}	
		
			if(searchedFound == false){
				break;	
			}
			else{
				commonChars = commonChars + searchedChar;	
			}		
		}
		
		
		//define summarized network's subnetmask in slash format and print network info
		var content_table = "<table id=\"ipsum_res_table\"></table>";
		var formattedNet = "";
		var minNetMask = commonChars.length;
		$('#ipsum_resultbox').append(content_table);
		var net_info = "";
		for(var k=0;k < networks.length;k++){

			formattedNet = "<span class=\"common_part\">"+addDots(commonChars)+"</span>"+dottedDecToBin(networks[k][0]).substring(addDots(commonChars).length);
			net_info = "<tr><td class=\"decimal\">"+networks[k][0]+"</td><td class=\"netmask\">/"+networks[k][1]+"</td><td class=\"binary\">"+formattedNet+"</td></tr>";
			$("#ipsum_res_table").append(net_info);
		}
		
		var lengthtouse = commonChars.length;
		var summarizedBin = commonChars
		for(var x = 1; x <= (32 - lengthtouse);x++){
			summarizedBin = summarizedBin + "0";
		}
		
		//define summarized network's address in dotted binary and decimal format
		var summarizednetBin = addDots(summarizedBin);
		var summarizednetDec = dottedBinToDec(summarizednetBin);
		
		formattedNet = "<span class=\"common_part\">"+addDots(commonChars)+"</span>"+summarizednetBin.substring(addDots(commonChars).length);
		net_info = "<tr class=\"summarized\"><td class=\"decimal\">"+summarizednetDec+"</td><td class=\"netmask\">/"+minNetMask+"</td><td class=\"binary\">"+formattedNet+"</td></tr>";
		$("#ipsum_res_table").append(net_info);
		//alert(summarizednetBin);
		//alert(summarizednetDec);
		//alert(minNetMask);
		
		
		$('#ipsum_resultbox').show();
	}

	//MAIN FUNCTION
	$.fn.ipv4summarizator = function(){
		
		var fields_container = "<div id=\"ipsum_input_fields\"></div>";
		var fields_table = "<table id=\"ipsum_networks\"><tr id=\"ipsum_net-0\"><td><input id=\"f1-0\" name=\"f1-0\" type=\"text\" maxlength=3></td><td>.</td><td><input id=\"f2-0\" name=\"f2-0\" type=\"text\" maxlength=3></td><td>.</td><td><input id=\"f3-0\" name=\"f3-0\" type=\"text\" maxlength=3></td><td>.</td><td><input id=\"f4-0\" name=\"f4-0\" type=\"text\" maxlength=3></td><td>/</td><td><input id=\"netmask-0\" name=\"netmask-0\" type=\"text\" placeholder=\"netmask\"></td></tr><tr id=\"ipsum_net-1\"><td><input id=\"f1-1\" name=\"f1-1\" type=\"text\" maxlength=3></td><td>.</td><td><input id=\"f2-1\" name=\"f2-1\" type=\"text\" maxlength=3></td><td>.</td><td><input id=\"f3-1\" name=\"f3-1\" type=\"text\" maxlength=3></td><td>.</td><td><input id=\"f4-1\" name=\"f4-1\" type=\"text\" maxlength=3></td><td>/</td><td><input id=\"netmask-1\" name=\"netmask-1\" type=\"text\" placeholder=\"netmask\"></td></tr></table>";
		var button_box = "<div id=\"ipsum_buttonbox\"><input id=\"nets\" name=\"nets\" type=\"hidden\" value=\"2\"><input id=\"summarize\" name=\"summarize\" class=\"ipsum_submit\" type=\"button\" value=\"Summarize\"><input id=\"addnet\" name=\"addnet\" class=\"ipsum_submit\" type=\"button\" value=\"Add Network\"></div>";
		var error_box = "<div id=\"ipsum_errorbox\"></div>";
		var result_box = "<div id=\"ipsum_resultbox\"></div>";
		
		$(this).append("<div id=\"ipsum_main_container\"></div>");
		$("#ipsum_main_container").append(fields_container);
		$("#ipsum_main_container").append(error_box);
		$("#ipsum_main_container").append(button_box);
		$("#ipsum_main_container").append(result_box);
		$("#ipsum_input_fields").append(fields_table);
			
		$('#ipsum_errorbox').hide();
		$('#ipsum_resultbox').hide();		
			
		$("#addnet").click(function() {	
			var netsnumber = $("#nets").val();
			var newnet = "<tr id=\"ipsum_net-"+netsnumber+"\"><td><input id=\"f1-"+netsnumber+"\" name=\"f1-"+netsnumber+"\" type=\"text\"></td><td>.</td><td><input id=\"f2-"+netsnumber+"\" name=\"f2-"+netsnumber+"\" type=\"text\"></td><td>.</td><td><input id=\"f3-"+netsnumber+"\" name=\"f3-"+netsnumber+"\" type=\"text\"></td><td>.</td><td><input id=\"f4-"+netsnumber+"\" name=\"f4-"+netsnumber+"\" type=\"text\"></td><td>/</td><td><input id=\"netmask-"+netsnumber+"\" name=\"netmask-"+netsnumber+"\" type=\"text\" placeholder=\"netmask\"></td></tr>";
			$("#nets").val(parseInt(netsnumber)+1);
			$("#ipsum_networks").append(newnet);
		});	
			
		$("#summarize").click(function() {	
			
			var netsnumber = $("#nets").val();
			var f1;
			var f2;
			var f3;
			var f4;
			var netmask;
			
			var r1;
			var r2;
			var r3;
			var r4;
			var rnet;
			
			var errors = false;
			var values = new Array();
			var net_val;
			var all_empty = false;
			
			for(var i = 0;i < netsnumber; i++){
				
				net_val = new Array;
				all_empty = false;
				f1 = $("#f1-"+i).val();
				f2 = $("#f2-"+i).val();
				f3 = $("#f3-"+i).val();
				f4 = $("#f4-"+i).val();
				netmask = $("#netmask-"+i).val();	
				net_val = new Array();
				
				//validate fields
				if(i == 0 || i == 1){
					
					r1 = validate(f1,"none",true);
					r2 = validate(f2,"none",true);
					r3 = validate(f3,"none",true);
					r4 = validate(f4,"none",true);
					rnet = validate(netmask,"netmask",true);
				}else{
					
					//all fields are empty
					if(f1 == "" && f2 == "" && f3 == "" && f4 == "" && netmask == "")
					{
						r1 = true;
						r2 = true;
						r3 = true;
						r4 = true;
						rnet = true;
						
						all_empty = true;
					}
					else
					{
						r1 = validate(f1,"none",true);
						r2 = validate(f2,"none",true);
						r3 = validate(f3,"none",true);
						r4 = validate(f4,"none",true);
						rnet = validate(netmask,"netmask",true);
					}	
				}
								
				if(!r1 || !r2 || !r3 || !r4 || !rnet)
				{
					errors = true;
				}
				else
				{
					if(!all_empty)
					{
						net_val[0] = f1+"."+f2+"."+f3+"."+f4
						net_val[1] = netmask;
						
						values.push(net_val);
					}		
				}		
			}
			
			if(errors)
			{
				$('#ipsum_errorbox').html("");
				$('#ipsum_errorbox').append("<p>Invalid values entered</p><p>Please note: you have to provide a minimum of two valid ip network addresses and netmask values.</p>");	
				$('#ipsum_errorbox').show();
				$('#ipsum_resultbox').hide();	
			}
			else
			{
				$('#ipsum_errorbox').hide();
				summarizeNow(values)
			}						
		});		
	}	