
function _timer(callback) {
    var time = 0; //  The default time of the timer
    var mode = 1; //    Mode: count up or count down
    var status = 0; //    Status: timer is running or stoped
    var timer_id; //    This is used by setInterval function

    // this will start the timer ex. start the timer with 1 second interval timer.start(1000) 
    this.start = function(interval) {
        interval = (typeof(interval) !== 'undefined') ? interval : 1000;

        if (status == 0) {
            status = 1;
            timer_id = setInterval(function() {
                switch (mode) {
                    default: if (time) {
                        time--;
                        generateTime();
                        if (typeof(callback) === 'function') callback(time);
                    }
                    break;

                    case 1:
                            if (time < 86400) {
                            time++;
                            generateTime();
                            if (typeof(callback) === 'function') callback(time);
                        }
                        break;
                }
            }, interval);
        }
    }

    //  Same as the name, this will stop or pause the timer ex. timer.stop()
    this.stop = function() {
        if (status == 1) {
            status = 0;
            clearInterval(timer_id);
        }
    }

    // Reset the timer to zero or reset it to your own custom time ex. reset to zero second timer.reset(0)
    this.reset = function(sec) {
        sec = (typeof(sec) !== 'undefined') ? sec : 0;
        time = sec;
        generateTime(time);
    }

    // Change the mode of the timer, count-up (1) or countdown (0)
    this.mode = function(tmode) {
        mode = tmode;
    }

    // This methode return the current value of the timer
    this.getTime = function() {
        return time;
    }

    // This methode return the current mode of the timer count-up (1) or countdown (0)
    this.getMode = function() {
        return mode;
    }

    // This methode return the status of the timer running (1) or stoped (1)
    /*this.getStatus {
        return status;
    }*/

    // This methode will render the time variable to hour:minute:second format
    function generateTime() {
        var second = time % 60;
        var minute = Math.floor(time / 60) % 60;
        var hour = Math.floor(time / 3600) % 60;

        second = (second < 10) ? '0' + second : second;
        minute = (minute < 10) ? '0' + minute : minute;
        hour = (hour < 10) ? '0' + hour : hour;

        $('div.timer span.second').html(second);
        $('div.timer span.minute').html(minute);
        $('div.timer span.hour').html(hour);
    }
}

function destroyCode() {
    if ($('.done').val() != 'yes') {
        var val = $('.number').val();
        var usrId = $('#usrId').val();
        var from = $('.from').val();
        var data = {};

        data.val = val;
        data.userId = usrId;
        data.from = from;


        $.ajax({

            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/destroyCode',
            success: function(data) {
                console.log(data);
                JSON.stringify(data);
                $('.session').val('no');
            }
        });
    }
}

  /**************Profile Page********************/
