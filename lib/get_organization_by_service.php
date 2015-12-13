<?php
/**
 * Created by PhpStorm.
 * User: zhangxiaoxue
 * Date: 10/31/15
 * Time: 3:20 PM
 */

// connect to the database
$con = mysqli_connect("","","","");

if (mysqli_connect_errno($con)){
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
    die();
}
else{
    //SELECT * FROM `table` LIMIT [row to start on], [how many to include]
    $service = $_GET['q'];
    $state = $_GET['state'];
    //$service = 'State Key Resources';

    get_organization_by_service($service, $state);
}

mysqli_close($con);

function get_organization_by_service($service, $state){
    global $con;

    $query = "SELECT * FROM organization WHERE service_offered LIKE '%" . $service . "%' AND state='" . $state . "'";

    $result = mysqli_query($con, $query);

    if ($result){
        $organizations = array();

        while($row = $result->fetch_array(MYSQLI_ASSOC))
        {
            $rows[] = $row;
        }

        foreach($rows as $row)
        {
            $address = $row['address'].','.$row['city'].','.$row['state'];
            if($row['lat'] != 0 || $row['lat'] != '0'){
                $temp = array();
                array_push($temp, (float)$row['long']);
                array_push($temp, (float)$row['lat']);
                array_push($temp, (int)$row['program_id']);
                array_push($temp, $row['program']);
                array_push($temp, $row['service_offered']);
                array_push($temp, $address);
                array_push($organizations, $temp);
            }
        }

        echo json_encode(array ('info'=>"",'status'=>1,'data'=>$organizations));
    }else{
        echo json_encode(array ('info'=>"database connection error",'status'=>0,'data'=>null));
        exit;
    }
}

