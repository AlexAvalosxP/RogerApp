function loadMesasPedido()
{
	menuMesas = document.getElementById('menuMesas');

	var ajax = new XMLHttpRequest();
    ajax.open('GET', "http://192.168.1.85/Roger/PHP/GetMesas.php", true);
    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ajax.send();
    ajax.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {
    		var response = JSON.parse(ajax.responseText);
    		console.log(response);
    		
    		for (var i = 0; i < Object.keys(response).length; i++) {
    			menuMesas.innerHTML += '<button id="' + response[i].id + '" onclick="window.location.assign(\'pedido.html?id=' + response[i].id + '\')">' + response[i].name + '</button>';
    		}	
    	}
	}
}

function firstLoad()
{
	ingElemIndex = 0;
	mesaN = "";
	prices = false;

	var ajaxJSONprod = new XMLHttpRequest();
	ajaxJSONprod.open('POST', "http://192.168.1.85/Roger/PHP/GetJSONprod.php", true);
    ajaxJSONprod.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ajaxJSONprod.send();
    ajaxJSONprod.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {
    		var response = ajaxJSONprod.responseText;
    		//console.log(response);
    		document.getElementById("hiddenJSON").innerHTML = response;

    		var ajaxJSONcode = new XMLHttpRequest();
			ajaxJSONcode.open('POST', "http://192.168.1.85/Roger/PHP/GetJSONcode.php", true);
		    ajaxJSONcode.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		    ajaxJSONcode.send();
		    ajaxJSONcode.onreadystatechange = function() {
		    	if (this.readyState == 4 && this.status == 200) {
		    		var responseC = ajaxJSONcode.responseText;

		    		document.getElementById("hiddenJSONcde").innerHTML = responseC;

		    		selectOption();
		    	}
		    }
    	}
	}
}

function selectOption()
{
	rootJSON = JSON.parse(document.getElementById("hiddenJSON").innerHTML);
	rootJSONcde = JSON.parse(document.getElementById("hiddenJSONcde").innerHTML);

	var urlParams = new URLSearchParams(window.location.search);
	id = urlParams.get('id');

	mesaN = id;

	var ajax = new XMLHttpRequest();
    ajax.open('POST', "http://192.168.1.85/Roger/PHP/GETpedido.php", true);
    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ajax.send('m=' + id);
    ajax.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {
    		var response = ajax.responseText;
    		//console.log(response);
    		
    		if (response == "[]")
    		{
    			loadMesa();
    		} 
    		else
    		{
    			loadMenuMesa(response);
    		}
    	}
	}
}

