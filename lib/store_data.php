<?php
/**
 * Created by PhpStorm.
 * User: zhangxiaoxue
 * Date: 10/31/15
 * Time: 3:20 PM
 */

include_once("simple_html_dom.php");

$us_state_abbrevs_names = array(
    'AL'=>'ALABAMA',
    'AK'=>'ALASKA',
    'AS'=>'AMERICAN SAMOA',
    'AZ'=>'ARIZONA',
    'AR'=>'ARKANSAS',
    'CA'=>'CALIFORNIA',
    'CO'=>'COLORADO',
    'CT'=>'CONNECTICUT',
    'DE'=>'DELAWARE',
    'DC'=>'DISTRICT OF COLUMBIA',
    'FM'=>'FEDERATED STATES OF MICRONESIA',
    'FL'=>'FLORIDA',
    'GA'=>'GEORGIA',
    'GU'=>'GUAM GU',
    'HI'=>'HAWAII',
    'ID'=>'IDAHO',
    'IL'=>'ILLINOIS',
    'IN'=>'INDIANA',
    'IA'=>'IOWA',
    'KS'=>'KANSAS',
    'KY'=>'KENTUCKY',
    'LA'=>'LOUISIANA',
    'ME'=>'MAINE',
    'MH'=>'MARSHALL ISLANDS',
    'MD'=>'MARYLAND',
    'MA'=>'MASSACHUSETTS',
    'MI'=>'MICHIGAN',
    'MN'=>'MINNESOTA',
    'MS'=>'MISSISSIPPI',
    'MO'=>'MISSOURI',
    'MT'=>'MONTANA',
    'NE'=>'NEBRASKA',
    'NV'=>'NEVADA',
    'NH'=>'NEW HAMPSHIRE',
    'NJ'=>'NEW JERSEY',
    'NM'=>'NEW MEXICO',
    'NY'=>'NEW YORK',
    'NC'=>'NORTH CAROLINA',
    'ND'=>'NORTH DAKOTA',
    'MP'=>'NORTHERN MARIANA ISLANDS',
    'OH'=>'OHIO',
    'OK'=>'OKLAHOMA',
    'OR'=>'OREGON',
    'PW'=>'PALAU',
    'PA'=>'PENNSYLVANIA',
    'PR'=>'PUERTO RICO',
    'RI'=>'RHODE ISLAND',
    'SC'=>'SOUTH CAROLINA',
    'SD'=>'SOUTH DAKOTA',
    'TN'=>'TENNESSEE',
    'TX'=>'TEXAS',
    'UT'=>'UTAH',
    'VT'=>'VERMONT',
    'VI'=>'VIRGIN ISLANDS',
    'VA'=>'VIRGINIA',
    'WA'=>'WASHINGTON',
    'WV'=>'WEST VIRGINIA',
    'WI'=>'WISCONSIN',
    'WY'=>'WYOMING',
    'AE'=>'ARMED FORCES AFRICA \ CANADA \ EUROPE \ MIDDLE EAST',
    'AA'=>'ARMED FORCES AMERICA (EXCEPT CANADA)',
    'AP'=>'ARMED FORCES PACIFIC'
);

// connect to the database
$con = mysqli_connect("","","","");

if (mysqli_connect_errno($con)){
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
    die();
}
else{
    //insert_data_by_state('AL');
    foreach($us_state_abbrevs_names as $key=>$state_name){
        insert_data_by_state($key);
    }
}

mysqli_close($con);


function insert_data_by_state($state_abbrev){
    $url = "http://209.200.89.252/search_site/list.cfm?program_name=&ZipInput=&ZipRadius=&state=" . $state_abbrev . "&city=&county=&org_type=&language=&service_type_prev=&addtl_info=&submit=Search";

    $per_page = 15;

    $html = file_get_html($url, 10);
    $count = preg_split("/ /", trim($html->find('.recordcounts', 0)->plaintext))[4];
    $page_num = $count%$per_page == 0 ? floor($count/$per_page) - 1: floor($count/$per_page);

    for($i = 0; $i <= $page_num; $i++){

        $start = $i*$per_page + 1;
        $url = "http://209.200.89.252/search_site/list.cfm?program_name=&ZipInput=&ZipRadius=&state=" . $state_abbrev . "&city=&county=&org_type=&language=&service_type_prev=&addtl_info=&submit=Search";
        $url = $url . "&int_startrow=" . $start;

        var_dump($url . '<br/>');
        insert_page($url);
    }
}

function insert_page($url){
    $html = file_get_html($url, 10);

    foreach($html->find('table tr') as $key=>$organization) {
        if($key != 0){
            $item['program'] = $organization->find('td a', 0)->plaintext;
            preg_match("/program_id=(\d*)/", $organization->find('td:eq(0) a', 0)->href, $program_id_array);
            $item['program_id'] = $program_id_array[1];

            $address_array = preg_split("/<br \/>/", $organization->find('td', 0)->innertext);

            $item['address'] = trim($address_array[1]);
            if(sizeof($address_array) > 2){
                $item['address'] = $item['address'] . ',' . trim($address_array[2]);
            }

            $item['city'] = $organization->find('td', 1)->plaintext;
            $item['state'] = $organization->find('td', 2)->plaintext;
            $item['phone'] = trim(preg_replace("/\(email\)/", "", $organization->find('td', 3)->plaintext));
            $item['email'] = preg_replace("/mailto:/", "", $organization->find('td', 3)->find('a', 0)->href);

            $service_array = preg_split("/<br>/", $organization->find('td', 4)->innertext);

            if(sizeof($service_array) > 1){
                $item['is_statewide'] = 1;
                $item['service_offered'] = trim($service_array[1]);
            }else{
                $item['is_statewide'] = 0;
                $item['service_offered'] = trim($service_array[0]);
            }

            $organizations[] = $item;
        }
    }

    global $con;

    //insert data into database
    foreach($organizations as $key=>$organization) {
        $query = "INSERT INTO organization (program_id, program, address, city, state, phone, email, is_statewide, service_offered) " .
            "VALUES ('" . $organization['program_id'] . "', '" . $organization['program'] . "', '" . $organization['address'] .  "', '" . $organization['city'] . "', '" . $organization['state'] . "', '" . $organization['phone'] . "', '" . $organization['email'] . "', '" . $organization['is_statewide'] . "', '" . $organization['service_offered'] ."');";

        $result = mysqli_query($con, $query);

        if ($result) {

        }else{
            echo json_encode(array('info' => "server error", 'status' => 0, 'data' => []));
            exit;
        }
    }

}

