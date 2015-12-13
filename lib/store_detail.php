<?php
/**
 * Created by PhpStorm.
 * User: zhangxiaoxue
 * Date: 10/31/15
 * Time: 3:20 PM
 */

include_once("simple_html_dom.php");

// connect to the database
$con = mysqli_connect("","","","");

$count = 0;

if (mysqli_connect_errno($con)){
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
    die();
}
else{
    //SELECT * FROM `table` LIMIT [row to start on], [how many to include]
    $query = "SELECT * FROM organization LIMIT 31500,1500";

    $result = mysqli_query($con, $query);

    if ($result){

        while($row = $result->fetch_array())
        {
            $rows[] = $row;
        }

        foreach($rows as $row)
        {
            //echo $row['program_id'] . '<br/>';

            insert_detail($row['program_id']);
        }
    }
}

mysqli_close($con);

function insert_detail($program_id){
    global $con;
    global $count;

    $url = "http://209.200.89.252/search_site/detail.cfm?program_id=" . $program_id;
    $html = file_get_html($url, 10);

    if($html->find('.contact', 0)){
        preg_match("/\d{5}/", $html->find('.contact p', 1)->plaintext, $zipcode_array);
        if(sizeof($zipcode_array) != 0){
            $item['zipcode'] = $zipcode_array[0];
        }else{
            preg_match("/\d{5}/", $html->find('.contact p', 2)->plaintext, $zipcode_array);
            $item['zipcode'] = $zipcode_array[0];
        }
    }else{
        $item['zipcode'] = '';
    }

    if($html->find('.org_type', 0)){
        $item['org_type'] = $html->find('.org_type', 0)->plaintext;
    }else{
        $item['org_type'] = '';
    }

    if($html->find('.service', 0)){
        $item['service'] = mysqli_real_escape_string($con, trim($html->find('.service', 0)->plaintext));
    }else{
        $item['service'] = '';
    }

    if($html->find('.program', 0)){
        $item['information'] = mysqli_real_escape_string($con, trim($html->find('.program', 0)->plaintext));
    }else{
        $item['information'] = '';
    }

    foreach($html->find('.contact p') as $p){
        if($p->find('a[target=_blank]', 0)){
            $item['website'] = mysqli_real_escape_string($con, $p->find('a[target=_blank]', 0)->plaintext);
        }else{
            $item['website'] = '';
        }

    }

    //nationwide or statewide
    $item['is_statewide'] = 0;
    $item['is_nationwide'] = 0;
    if($html->find('.categories', 0)){
        if($html->find('.categories', 0)->find('em', 0)){
            if(sizeof(preg_split("/nation/", $html->find('.categories', 0)->find('em', 0)->plaintext)) > 1){
                $item['is_nationwide'] = 1;
            }
            if(sizeof(preg_split("/state/", $html->find('.categories', 0)->find('em', 0)->plaintext)) > 1){
                $item['is_statewide'] = 1;
            }
        }
    }

    //var_dump($item);

    //insert data into database
    $query = "UPDATE organization SET zipcode='".$item['zipcode']."', org_type='".$item['org_type']."', service='".$item['service']."', information='".$item['information']
                ."', website='".$item['website']."', is_nationwide=".$item['is_nationwide'].", is_statewide=".$item['is_statewide']." WHERE program_id=".$program_id;


    $result = mysqli_query($con, $query);

    if ($result) {
        $count = $count + 1;
        echo 'insert '.$count.' rows success' . '<br/>';
    }else{
        echo 'error: ' . $query;
        exit;
    }

}