function loadMenuMesa(jsonRes)
{
	//console.log("Menu mesa");
	//loadMesa();

	var ajaxM = new XMLHttpRequest();
    ajaxM.open('POST', "http://192.168.1.85/Roger/PHP/GetMesaById.php", true);
    ajaxM.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ajaxM.send("id=" + parseInt(mesaN));
    ajaxM.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {
    		var responseM = JSON.parse(ajaxM.responseText);
    		//console.log(responseM);
    		
    		document.getElementById('dMesa').innerHTML = responseM[0].name;
    	}
	}

	loadOptionsMesa();

	pedidoJson = JSON.parse(jsonRes);

	for (i = 0; i < Object.keys(pedidoJson).length; i++)
	{
		ingElemIndex = ingElemIndex + 1;

		newH3 = document.createElement('h3');
		newH3.setAttribute('id', 'qtyP' + ingElemIndex);
		newH3.setAttribute('class', 'iQty');
		newH3.innerHTML = pedidoJson[i].cant;

		newH3_2 = document.createElement('h3');
		newH3_2.setAttribute('id', 'nmP' + ingElemIndex);
		newH3_2.setAttribute('class', 'iNm');
		newH3_2.innerHTML = pedidoJson[i].prodNm;

		newButtonPs = document.createElement('button')
		newButtonPs.setAttribute("onclick", "incProd('" + ingElemIndex + "')");
		newButtonPs.innerHTML = "+";
		newButtonPs.setAttribute("class", "btnControl");
		newButtonPs.setAttribute('hidden', 'true');

		newButtonMs = document.createElement('button')
		newButtonMs.setAttribute("onclick", "decProd('" + ingElemIndex + "', '" + ingElemIndex + "')");
		newButtonMs.innerHTML = "-";
		newButtonMs.setAttribute("class", "btnControl");
		newButtonMs.setAttribute('hidden', 'true');

		newButtonSn = document.createElement('button')
		newButtonSn.setAttribute("onclick", "editProd('" + pedidoJson[i].prodId + "', '" + pedidoJson[i].prodNm + "', '" + ingElemIndex + "', " + parseInt(pedidoJson[i].index1) + ", " + parseInt(pedidoJson[i].index2) + ")");
		newButtonSn.innerHTML = "S/";
		newButtonSn.setAttribute("class", "btnControl");
		newButtonSn.setAttribute('hidden', 'true');

		newH2_hidden = document.createElement('h2');
		newH2_hidden.setAttribute('class', 'pricesP');
		newH2_hidden.setAttribute('id', 'pricesP' + ingElemIndex);
		newH2_hidden.setAttribute('hidden', 'true');
		newH2_hidden.innerHTML = "$" + pedidoJson[i].priceP.toFixed(2);

		newH2_show = document.createElement('h2');
		newH2_show.setAttribute('class', 'pricesPshow');
		newH2_show.setAttribute('id', 'pricesPshow' + ingElemIndex);
		newH2_show.innerHTML = "$" + (pedidoJson[i].priceP * pedidoJson[i].cant).toFixed(2);;

		newDiv_hidden = document.createElement('div');
		newDiv_hidden.setAttribute('id', pedidoJson[i].prodId);
		newDiv_hidden.setAttribute('hidden', 'true');

		newDiv_hidden2 = document.createElement('div');
		newDiv_hidden2.setAttribute('class', 'indexes');
		newDiv_hidden2.setAttribute('hidden', 'true');
		newDiv_hidden2.innerHTML = pedidoJson[i].index1 + "," + pedidoJson[i].index2;

		newH3_hidden = document.createElement('h3');
		newH3_hidden.setAttribute('class', 'catTypes');
		newH3_hidden.setAttribute('hidden', 'true');
		newH3_hidden.innerHTML = pedidoJson[i].cat;

		newDiv = document.createElement('div');
		newDiv.setAttribute('class', 'pItem');
		newDiv.setAttribute('id', 'prod' + ingElemIndex);

		newDiv2 = document.createElement('div');
		newDiv2.setAttribute('class', 'extraIng');
		newDiv2.setAttribute('id', 'prodEx' + ingElemIndex);

		newDiv.appendChild(newH3);
		newDiv.appendChild(newH3_2);
		newDiv.appendChild(newButtonSn);
		newDiv.appendChild(newButtonPs);
		newDiv.appendChild(newButtonMs);
		newDiv.appendChild(newDiv_hidden);
		newDiv.appendChild(newDiv_hidden2);
		newDiv.appendChild(newH3_hidden);
		newDiv.appendChild(newH2_hidden);
		newDiv.appendChild(newH2_show);

		for (j = 0; j < Object.keys(pedidoJson[i].extra).length; j++)
		{
			if (pedidoJson[i].extra[j].type == "Sn")
			{
				newDiv2.innerHTML += "<div><h1 id='exProd" + pedidoJson[i].extra[j].ingId + "'>Sn/ " + pedidoJson[i].extra[j].ingNm + "</h1><h2 class='pricesI' hidden='true'>$0.00</h2><h2 class='pricesIshow' hidden='true'>$0.00</h2></div></div>";
			}
			else
			{
				newDiv2.innerHTML += "<div><h1 id='exProd" + pedidoJson[i].extra[j].ingId + "'>Ex/ " + pedidoJson[i].extra[j].ingNm + "</h1><h2 class='pricesI' hidden='true'>$" + pedidoJson[i].extra[j].priceI.toFixed(2) + "</h2><h2 class='pricesIshow'>$" + (pedidoJson[i].extra[j].priceI * pedidoJson[i].cant).toFixed(2) + "</h2></div></div>";	
			}
		}

		iList = document.getElementById("itemList");
		iList.appendChild(newDiv);
		iList.appendChild(newDiv2);
	}

}

function switchPrices()
{
	cntrl = document.getElementsByClassName('btnControl');
	prcs = document.getElementsByClassName('pricesPshow');
	if (prices)
	{
		for (i = 0; i < cntrl.length; i++)
		{
			cntrl[i].hidden = false;
		}

		for (i = 0; i < prcs.length; i++)
		{
			prcs[i].hidden = true;
		}

		prices = false;
	}
	else
	{
		for (i = 0; i < cntrl.length; i++)
		{
			cntrl[i].hidden = true;
		}

		for (i = 0; i < prcs.length; i++)
		{
			prcs[i].hidden = false;
		}


		prices = true;
	}
}

