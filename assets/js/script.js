// Initialize AOS (guarded)
if (window.AOS && typeof AOS.init === 'function') {
    AOS.init({
        duration: 1000,
        once: true
    });
}

// Page navigation - FIXED VERSION
function showPage(pageId, linkElement, evt) {
    // Prevent default behavior if event was passed
    if (evt && typeof evt.preventDefault === 'function') {
        evt.preventDefault();
    }

    // Hide all sections
    $('section').removeClass('active');

    // Show selected section
    $('#' + pageId).addClass('active');

    // Update active nav link
    $('nav a').removeClass('active');
    if (linkElement) {
        $(linkElement).addClass('active');
    } else {
        // If no linkElement provided, find and activate the correct nav link
        $('nav a[href="#' + pageId + '"]').addClass('active');
    }

    // Scroll to top smoothly
    $('html, body').animate({scrollTop: 0}, 500);

    // Reinitialize AOS for the new section (guarded)
    setTimeout(function() {
        if (window.AOS && typeof AOS.refresh === 'function') {
            AOS.refresh();
        }
    }, 100);

    console.log('Showing page:', pageId); // Debug log
}

// Scroll to section
function scrollToSection(sectionId) {
    // Find the nav link for this section
    var navLink = $('nav a[href="#' + sectionId + '"]');
    showPage(sectionId, navLink[0]);
}

// Slideshow and other DOM-ready logic
$(document).ready(function() {
    // Initialize each slideshow container separately so multiple carousels won't conflict
    $('.slideshow').each(function() {
        const $slideshow = $(this);
        const $slides = $slideshow.find('.slide');
        const $dotsContainer = $slideshow.find('.dots');
        let current = 0;
        let intervalId;

        // create dots scoped to this slideshow
        $dotsContainer.empty();
        $slides.each(function(i) {
            $dotsContainer.append('<button class="dot" aria-label="Slide ' + (i+1) + '" data-slide="' + i + '"></button>');
        });

        const $dots = $dotsContainer.find('.dot');

        function showLocalSlide(i) {
            if ($slides.length === 0) return;
            if (i < 0) i = 0;
            if (i >= $slides.length) i = 0;
            $slides.removeClass('active');
            $dots.removeClass('active');
            $($slides[i]).addClass('active');
            $($dots[i]).addClass('active');
            current = i;
        }

        // initial
        showLocalSlide(0);

        // dot click
        $dots.on('click', function() {
            const idx = $(this).data('slide');
            showLocalSlide(idx);
            // restart timer
            clearInterval(intervalId);
            intervalId = setInterval(next, 5000);
        });

        function next() {
            current = (current + 1) % $slides.length;
            showLocalSlide(current);
        }

        intervalId = setInterval(next, 5000);

        // pause on hover
        $slideshow.hover(function() {
            clearInterval(intervalId);
        }, function() {
            intervalId = setInterval(next, 5000);
        });
    });



    // Form submission handlers
    $('#admissionForm').on('submit', function(e) {
        e.preventDefault();

        // Get form values
        const name = $('#name').val();
        const email = $('#email').val();
        const phone = $('#phone').val();
        const course = $('#course').val();
        const message = $('#message').val();

        // Simple validation
        if (name && email && phone && course) {
            // Show success message
            $('#formMessage').html('<div class="alert alert-success">Thank you for your application! We will contact you soon.</div>');
            $('#formMessage').show();

            // Reset form
            this.reset();

            // Hide message after 5 seconds
            setTimeout(function() {
                $('#formMessage').fadeOut();
            }, 5000);
        } else {
            // Show error message
            $('#formMessage').html('<div class="alert alert-danger">Please fill in all required fields.</div>');
            $('#formMessage').show();
        }
    });

    // Contact form submission
    $('#contactForm').on('submit', function(e) {
        e.preventDefault();

        // Get form values
        const name = $('#contactName').val();
        const email = $('#contactEmail').val();
        const phone = $('#contactPhone').val();
        const role = $('#contactRole').val();
        const subject = $('#contactSubject').val();
        const message = $('#contactMessage').val();

        // Simple validation
        if (name && email && role && subject && message) {
            // Show success message
            $('#contactFormMessage').html('<div class="alert alert-success">Thank you for contacting us! We will get back to you soon.</div>');
            $('#contactFormMessage').show();

            // Reset form
            this.reset();

            // Hide message after 5 seconds
            setTimeout(function() {
                $('#contactFormMessage').fadeOut();
            }, 5000);
        } else {
            // Show error message
            $('#contactFormMessage').html('<div class="alert alert-danger">Please fill in all required fields.</div>');
            $('#contactFormMessage').show();
        }
    });

    // Notice board auto-scroll (optional)
    var noticeScroll = setInterval(function() {
        var noticeBoard = $('.notice-board');
        if (noticeBoard.length > 0) {
            noticeBoard.scrollTop(noticeBoard.scrollTop() + 1);

            if (noticeBoard.scrollTop() >= noticeBoard[0].scrollHeight - noticeBoard.height()) {
                noticeBoard.scrollTop(0);
            }
        }
    }, 50);

    // Pause auto-scroll on hover
    $('.notice-board').hover(
        function() {
            clearInterval(noticeScroll);
        },
        function() {
            noticeScroll = setInterval(function() {
                var noticeBoard = $('.notice-board');
                if (noticeBoard.length > 0) {
                    noticeBoard.scrollTop(noticeBoard.scrollTop() + 1);

                    if (noticeBoard.scrollTop() >= noticeBoard[0].scrollHeight - noticeBoard.height()) {
                        noticeBoard.scrollTop(0);
                    }
                }
            }, 50);
        }
    );

    // Add hover effect to cards
    $('.card, .course, .stat, .highlight, .activity-category, .event-card, .info-card').hover(
        function() {
            $(this).addClass('shadow-lg');
        },
        function() {
            $(this).removeClass('shadow-lg');
        }
    );

    // Dynamic year in footer
    var currentYear = new Date().getFullYear();
    $('.footer-bottom p').html('&copy; ' + currentYear + ' Warrior Institute of Technology | All Rights Reserved');

    // Handle navigation links with hash properly
    $('nav a').on('click', function(e) {
        e.preventDefault();
        var href = $(this).attr('href');
        if (href && href.startsWith('#')) {
            var pageId = href.substring(1);
            showPage(pageId, this, e);
        }
    });

    // Add typing effect to hero title
    var text = "Welcome to WIT";
    var index = 0;
    var typingSpeed = 100;

    function typeWriter() {
        if (index < text.length) {
            $(".hero-content h2").text(text.substring(0, index + 1));
            index++;
            setTimeout(typeWriter, typingSpeed);
        }
    }

    // Start typing effect when page loads
    setTimeout(typeWriter, 500);
});