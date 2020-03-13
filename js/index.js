var expandingAnimationTiming = 500;
var collapsingAnimationTiming = 200;

/* Extends jQuery animate easing */
$.easing = Object.assign({}, $.easing, {
    easeOutBack: function (x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    }
});

/* Function to expand cards */
function expandElement(elementToExpand) {
    // Adds class 'open' to help with styling
    elementToExpand.parents(".card").addClass("open");

    // Prevents 'body' scroll
    $("body").addClass("lock");

    // freeze the current scroll position of the background page expand-wrapper
    var elementOffset = $(".list-wrapper").offset();
    var elementScrollTop = $("body").scrollTop();
    var netOffset = elementOffset.top - elementScrollTop;
    var expandPosition = $(".list-wrapper").offset();
    var expandTop = expandPosition.top;
    var expandLeft = expandPosition.left;
    var expandWidth = $(".list-wrapper").outerWidth();
    var expandHeight = $(".list-wrapper").outerHeight();
    console.log(elementOffset);
    console.log(elementScrollTop);
    console.log(netOffset);
    console.log(expandPosition);
    console.log(expandTop);
    console.log(expandLeft);
    console.log(expandWidth);
    console.log(expandHeight);
    $(".list-wrapper").css({
        top: netOffset,
        position: "fixed",
        overflow: "hidden",
        "z-index": "11"
    });

    // convert the expand-item to fixed position without moving it
    elementToExpand.css({
        top: elementToExpand.offset().top - $("body").scrollTop(),
        left: elementToExpand.offset().left,
        height: elementToExpand.height(),
        width: elementToExpand.width(),
        "max-width": expandWidth,
        position: "fixed"
    });

    // Changes height of banner 设置新banner图的高度
    var expandedHeight = elementToExpand.find(".banner").data("height-expanded");
    elementToExpand.find(".banner").animate({
            height: expandedHeight
        },
        expandingAnimationTiming,
        "easeOutBack"
    );

    // Changes position of content 设置文本内容的 top，为主图高度-5% 。原本就是绝对定位
    var expandedPosition = elementToExpand
        .find(".inner-content")
        .data("position-expanded");
    elementToExpand.find(".inner-content").animate({
            top: expandedPosition
        },
        expandingAnimationTiming,
        "easeOutBack"
    );

    // start expand-item animation to the expand wrapper
    // expand the element with class .about-tile-bg-image
    // 设置卡片的移动动画 
    elementToExpand.animate({
            left: expandLeft,
            top: expandTop,
            height: expandHeight,
            width: expandWidth,
            "max-width": expandWidth
        },
        expandingAnimationTiming, // animation timing in millisecs
        "easeOutBack", //animation easing
        function () {
            elementToExpand.css({
                right: 0,
                bottom: 0,
                width: "100%",
                height: "100%"
            });

            elementToExpand.find(".banner-holder").css({
                position: "fixed"
            });
        }
    );
}

/* Function to collapse cards */
function collapseElement(collapseButton) {
    // find the element to collapse
    var elementToCollpseParent = collapseButton.parents(".card");
    var elementToCollpse = elementToCollpseParent.find(".card-content");

    // find the location of the placeholder
    var elementToCollpsePlaceholder = elementToCollpse.parents(".card");
    var elementToCollpsePlaceholderTop =
        elementToCollpsePlaceholder.offset().top - $("body").scrollTop();
    var elementToCollpsePlaceholderLeft = elementToCollpsePlaceholder.offset()
        .left;
    var elementToCollpsePlaceholderHeight = elementToCollpsePlaceholder.outerHeight();
    var elementToCollpsePlaceholderWidth = elementToCollpsePlaceholder.outerWidth();

    elementToCollpse.find(".banner-holder").css({
        position: "absolute"
    });

    // convert the width and height to numeric values
    elementToCollpse.css({
        right: "auto",
        bottom: "auto",
        width: elementToCollpse.outerWidth(),
        height: elementToCollpse.outerHeight()
    });

    $(".list-wrapper").css({
        top: 0,
        position: "absolute",
        overflow: "auto",
        "z-index": "1"
    });

    // Changes height of banner
    var collapsedHeight = elementToCollpse.find(".banner").data("height");
    elementToCollpse.find(".banner").animate({
            height: collapsedHeight
        },
        collapsingAnimationTiming,
        "linear"
    );

    // Changes position of content
    var collapsedPosition = elementToCollpse
        .find(".inner-content")
        .data("position");
    elementToCollpse.find(".inner-content").animate({
            top: collapsedPosition
        },
        collapsingAnimationTiming,
        "linear"
    );

    elementToCollpse.animate({
            left: elementToCollpsePlaceholderLeft,
            top: elementToCollpsePlaceholderTop,
            height: elementToCollpsePlaceholderHeight,
            width: elementToCollpsePlaceholderWidth
        },
        collapsingAnimationTiming, // animation timing in millisecs
        "linear", //animation easing
        function () {
            // Removes class 'open'
            elementToCollpseParent.removeClass("open");

            elementToCollpse.css({
                position: "relative",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%"
            });
        }
    );

    // Stops preventing 'body' scroll
    $("body").removeClass("lock");
}

function setCardHeight() {
    $(".card ").each(function (index, element) {
        var slideHeight = $(element)
            .find(".banner-holder")
            .outerHeight();
        var containerHeight = $(element)
            .find(".inner-content")
            .outerHeight();
        var contentHeight = slideHeight + containerHeight;

        $(element).css({
            height: contentHeight
        });
    });
}

function attachListeners() {
    $(document)
        .on("click", ".card-content", function () {
            if (
                $(this)
                .parents(".card")
                .hasClass("open")
            ) {
                return;
            }
            // console.log(this);
            
            expandElement($(this));
        })
        .on("click", ".card .close-btn", function (event) {
            event.stopPropagation();
            collapseElement($(this));
        })
        .on('touchstart', '.card', function () {
            $(this).addClass('hover');
        })
        .on('touchend touchmove touchcancel', '.card', function () {
            $(this).removeClass('hover');
        });
}

function initialiseCards() {
    attachListeners();
    setCardHeight();
}

$(document).ready(function () {
    initialiseCards();
});
