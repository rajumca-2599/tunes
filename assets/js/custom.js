//Fixed Bottom Hegiht
var fx_btm = $('.fixed_footer').outerHeight();
var fx_head = $('.fixed_header').outerHeight();
$('.body_wrapper').css('padding-bottom', fx_btm + 15);
$('.body_wrapper').css('padding-top', fx_head + 15);


//Fixed Top & Bottom Height
var fx_btm = $('.fixed_footer').outerHeight();
var fx_head = $('.header').outerHeight();
var fx_menu = $('.footer_menu').outerHeight();
$('.app_main_wrapper').css('padding-bottom', fx_btm);
$('.app_main_wrapper').css('padding-top', fx_head);
$('.app_main_wrapper').css('padding-bottom', fx_menu);

// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);

// We listen to the resize event
window.addEventListener('resize', () => {
    // We execute the same script as before
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});


//Input Number Max Length
$(document).ready(function() {
  $('input[type=number][max]:not([max=""])').on('input', function(ev) {
      var $this = $(this);
      var maxlength = $this.attr('max').length;
      var value = $this.val();
      if (value && value.length >= maxlength) {
          $this.val(value.substr(0, maxlength));
      }
  });
});

//Add BG to header when page scoll down
$(window).scroll(function() {
  if ($(this).scrollTop() > 20) {
      $(".header").addClass("open");
  } else {
      $(".header").removeClass("open");
  }
});

//Cards swiper
var swiper = new Swiper(".auto_swiper_1", {
    slidesPerView: 'auto',
    spaceBetween: 12,
});
var swiper = new Swiper(".rect_card_swiper_1", {
    slidesPerView: 'auto',
    spaceBetween: 12,
});
// Add class if only one slide
if ($('.rect_card_swiper_1 .swiper-slide').length == 1) {
    $('.rect_card_swiper_1').addClass('one_child');
}
var swiper = new Swiper(".promo_card_swiper_1", {
    slidesPerView: 1.1,
    spaceBetween: 12,
    // centeredSlides: true,
});
if ($('.promo_card_swiper_1 .swiper-slide').length == 1) {
    $('.promo_card_swiper_1').addClass('one_child');
}

var swiper = new Swiper(".dashboard_swiper", {
    slidesPerView: 1,
    spaceBetween: 20,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
});

//Column Swiper
var swiper = new Swiper(".column_swiper_1", {
    slidesPerView: 2.1,
    //grid: {
        //rows: 3,
    //},
    slidesPerColumnFill: "row",
    // slidesPerGroup: 3,
    // slidesPerColumnFill: 'rows',
    // direction: 'horizontal',
    spaceBetween: 12,
});
//Column Swiper
var swiper = new Swiper(".column_swiper_3", {
    slidesPerView: 2.3,
    //grid: {
        //rows: 3,
    //},
    //slidesPerColumnFill: "row",
    // slidesPerGroup: 3,
    // slidesPerColumnFill: 'rows',
    // direction: 'horizontal',
    spaceBetween: 10,
});

//Alerts has Single child

$(document).ready(function() {
    if ( $('.app_alerts_list').children().length <= 1 ) {
        $(".app_alerts_list").addClass("one_child");
    } else{
        $(".app_alerts_list").removeClass("one_child");
    }
});

//Alerts Card remove
$('.alert_close').on("click", function() {
    $(this).parent().remove();
});
if ( $('.app_alerts_list').children().length <= 0 ) {
    $(".app_alerts_wrap").addClass("no_alerts");
}


//Usage expand
$('#usage_more_btn').on("click", function() {
    $(this).toggleClass('open');
    $('.usage_list').toggleClass('expand');
});

//FAQ Accordion
$('.accordion_item .collapse').on('shown.bs.collapse', function(e) {
    var $card = $(this).closest('.accordion_item');
    $('html,body').animate({
      scrollTop: $card.offset().top - 100
    }, 500);
});


//Fillter js st
$( function() {
$('#price-range').slider({
range: true,
min: 0,
max: 9000,
values: [0, 9000],
slide: function(event, ui) {
    $('#price-min').val(ui.values[0]);
    $('#price-max').val(ui.values[1]);
}
});
});

