jQuery(document).ready(function($) {

    'use strict';


    //FULLSCREEN SLIDER
    $('#slides').superslides({
        animation: 'fade'
    });


    //SMOOTH SCROLL
    smoothScroll.init({
        speed: 500, // How fast to complete the scroll in milliseconds
        easing: 'easeInOutCubic', // Easing pattern to use
        updateURL: false, // Boolean. Whether or not to update the URL with the anchor hash on scroll
        callbackBefore: function(toggle, anchor) {}, // Function to run before scrolling
        callbackAfter: function(toggle, anchor) {} // Function to run after scrolling
    });


    //TEXT ROTATOR
    $(".rotate").textrotator({
        animation: "fade", // You can pick the way it animates when rotating through words. Options are dissolve (default), fade, flip, flipUp, flipCube, flipCubeUp and spin.
        separator: "," // If you don't want commas to be the separator, you can define a new separator (|, &, * etc.) by yourself using this field.
    });


    //MILESTONE
    $('.timer').countTo();


    //ANIMATIONS
    var wow = new WOW({
        boxClass: 'wow', // animated element css class (default is wow)
        animateClass: 'animated', // animation css class (default is animated)
        offset: 0, // distance to the element when triggering the animation (default is 0)
        mobile: false // trigger animations on mobile devices (true is default)
    });
    wow.init();


    // ---------------------------ADIVOSOR CAROUSEL
    var questionnaire = $("#questionnaire-carousel");
    questionnaire.owlCarousel({
        autoPlay: false,
        pagination: true,
        slideSpeed: 500,
        paginationSpeed: 600,
        paginationNumbers: false,
        singleItem: true,
        rewindNav: false,
        scrollPerPage: true,
        mouseDrag: false,
        navigation: false // Show next and prev buttons
        // navigationText: ['<div class="q-buttons owl-prev prev-verify" style="">Previous</div>', '<div class="q-buttons owl-next next-verify" style="">Next</div>']
    });

    var current_page = 1;
    $('.prev-verify').css('visibility', 'hidden');
    function min_selected(q_num) {
        var result = false;
        $.each($('input[id*="q' + (q_num - 2) + '"]'), function(index, value) {
            if (value.checked) {
                result = true;
                return false;
            }
        });
        return result;
    }

    function go_to_page(page_num) {
        $('.custom-page').each(function(index) {
            $(this).removeClass('active');
        });
        $('.custom-page.' + page_num).addClass('active');
        questionnaire.trigger('owl.goTo', page_num - 1);
        current_page = page_num;
        $('.prev-verify').css('visibility', current_page == 1 ? 'hidden':'visible');
        $('.next-verify').css('visibility', current_page == 14 ? 'hidden':'visible');
    }

    $('body').on('click', '.next-verify', function() {
        if (current_page < 3) {
            if ($('#q'+current_page+'-none').prop('checked')){
                generatereport("report-unregulated")
            } else {go_to_page(current_page + 1)
            }
        } else if (current_page < 14) {

                if (current_page==11){
                    var x=0
                    for (var i = 4; i < 12; i++){
                        if ($('#q'+i+'-no').prop('checked')){
                         x++;     
                        }
                    }
                    if (x==8){generatereport("report-no-action")}
                }
                if ([3, 4, 5, 6].indexOf(current_page) > -1) { //Check that at least one checkbox has been checked in slides 3, 4, 5, 6, 7
                    if (min_selected(current_page)) {
                        go_to_page(current_page + 1)
                    } else {
                        $('.error-message').text("Please select at least one option.").show().delay(5000).fadeOut();
                    }
                } else { //Go on to the next slide
                    if (current_page == 13){$('.next-verify').css('visibility', 'hidden');} 
                    go_to_page(current_page + 1)
                }
            }
    });

    $('body').on('click', '.prev-verify', function() {
        if (current_page > 1) {
            go_to_page(current_page - 1)
        }
    });

    $('body').on('click', '.custom-page', function(event) {
        var previous_page = current_page;
        current_page = parseInt($(this).find('span').text());
        if ([3, 4, 5, 6].indexOf(previous_page) > -1 && current_page > previous_page) {
            if (min_selected(previous_page)) {
                go_to_page(current_page);
            } else {
                $('.error-message').text("Please select at least one option.").show().delay(5000).fadeOut();
                current_page = previous_page;
            }
        }
        if (current_page - previous_page > 0 && current_page > previous_page) {
            var all_questions_answered = true;
            var missing_question = 3;
            for (var i = 3; i < current_page; i++) {
                if (!min_selected(i)) {
                    all_questions_answered = false;
                    missing_question = i;
                    break
                }
            }
            if (all_questions_answered) {
                go_to_page(current_page);
            } else {
                $('.error-message').text("Please answer some missing questions first.").show().delay(5000).fadeOut();
                go_to_page(missing_question);
                current_page = missing_question;
            }
        } else {
            go_to_page(current_page);
        }
    });

    //----------------GENERATES REPORT-----------------
    $('body').on('click', '.button-generate-report', function() {
        var report = ''
        generatereport(report) 
    });

    function generatereport(reporttype) {
        var revenue = $("#revenue").val();
        $('#q1 :checkbox:checked').each(function() {
                    $('#q1-text').append(', '+$(this).val());   
        });
        if (reporttype){
            $('#report').show();
            $('#'+ reporttype).show();

            //Scroll to report part of page
                $('html, body').animate({
                    scrollTop: $("#report").offset().top - 40
                }, 1000);
        }
            else{
                if (min_selected(current_page)) {
                var options = {};
                $.each($('input[name="question"]'), function(index, value) {
                    options[this.id] = this.checked ? 1 : 0;
                });

                if (min_selected(12) && (!$('#q12-no').prop('checked'))){
                    if ($('#q16-yes').prop('checked')){$('#q16-true').show()}
                    generatereport("report-exemption")
                }else if ($('#q12-no').prop('checked')){
                    var atLeastOneIsChecked = $('input[class="apply"]:checked').length > 0;
                    if (atLeastOneIsChecked){
                        if ($('#q3-yes').prop('checked')){$('.agents').show(); $('#agent-fee').append($("#agents").val() * 200)}
                        if ($('#q4-yes').prop('checked')){$('#q4-true').show()}
                        if ($('input[class="q5-apply"]:checked')){$('#q5-true').show()}
                        if ($('#q6-yes').prop('checked')){$('#q6-true').show()}
                        if ($('input[class="q7 apply"]:checked')){$('#q7-true').show()}
                        if ($('#q8-yes').prop('checked')){$('#q8-true').show()}
                        if ($('input[class="q9 apply"]:checked')){$('#q9-true').show()}
                        if ($('input[class="q10 apply"]:checked')){$('#q10-true').show()}
                        if ($('#q11-yes').prop('checked')){$('#q11-true').show();$('#register-institution').show()}
                        if ($('#q14-yes').prop('checked')){$('#q14-true').show()}
                        $('#revenue_text').append(revenue);
                        if (revenue > 1000000) { $('#fee').append("$5,000");} else if (1000000 >= revenue > 500000){$('#fee').append("$3,000");
                        }else if (500000 >=revenue > 250000){$('#fee').append("$2,000");} else if (250000 >= revenue > 50000){$('#fee').append("$1,000");
                        } else if (revenue < 50000){$('#fee').append("$500");}
                        if ($('input[class="calculus1"]:checked')){
                            $('#calculus').append(1000+ ($("#agents").val() * 200));
                    } else if ($('input[class="calculus2"]:checked')) {
                        var license_fee = 0
                        var bond_fee =0
                        if ($('#q1-non-degree').prop('checked')){license_fee=1000} else if ($('#q1-degree').prop('checked')){license_fee=4000}
                        if ((.20 * revenue) < 5000){bond_fee=5000} else {bond_fee = (.20 * revenue)}
                        $('#calculus').append(license_fee+bond_fee+250)
                }
                        generatereport("report-apply")
                    }
                }

                //if (options[])
                // var point = $.map($('input[name="question"]'), function(value, index) {
                //     return value.checked ? 1 : 0;
                // });
                // $('.report-category-heading').hide();
                // $('#report').hide();
                // $('.relevant-case-study-list').empty();
                // for (var key in options) {
                //     if (options[key]) {
                //         $('.' + key).show();
                //         $('.' + key.substring(0, 2)).show();
                //     } else {
                //         $('.' + key).hide();
                //     }
                // }
              //   var points = [];
              //   for (var o in items) {
              //       points.push(items[o].scores);
              //   }
              //   var tree = createKDTree(points);
              //   var candidates = tree.knn(point, 5);
              //   console.log(candidates);
              //   var new_case_study = _.template(case_study_template);
              //   for (var i in candidates) {
              //       if (items[candidates[i]]['title'] != 'EMPTY EXAMPLE') {
              //           var data = {
              //               "url": items[candidates[i]]['url'].replace(".", "-"),
              //               "title": items[candidates[i]]['title']
              //           }
              //           console.log(data);
              //           $(".relevant-case-study-list").append(new_case_study(data));
              //       }
              //   }
                $('#report').show();
             //   $('#relevant-case-studies').show();
                $('#academy-info').show();
              //  gridContainer.cubeportfolio('destroy');
              //  gridContainer.cubeportfolio(options_portfolio);
                //Scroll to report part of page
                $('html, body').animate({
                    scrollTop: $("#report").offset().top - 40
                }, 1000);
            } else {
                $('.error-message').text("Please select at least one option.").show().delay(5000).fadeOut();
            }
        }
   
    }


    //-------------------Accordion Change Chevron--------
    $('.accordion-heading').on('click', 'p', function() {
        var icon = $(this).find('.fa');
        if (icon.attr('class') == 'fa fa-chevron-circle-right') {
            icon.attr('class', 'fa fa-chevron-circle-down');
        } else if (icon.attr('class') == 'fa fa-chevron-circle-down') {
            icon.attr('class', 'fa fa-chevron-circle-right');
        }
    });

    //OWLCAROUSEL TEAM
    $("#team-slider").owlCarousel({
        slideSpeed: 300,
        paginationSpeed: 400,
        autoPlay: true,
        singleItem: false,
        items: 3,
        itemsDesktop: [1200, 3],
        itemsDesktopSmall: [980, 3],
        itemsTablet: [768, 2],
        itemsMobile: [479, 1],
        pagination: true,
        navigation: true, // Show next and prev buttons
        navigationText: ['<i class="pe-7s-angle-left-circle pe-3x"></i>', '<i class="pe-7s-angle-right-circle pe-3x"></i>'],
    });


    //PARALLAX BACKGROUND
    $(window).stellar({
        horizontalScrolling: false,
    });


    //PRELOADER
    $('#preload').delay(350).fadeOut('slow'); // will fade out the white DIV that covers the website.


    //HEADER ANIMATION
    $(window).scroll(function() {
        if ($(".navbar").offset().top > 50) {
            $(".navbar-fixed-top").addClass("top-nav-collapse");
        } else {
            $(".navbar-fixed-top").removeClass("top-nav-collapse");
        }
    });

});

// CONTACT FORM FUNCTION
var contact_send = function() {

    'use strict';

    var name = $("#name").val();
    var email = $("#email").val();
    var message = $("#message").val();

    if (name == "") {
        alert("Your name is empty!");
        $("#name").focus();
    } else if (email == "") {
        alert("Your email address is empty!");
        $("#email").focus();
    } else if (message == "") {
        alert("Your message is empty!");
        $("#message").focus();
    } else {
        $.post("contact.send.php", {
            name: name,
            email: email,
            message: message
        }, function(result) {
            if (result == "SUCCESS") {
                alert("Your contact form is sent.");
                setTimeout(function() {
                    $("#name").val("");
                    $("#email").val("");
                    $("#message").val("");
                }, 3000);
            } else {
                alert("Your contact form isn't sent. Please check fields and try again.");
            }
        });
    }

};
