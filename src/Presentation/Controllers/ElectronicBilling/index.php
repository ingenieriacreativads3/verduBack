<?php
// header('Content-Type: text/html; charset=UTF-8');
// header('Access-Control-Allow-Origin: *');  
// date_default_timezone_set('America/Buenos_Aires');

include('wsaa.class.php');
include('wsfev1.class.php');

$OS = "windows"; // linux-windows
$build = "test"; // prod-test
$pathLinux;
$pathWindows;
$pathLogs;
$path;
$database;
$condVta;
$identificationValue;
$err;

if($build == "test") {
	$pathLinux = '/var/www/html/libs/fe-ar/resources/';
	$pathWindows = 'C:/PosCloud/xampp/htdocs/libs/fe-ar/resources/';
} else {
	$pathLinux = '/var/www/html/libs/fe/ar/resources/';
	$pathWindows = 'C:/xampp/htdocs/libs/fe/ar/resources/';
}

if($OS == "windows") {
	$path = $pathWindows;
} else {
	$path = $pathLinux;
}

$asd->config->companyIdentificationValue = 20366209728;
$asd->config->vatCondition = 1;
$asd->config->database = "fullrep";

$asd->transaction->_id = ObjectId("5debb1038ae844322a14fb93");
$asd->transaction->origin = 5;
$asd->transaction->letter = "B";
$asd->transaction->number = 1;
$asd->transaction->basePrice = 252.89;
$asd->transaction->exempt = 0;
$asd->transaction->discountAmount = 34;
$asd->transaction->discountPercent = 10;
$asd->transaction->totalPrice = 306;
$asd->transaction->roundingAmount = 0;
$asd->transaction->diners = 0;
$asd->transaction->balance = 0;
$asd->transaction->startDate = ISODate("2019-12-07T14:02:40.000Z");
$asd->transaction->VATPeriod = "201912";
$asd->transaction->state = "Cerrado";
$asd->transaction->madein = "mostrador";
$asd->transaction->quotation = 1;
$asd->transaction->type = ObjectId("5de932b48ae844322a133e2a");
$asd->transaction->branchOrigin = ObjectId("5ddbc6a03a320c3200785f96");
$asd->transaction->branchDestination = ObjectId("5ddbc6a03a320c3200785f96");
$asd->transaction->depositOrigin = ObjectId("5ddbc6b53a320c3200785fa0");
$asd->transaction->depositDestination = ObjectId("5ddbc6b53a320c3200785fa0");
$asd->transaction->creationUser = ObjectId("5de80405e3a32120ba639c40");
$asd->transaction->creationDate = ISODate("2019-12-07T14:02:43.000Z");
$asd->transaction->operationType = "U";
$asd->transaction->__v = 0;
$asd->transaction->taxes[0]->percentage = 21;
$asd->transaction->taxes[0]->taxBase = 252.89;
$asd->transaction->taxes[0]->taxAmount = 53.11;
$asd->transaction->taxes[0]->_id = ObjectId("5debc47f31cb056d27bb1569");
$asd->transaction->taxes[0]->tax = ObjectId("5c6724ff1737e94aadc768bd");
$asd->transaction->updateDate = ISODate("2019-12-07T15:25:54.000Z");
$asd->transaction->updateUser = ObjectId("5de80405e3a32120ba639c40");
$asd->transaction->company = ObjectId("5d94d82500bc82190d78a5ff");
$asd->transaction->transport = null;
$asd->transaction->CAE = "69499251252226";
$asd->transaction->CAEExpirationDate = ISODate("2019-12-17T03:00:00.000Z");
$asd->transaction->endDate = ISODate("2019-12-07T15:25:53.000Z");
$asd->transaction->expirationDate = ISODate("2019-12-07T15:25:53.000Z");

if(isset($asd['config']) || isset($asd['transaction'])) {
	$config = json_decode($asd['config'], true);
	$transaction = json_decode($asd['transaction'], true);

	if(isset($config["database"]) || isset($config["vatCondition"]) || isset($config["companyIdentificationValue"])) {
		$database = $config["database"];
		$condVta = $config["vatCondition"];
		$identificationValue = str_replace("-", "", $config["companyIdentificationValue"]);
		file_put_contents("log.txt", date("d/m/Y H:i:s") ." - Se conecta: ".$database." CUIT $identificationValue\n", FILE_APPEND | LOCK_EX);
		$pathLogs = "log.txt";
	} else {
		if(empty($err)) {
			$err =	'{
						"status":"err",
						"message":"Los parámetros enviados no son válidos 1"
					}';
			file_put_contents("log.txt", date("d/m/Y H:i:s") ." - Err: ". $err."\n", FILE_APPEND | LOCK_EX);
			echo $err;
		}
	}
} else {
	if(empty($err)) {
		$err =	'{
					"status":"err",
					"message":"Los parámetros enviados no son válidos 2"
				}';
		file_put_contents("log.txt", date("d/m/Y H:i:s") ." - Err: ". $err."\n", FILE_APPEND | LOCK_EX);
		echo $err;
	}
}