$('#price-min').change(function(event) {
var minValue = $('#price-min').val();
var maxValue = $('#price-max').val();
if ( minValue <= maxValue) {
$('#price-range').slider("values", 0, minValue);
} else {
$('#price-range').slider("values", 0, maxValue);
$('#price-min').val(maxValue);
}
}); 
// This isn't very DRY but it's just for demo purpose... oh well.
$('#price-max').change(function(event) {
var minValue = $('#price-min').val();
var maxValue = $('#price-max').val();
if ( maxValue >= minValue) {
$('#price-range').slider("values", 1, maxValue);
} else {
$('#price-range').slider("values", 1, minValue);
$('#price-max').val(minValue);
}
});
//filter js end

//tab swiper st 
var swiper = new Swiper('.personal-blog-carousal', {
    slidesPerView: 1,
    spaceBetween: 10,
    centeredSlides: true,
    loop: true,
    observer: true,
    observeParents: true,
    loopFillGroupWithBlank: true,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        991.98: {
            slidesPerView: 2.8,
            spaceBetween: 30,
        },

        575.98: {
            slidesPerView: 1.2,
            spaceBetween: 0,
            centeredSlides: true,

        },
    }

});


var galleryThumbs = new Swiper('.tabs-thumbs', {
    spaceBetween: 0,
    slidesPerView: 3,
    freeMode: true,
    watchSlidesVisibility: true,
    watchSlidesProgress: true,
    observer: true,
    observeParents: true,
    breakpoints: {

        1024: {
            slidesPerView: 3,
            spaceBetween: 0,

        },
    }

});
var galleryTop = new Swiper('.tabs-top-swiper', {
    spaceBetween: 10,
    observer: true,
    observeParents: true,
    navigation: {
        nextEl: '.swipertabs-button-next',
        prevEl: '.swipertabs-button-prev',
    },
    thumbs: {
        swiper: galleryThumbs
    },
});

$(document).ready(function () {
    $('.shaded-left:has(.swiper-button-disabled)').addClass("disabledarrow");
    $('.shaded-right :has(.swiper-button-disabled)').addClass("disabledarrow");
});

$('#swipertabs-button-next ').click(function () {

    if ($('.swipertabs-button-next').hasClass('swiper-button-disabled')) {
        $('.shaded-right').addClass('disabledarrow');  /* missing . before removeClass */
        // alert('hello');
    }
    else (
        $('.shaded-right').removeClass('disabledarrow')  /* missing . before removeClass */

    )
    if ($('.swipertabs-button-prev').hasClass('swiper-button-disabled')) {
        $('.shaded-left').addClass('disabledarrow');  /* missing . before removeClass */
        // alert('hello');
    }
    else (
        $('.shaded-left').removeClass('disabledarrow')  /* missing . before removeClass */
    )
});

$('#swipertabs-button-prev ').click(function () {

    if ($('.swipertabs-button-prev').hasClass('swiper-button-disabled')) {
        $('.shaded-left').addClass('disabledarrow');  /* missing . before removeClass */
        // alert('hello');    transform: translate3d(0, 0px, 0px);
        $('.swiper-wrapper').css("transform", "translate3d(0, 0px, 0px)")

    }
    else (
        $('.shaded-left').removeClass('disabledarrow')  /* missing . before removeClass */
    )
    if ($('.swipertabs-button-next').hasClass('swiper-button-disabled')) {
        $('.shaded-right').addClass('disabledarrow');  /* missing . before removeClass */
        // alert('hello');
    }
    else (
        $('.shaded-right').removeClass('disabledarrow')  /* missing . before removeClass */

    )
});

//tab swiper end

$(document).ready(function(){
    $(".usage_box_slider").each(function(){
      
      var $bar = $(this).find(".semicircleBar");
      var $val = $(this).find(".semicircleBar_value");
      var perc = parseInt( $val.text(), 10);
    
      $({p:0}).animate({p:perc}, {
        duration: 1500,
        easing: "swing",
        step: function(p) {
          $bar.css({
            transform: "rotate("+ (45+(p*1.8)) +"deg)", // 100%=180° so: ° = % * 1.8
            // 45 is to add the needed rotation to have the green borders at the bottom
          });
          $val.text(p|0);
        }
      });
    }); 
});

//profile pic upload js st
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $('#imagePreview').css('background-image', 'url('+e.target.result +')');
            $('#imagePreview').hide();
            $('#imagePreview').fadeIn(650);
        }
        reader.readAsDataURL(input.files[0]);
    }
}
$("#imageUpload").change(function() {
    readURL(this);
});
//profile pic upload js end