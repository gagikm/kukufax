var file = "";
var name = "";

var isMobile = false;
var hasMusic = false;

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-49234069-8', 'auto');
ga('send', 'pageview');

var warningIcon = "<img id='warningIcon' src='/static/img/orange-warning-icon.png'>";
var loadingGif = "<img id='loadingIcon' src='/static/img/loading.gif'>";
var successIcon = "<img id='successIcon' src='/static/img/success.png'>";

if (window.innerWidth < 900 || screen.width < 900) {
  isMobile = true;
  $('head').append('<link rel="stylesheet" type="text/css" href="../static/bootstrap/css/mobileStyle.css">');
}

var bgNum = Math.floor(Math.random() * 4) + 1;
var bgFileName = "bg" + bgNum +".jpg";
$('html').css('background-image','url("../../static/img/bg/' + bgFileName +'")');

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('vid', {
    events: {
      'onReady': onPlayerReady
    }
  });
}

function onPlayerReady() {
  if ($('#wrap').is(':visible')) {
    player.playVideo();
  }
}


var navParam = getURLParameter('nav');
var kukucodeParam = getURLParameter('kukucode');

$(document).ready(function() {

  getPublicKukucodes();
  openBottomPanel();

  // if (!isMobile) {
  //   $("#intro").animate({width: '550px'}, 5000);
  // }

  if (navParam === "receive") {
    if (isMobile) {
      switchToReceiveMobile();
    } else {
      switchToReceive();
    }
  } else if (navParam === "send") {
    switchToSend();
  }

  if (kukucodeParam) {
    $('#receiveKukucode').val(kukucodeParam);
  }

  $(document).on('click', "p.publicLetter", function() {
    switchToReceive();
    $('#receiveKukucode').val($(this).html());         
    $('#checkButton').click();
  });

  $("#receive").on('submit', function(e){
      e.preventDefault();
      validate();
  });

  $("#send").on('submit', function(e){
      e.preventDefault();
      checkAndSubmit();
    });

  $("#send").on('change', function(){
    $("#letterIconCaption").val($('#uploadedFile').prop("files")[0]['name']);
    $("#mobileUploadButton").val($('#uploadedFile').prop("files")[0]['name']);
  })

  $('#imageIconCaption').on('input', function(){
    $('#bgLink').val($(this).val());
  });

  $('#musicIconCaption').on('input', function(){
    $('#youtubeLink').val($(this).val());
  });

  $('#kukucodeIconCaption').on('input', function(){
    $('#sendKukucode').val($(this).val());
  });

  $('#pinIconCaption').on('input', function(){
    $('#sendPin').val($(this).val());
  });

  $('#sendIcon').on('click', function(){
    $("#send").submit();
  });

  $("#topSendNav").on('click', function(e){
    switchToSend();
  });

  $("#mobileSendNav").on('click', function(e){
      switchToSendMobile();
    });

  $("#topReceiveNav").on('click', function(e){
      switchToReceive();
    });

  $("#mobileReceiveNav").on('click', function(e){
      switchToReceiveMobile();
    });

  $("#fromAddress").on('focus', function(e){
      $("#fromAddress").val(wordifyDate(new Date()));
    });

  $("#letterIcon, #mobileUploadButton").on('click', function() {
    $("#uploadedFile").trigger('click');
  });

  $("#kukucodeIcon img").on('click', function() {
    $("#kukucodeIconCaption").trigger('focus');
  });

  $("#pinIcon img").on('click', function() {
    $("#pinIconCaption").trigger('focus');
  });

  $("#musicIcon img").on('click', function() {
    $("#musicIconCaption").trigger('focus');
  });

  $("#imageIcon img").on('click', function() {
    $("#imageIconCaption").trigger('focus');
  });

  $("#assignedPin").on('click', function() {
    $('#assignedPin').html($('#sendPin').val());
  });


  $("#bgLink").on('change', function(){
    var defaultBg = $('html').css("background-image")
    defaultBg = defaultBg.replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*/, '')

    var linkInputted = $('#bgLink').val();
    if (linkInputted && isUrl(linkInputted)) {
      $('html').css('background-image','url("' + linkInputted +'")');
    } else {
      $('html').css('background-image','url("' + defaultBg +'")');
    }
  })

  $("#kukucodeIcon").hover(function() {
    $("#kukucodeArrow").show();
  }, function() {
    $("#kukucodeArrow").hide();
  });

  $("#pinIcon").hover(function() {
    $("#pinArrow").show();
  }, function() {
    $("#pinArrow").hide();
  });

  $("#letterIcon").hover(function() {
    $("#letterArrow").show();
  }, function() {
    $("#letterArrow").hide();
  });

  $("#musicIcon").hover(function() {
    $("#musicArrow").show();
  }, function() {
    $("#musicArrow").hide();
  });

  $("#imageIcon").hover(function() {
    $("#imageArrow").show();
  }, function() {
    $("#imageArrow").hide();
  });

  $("#toggleOptionalInputs").on('click', function() {
    if($(".optional").is(':visible')) {
      $(".optional").attr('style', 'display: none !important');
      $("#sendStatusMessage").css('margin-top','490px');
      $("#toggleOptionalInputs").html("Show optional inputs");  
    } else {
      $("#toggleOptionalInputs").html("Hide optional inputs");
      $("#sendStatusMessage").css('margin-top','840px');
      $(".optional").attr('style', 'display: block !important');
    }
  });
});

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

