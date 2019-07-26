$(function() {

    //Wait for Pinegrow to wake-up
    $('body').one('pinegrow-ready', function(e, pinegrow) {

        ////////
        // CONFIGURATION
        ////////

        //Create the list of selectors that will be editable
        //First, we add #replace elements that will also be visible during the editing
        var replace_selectors = '#replace1, #replace2, #replace3, #replace4, #replace5, #replace6, #replace7, #replace8, #replace9, #replace10, #replace11, #replace12, #replace13, #replace14, #replace15, #replace16, #replace17, #replace18, #replace19, #replace20, #replace21, #replace22, #replace23, #replace24, #replace25, #replace26, #replace27, #replace28, #replace29, #replace30, .print';

        //Then we add <p> and <ul> to the list of editable elements
        //Add any additional editable elements here
        var selectors = `${replace_selectors}, p, ul`;

        //Next we define elements that should be protected, even if they are in editable areas. For example, <select> elements
        var protect = 'select';

        //Note, only elements within the #content section are editable
        var editable_section = '#content';

        ////////
        // END OF CONFIGURATION - No need to change anything below
        ////////////////////////////////////


        var version = 5.5;

        if(parseFloat(crsaGetVersion()) < version) {
            pinegrow.showAlert(`LSHTM plugin requires Pinegrow Web Editor ${version} or higher.`, 'Please update Pinegrow Web Editor');
            return;
        }



        //Create new Pinegrow framework object
        var f = new PgFramework('lshtm', 'LSHTM Plugin');

        f.description = 'LSHTM plugin.';

        //Enable this plugin by default
        f.default = true;
        //Can't be disabled
        f.show_in_manager = false;
        f.has_actions = true;

        var editable_action = new PgComponentType('lshtm.editable', 'Editable area');
        editable_action.selector = function(pgel) {
            if(!pgel.closest(editable_section)) return false;
            return pgel.isSelector(selectors);
        }
        editable_action.attribute = 'data-not-used';
        editable_action.action = true;
        editable_action.not_main_type = true;
        editable_action.get_action_tag = function(pgel, def) {
            return '<i class="icon icon-Editable"></i> Editable';
        }
        f.addComponentType(editable_action);

        f.on_cms_get_dynamic_field = function(page, pgel, ret_obj) {

            var p = null;

            if(!pgel.closest(editable_section)) return;

            if(pgel.closest(protect)) return;

            if(ret_obj.closest) {
                p = pgel.closest(selectors);
            } else if(pgel.isSelector(selectors)) {
                p = pgel;
            }
      
            if(p) {
                ret_obj.pgel = p;
                ret_obj.info = {
                    name: 'Editable',
                    content: true,
                    attrs: [],
                    classes: []
                };
            }
        }

        f.on_cms_get_selectors_for_dynamic_fields = function(page, list) {
            //list.push(selectors);
        }

        f.on_inline_edit_started = function(page, pgel, $edit_el) {
            $edit_el.find(protect).attr('contenteditable', 'false');
        }

        f.on_set_inline_style = function(page, o) {
            o.css += `
            ${replace_selectors} {
                display:block;
            }
            `;
        }

        //Tell Pinegrow about the framework
        pinegrow.addFramework(f);

        console.log('LSHTM plugin loaded.');
    });
});