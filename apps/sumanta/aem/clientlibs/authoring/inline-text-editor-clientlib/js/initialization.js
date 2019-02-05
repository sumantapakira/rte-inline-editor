var INLINE_FEATURE = "inlineTextEdit", 
    TEXT_FONT_SIZE = "font-size",
    TEXT_FONT_FAMILY = "font-family",
    TEXT_COLOR = "color",
    GROUP = "sumanta-aem",
    DIALOG = "inlineTextEditorDialog",
    REQUESTER = "requester",
    PICKER_URL = "/apps/sumanta/aem/components/content/custom-rte-text/cq:dialog.html";

(function($){
    var CUI = window.CUI;

    addPlugin();

    addTemplate();

    function addPlugin(){
        var toolbar = CUI.rte.ui.cui.DEFAULT_UI_SETTINGS.inline.toolbar;

        toolbar = CUI.rte.ui.cui.DEFAULT_UI_SETTINGS.fullscreen.toolbar;
        toolbar.splice(8, 0, GROUP + "#" + INLINE_FEATURE);
    }

    function addTemplate(){
        var url = PICKER_URL + "?" + REQUESTER + "=" + GROUP;

        var html = "<iframe id='customdialog' width='900px' height='600px' frameBorder='0' src='" + url + "'></iframe>";

        if(_.isUndefined(CUI.rte.Templates)){
            CUI.rte.Templates = {};
        }

        if(_.isUndefined(CUI.rte.templates)){
            CUI.rte.templates = {};
        }

        CUI.rte.templates['dlg-' + DIALOG] = CUI.rte.Templates['dlg-' + DIALOG] = Handlebars.compile(html);
    }
}(jQuery, window.CUI,jQuery(document)));

