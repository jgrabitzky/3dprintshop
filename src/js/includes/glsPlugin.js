var GLSPSMap=function(){};GLSPSMap.prototype=function(){var e=["CZ","HU","EN","RO","SI","SK","HR"],t="//online.gls-hungary.com/psmap/psmap_getdata.php",a=null,n=null,s=[],o=[],i=[],r=[],l="",p="",c="",d=null,u=null,h=null,m=null,g=null,f=null,v=[];v.HU="Hungary",v.HR="Croatia",v.CZ="Czech Republic",v.SK="Slovakia",v.SI="Slovenia",v.RO="Romania";var y=function(){a=null,n=null,s=[],o=[],i=[],r=[],l="",p="","",c="",d=null,u=null,h=null,m=null,g=null,f=null},S=function(e){var t=new google.maps.Geocoder;e.replace(" ","")==parseInt(e.replace(" ",""),10)&&(e+=","+v[c]),e+=","+c.toLowerCase(),t.geocode({address:e},b)},b=function(e,t){if(t===google.maps.GeocoderStatus.OK){null!=a&&a.setMap(null);var o=new google.maps.Marker({map:n,position:e[0].geometry.location});n.setCenter(e[0].geometry.location),a=o,o.setAnimation(google.maps.Animation.DROP),setVisiblyParcelShop(5,s,i,n),P()}},E=function(e){return k(e).indexOf(p)>-1},k=function(e){return e.toLowerCase()},L=function(){for(var e=0;e<s.length;e++){if("t"===s[e].isparcellocker)var t="//online.gls-hungary.com/img/icon_parcellocker_hu.png";else t="//online.gls-hungary.com/img/icon_paketshop50x38_"+("hu"==c.toLowerCase()?"hu":"en")+".png";var a=new google.maps.Marker({map:n,title:s[e].name+"\r"+s[e].address+"\r"+s[e].zipcode+" "+s[e].city+"\r"+$.trim(s[e].contact+" "+s[e].phone),icon:t,position:new google.maps.LatLng(s[e].geolat,s[e].geolng)});r[s[e].pclshopid]={marker:a},C(a,s[e].pclshopid)}},C=function(e,t){google.maps.event.addListener(e,"click",function(){w(e,t,!0)})},P=function(){!function(){if(s){for(var e=n.getBounds(),t=[],a=0;a<s.length;a++)e.contains(new google.maps.LatLng(s[a].geolat,s[a].geolng))&&(""===p||E(s[a].name)||E(s[a].ctrcode)||E(s[a].zipcode)||E(s[a].city)||E(s[a].address))&&t.push(s[a]);i=t}}(),i=getVisibleParcelShops(n,s),countDistances(a,i),sortByDistance(i),M()},M=function(){$("#psitems-canvas").html(""),$.each(i,function(){var e="",t="";(isEmpty(this.holidaystarts)||isEmpty(this.holidayends)||(t=this.holidaystarts==this.holidayends?o.holiday+": "+formatDate(c,this.holidayends):o.holiday+": "+formatDate(c,this.holidaystarts)+" - "+formatDate(c,this.holidayends)),""==this.dropoffpoint||"f"==this.dropoffpoint||""!=t)&&(e='<br/> <span style="color: red;">'+(""!=t?t:o.dropOff)+"</span>");var a=$(document.createElement("div")).prop("id",this.pclshopid).prop("title",formatDistance(this.distance)).on("mouseover",{obj:this},function(e){$(this).hasClass("psSelected")||(O(e.data.obj.pclshopid),isEmpty(r[e.data.obj.pclshopid])||isEmpty(r[e.data.obj.pclshopid].div)||r[e.data.obj.pclshopid].div.addClass("psOver"))}).on("mouseout",{obj:this},function(e){$(this).hasClass("psSelected")||isEmpty(r[e.data.obj.pclshopid])||isEmpty(r[e.data.obj.pclshopid].div)||r[e.data.obj.pclshopid].div.removeClass("psOver")}).on("click",{obj:this},function(e){w(r[e.data.obj.pclshopid].marker,e.data.obj.pclshopid)}).css("padding","10px 10px 10px 10px").css("cursor","pointer").html(this.name+"<br/>"+this.zipcode+" "+this.city+"<br/>"+this.address+e);r[this.pclshopid].div=a,$("#psitems-canvas").append(a).append($(document.createElement("div")).html('<hr style="float:left;width:98%;margin:0;"/>')).css("margin","0").append($(document.createElement("div")).css("clear","both"))}),$("#psitems-canvas").append($(document.createElement("div")).html("<br/><br/>"))},O=function(e){for(var t in r)t!==e&&t!==l&&(r[t]&&r[t].marker&&r[t].marker.animation&&r[t].marker.setAnimation(null),$(r[t].div).removeClass())},w=function(e,t,a){var n=!isEmpty(r[t])&&!isEmpty(r[t].div);l=t,O(t),n&&r[t].div.addClass("psOver").addClass("psSelected"),e.setAnimation(google.maps.Animation.BOUNCE),a&&n&&$("#psitems-canvas").animate({scrollTop:$(r[t].div).parent().scrollTop()+$(r[t].div).offset().top-$(r[t].div).parent().offset().top}),!isEmpty(glsPSMap_OnSelected_Handler)&&glsPSMap_OnSelected_Handler&&_(t)},_=function(e){for(var t=0;t<s.length;t++)if(s[t].pclshopid===e){s[t].openings?this.glsPSMap_OnSelected_Handler(s[t]):A({action:"getOpenings",pclshopid:e},$.proxy(function(e){s[t].openings=e,this.glsPSMap_OnSelected_Handler(s[t])},this));break}},j=function(){var e=o.searchPS;this.value===e&&(this.value="",$(this).removeClass("default"))},D=function(){""===this.value&&(this.value=o.searchPS,$(this).addClass("default")),p=""},x=function(){p!==this.value&&(""!=(p=""===$.trim(this.value)||this.value===o.searchPS?"":k(this.value))&&S(p),p="")};function A(e,a){var n="?ctrcode="+c;if($.each(e,function(e,t){n+="&"+e+"="+t}),"getList"==e.action&&(isEmpty(d)||(n+="&senderid="+d),isEmpty(u)||(n+="&pclshopin="+u),isEmpty(h)||(n+="&parcellockin="+h),isEmpty(f)||(n+="&codhandler="+f)),"XDomainRequest"in window&&null!==window.XDomainRequest){var s=new XDomainRequest;s.open("get",t+n),s.onload=function(){var t=new ActiveXObject("Microsoft.XMLDOM"),n=$.parseJSON(s.responseText);t.async=!1,null!=n&&void 0!==n||(n=$.parseJSON(e.firstChild.textContent)),a(n)},s.onerror=function(){_result=!1},s.send()}else{if(-1!=navigator.userAgent.indexOf("MSIE")&&parseInt(navigator.userAgent.match(/MSIE ([\d.]+)/)[1],10)<8)return!1;$.ajax({url:t+n,cache:!1,dataType:"json",type:"GET",async:!1,success:function(e,t){a(e)}})}}return{init:function(a,i,r,l,p,v,b,E){y();var k=$("#"+i);if(isEmpty(r))switch(a.toUpperCase()){case"HU":r="Budapest, HU";break;case"SK":r="Bratislava, SK";break;case"CZ":r="Praha, CZ";break;case"RO":r="Bucuresti, RO";break;case"SI":r="Ljubljana, SI";break;case"HR":r="Zagreb, HR"}else editedAddress=r.split(","),r=editedAddress.slice(1).join();switch(c=a,m=l,g=r,isEmpty(p)||(d=p),isEmpty(v)||(u=v),isEmpty(b)||(h=b),isEmpty(E)||(f=E),a.toUpperCase()){case"HU":t="//online.gls-hungary.com/psmap/psmap_getdata.php";break;case"SK":t="//online.gls-slovakia.sk/psmap/psmap_getdata.php";break;case"CZ":t="//online.gls-czech.com/psmap/psmap_getdata.php";break;case"RO":t="//online.gls-romania.ro/psmap/psmap_getdata.php";break;case"SI":t="//online.gls-slovenia.com/psmap/psmap_getdata.php";break;case"HR":t="//online.gls-croatia.com/psmap/psmap_getdata.php"}var C=getLanguageFromUrl();if(-1!==$.inArray(C,e))var M=C;else M=a;A({action:"getLng2",country:M.toLowerCase()},function(e){o=getLanguageArray(e)}),k.append($(document.createElement("div")).prop("id","left-canvas").append($(document.createElement("input")).prop("id","searchinput").prop("type","text").addClass("default").val(o.searchPS).on("focus",j).on("blur",D).on("keyup",x)).append($(document.createElement("div")).prop("id","psitems-canvas"))).append($(document.createElement("div")).prop("id","right-canvas").append($(document.createElement("div")).prop("id","map-canvas"))),A({action:"getList",dropoff:l},function(e){for(var t=0;t<e.length;t++)!1===containsArrayTheParcelShop(s,e[t])&&s.push(e[t])}),n=new google.maps.Map(document.getElementById("map-canvas"),{zoom:12}),google.maps.event.addListener(n,"dragend",P),google.maps.event.addListener(n,"zoom_changed",P),isEmpty(s)||L(),S(r)},initAddress:S,setParam:function(e,t){switch(e){case"pclshopin":return u=t,!0;case"parcellockin":return h=t,!0;default:return!1}},reloadList:function(){A({action:"getList",dropoff:m},function(e){s=e,L()}),S(g)}}}();var getDistance=function(e,t){var a=function(e){return e*Math.PI/180},n=a(t.lat()-e.lat()),s=a(t.lng()-e.lng()),o=Math.sin(n/2)*Math.sin(n/2)+Math.cos(a(e.lat()))*Math.cos(a(t.lat()))*Math.sin(s/2)*Math.sin(s/2);return 6378137*(2*Math.atan2(Math.sqrt(o),Math.sqrt(1-o)))},sortByDistance=function(e){var t,a,n;do{for(t=!1,a=0;a<e.length-1;a++)e[a].distance>e[a+1].distance&&(n=e[a],e[a]=e[a+1],e[a+1]=n,t=!0)}while(t)},countDistances=function(e,t){if(null!=e)for(var a=new google.maps.LatLng(e.getPosition().lat(),e.getPosition().lng()),n=0;n<t.length;n++)if(!isEmpty(t[n].geolat)&&!isEmpty(t[n].geolng)){var s=new google.maps.LatLng(t[n].geolat,t[n].geolng);t[n].distance=getDistance(a,s)}},formatDistance=function(e){return e>1e3?Math.round(e/1e3*10)/10+" km":Math.round(e)+" m"},setVisiblyParcelShop=function(e,t,a,n){var s=20;a=[],n.setZoom(s);do{n.setZoom(--s),a=getVisibleParcelShops(n,t)}while(a.length<e&&s>5)},getVisibleParcelShops=function(e,t){result=[];for(var a=0;a<t.length;a++)position=new google.maps.LatLng(t[a].geolat,t[a].geolng),e.getBounds().contains(position)&&!1===containsArrayTheParcelShop(result,t[a])&&result.push(t[a]);return result},containsArrayTheParcelShop=function(e,t){for(var a=0;a<e.length;a++)if(e[a].pclshopid===t.pclshopid)return!0;return!1},getLanguageFromUrl=function(){var e=$(location).attr("search"),t=e.search("lang=");return e.substring(t+5,8)},formatDate=function(e,t){return"HU"===e.toUpperCase()?t.replace(/\-/g,"."):t.split("-").reverse().join(".")},getLanguageArray=function(e){var t={holiday:"Holiday",searchPS:"Search ParcelShop ...",dropOff:"Only dispatch!"};return isEmpty(e)||isEmpty(e[0])||0==e?t:($.each(e,function(){switch(this.id){case"lbl_psmap_search":t.searchPS=this.txt;break;case"txt_holiday":t.holiday=this.txt;break;case"txt_dropOffPoint":t.dropOff=this.txt}}),t)},isEmpty=function(e){return null==e||""===e||(!("number"!=typeof e||!isNaN(e))||!!(e instanceof Date&&isNaN(Number(e))))};