switchToSend = function() {
  $("#receive").hide();
  $("#intro").hide();
  $("#senderInfo").hide();
  $("#send").show();
  if (!isMobile) {
    $("#icons").show();
  } else {
    $("#letterInfo").show();
    $("#submitLetter").show();
    $("#toggleOptionalInputs").show();
    closeBottomPanel();
  }
  $("#topbar").css('background-color', '#009633');
  $("#topReceiveNav").css('border-bottom', 'none');
  $("#topSendNav").css('border-bottom', '2px solid white');
  clearStatusMessages();
}

switchToSendMobile = function() {
  $("#mobileSendNav").css({'border-bottom': '1px solid #009633', opacity: 1});
  $("#mobileReceiveNav").css({'border-bottom': '1px solid transparent', opacity: 0.5});
  $("#receive").hide();
  $("#send").show();
}

switchToReceive = function() {
  $("#topbar").css('background-color', '#4BA5D9');
  $("#receive").show();
  $("#send").hide();
  $("#icons").hide();
  $("#sendStatusMessage").hide();
  $("#topSendNav").css('border-bottom', 'none');
  $("#topReceiveNav").css('border-bottom', '2px solid white');
  clearStatusMessages();
  $("#senderName").html("");
  $("#senderDateOrAddress").html("");
  $("#senderCity").html("");
  if (isMobile) {
    $("#toggleOptionalInputs").hide();
    openBottomPanel();
  } else {
    $("#intro").show();
  }
}

switchToReceiveMobile = function() {
  $("#mobileSendNav").css({'border-bottom': '1px solid transparent', opacity: 0.5});
  $("#mobileReceiveNav").css({'border-bottom': '1px solid #4BA5D9', opacity: 1});
  $("#receive").show();
  $("#send").hide();
}
isUrl = function(s) {
   var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
   return regexp.test(s);
}

clearStatusMessages = function() {
  $('#receiveStatusMessage').html("");
  $('#sendStatusMessage').html("");
}


showInfo = function() {
  $('#receiveKukucode').hide();
  $('#receivePin').hide();
  $('#intro').hide();
  $('#receiveStatusMessage').hide();
  $('#resetButton').show();
  $('#openButton').show();
  $('#checkButton').hide();
  if (isMobile) {
    $('#openButton').css({'visibility':'visible', 'display':'inline-block'});
    $('#resetButton').css({'visibility':'visible', 'display':'inline-block'});
    $('#topnavbar div').hide();
  } else {
    $('#topbar').hide();
    $('#ad').hide();
    $('#receive').css({'margin-left': '500px', 'margin-top': '240px'});
    $('#receive').addClass('hoverForButtons');
  }
  $('#senderInfo').show();
  $('#envelopeInfo').show();
  closeBottomPanel();
}