function loadOptionsMesa()
{
	menu = document.getElementById("menuList");
	menu.innerHTML = "";

	menu.innerHTML += "<button onclick='loadMesa()'>Editar pedido</button>";
	menu.innerHTML += "<button onclick='showCuenta()'>Liberar mesa (cuenta)</button>";
	menu.innerHTML += "<button onclick='cancelPedido()'>Cancelar pedido</button>";
}

function showCuenta()
{
	//prcs = document.getElementsByClassName('pricesP');

	//for (i = 0; i < prcs.length; i++)
	//{
	//	prcs[i].hidden = false;
	//}

	extraArray = document.getElementsByClassName('extraIng');
	pricesArray = document.getElementsByClassName('pricesPshow');

	totalCta = 0;

	for (i = 0; i < extraArray.length; i++)
	{
		extraArr = [];

		for (j = 0; j < extraArray[i].childNodes.length ; j ++)
		{
			totalCta += parseFloat(extraArray[i].childNodes[j].childNodes[2].innerText.substring(1))
		}

		totalCta += parseFloat(pricesArray[i].innerText.substring(1))
	}

	menu.innerHTML = "<div><h2>Total a cobrar:</h2><h3>$" + totalCta.toFixed(2) + "<h3><h2>Descuento:</h2><input type='text' id='discountDesc' placeholder='Concepto'><input type=number id='discountCant' step='0.10' onchange='roundPrice(this)' placeholder='Cantidad'><h2>Monto recibido:</h2><input type=number id='montoCant' step='0.10' onchange='roundPrice(this)' placeholder='Cantidad'><button onclick='backShowCuenta()'>Cancelar</button><button onclick='showCuenta2(" + totalCta + ")'>Generar cuenta</button></div>";
}

function backShowCuenta()
{
	//prcs = document.getElementsByClassName('pricesP');

	//for (i = 0; i < prcs.length; i++)
	//{
	//	prcs[i].hidden = true;
	//}

	loadOptionsMesa();
}

function showCuenta2(tot)
{
	dataArr = [];

	itemArray = document.getElementsByClassName('pItem');
	extraArray = document.getElementsByClassName('extraIng');
	catArray = document.getElementsByClassName('catTypes');
	pricesArray = document.getElementsByClassName('pricesP');

	disDesc = document.getElementById('discountDesc').value;
	disCant = document.getElementById('discountCant').value;
	montCant = document.getElementById('montoCant').value;

	doCuenta1 = false;
	doCuenta2 = false;

	if (disCant > tot) 
	{
		alert("El Descuento es mayor a la cuenta");

	}
	else
	{
		if (disCant != "") 
		{
			if (disDesc == "") 
			{
				disDesc = "DESCUENTO";
			}
			doCuenta1 = true;
		}
		else
		{
			disCant = 0;
			if (disDesc != "") 
			{
				alert("Ingrese un monto de descuento o borre la descripción")
			}
			else
			{
				disDesc = ".-NO.DISC--";
				doCuenta1 = true;
			}
		}
	}

	//console.log("Des: " + disDesc + " Cant: " + disCant);

	if(montCant == "")
	{
		montCant = tot - parseFloat(disCant);
	}

	if (doCuenta1)
	{
		if(tot - parseFloat(disCant) > parseFloat(montCant))
		{
			alert("El monto ingresado es menor al total a pagar");
		}
		else
		{
			doCuenta2 = true;
		}
	}

	for (i = 0; i < itemArray.length; i++)
	{
		extraArr = [];

		for (j = 0; j < extraArray[i].childNodes.length ; j ++)
		{
			extraArr.push({
				ingId: parseInt(extraArray[i].childNodes[j].childNodes[0].id.replace('exProd', '')),
				ingNm: extraArray[i].childNodes[j].childNodes[0].innerHTML.substring(4),
				type: extraArray[i].childNodes[j].childNodes[0].innerHTML.substring(0,2),
				priceI: parseFloat(extraArray[i].childNodes[j].childNodes[1].innerText.substring(1))
			});
		}

		dataArr.push({
			prodId: parseInt(itemArray[i].childNodes[5].id),
			prodNm: itemArray[i].childNodes[1].innerText,
			cant: parseInt(itemArray[i].childNodes[0].innerHTML),
			extra: extraArr,
			cat: parseInt(catArray[i].innerText),
			priceP: parseFloat(pricesArray[i].innerText.substring(1))
		});
	}

	if(dataArr.length != 0)
	{
		if(doCuenta2)
		{
			nmMesa = document.getElementById('dMesa').innerHTML;

			var ajaxPedido = new XMLHttpRequest();
		    ajaxPedido.open('POST', "http://192.168.1.85/Roger/PHP/addPedidoDB.php", true);
		    ajaxPedido.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		    ajaxPedido.send("m=" + mesaN + "&dc=" + disCant + "&tot=" + tot + "&p=" + JSON.stringify(dataArr));
		    ajaxPedido.onreadystatechange = function() {
		    	if (this.readyState == 4 && this.status == 200) {

		    	}
		    }

			var ajaxTicket = new XMLHttpRequest();
		    ajaxTicket.open('POST', "http://192.168.1.85/Roger/PHP/printCuenta.php", true);
		    ajaxTicket.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		    ajaxTicket.send("m=" + nmMesa + "&dd=" + disDesc + "&dc=" + disCant + "&mc=" + montCant + "&tot=" + tot + "&p=" + JSON.stringify(dataArr));
		    ajaxTicket.onreadystatechange = function() {
		    	if (this.readyState == 4 && this.status == 200) {
		    	}
		    }

			var ajax = new XMLHttpRequest();
		    ajax.open('POST', "http://192.168.1.85/Roger/PHP/SETpedido.php", true);
		    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		    ajax.send("m=" + mesaN + "&d=[]");
		    ajax.onreadystatechange = function() {
		    	if (this.readyState == 4 && this.status == 200) {
		    		alert("Total a devolver: $" + (parseFloat(montCant) - tot + parseFloat(disCant)).toFixed(2));
		    		window.location.assign('mesas.html');
		    	}
		    }
		}
	}
	else
	{
		alert("No se han agregado productos para cobrar");
	}
}

