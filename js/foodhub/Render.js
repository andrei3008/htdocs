/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


foodhub.Render = function(){
  return {
      dateFormat: function(date){
          //console.log(date);
          return (date.getDate()<10?'0':'') + date.getDate() + '/' + (date.getMonth()<9?'0':'') + (date.getMonth()+1) + '/' + date.getFullYear() + ' ' + (date.getHours()<10?'0':'') + date.getHours() + ':' + (date.getMinutes()<10?'0':'') + date.getMinutes();
      },
      todayISO : function() {
          //"2012-04-30T09:34:08.256Z"
          var currentDate = new(Date);
          return currentDate.getFullYear() + '-' + (currentDate.getMonth()<9?'0':'')+(currentDate.getMonth()+1) + '-' + (currentDate.getDate()<10?'0':'')+currentDate.getDate() + 'T' + (currentDate.getHours()<10?'0':'')+currentDate.getHours() + ':' + (currentDate.getMinutes()<10?'0':'')+currentDate.getMinutes() + ':' + (currentDate.getSeconds()<10?'0':'')+currentDate.getSeconds() + '.' + (currentDate.getMilliseconds()<100?'0':'')+(currentDate.getMilliseconds()<10?'0':'')+currentDate.getMilliseconds() + 'Z';
      }
  };  
}();
