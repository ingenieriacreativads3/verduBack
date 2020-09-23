<?php

  if ($argc == 1)
  // siempre recibe al menos el nombre del archivo como parametro
  {
    die("Debe ingrear un parametro");
  }

  switch ($argv[1]) {
    case 'd':
      echo "Has seleccionado borrar todo el contenido";
      break;
    case 'a':
        // Si elige la opcion a (add) debe enviar tambien el nombre
        if ($argc == 2 || $argv[2] == "" )
        {
          echo "Error: No ingreso el nombre";
        }
        else
        {
          echo "Se agrego el item " . $argv[2];

        }
        break;
    default:
      echo "Parametro, no valido";
      echo "Las opciones posibles son d ó a";
      break;
  }
 ?>