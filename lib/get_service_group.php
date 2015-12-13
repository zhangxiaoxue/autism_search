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
    $query = "SELECT * FROM service_type ORDER BY group_id";

    $result = mysqli_query($con, $query);

    if ($result){
        while($row = $result->fetch_array(MYSQLI_ASSOC))
        {
            $rows[] = $row;
        }

        $temp = array();
        foreach($rows as $index => $row)
        {
            $row['index'] = $index;
            if(!$temp[$row['group_id']]){
                $temp[$row['group_id']] = array();
            }
            array_push($temp[$row['group_id']], $row);
        }

        echo json_encode(array ('info'=>"",'status'=>1,'data'=>$temp));
    }else{
        echo json_encode(array ('info'=>"database connection error",'status'=>0,'data'=>null));
        exit;
    }
}

mysqli_close($con);