var timer;
$(document).ready(function(e) {

    /*******TIMER********/

   
    $('.loader, .hideField, .fitLevel,.goalLevel,.RoutineLevel,.showPwdField,.openForPwd').hide();
    $(".pwd_change").on('click', function() {

        $(".openForPwd").slideToggle();

    });

    /*****open model*****/
    $('.showBig').click(function() {
        $('.showOld').show();
        $('.showNew').hide();
        $('#myModal').modal('toggle');
        $('.phone').val('');
        var getCode = $("#phone").intlTelInput('getSelectedCountryData').dialCode;

        $("#phone").val('+' + getCode);

    });
    /*********/
    /******change number*******/
    $('.numChang').click(function(e) {
        // $('.showNew').hide();
        //$('.showOld').show();
        $(".showNew").toggle("slide");
        $(".showOld").toggle("slide");
        $('.sendMgiing').text('');



        timer.stop();
        timer.reset(60);

        //timer.start(1000)
    });

    /*******Time Out*****/
    timer = new _timer(
        function(time) {
            if (time == 0) {

                timer.stop();
                destroyCode();

                /******session destroy for phone*****/

            }
        }
    );
    timer.reset(0);
    timer.mode(0);
    /***Time**/

    /*******Resend Code again*******/
    $('.resend').click(function() {
        $('.sendMging').text('');
        $('.loader').show();
        $('.code').val('');
          $('.session').val('yes');
        var from = $('.from').val();
        $('.verify').attr('disabled', 'disabled');
        timer.stop();
        timer.reset(60);

        var val = $('.number').val();
        var usrId = $('#usrId').val();

        var data = {};

        data.val = val;
        data.userId = usrId;
        data.from = from;

        $.ajax({

            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/sendCodeAgain',
            success: function(data) {
                console.log(data);
                JSON.stringify(data);

                if (data.type == 'success') {
                    timer.start(1000);

                    if ($('.sendMging').hasClass('success')) {} else {
                        $('.sendMging').addClass('success');
                    }
                    $('.sendMging').removeClass('error');
                    $('.sendMging').text(data.msg);
                }
                $('.loader').hide();
                $('.verify').removeAttr('disabled');
            }
        });
    });

    /******verify Code******/
    $('.verify').click(function() {
        var code = $('.code').val();
        var from = $('.from').val();
     
        if (code) {
              $('.resend').attr('disabled', 'disabled');
             $('.loadering').show();
             $('.sendMging').text('Please Wait for Response..');
              if ($('.sendMging').hasClass('success')) {} else {
                    $('.sendMging').addClass('success');
               }
               $('.sendMging').removeClass('error');


            if ($('.session').val() != 'no') {
                var number = $('.number').val();
                var usrId = $('#usrId').val();
                var countryName = $('.selected-flag').attr('title');
                var data = {};
                data.code = code;
                data.from = from;
                data.val = number;
                data.userId = usrId;
                data.countryName = countryName;

                $.ajax({

                    type: 'POST',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    url: '/VerifyCode',
                    success: function(data) {
                        console.log(data);
                        JSON.stringify(data);

                        if (data.type == 'success') {
                             $('.done').val('yes');
                             if ($('.sendMging').hasClass('success')) {} else {
                                $('.sendMging').addClass('success');
                            }
                            $('.sendMging').removeClass('error');

                            $('.sendMging').text(data.msg);
                            $('.phonCnt').val(number);
                            timer.stop();
                           
                              $('#myModal').delay(1000).fadeOut('slow');
                               setTimeout(function() {
                                   $("#myModal").modal('hide');
                               }, 1500);
                              $('.phonCnt').val(number);
                            //setTimeout(location.reload.bind(location), 1000);
                        } else {

                            if ($('.sendMging').hasClass('error')) {} else {
                                $('.sendMging').addClass('error');
                            }
                            $('.sendMging').removeClass('success');

                            $('.sendMging').text(data.msg);
                        }
                        $('.loadering').hide();
                        $('.resend').removeAttr('disabled');

                    }
                });
            } else {
                if ($('.sendMging').hasClass('error')) {} else {
                    $('.sendMging').addClass('error');
                }
                 $('.loadering').hide();
                 $('.resend').removeAttr('disabled');

                $('.sendMging').removeClass('success');
                $('.sendMging').text('Session Expired.Please resend the code.');
            }
        } else {
            if ($('.sendMging').hasClass('error')) {} else {
                $('.sendMging').addClass('error');
            }
            $('.sendMging').removeClass('success');
            $('.sendMging').text('Fill the field.');
            }
            
        
    });


    $('#pwdChange').submit(function(e) {

        var valid = $("#pwdChange").valid();
        if (valid) {} else {
            e.preventDefault();
        }
    });
    $('#pwdChange').validate({
        rules: {
            'old_pwd': 'required',
            'password': {
                required: true,
                minlength: 6
            },

        },
        messages: {
            old_pwd: {
                required: "old password can't be blank"
            },
            password: {
                required: "Password can't be blank",
                minlength: "Password should be at least {0} characters long"
            }

        }

    });


    var abc = 0; //Declaring and defining global increement variable
    $('.selectAdd').on('change', function() {
        var are = $(this).val();
        // alert(e.parents('.updateProfile').find('.fields'))
        $(this).parents('.updateProfile').find('.fields').val(are);
    });

    $('.selectRoutine').on('change', function() {
        var are = $(this).val();
        // alert(e.parents('.updateProfile').find('.fields'))
        $(this).parents('.updateProfile').find('.fields').val(are);
    });

    //setphone
    $("#phone").intlTelInput();

    var getCode = $("#phone").intlTelInput('getSelectedCountryData').dialCode;
    $('#phone').val('+' + getCode);

    /*************For phone valid******/
    var telInput = $("#phone"),
        errorMsg = $("#error-msg"),
        validMsg = $("#valid-msg");

    // initialise plugin
    telInput.intlTelInput({
        utilsScript: "../js/mobileValid/utils.js"
    });

    var reset = function() {
        telInput.removeClass("error");
        errorMsg.addClass("hide");
        validMsg.addClass("hide");
    };

    // on blur: validate
    telInput.blur(function() {
        reset();
        if ($.trim(telInput.val())) {
            //alert($.trim(telInput.val()));
            if (telInput.intlTelInput("isValidNumber")) {
                validMsg.removeClass("hide");
            } else {
                telInput.addClass("error");
                errorMsg.removeClass("hide");
            }
        }
    });

    // on keyup / change flag: reset
    telInput.on("keyup change", reset);
    /************end***********/



    $("#phone").on("blur keyup change", function() {
        if ($(this).val() == '') {
            var getCode = $("#phone").intlTelInput('getSelectedCountryData').dialCode;

            $(this).val('+' + getCode);

        }
    });
    $(document).on("click", ".country", function() {
        if ($("#phone").val() == '') {
            var getCode = $("#mobile-number").intlTelInput('getSelectedCountryData').dialCode;
            $("#phone").val('+' + getCode);
        }
    });


  $('body').on('change', '#file', function() {
        if (this.files && this.files[0]) {
            abc += 1; //increementing global variable by 1
            $('.showImg').hide();
            var z = abc - 1;
            var x = $(this).parent().find('#previewimg' + z).remove();
            $(this).parents('.change_profile_img').before("<div id='abcd" + abc + "' class='abcd'><img id='previewimg" + abc + "' src='' style='width:100%; height:100%; margin-top:-25px'/></div>");

            var reader = new FileReader();
            reader.onload = imageIsLoaded;
            reader.readAsDataURL(this.files[0]);

            // $(this).hide();
            $("#abcd" + abc).append($("<img/>"));
            var data = new FormData();
            data.append('files', this.files[0]);

            $.ajax({
                url: '/upFile',
                type: 'POST',
                data: data,
                processData: false,
                contentType: false,
                success: function(data) {

                    $('.showProImg').attr('src', './uploads/images/' + data);
                    console.log('upload successful!\n' + data);
                }

            });
        }
    });
    //To preview image     
    function imageIsLoaded(e) {
        $('#previewimg' + abc).attr('src', e.target.result);
    };

    function isValidEmailAddress(emailAddress) {
        var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        return pattern.test(emailAddress);
    };

    $('.edit').click(function() {
        $(this).parents('.updateProfile').find('input').removeAttr('readonly');

        var at = $(this).parents('.updateProfile').find('.fields').attr('attr');
        if (at == 'phone') {
            $(this).parents('.updateProfile').find('.fields').hide();
            $('.setphone').show();

            $('.intl-tel-input').show();
        } else if (at == 'fitness') {
            $(this).parents('.updateProfile').find('input').hide();
            $('.fitLevel').show();
        } else if (at == 'WOD_routine') {
            $(this).parents('.updateProfile').find('input').hide();
            $('.RoutineLevel').show();
        } else if (at == 'goal') {
            $(this).parents('.updateProfile').find('input').hide();
            $('.goalLevel').show();
        }

        // $(this).hide();
        $(this).parents('.updateProfile').find('.hideField').show();
        $(this).parents('.updateProfile').find('.hideField').find('.sub').show();
    });

    $('.sub').click(function(e) {
        e.preventDefault();
        var usrId = $('#usrId').val();
        var val = $(this).parents('.updateProfile').find('.fields').val();
        var attr = $(this).parents('.updateProfile').find('.fields').attr('attr');
        var paret = $(this).parents('.updateProfile');

        if (attr == 'phone') {
            $('.session').val('yes');
             $('.sendMgiing').text('');
             if ($(".phone").intlTelInput("isValidNumber")) {

                $('.loading').show();


                var number = $('.setphone').val();

                $(this).parents('.updateProfile').find('.fields').val(number);
                var val = $(this).parents('.updateProfile').find('.fields').val();
                var countryName = $('.selected-flag').attr('title');
                var country = $('.cnty_Nm').val(countryName);
                $(this).parents('.updateProfile').find('.sub').attr('disabled', 'disable');
                $('.sendMging').text('');

            } else {
                return false;
                exit();
            }
        }

        if (val != '') {

            if (attr == 'fitness') {
                $('.fitLevel').hide();
                $(this).parents('.updateProfile').find('.fields').show();
                $(this).parents('.updateProfile').find('.edit').show();
            } else if (attr == 'WOD_routine') {
                $('.RoutineLevel').hide();
                $(this).parents('.updateProfile').find('.fields').show();
                $(this).parents('.updateProfile').find('.edit').show();
            } else if (attr == 'email') {

                if (!isValidEmailAddress(val)) {
                    $('.msg').addClass('error');
                    $('.msg').text('Please fill valid email address');
                    return false;
                    exit();
                }
            } else if (attr == 'fitness') {
                $('.goalLevel').hide();
                $(this).parents('.updateProfile').find('.fields').show();
                $(this).parents('.updateProfile').find('.edit').show();
            }

            var from = $('.from').val();

            div = $(this).parents('.updateProfile');
            $(this).parents('.updateProfile').find('.alertText').removeClass('err').text('');

            var data = {};
            data.attr = attr;
            data.val = val;
            data.userId = usrId;
            data.from = from;
            if (countryName) {
                data.country = countryName;
            }

            $.ajax({

                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json',
                url: '/updateUser',
                success: function(data) {
                    console.log(data);
                    JSON.stringify(data);

                    if (data.type == 'err') {
                        if (attr == 'phone') {
                    $('.sendMgiing').text(data.msg);
                    $('.loading').hide();
                    paret.find('.sub').removeAttr('disabled');

                        }else{
                        $('.msg').removeClass('success');
                        $('.msg').addClass('error');
                        }
                    } else {

                        if (attr == 'user_name') {
                            paret.find('#usrnm').val(val);
                            $('.upName').text($('#usrnm').val() + ' ( ' + $('#usrfn').val() + ' ' + $('#usrln').val() + ' )');
                        } else if (attr == 'fitness') {
                            paret.find('#usrfitns').val(val);
                        } else if (attr == 'goal') {
                            paret.find('#usrgoal').val(val);
                        } else if (attr == 'WOD_routine') {
                            paret.find('#usrWOD').val(val);
                        } else if (attr == 'last_name') {
                            paret.find('#usrln').val(val);
                            $('.upName').text($('#usrnm').val() + ' ( ' + $('#usrfn').val() + ' ' + $('#usrln').val() + ' )');
                        } else if (attr == 'first_name') {
                            paret.find('#usrfn').val(val);
                            $('.upName').text($('#usrnm').val() + ' ( ' + $('#usrfn').val() + ' ' + $('#usrln').val() + ' )');
                        } else if (attr == 'phone') {
                            /*   paret.find('#usrphn').val(val);
                            number
                               paret.find('.fields').show();
                                paret.find('.edit').show();
                                paret.find('.intl-tel-input').hide();
                               
                            $('.showValid').show();*/
                            paret.find('.sub').removeAttr('disabled');
                            paret.find('.loading').hide();
  
                           $('.phonCnt').val('');
                            paret.find('#usrphn').val(val);
                            $('.number').val(val);
                            //$('.showOld').hide();
                            $(".showOld").toggle("slide");
                            $(".showNew").toggle("slide");
                            $('.showNew').show('slide', {
                                direction: 'left'
                            }, 1000);
                            //$('.showNew').show();
                            $('.loading').hide();
                            $('.code').val('');
                            paret.find('.sub').removeAttr('disabled');


                            timer.reset(60);

                            timer.start(1000)

                            //  myVar = setTimeout(function(){ destroyCode(); }, 20000);
                            timer.reset(60).click();
                            setTimeout(function() {
                                timer.start(1000).click();
                            }, 1000)

                        } else if (attr == 'email') {
                            paret.find('#usrmail').val(val);
                        } else if (attr == 'age') {
                            paret.find('#usrage').val(val);
                        } else if (attr == 'height') {
                            paret.find('#usrheght').val(val);
                        } else if (attr == 'weight') {
                            paret.find('#usrweght').val(val);
                        } else if (attr == 'waist') {
                            paret.find('#usrwst').val(val);
                        }

                        $('.msg').addClass('success');
                        $('.msg').removeClass('error');
                    }
                    $('.msg').text(data.msg);

                    div.find('.fields').attr('readonly', 'readonly');
                    div.find('.hideField').hide();
                    //   div.find('.edit').show();
                    div.find("#error-msg").hide();
                    div.find("#valid-msg").hide();

                }

            });
        } else {
            var err = $(this).parents('.updateProfile').find('.alertText').addClass('err').text('Please fill the field first');
        }
    });

    //hide submit nutton

    $('.closeTab').click(function() {

        var attr = $(this).parents('.updateProfile').find('.fields').attr('attr');

        if (attr == 'user_name') {
            var fiVAal = $(this).parents('.updateProfile').find('#usrnm').val();
            $(this).parents('.updateProfile').find('.fields').val(fiVAal);
        } else if (attr == 'fitness') {

            var fiVAal = $(this).parents('.updateProfile').find('#usrfitns').val();
            $(this).parents('.updateProfile').find('.fields').val(fiVAal);


        } else if (attr == 'last_name') {

            var fiVAal = $(this).parents('.updateProfile').find('#usrln').val();
            $(this).parents('.updateProfile').find('.fields').val(fiVAal);

        } else if (attr == 'first_name') {

            var fiVAal = $(this).parents('.updateProfile').find('#usrfn').val();
            $(this).parents('.updateProfile').find('.fields').val(fiVAal);


        } else if (attr == 'phone') {

            var fiVAal = $(this).parents('.updateProfile').find('#usrphn').val();
            $(this).parents('.updateProfile').find('.fields').val(fiVAal);

        } else if (attr == 'email') {

            var fiVAal = $(this).parents('.updateProfile').find('#usrmail').val();
            $(this).parents('.updateProfile').find('.fields').val(fiVAal);

        } else if (attr == 'height') {

            var fiVAal = $(this).parents('.updateProfile').find('#usrheght').val();
            $(this).parents('.updateProfile').find('.fields').val(fiVAal);


        } else if (attr == 'age') {

            var fiVAal = $(this).parents('.updateProfile').find('#usrage').val();
            $(this).parents('.updateProfile').find('.fields').val(fiVAal);


        } else if (attr == 'weight') {

            var fiVAal = $(this).parents('.updateProfile').find('#usrweght').val();
            $(this).parents('.updateProfile').find('.fields').val(fiVAal);


        } else if (attr == 'waist') {

            var fiVAal = $(this).parents('.updateProfile').find('#usrwst').val();
            $(this).parents('.updateProfile').find('.fields').val(fiVAal);

        }
        $(this).parents('.updateProfile').find('.fields').show();
        $(this).parents('.updateProfile').find('.setphone').hide();
        $(this).parents('.updateProfile').find('.fitLevel').hide();
        $(this).parents('.updateProfile').find('.goalLevel').hide();
        $(this).parents('.updateProfile').find('.RoutineLevel').hide();
        $(this).parents('.updateProfile').find('.fields').attr('readonly', 'readonly');
        $(this).parents('.updateProfile').find('.hideField').hide();
        //  $(this).parents('.updateProfile').find('.edit').show();
        $(this).parents('.updateProfile').find('.intl-tel-input').hide();
        $(this).parents('.updateProfile').find('#error-msg').hide();
        $(this).parents('.updateProfile').find('#valid-msg').hide();

    });
    $('.intl-tel-input').hide();
    $('.data .intl-tel-input').show();


    /**************end of Profile Page********************/

});