hideInfo = function() {
  openBottomPanel();
  $('#receiveKukucode').show();
  $('#receivePin').val("");
  $('#receivePin').hide();
  $('#receiveStatusMessage').html("");
  $('#receiveStatusMessage').show();
  $('#senderInfo').hide();
  $('#resetButton').hide();
  $('#openButton').hide();
  $('#editButton').hide();
  $('#sendButton').hide();
  $('#checkButton').show();
  if (isMobile) {
    $('#openButton').css({'visibility':'hidden', 'display':'none'});
    $('#resetButton').css({'visibility':'hidden', 'display':'none'});
    $('#topnavbar div').show();
  } else {
    $('#topbar').show();
    $('#ad').show();
    $('#receive').css({'margin': '0 auto', 'margin-top': '120px'});
    $('#receive').removeClass('hoverForButtons');
  }
  $('#envelopeInfo').hide();
}

openPreview = function() {
  if ($('#uploadedFile').prop("files") && $('#uploadedFile').prop("files")[0]) {
    var reader = new FileReader();
    var youtubeId;
    if ($("#youtubeLink").val()) {
      var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      var match = $('#youtubeLink').val().match(regExp);

      if (match && match[2].length == 11) {
        youtubeId = match[2];
      } 
    }
    reader.onload = function(e) {
      updateUserInfo($('#sendName').val(), e.target.result, $('#sendLocation').val(), $('#sendDate').val(), 
                     $('#fromName').val(), $('#fromAddress').val(), $('#fromLocation').val(), youtubeId, $('#bgLink').val(), true);
    }

    reader.readAsDataURL($('#uploadedFile').prop("files")[0]);
  }
  showInfo();
  $('#send').hide();
  $('#icons').hide();
  $('#receive').show();
  $('#sendStatusMessage').hide();
  $('#resetButton').hide();
  $('#editButton').show();
  $('#sendButton').show();
  $('#receiveStatusMessage').css('display','inline');
  clearStatusMessages();
}

closePreview = function() {
  hideInfo();
  $('#send').show();
  $('#icons').show();
  $('#topbar').show();
  $('#receive').hide();
  $('#senderInfo').hide();
  $('html').css('background-image','url("../../static/img/bg/' + bgFileName +'")');
  $('#receiveStatusMessage').css('display','block');
  $('#letter').css('height','auto');
  clearStatusMessages();

}

closeBottomPanel = function() {
  $('#bottomPanel').animate({height: "0px"}, 1000);
}

openBottomPanel = function() {
  $('#bottomPanel').animate({height: "70px"}, 1000);
}

// On receive side, validate kukucode to make sure it exists then retrieve letter and info
validate = function(event) {
  if (!$('#receiveKukucode').val()) {
    $("#receiveStatusMessage").html(warningIcon + "Please enter a kukucode");
    return;
  }
	$.post( "/retrieve", $("#receive").serialize(),
                function(data) {
                  updateUserInfo(data.Item.name, data.Item.fileName, data.Item.location, data.Item.date, data.Item.senderName, data.Item.senderDateOrAddress, data.Item.senderLocation, data.Item.youtubeVid, data.Item.bgImageLink, false);
                  showInfo();
                }, "json"
              )
              .error(function(xhr) {
                if (xhr.responseText == "unassignedKukucode") {
                    $("#receiveStatusMessage").css('color','#FEB648');
                    $("#receiveStatusMessage").html(warningIcon + "Invalid kukucode");
                    $("#checkButton").val("receive");
                  } else if (xhr.responseText == "pinProtected") {
                    $('#receivePin').css({'display':'block'});
                    $("#receiveStatusMessage").html("");
                    $('#checkButton').val("access");
                  } else if (xhr.responseText == "incorrectPin") {
                    $("#receiveStatusMessage").html(warningIcon + "Incorrect pin");
                    $('#checkButton').val("try again");
                  } else {
                    alert(xhr.responseText);
                  }
              })
              .always(function() {
              });
  $("#checkButton").val("receiving...");
}