function cancelPedido()
{
	menu.innerHTML = "¿Estás seguro que quieres cancelar este pedido?";

	menu.innerHTML += "<br><button onclick='cancelPedido2()'>Sí, Cancelar pedido</button>";
	menu.innerHTML += "<button onclick='loadOptionsMesa()'>No, regresar</button>";
}

function cancelPedido2()
{
	var ajax = new XMLHttpRequest();
    ajax.open('POST', "http://192.168.1.85/Roger/PHP/SETpedido.php", true);
    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ajax.send("m=" + mesaN + "&d=[]");
    ajax.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {
    		alert("Pedido cancelado");
    		window.location.assign('mesas.html');
    	}
    }
}

function loadMesa()
{
	//document.getElementById('cdeDiv').hidden = false;
	cntrl = document.getElementsByClassName('btnControl');
	document.getElementById('btnSwitch').hidden = false;

	for (i = 0; i < cntrl.length; i++)
	{
		cntrl[i].hidden = false;
	}

	prcs = document.getElementsByClassName('pricesPshow');

	for (i = 0; i < prcs.length; i++)
	{
		prcs[i].hidden = true;
	}

	var ajaxM = new XMLHttpRequest();
    ajaxM.open('POST', "http://192.168.1.85/Roger/PHP/GetMesaById.php", true);
    ajaxM.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ajaxM.send("id=" + parseInt(mesaN));
    ajaxM.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {
    		var responseM = JSON.parse(ajaxM.responseText);
    		//console.log(responseM);
    		
    		document.getElementById('dMesa').innerHTML = responseM[0].name;
    	}
	}

	menu = document.getElementById("menuList");
	menu.innerHTML = "";

	for (var i = 0; i < Object.keys(rootJSON).length; i++) {
		menu.innerHTML += "<button onclick='displayProds(" + rootJSON[i].id + ", " + i + ")'>" + rootJSON[i].name + "</button>";
	}

	/*var ajax = new XMLHttpRequest();
    ajax.open('GET', "http://192.168.1.85/Roger/PHP/GetCategorias.php", true);
    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ajax.send();
    ajax.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {
    		var response = JSON.parse(ajax.responseText);
    		//console.log(response);
    		
    		for (var i = 0; i < Object.keys(response).length; i++) {
    			menu.innerHTML += "<button onclick='displayProds(" + response[i].id + ")'>" + response[i].name + "</button>";
    		}	
    	}
	}*/
}

