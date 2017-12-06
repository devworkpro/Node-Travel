$(document).ready(function() {


 /***************List WOD Section under Admin scetion****/
 $('.orderList').click( function (e){
//e.preventDefualt();
    var data =[];
   
    var i = 1;
   var google =$(this).parents('.tab-pane').find('.gogle');
   google.each( function (){
  var order = $(this).find('.order').val();
  console.log(order);
 // var order.i = order;
  data.push(order);
   var wodId =  $(this).find('.ids').val();
  // var wodId.i = wodId;
  data.push(wodId);
   data.push('br');



       i++; });
    var obj ={};
    obj.data = data;
    obj.plan = google.find('.plan_name').val(); 
   
       $.ajax({

                type: 'POST',
                data: JSON.stringify(obj),
                contentType: 'application/json',
                url: '/orderWODList',
                success: function(data) {
                    $('.showDivNow').show();
                }
                });

    });

 /****************end of WOD section*********/

 /*************Add Workout**********/
 $('.planChange').on('change', function(e) {
    var planId = $(this).val();
 
      $.ajax({

                type: 'POST',
             data: JSON.stringify({ "planId": planId}),
                contentType: 'application/json',
                url: '/getUniqueOrder',
                success: function(data) {
                    JSON.stringify(data);
                   if(data === 'false'){
                   var getted = '1';
                   }else{
                   var getted = parseInt(data)+ parseInt(1);
             
                 }
                    $('.orderSeq').val(getted);
                    console.log(getted);
                }
                });

});
 /***********end of Workout********/
 });

