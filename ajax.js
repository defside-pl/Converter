/**
 * Created by silk on 30.11.2015.
 */

/*-----------------------------------------------------------------------------------------*/
/* AJAX functions CreateRequest & SendRequest. There are many examples in internet. Nothing special to comment:)*/

function CreateRequest()
{
    var Request = false;

    if (window.XMLHttpRequest)
    {
        // Safari, Konqueror etc
        Request = new XMLHttpRequest();
    }
    else if (window.ActiveXObject)
    {
        //Internet explorer
        try
        {
            Request = new ActiveXObject("Microsoft.XMLHTTP");
        }
        catch (CatchException)
        {
            Request = new ActiveXObject("Msxml2.XMLHTTP");
        }
    }

    if (!Request)
    {
        alert("Can't create XMLHttpRequest");
    }

    return Request;
}

//*-----------------------------------------------------------------------------------------
/*
 r_method  - request method
 r_path    - php script path
 r_args    - arguments, for instance a=1&b=2&c=3..
 r_handler - callback function
 */

function SendRequest(r_method, r_path, r_args, r_handler)
{

    var Request = CreateRequest();
    if (!Request)
    {
        return;
    }
    Request.onreadystatechange = function()
    {
        if (Request.readyState == 4)
        {
            if (Request.status == 200)
            {
                r_handler(Request);
            }
            else
            {
                Request='error';  //If response from our script <> 200 OK need to handle it
               r_handler(Request);
            }
        }
        else
        {

        }
    }


    if (r_method.toLowerCase() == "get" && r_args.length > 0)
        r_path += "?" + r_args;


    Request.open(r_method, r_path, true);

    if (r_method.toLowerCase() == "post")
    {
        Request.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=utf-8");
        Request.send(r_args);
    }
    else
    {
        Request.send(null);
    }
}

/*-----------------------------------------------------------------------------------------*/
/* Simple clear function on double click action*/

function ClearForm()
{
    document.getElementById('amount').value="";
    document.getElementById('result').value="";
    document.getElementById('date').style.display="none"
}

/*-----------------------------------------------------------------------------------------*/


 function Proceed(button)
 {
     var amount=document.getElementById('amount').value;   //Get input from User
     if (amount==0) { document.getElementById("amount").focus(); return false;}   //Just focus field and leave, if empty or zero
     document.getElementById('ldr').style.display="block"; //Show GIF loader, while an user wait result
     var Handler = function(Request)                       //AJAX callback function
     {
         if (Request=='error')                             //Wrong response from script, show error message
         {
             document.getElementById('date').style.display="block"
             document.getElementById('date').innerHTML ="Service Temporarily Unavailable";
             document.getElementById('ldr').style.display="none";
             return false;
         }
                                                               //Got response.
         document.getElementById('ldr').style.display="none";  //Hide GIF loader
         var responsedata = eval("(" + Request.responseText + ")"); //Make JavaScript object from JSON string
         document.getElementById('date').style.display="block"; //Show Date field
         document.getElementById('date').innerHTML ="Date: "+responsedata["date"]; //Set Date field
         document.getElementById('result').value=responsedata["data"]; // Set result
     }

    SendRequest('POST','Converter.php','amount='+amount, Handler);  //AJAX Request:
                                                                    //POST /Converter.php HTTP/1.1\r\n
                                                                    //...\r\n\r\n
                                                                    //amount={amount}
return false;

 }

/*-----------------------------------------------------------------------------------------*/