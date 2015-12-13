<?php
/**
 * Created by PhpStorm.
 * User: zhangxiaoxue
 * Date: 10/31/15
 * Time: 3:20 PM
 */

// connect to the database
$con = mysqli_connect("","","","");

$count = 0;

if (mysqli_connect_errno($con)){
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
    die();
}
else{
    //SELECT * FROM `table` LIMIT [row to start on], [how many to include]
    $query = "SELECT * FROM organization WHERE  service_offered LIKE '%".$_GET["q"]."%'";

//    $query = "SELECT * FROM organization WHERE  service_offered LIKE '%".$_GET["q"]."%'";


    echo $query . "<br/>";


    $result = mysqli_query($con, $query);
    $geocodes = array();

    if ($result){

        while($row = $result->fetch_array(MYSQLI_ASSOC))
        {
            $rows[] = $row;
        }

        foreach($rows as $index=>$row)
        {
            $temp = array();

            // no data about latitude and longitude in database, search and insert data into it
            if($row['lat'] == 0){
                $lat = 0;
                $long = 0;

                $address = $row['address'].','.$row['city'].','.$row['state'];

//                $url = 'https://maps.googleapis.com/maps/api/geocode/json?address='.urlencode($address);
                $url = 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDZyrmRF6CeudD-wclNCp8Ff-yfudDh86Q&address='.urlencode($address);
//                $url = 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyBPOdgCTjayiCtSztD3eH1zRekxLwxyt8k&address='.urlencode($address);

                $ch = curl_init();
                curl_setopt($ch,CURLOPT_URL,$url);
                curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
                curl_setopt($ch,CURLOPT_CONNECTTIMEOUT, 4);
                $json = curl_exec($ch);
                if(!$json) {
                    echo curl_error($ch);
                }
                curl_close($ch);

                $response = json_decode($json, true);

                if($response['status'] == 'OK'){
                    $item = $response['results'][0];
                    $lat = (float)$item['geometry']['location']['lat'];
                    $long = (float)$item['geometry']['location']['lng'];

                    //print_r($lat . '<br/>');
                    //print_r($long);

                    insert_geocode($row['program_id'], $lat, $long);
                    array_push($temp, $lat);
                    array_push($temp, $long);
                }else{
                    echo 'error[' . $row['program_id'] . ']: ' . 'https://maps.googleapis.com/maps/api/geocode/json?address='.$address . '<br/>';
                }

            }else{
                //get data from database
                array_push($temp, $row['lat']);
                array_push($temp, $row['long']);
            }

            array_push($geocodes, $temp);

        }

        //print_r($geocodes);
    }
}

mysqli_close($con);

function insert_geocode($program_id, $lat, $long){
    global $con;
    global $count;

    //insert data into database
    $query = "UPDATE organization SET `lat`=".$lat.", `long`=".$long." WHERE program_id=".$program_id;

    $result = mysqli_query($con, $query);

    if ($result) {
        $count = $count + 1;
        echo 'insert '.$count.' rows success' . '<br/>';
    }else{
        echo 'error: ' . $query;
        exit;
    }
}