function displayProds(idP, indexJSON)
{
	menu = document.getElementById("menuList");
	menu.innerHTML = "";

	for (var i = 0; i < Object.keys(rootJSON[indexJSON].sub).length; i++) {
		menu.innerHTML += "<button onclick='addItemPedido(" + rootJSON[indexJSON].sub[i].id + ", \"" + rootJSON[indexJSON].sub[i].name + "\", " + rootJSON[indexJSON].typeC + ", \"" + rootJSON[indexJSON].sub[i].price + "\", " + indexJSON + ", " + i + ")'>" + rootJSON[indexJSON].sub[i].name + "</button>";
	}

	menu.innerHTML += "<button onclick='loadMesa()'>Regresar</button>";	

	/*var ajax = new XMLHttpRequest();
    ajax.open('POST', "http://192.168.1.85/Roger/PHP/GetProductsByCatId.php", true);
    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ajax.send("id=" + idP);
    ajax.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {
    		var response = JSON.parse(ajax.responseText);
    		//console.log(response);
    		
    		for (var i = 0; i < Object.keys(response).length; i++) {
    			menu.innerHTML += "<button onclick='addItemPedido(" + response[i].id + ", \"" + response[i].name + "\", " + response[i].typeC + ", \"" + response[i].price + "\")'>" + response[i].name + "</button>";
    		}

    		menu.innerHTML += "<button onclick='loadMesa()'>Regresar</button>";	
    	}
	}*/
}

function addItemByCode()
{
	prdCode = document.getElementById("prdCODE").value.toUpperCase();

	/*if(rootJSONcde[prdCODE] == undefined)
	{
		alert("El código " + prdCode.toUpperCase() + " no existe");
	} else {
		addItemPedido(rootJSONcde[prdCODE][0].id, rootJSONcde[prdCODE][0].name, rootJSONcde[prdCODE][0].cat, rootJSONcde[prdCODE][0].price, rootJSONcde[prdCODE][0].index1, rootJSONcde[prdCODE][0].index2);
		document.getElementById("prdCODE").value = "";
	}	*/

	try
	{
		addItemPedido(rootJSONcde[prdCode][0].id, rootJSONcde[prdCode][0].name, rootJSONcde[prdCode][0].cat, rootJSONcde[prdCode][0].price, rootJSONcde[prdCode][0].index1, rootJSONcde[prdCode][0].index2);
		document.getElementById("prdCODE").value = "";	
	}
	catch(err)
	{
		alert("El código " + prdCode.toUpperCase() + " no existe");
		document.getElementById("prdCODE").value = "";
	}

	/*var ajax = new XMLHttpRequest();
    ajax.open('POST', "http://192.168.1.85/Roger/PHP/GetProductsByCode.php", true);
    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ajax.send("cde=" + prdCode.toUpperCase());
    ajax.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {
    		var response = JSON.parse(ajax.responseText);
    		//console.log(response);
    		
    		if(Object.keys(response).length === 0)
    		{
    			alert("El código " + prdCode.toUpperCase() + " no existe");
    		} else {
    			addItemPedido(response[0].id, response[0].name, response[0].typeC, response[0].price);
    			document.getElementById("prdCODE").value = "";
    		}
    	}
	}*/
}

function addItemById(idP)
{

}

