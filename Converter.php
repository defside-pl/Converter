<?php

/**
 * Created by PhpStorm.
 * User: silk
 * Date: 30.11.2015
 * Time: 19:55
 */
/*-------------------------------------------------------------------------------------------*/
/* Here we have my pretty class Converter with methods: GetVarFromApi,CalculateValue
/*-------------------------------------------------------------------------------------------*/

class Converter
{
    /*
    There is API URL, I was using yahoo service
    */

   private $api_url="http://query.yahooapis.com/v1/public/yql?q=select+*+from+yahoo.finance.xchange+where+pair+=+%22RUBPLN%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";

    /*
    Here is a simple example how to make http request with CURL functions.  Nothing special to comment:)
    */

private function curl_load($url)
{
if (function_exists('curl_init'))
  {
   $ch = curl_init();
   curl_setopt($ch, CURLOPT_URL, $url);
   curl_setopt($ch, CURLOPT_HEADER, 0);
   curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
   curl_setopt($ch, CURLOPT_USERAGENT, 'Converter');
   $content = curl_exec($ch);
   curl_close($ch);
   return $content;
  }
else {return false;}
}
   /*
   There is method which obtains value of {$which_var} property from response object
   Here is example of such JSON response:

{
"query":
  {
    "count":1,"created":"2015-11-30T17:59:47Z","lang":"ru","results":
      {"rate":
         {
         "id":"RUBPLN","Name":"RUB/PLN","Rate":"0.0609","Date":"11/30/2015","Time":"5:59pm","Ask":"0.0609","Bid":"0.0609"
         }
      }
   }
}

  In that list we need only values of "Rate" & "Date" properties

   */


function GetVarFromApi($which_var)
{
  $res=0;
  $response=$this->curl_load($this->api_url);                         //Trying to get API response via CURL
  if ($response===false) $response=file_get_contents($this->api_url); //CURL doesn't work, then trying to use file_get_contents
  $r_obj=json_decode($response);                                      //Decode API response from string to object
  if (property_exists($r_obj->query->results->rate,$which_var))       //Just checking out, wrong object or not..
  {
    $res=strip_tags($r_obj->query->results->rate->{"$which_var"});    //Strip possible tags and return value of {$which_var} property
  }
    return $res;                                                      //The {$which_var} property not found, return zero
}


 /*
 Calculate result for front-end side
 */

 function CalculateValue($amount)
{
    $rate=$this->GetVarFromApi("Rate");  //Got Rate value
    return round($rate*$amount,3);       //Only 3 digits after point..
}

}

/*Class end*/

error_reporting(0); //Turn off all alerts

$options = array('options' => array('min_range' => 0));  //Using function filter_var set min_range = 0.
if (filter_var($_POST['amount'], FILTER_VALIDATE_FLOAT, $options) !== FALSE) // We need only float type numbers
{
$Converter =new Converter();
$process=$Converter->CalculateValue($_POST['amount']);
$date=$Converter->GetVarFromApi("Date");  //Got current date value
$post_data =json_encode(array('data' => $process,'date' => $date)); //Make JSON string for front-end side
header('Content-Length: '.strlen($post_data)); //That is need for webservers with wrong configuration.
die($post_data);
}