// Retrieve kukucodes of letters marked as public
getPublicKukucodes = function(event) {
  $.get( "/getPublicKukucodes",
                function(data) {
                  data.forEach(function(item){
                    console.log(item.kukucode);
                    $("#publicLettersList").append('<li><div><p class="publicLetter">' + item.kukucode + '</p></div></li>');
                  });
                }, "json"
              )
              .error(function(xhr) {
              })
              .always(function() {
              });
}


// Get data from send form and call signup route to add info and file to DB
submitLetter = function() {
  var formData = new FormData($('#send')[0]);

  $.ajax({
        url: "/signup",
        type: 'POST',
        data: formData,
        async: true,
        success: function (data) {
            $("#receiveStatusMessage").show();
            $("#receiveStatusMessage").css('color', '#009633');
            $("#receiveStatusMessage").html(successIcon + "KukuFax sent!");
            $("#sendStatusMessage").html(successIcon + "KukuFax sent!");
            $("#sendButton").hide();
            $("#editButton").hide();
            $("#resetButton").show();
            alert("KukuFax sent! \nKUKUCODE: " + $('#sendKukucode').val() + '\n' + "PIN: " + $('#sendPin').val());
        },
        error: function (request, status, error) {
            console.log(request.responseText);
        },
        cache: false,
        contentType: false,
        processData: false
    });
  $("#receiveStatusMessage").show();
  $("#receiveStatusMessage").css('color', '#009633');
  $("#receiveStatusMessage").html(loadingGif + "sending...");
}

validInputs = function() {
  if (!$("#fromName").val()) {
    $("#sendStatusMessage").show();
    $("#sendStatusMessage").css('color','#FEB648');
    $("#sendStatusMessage").html(warningIcon + "Please enter your name.");
    return false;
  } else if (!$("#sendKukucode").val()) {
    $("#sendStatusMessage").show();
    $("#sendStatusMessage").css('color','#FEB648');
    $("#sendStatusMessage").html(warningIcon + "Please assign a kukucode.");
    return false;
  } else if (!$("#uploadedFile").val()) {
    $("#sendStatusMessage").show();
    $("#sendStatusMessage").css('color','#FEB648');
    $("#sendStatusMessage").html(warningIcon + "Please upload your letter.");
    return false;
  } else if (!$("#sendName").val()) {
    $("#sendStatusMessage").show();
    $("#sendStatusMessage").css('color','#FEB648');
    $("#sendStatusMessage").html(warningIcon + "Please enter recipient's name.");
    return false;
  }
  return true;
}


// On send side, check inputs
checkAndSubmit = function(event) {
  if (!validInputs()) {
    return;
  }

	$.post( "/verifyUniqueKukucode", $("#send").serialize(),
                function() {
                }, "json"
              )
              .error(function(xhr) {
                if (xhr.responseText == "kukucodeTaken") {
                   $("#sendStatusMessage").css('color','#FEB648');
                   $("#sendStatusMessage").html(warningIcon + "kukucode already exists");
                } else {
                  if (isMobile) {
                    submitLetter();
                  } else {
                    openPreview();
                  }
                }
              });
  $("#sendStatusMessage").css('color', '#009633');
  $("#sendStatusMessage").html(loadingGif + "validating...");
  $("#sendStatusMessage").show();

}

