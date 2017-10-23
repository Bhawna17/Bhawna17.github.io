jQuery(function ($) {
   //calling flicker API to get images.
    $.getJSON('http://api.flickr.com/services/feeds/photos_public.gne?tags='
      + "Flower" + "&tagmode=any&format=json&jsoncallback=?",
      function (data) {
         //dynamically creating the list of image elements after fetching from flickr api
          $.each(data.items, function (i, item) {
              $('<li></li>').addClass("image").append($("<img/>").attr("src", item.media.m)).appendTo($(".carousel"));
          });

          var $carousel = $('.carousel');
          var $indicator = $('.carousel-indicators');
          var $currentImage = "li";
          var $fadeIn_fadeOut_time = 1000;//milliseconds
          var $slideshow_interval = 3000;//milliseconds
          var $next = $('.next');
          var $prev = $('.prev');

          // Returns first five images
          function getImages() {
              return $carousel.find($currentImage + ".image").slice(0, 5);
          }

          function getIndicators() {
              return $indicator.find($currentImage);
          }

          getImages().fadeOut();

         //By default first image and indicator is selected
          getImages().first().addClass('active');
          getImages().first().fadeIn($fadeIn_fadeOut_time);
          getIndicators().first().addClass('active');
          var $prevButton = $('.prev');
          var $nextButton = $('.next');
          //next and previous buttons are visible only on hover
          $carousel.hover(function () {
              $prevButton.fadeIn();
              $nextButton.fadeIn();
          }, function () {
              $prevButton.fadeOut();
              $nextButton.fadeOut();
          });

         //slideShow 
          $interval = setInterval(
           slideShow
            , $fadeIn_fadeOut_time + $slideshow_interval
          );

          function slideShow() {
              var $i = $carousel.find($currentImage + '.active').index();
              //navigate away from current image
              getImages().eq($i).removeClass('active');
              getImages().eq($i).fadeOut($fadeIn_fadeOut_time);
              getIndicators().eq($i).removeClass('active');
              //if the last image is selected, reset the counter to first image
              if (getImages().length == $i + 1) $i = -1;
             //select the next image
              getImages().eq($i + 1).fadeIn($fadeIn_fadeOut_time, function () {
                  getImages().eq($i + 1).addClass('active');
                  getIndicators().eq($i + 1).addClass('active');
              });

          }
          function goToNextSlide() {
              clearInterval($interval);
              var $currentSlide = $carousel.find($currentImage + '.active').index();
              getIndicators().eq($currentSlide).removeClass('active');
              getImages().eq($currentSlide).fadeOut();
              //if the last image is selected, reset the counter to first image
              if ($currentSlide == getImages().length - 1) {
                  $currentSlide = -1;
              }
              getImages().eq($currentSlide + 1).fadeIn();
              getIndicators().eq($currentSlide + 1).addClass('active');
              $currentSlide += 1;
              $interval = setInterval(slideShow, $fadeIn_fadeOut_time + $slideshow_interval);
          }

          function goToPrevSlide() {
              clearInterval($interval);
              var $currentSlide = $carousel.find($currentImage + '.active').index();
              getImages().eq($currentSlide).fadeOut();
              getImages().eq($currentSlide - 1).fadeIn();
              getIndicators().eq($currentSlide).removeClass('active');
              getIndicators().eq($currentSlide - 1).addClass('active');
              $currentSlide -= 1;
              $interval = setInterval(slideShow, $fadeIn_fadeOut_time + $slideshow_interval);
          }
          $next.on('click', goToNextSlide);
          $prev.on('click', goToPrevSlide);

      });
});