function addItemPedido(idP, nameP, typeC, priceP, index1, index2)
{
	/*<div class="pItem">
		<h3 id="qtyP1" class="iQty">3</h3><h3 id="nmP1" class="iNm">Hamburguesa Sencilla</h3><button id="1" onclick="incProd(this.id)">+</button><button id="1" onclick="decProd(this.id)">-</button>
	</div>*/

	ingElemIndex = ingElemIndex + 1;

	newH3 = document.createElement('h3');
	newH3.setAttribute('id', 'qtyP' + ingElemIndex);
	newH3.setAttribute('class', 'iQty');
	newH3.innerHTML = "1";

	newH3_2 = document.createElement('h3');
	newH3_2.setAttribute('id', 'nmP' + ingElemIndex);
	newH3_2.setAttribute('class', 'iNm');
	newH3_2.innerHTML = nameP;

	newButtonPs = document.createElement('button')
	newButtonPs.setAttribute("onclick", "incProd('" + ingElemIndex + "')");
	newButtonPs.setAttribute("class", "btnControl");
	newButtonPs.innerHTML = "+";

	newButtonMs = document.createElement('button')
	newButtonMs.setAttribute("onclick", "decProd('" + ingElemIndex + "', '" + ingElemIndex + "')");
	newButtonMs.setAttribute("class", "btnControl");
	newButtonMs.innerHTML = "-";

	newButtonSn = document.createElement('button')
	newButtonSn.setAttribute("onclick", "editProd('" + idP + "', '" + nameP + "', '" + ingElemIndex + "', " + index1 + ", " + index2 + ")");
	newButtonSn.setAttribute("class", "btnControl");
	newButtonSn.innerHTML = "S/";

	newH2_hidden = document.createElement('h2');
	newH2_hidden.setAttribute('class', 'pricesP');
	newH2_hidden.setAttribute('id', 'pricesP' + ingElemIndex);
	newH2_hidden.setAttribute('hidden', 'true');
	newH2_hidden.innerHTML = "$" + priceP;

	newH2_show = document.createElement('h2');
	newH2_show.setAttribute('class', 'pricesPshow');
	newH2_show.setAttribute('id', 'pricesPshow' + ingElemIndex);
	newH2_show.setAttribute('hidden', 'true');
	newH2_show.innerHTML = "$" + priceP;

	newDiv_hidden = document.createElement('div');
	newDiv_hidden.setAttribute('id', idP);
	newDiv_hidden.setAttribute('hidden', 'true');

	newDiv_hidden2 = document.createElement('div');
	newDiv_hidden2.setAttribute('class', 'indexes');
	newDiv_hidden2.setAttribute('hidden', 'true');
	newDiv_hidden2.innerHTML = index1 + "," + index2;

	newH3_hidden = document.createElement('h3');
	newH3_hidden.setAttribute('class', 'catTypes');
	newH3_hidden.setAttribute('hidden', 'true');
	newH3_hidden.innerHTML = typeC;

	newDiv = document.createElement('div');
	newDiv.setAttribute('class', 'pItem');
	newDiv.setAttribute('id', 'prod' + ingElemIndex);

	newDiv2 = document.createElement('div');
	newDiv2.setAttribute('class', 'extraIng');
	newDiv2.setAttribute('id', 'prodEx' + ingElemIndex);

	newDiv.appendChild(newH3);
	newDiv.appendChild(newH3_2);
	newDiv.appendChild(newButtonSn);
	newDiv.appendChild(newButtonPs);
	newDiv.appendChild(newButtonMs);
	newDiv.appendChild(newDiv_hidden);
	newDiv.appendChild(newDiv_hidden2);
	newDiv.appendChild(newH3_hidden);
	newDiv.appendChild(newH2_hidden);
	newDiv.appendChild(newH2_show);

	iList = document.getElementById("itemList");
	iList.appendChild(newDiv);
	iList.appendChild(newDiv2);

	loadMesa();
}

function incProd(idInc)
{
	qty = document.getElementById("qtyP" + idInc);
	val = parseInt(qty.innerHTML) + 1
	qty.innerHTML = val;

	priceDiv = document.getElementById("pricesPshow" + idInc);
	priceUnit = document.getElementById("pricesP" + idInc).innerText.substring(1);
	priceDiv.innerHTML = "$" + (parseFloat(priceUnit) * val).toFixed(2);

	pricesIDiv = document.getElementById("prodEx" + idInc);
	for (i = 0; i < pricesIDiv.childNodes.length; i++)
	{
		priceIunit = pricesIDiv.childNodes[i].childNodes[1].innerText.substring(1);
		pricesIDiv.childNodes[i].childNodes[2].innerHTML = "S" + (parseFloat(priceIunit) * val).toFixed(2);
	}
}

function decProd(idInc, idDiv)
{
	//qty = document.getElementById("qtyP" + idInc);
	//newQty = parseInt(qty.innerHTML) - 1;

	qty = document.getElementById("qtyP" + idInc);
	val = parseInt(qty.innerHTML) - 1


	if (val > 0)
	{
		qty.innerHTML = val;
		priceDiv = document.getElementById("pricesPshow" + idInc);
		priceUnit = document.getElementById("pricesP" + idInc).innerText.substring(1);
		priceDiv.innerHTML = "$" + (parseFloat(priceUnit) * val).toFixed(2);

		pricesIDiv = document.getElementById("prodEx" + idInc);
		for (i = 0; i < pricesIDiv.childNodes.length; i++)
		{
			priceIunit = pricesIDiv.childNodes[i].childNodes[1].innerText.substring(1);
			pricesIDiv.childNodes[i].childNodes[2].innerHTML = "S" + (parseFloat(priceIunit) * val).toFixed(2);
		}
	} else
	{
		deleteProd(idDiv);
	}
	
}

