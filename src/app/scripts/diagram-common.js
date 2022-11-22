"use strict";
/**
 * script for mobile symbol-palette
 */
Object.defineProperty(exports, "__esModule", { value: true });
var isMobile;
function paletteIconClick() {
    isMobile = window.matchMedia('(max-width:550px)').matches;
    if (isMobile) {
        var paletteIcon = document.getElementById('palette-icon');
        if (paletteIcon) {
            paletteIcon.addEventListener('click', showPaletteIcon, false);
        }
    }
}
exports.paletteIconClick = paletteIconClick;
function showPaletteIcon() {
    var paletteSpace = document.getElementById('palette-space');
    isMobile = window.matchMedia('(max-width:550px)').matches;
    if (isMobile) {
        if (!paletteSpace.classList.contains('sb-mobile-palette-open')) {
            paletteSpace.classList.add('sb-mobile-palette-open');
        }
        else {
            paletteSpace.classList.remove('sb-mobile-palette-open');
        }
    }
}
exports.showPaletteIcon = showPaletteIcon;
//# sourceMappingURL=diagram-common.js.map