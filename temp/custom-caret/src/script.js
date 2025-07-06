import "./style.scss";
const _editable = document.querySelector("div.editable");
const _caret = document.querySelector("div#caret");
_editable.addEventListener("keyup", updateCaretPosition);
_editable.addEventListener("input", updateCaretPosition);
_editable.addEventListener("click", updateCaretPosition);
function updateCaretPosition(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // prevents caret from going to next line
        console.log("enter pressed");
        return;
    }
    const selection = window.getSelection();
    const range = selection === null || selection === void 0 ? void 0 : selection.getRangeAt(0).cloneRange();
    range === null || range === void 0 ? void 0 : range.collapse(true);
    const positions = range === null || range === void 0 ? void 0 : range.getClientRects();
    const curr_pos = positions[0];
    _caret.style.top = (curr_pos === null || curr_pos === void 0 ? void 0 : curr_pos.top) + window.scrollX + "px";
    _caret.style.left = (curr_pos === null || curr_pos === void 0 ? void 0 : curr_pos.left) + window.scrollY + "px";
}