function editProd(idP, pName, idX, index1, index2)
{
	document.getElementById("popup").innerHTML = "<div class='back'><button onclick='closepopup()'>x</button><div class='popup1'><h2>" + pName + "</h2><div class='ingList' id='ingList'></div><button onclick='editProdPedido(" + idX + ")'>Actualizar</button></div></div>";

	rootDiv = document.getElementById('ingList');

	for (var i = 0; i < Object.keys(rootJSON[index1].sub[index2].sub).length; i++) {
		newSelect = document.createElement('select');
		newSelect.setAttribute('class', 'cantIngProd');
		newSelect.setAttribute('id', rootJSON[index1].sub[index2].sub[i].id);

		newOption1 = document.createElement('option');
		newOption1.setAttribute('value', 1);
		newOption1.setAttribute('selected', 'selected');
		newOption1.innerHTML = 'Normal';

		newOption2 = document.createElement('option');
		newOption2.setAttribute('value', 0);
		newOption2.innerHTML = 'Sin';

		newOption3 = document.createElement('option');
		newOption3.setAttribute('value', 2);
		newOption3.innerHTML = 'Extra';

		newOption4 = document.createElement('option');
		newOption4.setAttribute('value', 1);
		newOption4.innerHTML = '------';

		newOption5 = document.createElement('option');
		newOption5.setAttribute('value', 2);
		newOption5.innerHTML = 'Con (Extra)';

		newH3 = document.createElement('h3');
		newH3.setAttribute('class', 'ingExName')
		newH3.innerHTML = rootJSON[index1].sub[index2].sub[i].name;

		newH2_hidden = document.createElement('h2');
		newH2_hidden.setAttribute('class', 'pricesTempI');
		newH2_hidden.setAttribute('hidden', 'true');
		newH2_hidden.innerHTML = rootJSON[index1].sub[index2].sub[i].priceI;

		if(rootJSON[index1].sub[index2].sub[i].extra == 0)
		{
			newSelect.appendChild(newOption2);
			newSelect.appendChild(newOption1);
			newSelect.appendChild(newOption3);
		}
		else if (rootJSON[index1].sub[index2].sub[i].extra == 1)
		{
			newSelect.appendChild(newOption4);
			newSelect.appendChild(newOption5);
		}

		rootDiv.appendChild(newSelect);
		rootDiv.appendChild(newH3);
		rootDiv.appendChild(newH2_hidden);
	}

	/*var ajax = new XMLHttpRequest();
    ajax.open('POST', "http://192.168.1.85/Roger/PHP/GetIngredientesById.php", true);
    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ajax.send("id=" + idP);
    ajax.onreadystatechange = function() {
    	if (this.readyState == 4 && this.status == 200) {
    		var response = JSON.parse(ajax.responseText);

    		rootDiv = document.getElementById('ingList');

    		for (var i = 0; i < Object.keys(response).length; i++) {
    			newSelect = document.createElement('select');
				newSelect.setAttribute('class', 'cantIngProd');
				newSelect.setAttribute('id', response[i].idI);

				newOption1 = document.createElement('option');
				newOption1.setAttribute('value', 1);
				newOption1.setAttribute('selected', 'selected');
				newOption1.innerHTML = 'Normal';

				newOption2 = document.createElement('option');
				newOption2.setAttribute('value', 0);
				newOption2.innerHTML = 'Sin';

				newOption3 = document.createElement('option');
				newOption3.setAttribute('value', 2);
				newOption3.innerHTML = 'Extra';

				newH3 = document.createElement('h3');
				newH3.setAttribute('class', 'ingExName')
				newH3.innerHTML = response[i].name;

				newH2_hidden = document.createElement('h2');
				newH2_hidden.setAttribute('class', 'pricesTempI');
				newH2_hidden.setAttribute('hidden', 'true');
				newH2_hidden.innerHTML = response[i].priceI;

				newSelect.appendChild(newOption2);
				newSelect.appendChild(newOption1);
				newSelect.appendChild(newOption3);

				rootDiv.appendChild(newSelect);
				rootDiv.appendChild(newH3);
				rootDiv.appendChild(newH2_hidden);
			}
    	}
    }*/
}