//Escribimos el comienzo del log
file_put_contents($pathLogs, date("d/m/Y H:i:s") ." - Inicio Transacción\n", FILE_APPEND | LOCK_EX);
//Escribimos log con los parámetros recibidos
file_put_contents($pathLogs, date("d/m/Y H:i:s") ." - Config: ".json_encode($config)."\n", FILE_APPEND | LOCK_EX);
file_put_contents($pathLogs, date("d/m/Y H:i:s") ." - Transacción: ".json_encode($transaction)."\n", FILE_APPEND | LOCK_EX);

$wsaa = new WSAA($build, $path, $database);
	
// Compruebo fecha de exp y si la excede genero nuevo TA
$fecha_ahora = date("Y-m-d H:i:s");
$fecha_exp_TA = $wsaa->get_expiration();
file_put_contents($pathLogs, date("d/m/Y H:i:s") ." Comparo fechas: Fecha Actual ". $fecha_ahora ." - Fecha TA ".$fecha_exp_TA."\n", FILE_APPEND | LOCK_EX);	

if ($fecha_exp_TA < $fecha_ahora) {	
	if ($wsaa->generar_TA()) {
		file_put_contents($pathLogs, date("d/m/Y H:i:s") ." Genero nuevo TA, válido hasta: ". $wsaa->get_expiration() ."\n", FILE_APPEND | LOCK_EX);	
	} else {
		$err =	'{
						"status":"err",
						"message":"Error al obtener TA"
					}';
		file_put_contents($pathLogs, date("d/m/Y H:i:s") ." - Err: ". $err."\n", FILE_APPEND | LOCK_EX);
		echo $err;
  }
} else {
	file_put_contents($pathLogs, date("d/m/Y H:i:s") ." - TA reutilizado, válido hasta: ". $wsaa->get_expiration() ."\n", FILE_APPEND | LOCK_EX);
}

//Conecto Wsfev1
$wsfev1 = new WSFEV1($build, $path, $database, $identificationValue);

// Carga el archivo TA.xml
$wsfev1->openTA();

$doctipo;
$docnumber;

if($transaction["company"]) {
	$doctipo = $transaction["company"]["identificationType"]["code"];
	$docnumber = (double) str_replace("-", "", $transaction["company"]["identificationValue"]);
} else {
	$doctipo = 99;
	$docnumber = 0;
}

$tipcomp;
$x;

if(count($transaction["type"]["codes"]) > 0) {
	for ( $x = 0 ; $x < count($transaction["type"]["codes"]) ; $x ++ ) {
		if ($transaction["type"]["codes"][$x]["letter"] == $transaction["letter"]) {
			$tipcomp = $transaction["type"]["codes"][$x]["code"];
		}
	}
} else {
	if(empty($err)) {
		$err ='{
					"status":"err",
					"message":"El tipo de comprobante no tiene definidos los código AFIP"
				}';	
		file_put_contents($pathLogs, date("d/m/Y H:i:s") ." - Err: FECompUltimoAutorizado no es numérico - ". $err."\n", FILE_APPEND | LOCK_EX);
		echo $err;
	}
}

file_put_contents($pathLogs, date("d/m/Y H:i:s") ." - tipcomp - ". $tipcomp."\n", FILE_APPEND | LOCK_EX);
file_put_contents($pathLogs, date("d/m/Y H:i:s") ." - letra - ". $transaction["letter"]."\n", FILE_APPEND | LOCK_EX);

$ptovta = $transaction["origin"];
$tipocbte = $tipcomp;
if($transaction["endDate"]) {
	$cbteFecha = date("Ymd", strtotime($transaction["endDate"]));
} else {
	$cbteFecha = date("Ymd");
}
file_put_contents($pathLogs, date("d/m/Y H:i:s") ." - Fecha de comprobante - ". $cbteFecha."\n", FILE_APPEND | LOCK_EX);

$taxAmount = 0;
$taxBase = 0;
$tributoAmount = 0;
$exempt = 0;
$regfeiva = [];
$regfetrib = [];

if($transaction["letter"] !== "C" || $condVta !== 6) {
	$exempt = $transaction["exempt"];
	if(count($transaction["taxes"]) > 0) {
		$i = 0;
		$j = 0;
		for ( $y = 0 ; $y < count($transaction["taxes"]) ; $y ++) {
			if($transaction["taxes"][$y]["tax"]["taxBase"] != "Gravado") {
				$tributoAmount = $tributoAmount + $transaction["taxes"][$y]["taxAmount"];
				$regfetrib[$j] = array ( 'Id' => (int) $transaction["taxes"][$y]["tax"]["code"],
										'Desc' => $transaction["taxes"][$y]["tax"]["name"],
										'BaseImp' =>$transaction["taxes"][$y]["taxBase"],
										'Alic' => $transaction["taxes"][$y]["percentage"],
										'Importe' => $transaction["taxes"][$y]["taxAmount"]);
				$j++;
			} else {
				$taxAmount = $taxAmount + $transaction["taxes"][$y]["taxAmount"];
				$regfeiva[$i] = array ( 'Id' => (int) $transaction["taxes"][$y]["tax"]["code"], 
										'BaseImp' =>$transaction["taxes"][$y]["taxBase"],
										'Importe' => $transaction["taxes"][$y]["taxAmount"]);
				$i++;
				$taxBase = $taxBase + $transaction["taxes"][$y]["taxBase"];
			}
		}
	} else {
		$regfeiva = NULL;
		
	}
} else {
	$regfeiva = NULL;
	$taxBase = $transaction["totalPrice"];
}

