/* eslint no-undef: 0 */

if (window.location.protocol === "http:") window.location.protocol = "https:";

let scrolled = 0,
  r = 0,
  spin = true;

$(() => {
  setInterval(() => {
    if (spin)
      $("#globe").css({
        filter: `invert(${Math.max(scrolled / 1.75 - 10, 0)}%)`,
        // transform: `rotate(${scrolled / 4 + (r += 25 / (scrolled + 1))}deg)`
      });
    else
      $("#globe img").css({
        background: "#ff0000",
        filter: "hue-rotate(90deg)"
      });
  });

  $("#snap").click(function() {
    $(this).attr("disabled", true);
    html2canvas($("#globe")[0]).then(canvas => {
      let ctx = canvas.getContext("2d");
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixelArr = imageData.data;
      createBlankImageData(imageData);
      for (let i = 0; i < pixelArr.length; i += 4) {
        let p = Math.floor((i / pixelArr.length) * canvasCount);
        let a = imageDataArray[weightedRandomDistrib(p)];
        a[i] = pixelArr[i];
        a[i + 1] = pixelArr[i + 1];
        a[i + 2] = pixelArr[i + 2];
        a[i + 3] = pixelArr[i + 3];
      }
      for (let i = 0; i < canvasCount; i++) {
        let c = newCanvasFromImageData(
          imageDataArray[i],
          canvas.width,
          canvas.height
        );
        c.classList.add("dust");
        $("body").append(c);
      }
      $("#globe")
        .children()
        .not(".dust")
        .fadeOut(3500);
      $(".dust").each(function(index) {
        animateBlur($(this), 0.8, 800);
        setTimeout(() => {
          animateTransform(
            $(this),
            100,
            -100,
            chance.integer({ min: -15, max: 15 }),
            800 + 110 * index
          );
        }, 70 * index);
        $(this)
          .delay(70 * index)
          .fadeOut(110 * index + 800, "easeInQuint", () => {
            $(this).remove();
          });
      });
    });
  });

  particlesJS.load("globe", "/assets/particles.json", () => {
    console.log("callback - particles.js config loaded");
  });

  // $("a").on("click", function(e) {
  //   if (this.hash !== "") {
  //     $(".sr-only").remove();
  //     $("a")
  //       .parent()
  //       .removeClass("active");
  //     $(this)
  //       .parent()
  //       .addClass("active");
  //     $(this).append(`<span class="sr-only">(current)</span>`);
  //   }
  // });

  //   let titles = ["Answer", "Hero", "Cure", "Solution", "Friend"];
  //   let i = -1;
  //   let target = $("#textSwapper");
  //   //while ( i  >= titles.length ) {
  //   setInterval(titleSwap, 3000);
  //   //}
  //   function titleSwap() {
  //     //alert ("mH bams");
  //     i++;
  //     target.fadeOut(1000, function() {
  //       target.html(titles[i]);
  //       target.fadeIn(2000);
  //     });

  //     if (i >= titles.length) {
  //       i = 0;
  //     }
  //   }

  //   const dataExtra = $("[data-abbr], [data-def], [data-context]");

  //   dataExtra.mouseenter(function() {
  //     let thisAttr =
  //       ($(this).attr("data-abbr") ? $(this).attr("data-abbr") + " " : "") +
  //       ($(this).attr("data-def") ? $(this).attr("data-def") + " " : "") +
  //       ($(this).attr("data-context") ? $(this).attr("data-context") + " " : "");
  //     $(this).append("<span class = 'toolTip'>" + thisAttr + "</strong>");

  //     dataExtra.mouseleave(function() {
  //       $(".toolTip").hide();
  //     });

  //     if (typeof thisAttr === "undefined" || thisAttr === null) {
  //       $(this).append(
  //         "<span class = 'toolTip'> Error: No information available, sorry! </span>"
  //       );
  //     }
  //   });

  //   let hash = $(window.location.hash)[0];
  //   if (hash) hash.scrollIntoView();
  // });

  // let deferredPrompt = null;

  // let install = function() {
  //   if (deferredPrompt) {
  //     try {
  //       deferredPrompt.prompt();
  //     } catch (err) {}
  //     deferredPrompt.userChoice.then(function(choiceResult) {
  //       if (choiceResult.outcome === "accepted")
  //         console.info("PWA has been installed");
  //       else console.info("User chose not to install PWA");

  //       deferredPrompt = null;
  //     });
  //   }
  // };

  // window.addEventListener("beforeinstallprompt", function(e) {
  //   // Prevent Chrome 67 and earlier from automatically showing the prompt
  //   e.preventDefault();
  //   deferredPrompt = e;
  // });

  // // Check compatibility for the browser we're running this in
  // if ("serviceWorker" in navigator&&0) {
  //   window.addEventListener("load", () => {
  //     if (navigator.serviceWorker.controller)
  //       console.info(
  //         "[PWA Builder] active service worker found, no need to register"
  //       );
  //     else {
  //       // Register the service worker
  //       navigator.serviceWorker
  //         .register("sw.js", {
  //           scope: "../"
  //         })
  //         .then(reg => {
  //           console.info(
  //             "[PWA Builder] Service worker has been registered for scope: " +
  //               reg.scope
  //           );

  //           reg.onupdatefound = () => {
  //             let installingWorker = reg.installing;
  //             installingWorker.onstatechange = () => {
  //               switch (installingWorker.state) {
  //                 case "installed":
  //                   if (navigator.serviceWorker.controller);
  //                   break;
  //               }
  //             };
  //           };
  //         })
  //         .catch(err => console.error("[SW ERROR]", err));
  //     }
});