function editProdPedido(id)
{
	ed = document.getElementsByClassName("cantIngProd");
	edNm = document.getElementsByClassName("ingExName");
	exList = document.getElementById('prodEx' + id);
	prcI = document.getElementsByClassName("pricesTempI");

	qty = parseInt(document.getElementById("qtyP" + id).innerText);

	exList.innerHTML = "";

	for (i = 0; i < ed.length; i++)
	{
		//console.log(ed[i]);
		//console.log(ed[i].id);
		//console.log(ed[i].options.selectedIndex);

		switch (parseInt(ed[i].value))
		{
			case 0:
				exList.innerHTML += "<div><h1 id='exProd" + ed[i].id + "'>Sn/ " + edNm[i].innerHTML + "</h1><h2 class='pricesI' hidden='true'>$0.00</h2><h2 class='pricesIshow' hidden='true'>$0.00</h2></div>";
				break;
			case 2:
				exList.innerHTML += "<div><h1 id='exProd" + ed[i].id + "'>Ex/ " + edNm[i].innerHTML + "</h1><h2 class='pricesI' hidden='true'>$" + parseFloat(prcI[i].innerText).toFixed(2) + "</h2><h2 class='pricesIshow'>$" + (parseFloat(prcI[i].innerText) * qty).toFixed(2) + "</h2></div>";
				break;
			default:
				break;
		}
	}

	closepopup();
}

function deleteProd(id)
{
	parnt = document.getElementById('prod' + id);
	parnt.parentElement.removeChild(parnt);

	parnt = document.getElementById('prodEx' + id);
	parnt.parentElement.removeChild(parnt);
}

function agregarPedido(imp)
{
	dataArr = [];	

	itemArray = document.getElementsByClassName('pItem');
	extraArray = document.getElementsByClassName('extraIng');
	catArray = document.getElementsByClassName('catTypes');
	pricesArray = document.getElementsByClassName('pricesP');
	indexesArray = document.getElementsByClassName('indexes');

	for (i = 0; i < itemArray.length; i++)
	{
		extraArr = [];

		for (j = 0; j < extraArray[i].childNodes.length ; j ++)
		{
			extraArr.push({
				ingId: parseInt(extraArray[i].childNodes[j].childNodes[0].id.replace('exProd', '')),
				ingNm: extraArray[i].childNodes[j].childNodes[0].innerHTML.substring(4),
				type: extraArray[i].childNodes[j].childNodes[0].innerHTML.substring(0,2),
				priceI: parseFloat(extraArray[i].childNodes[j].childNodes[1].innerText.substring(1))
			});
		}

		indexes = indexesArray[i].innerHTML.split(",");

		dataArr.push({
			prodId: parseInt(itemArray[i].childNodes[5].id),
			prodNm: itemArray[i].childNodes[1].innerText,
			cant: parseInt(itemArray[i].childNodes[0].innerHTML),
			extra: extraArr,
			cat: parseInt(catArray[i].innerText),
			priceP: parseFloat(pricesArray[i].innerText.substring(1)),
			index1: indexes[0],
			index2: indexes[1]
		});
	}

	if(dataArr.length != 0)
	{
		nmMesa = document.getElementById('dMesa').innerHTML;
		if (imp == 1)
		{
			var ajaxTicket = new XMLHttpRequest();
		    ajaxTicket.open('POST', "http://192.168.1.85/Roger/PHP/printPedido.php", true);
		    ajaxTicket.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		    ajaxTicket.send("m=" + nmMesa + "&p=" + JSON.stringify(dataArr));
		    ajaxTicket.onreadystatechange = function() {
		    	if (this.readyState == 4 && this.status == 200) {
		    	}
		    }
		}

		var ajax = new XMLHttpRequest();
	    ajax.open('POST', "http://192.168.1.85/Roger/PHP/SETpedido.php", true);
	    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	    ajax.send("m=" + mesaN + "&d=" + JSON.stringify(dataArr));
	    ajax.onreadystatechange = function() {
	    	if (this.readyState == 4 && this.status == 200) {
	    		alert("Pedido registrado correctamente");
	    		window.location.assign('mesas.html');
	    	}
	    }
	}
	else
	{
		alert("No se han agregado productos para registrar");
	}
}

function closepopup()
{
	document.getElementById("popup").innerHTML = "";
	
}

function roundPrice(a)
{
 	a.value = parseFloat(a.value).toFixed(2);
}