expandLetter = function(form) {
  if (isMobile) {
    $('#ad').fadeOut(200);
    $('#navbar').fadeOut(200);
    $('#receive').fadeOut(200);
    $('#wrap').fadeIn(900);
    setTimeout(function() {
        if ($('#letter').height() < 200) {
          $('#letter').css('height', '100vh');
        }
        $('#envelope').animate({height:'100vh', marginTop:0},200);
        $('#envelope').css({border:'none', borderImage: 'none'}, 900);
        $('#wrap').css('visibility','visible')
        if (hasMusic) {
          player.playVideo();
        }
        $('#close').fadeIn(200);
      }, 1000);
  } else {
    $('#ad').fadeOut(200);
  	$('#navbar').fadeOut(200);
  	$('#receive').fadeOut(200);
  	$('#wrap').fadeIn(900);
    setTimeout(function() {
        if ($('#letter').height() < 500) {
          if($(window).height() < 920) {
            $('#letter').css('height', '100vh');
          } else {  
            $('#letter').css('height', '920px');
          }
        }
        $('#envelope').animate({height:'100vh', marginTop:0},200);
        $('#envelope').css({border:'none', borderImage: 'none'}, 900);
        $('#wrap').css('visibility','visible')
        if (hasMusic) {
          player.playVideo();
        }
        $('#close').fadeIn(200);
      }, 500);
  }
}


closeLetter = function(form) {
  if (!isMobile) {
	  $('#envelope').animate({height:'420', width:'920', marginTop:95} ,200);
	  $('#envelope').css({border:'10px solid white', borderImage: "url('/static/img/border.png') 10 round", backgroundColor: 'white'}, 2000);
  } else {
    $('#envelope').animate({height:'', width:'100%', marginTop:50} ,200);
    $('#envelope').css({border:'10px solid white', borderImage: "url('/static/img/border.png') 10 round", backgroundColor: 'white'}, 2000);
  }
  $('#close').hide();
	$('#wrap').hide();
  $('#wrap').css('visibility','hidden')
	$('#navbar').fadeIn(200);
	$('#receive').fadeIn(200);
  if (hasMusic) {
    player.pauseVideo();
  }
}

resetPage = function() {
  switchToReceive();
	hideInfo();
  $('html').css('background-image',"");
  $("#checkButton").val("receive");
}

updateUserInfo = function(name, fileName, location, date, senderName, senderDateOrAddress, senderCity, youtubeVid, bgImageLink, preview) {
	document.getElementById('name').innerHTML = name;
	
  if (date) {
    document.getElementById('address1').innerHTML = date;
  } else {
    document.getElementById('address1').innerHTML = "";
  }
  if (location) {
	 document.getElementById('address2').innerHTML = location;
  } else {
    document.getElementById('address2').innerHTML = "";
  }

  if (senderName) {
    document.getElementById('senderName').innerHTML = senderName;
  } else {
    document.getElementById('senderName').innerHTML = "";
  }
  if (senderDateOrAddress) {
    document.getElementById('senderDateOrAddress').innerHTML = senderDateOrAddress;
  } else {
    document.getElementById('senderDateOrAddress').innerHTML = "";
  }
  if (senderCity) {
    document.getElementById('senderCity').innerHTML = senderCity;
  } else {
    document.getElementById('senderCity').innerHTML = "";
  }

  if (bgImageLink) {
      $('html').css('background-image','url("' + bgImageLink +'")');
    }

  if (!isMobile) {
    if (preview) {
      $('#letter').attr('data', fileName);
    } else {
	   $('#letter').attr('data', "https://s3-us-west-2.amazonaws.com/s3-kukufiles/"+ fileName + "#zoom=100&view=FitH&scrollbar=0");
    }
  } else {
    $('#letter').attr('data', "https://s3-us-west-2.amazonaws.com/s3-kukufiles/"+ fileName + "#view=Fit");
  }

  if (youtubeVid) {
      console.log("has music");
      hasMusic = true;
      $('#vid').attr("src", "https://www.youtube.com/embed/" + youtubeVid + "?enablejsapi=1");
    } else {
      hasMusic = false;
  }
}

showSendScreen = function() {
  $('#assignedKukucode').html($('#sendKukucode').val());
  $('#assignedPin').html('click to show');
  $('#sendScreenWrapper').show();
}
