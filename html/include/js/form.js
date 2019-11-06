/*************************************************
 *         Plasma Robotics  Scouting App         *
 *              Form Render Scripts              *
 ************************************************/

 // Select2

$('.form-select').each(function() {
    // Upgrade Select Elements to Stylable Select2 Objects
    $(this).select2({
        containerCssClass: 'form-select2-selection',
        dropdownCssClass: 'form-select2-dropdown'
    });
});

$('.form-select2-selection').each(function() {
    // Add Proper CSS Classes to Select2 Objects
    $(this).closest('.select2-container').addClass('form-select2-container').removeAttr('style');
});