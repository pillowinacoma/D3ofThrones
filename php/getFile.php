    <?php 
        $dir = "../".$_GET["dir"] ;
        //  si le dossier pointe existe
        if (is_dir($dir)) {

           // s'il contient quelque chose
            if ($dh = opendir($dir)) {
              $array = array();
               // boucler tant que quelque chose est trouve
               while (($file = readdir($dh)) !== false) {
                  if($file != "." && $file != "..")
                    $array[]= $file;
                   // affiche le nom et le type
                    
               }
               echo json_encode($array);
               // on ferme la connection
               closedir($dh);
           }
        }
      ?>