if($regfetrib == []) {
	$regfetrib = NULL;
}
if($regfeiva == []) {
	$regfeiva = NULL;
}

$regfe['CbteTipo'] = $tipocbte;
$regfe['Concepto'] = 1; //Productos: 1 ---- Servicios: 2 ---- Prod y Serv: 3
$regfe['DocTipo'] = $doctipo; //80=CUIT -- 96 DNI --- 99 general cons final
$regfe['DocNro'] = $docnumber;  //0 para consumidor final / importe menor a $1000
$regfe['CbteFch'] = $cbteFecha; 	// fecha emision de factura
$regfe['ImpNeto'] = $taxBase;			// Imp Neto
$regfe['ImpTotConc'] = $exempt;			// no gravado
$regfe['ImpIVA'] = $taxAmount;			// IVA liquidado
$regfe['ImpTrib'] = $tributoAmount;			// otros tributos
$regfe['ImpOpEx'] = 0;			// operacion exentas
$regfe['ImpTotal'] = $transaction["totalPrice"];			// total de la factura. ImpNeto + ImpTotConc + ImpIVA + ImpTrib + ImpOpEx
$regfe['FchServDesde'] = null;	// solo concepto 2 o 3
$regfe['FchServHasta'] = null;	// solo concepto 2 o 3
$regfe['FchVtoPago'] = null;		// solo concepto 2 o 3
$regfe['MonId'] = 'PES'; 			// Id de moneda 'PES'
$regfe['MonCotiz'] = 1;			// Cotizacion moneda. Solo exportacion

// Comprobantes asociados (solo notas de crédito y débito):
// $regfeasoc['Tipo'] = 91; //91; //tipo 91|5			
// $regfeasoc['PtoVta'] = 1;
// $regfeasoc['Nro'] = 1;

//Pido ultimo numero autorizado
$nro = $wsfev1->FECompUltimoAutorizado($ptovta, $tipocbte);
if(!is_numeric($nro)) {
	file_put_contents($pathLogs, date("d/m/Y H:i:s") ." - Err: FECompUltimoAutorizado no es numérico - Error anterior ". $err."\n", FILE_APPEND | LOCK_EX);
	$nro=0;
	$nro1 = 0;
	if(!isNan($wsfev1->Code)) {
		$wsfev1->Code = 0;
	}
	if(empty($err)) {
		$err ='{
					"status":"err",
					"code":'.$wsfev1->Code.',
					"message":"'.$wsfev1->Msg.'",
					"observationCode":"'.$wsfev1->ObsCod.'",
					"observationMessage":"'.$wsfev1->ObsMsg.'"
				}';	
		file_put_contents($pathLogs, date("d/m/Y H:i:s") ." - Err: FECompUltimoAutorizado no es numérico - ". $err."\n", FILE_APPEND | LOCK_EX);
	}
} else {
	file_put_contents($pathLogs, date("d/m/Y H:i:s") ." - Ultimo número de comprobante autorizado - ".$nro."\n", FILE_APPEND | LOCK_EX);
	$nro1 = $nro + 1;
	$cae = $wsfev1->FECAESolicitar(	$nro1, // ultimo numero de comprobante autorizado mas uno 
									$ptovta,  // el punto de venta
									$regfe, // los datos a facturar
									$regfeasoc,
									$regfetrib,
									$regfeiva	
				);
	 
	$caenum = $cae['cae']; 
	$caefvt = $cae['fecha_vencimiento'];
	$numero = $nro+1;
	
	if ($caenum != "") {
		
		$CAEExpirationDate = str_split($caefvt, 2)[3]."/".str_split($caefvt, 2)[2]."/".str_split($caefvt, 4)[0]." 00:00:00";
		
		$result ='{
			"status":"OK",
			"number":'.$numero.',
			"CAE":"'.$caenum.'",
			"CAEExpirationDate":"'.$CAEExpirationDate.'"
		}';
		file_put_contents($pathLogs, date("d/m/Y H:i:s") ." - Response - ".$result."\n", FILE_APPEND | LOCK_EX);
		echo $result;
	} else {
		if(empty($err)) {
			$err ='{
				"status":"err",
				"code":"'.$wsfev1->Code.'",
				"message":"'.$wsfev1->Msg.'",
				"observationCode":"'.$wsfev1->ObsCod.'",
				"observationMessage":"'.$wsfev1->ObsMsg.'",
				"observationCode2":"'.$wsfev1->ObsCode2.'",
				"observationMessage2":"'.$wsfev1->ObsMsg2.'"
			}';
			file_put_contents($pathLogs, date("d/m/Y H:i:s") ." - Response - ".$err."\n", FILE_APPEND | LOCK_EX);
			echo $err;
		}
	}
}
