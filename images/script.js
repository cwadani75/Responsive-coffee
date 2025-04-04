// Toggle Mobile Menu
document.addEventListener("DOMContentLoaded", function () {
    const menuOpenButton = document.getElementById("menu-open-button");
    const menuCloseButton = document.getElementById("menu-close-button");

    menuOpenButton.addEventListener("click", function () {
        document.body.classList.add("show-mobile-menu");
    });

    menuCloseButton.addEventListener("click", function () {
        document.body.classList.remove("show-mobile-menu");
    });
});
const swiper = new Swiper('.slider-wrapper', {
    // Optional parameters
    direction: 'vertical',
    loop: true,
    grabCursor: true,
    spaceBetween: 25,
  
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true,
    },
  
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  
    // Responsive breakpoints
 breakpoints:{
  0:{
    slidesPerview: 1
  },
  768:{
    slidesPerview: 2
  },
  1024:{
    slidesPerview: 3
  }
 }
  });
  