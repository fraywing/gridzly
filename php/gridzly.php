<?php

class Gridzly{
    private $defaults;
    private $creds;
    private $dbHandle;
    public function main($props){
    $this->defaults = (object)array("data" => "asdasd"); //this is ridiculous in PHP that you can initialize a function in a class-member funcion.
    try{
    $dbHandle = new PDO("mysql:host=$props->hostName;dbname=$props->dbName",$props->userName,$props->password); //pdo start
    }catch(PDOException $e){
        $e->getMessage();
    }
    if(isset($_POST["getData"])){
        $json = json_decode($_POST["getData"]);
        $this->getData($json);
    }elseif(isset($_POST["putData"])){
        $json = json_decode($_POST["putData"]);
        $this->putData($json);
    }
    }
    private function getData($statement){
        $cleaned = mysql_real_escape_string($statement); //cleaned
        //creds stuff
        try{
        $handle = $this->dbHandle;
        $STH = $handle->query($statement);
        
        }
        catch(PDOException $e) {
         echo $e->getMessage();
        }
    }
    private function putData($statement){
        $cleaned = mysql_real_escape_string($statement); //cleaned
        //creds stuff
        try{
        $handle = $this->dbHandle;
        }
        catch(PDOException $e) {
          echo $e->getMessage();
        }
    }
    
    
}


$grid = new Gridzly();
$gridClass = "adasfd";
$grid->main($gridClass,array(
                  userName => "sadasd",
                  password => "sadsdaff",
                  dbName => "kit",
                  hostName => "asfdsad",
                  usePDO => true,
                  selectStatement => `asdasdsd`, //select the data for the column rows
                  updateStatement => `asdasdsd`
                  ));



if(isset($_POST["getRecords"]) && isset($_POST["filter"])){
    $arr = array("colHeaders" => array("Name","Family","Friends","Date","Time"),
                 "rows" => array(array("<select><option value='a select value' name='select1'>Item</option><option>Items and one2</option></select>", "The fam", "Carol", "23323", "324124"),
                                 array("Sarah", "The Jon", "Sam", "5656", "<button name='mycoolButton' value='a cool thing'>Something</button>"),
                                 array("Anderson", "2323m", "Carol", "2343", "4543"),
                                 array("Austin", "The fam", "Colleen", "65656", "22"),
                                 array("Auadvgaddaadsffasstin", "The fam", "Colleen", "65656", "22"),
                                 array("Austin", "The fam", "Colleen", "65656", "22"),
                                 array("Sarah", "The Jon", "Sam", "5656", "24545"),
                                  array("Sarah", "The Jon", "Sam", "5656", "24545"),
                                   array("Sarah", "The Jon", "asd", "5656", "24545"),
                                    array("Sarah", "The aa", "Sam", "5656", "24545"),
                                     array("Sarah", "The Jon", "wd", "5656", "24545")

                                 )
                 );
    $json = json_encode($arr);
    echo $json;
}else if(isset($_POST["getRecords"])){
    $arr = array("colHeaders" => array("Name","Family","Friaagadfadfsd sd aends","Date","Time"),
                 "rows" => array(array("<select><option>Item</option><option>Items and one2</option></select>", "The fam", "Carol", "23323", "324124"),
                                 array("Sarah", "The Jon", "Sam", "5656", "<button>Something</button>"),
                                 array("Anderson", "23dgsfg sds df df sd sdgasd 23m", "Carol", "2343", "4543"),
                                 array("Austin", "The fsad sd asdfm", "Colleen", "65656", "22"),
                                 array("Auadvgaddaadsffasstin", "The fam", "Colleen", "65656", "22"),
                                 array("Auafadfstin", "The fam", "Colleen", "65as ds adas d656", "22"),
                                 array("Sarah", "The Jon", "Sam", "5656", "24545"),
                                  array("Sarah", "The Jon", "Sam", "5656", "24545"),
                                   array("Sarah", "The Jon", "Sam", "5656", "24545"),
                                    array("Sarah", "The Jon", "Sasd asdasd am", "5656", "24545"),
                                     array("Sarah", "The Jon", "Sam", "5656", "24545"),
                                      array("Sarah", "The Jon", "Sa sad sad sd sd m", "5656", "24545"),
                                       array("Sarah", "The Jon", "Sam", "5656", "24545"),
                                        array("Sarah", "The Jon", "Sam", "5656", "24545"),
                                        array("Sarah", "The Jon", "Sam", "5656", "24545"),
                                        array("Sarah", "The Jon", "Sam", "5656", "24545"),
                                        array("Sarah", "The Jon", "Sam", "5656", "24545"),
                                        array("Sarah", "The Jon", "Sam", "5656", "24545"),
                                        array("Sarah", "Theasd asd  Jon", "Sam", "5656", "24545"),
                                        array("Sarah", "The Jon", "Sam", "5656", "24545")

                                 )
                 );
    $json = json_encode($arr);
    echo $json;
}

?>