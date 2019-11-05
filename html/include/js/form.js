/*************************************************
 *         Plasma Robotics  Scouting App         *
 *              Form Render Scripts              *
 ************************************************/

 // Select2

 $('.form-select').each(function () {
    $(this).select2({
        containerCssClass: 'form-select2-container',
        dropdownCssClass: 'form-select2-dropdown'
    });
 });