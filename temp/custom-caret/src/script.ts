import "./style.scss";

const _editable = document.querySelector("div.editable") as HTMLDivElement;
const _caret = document.querySelector("div#caret") as HTMLDivElement;


_editable.addEventListener("keyup", updateCaretPosition)
_editable.addEventListener("input", updateCaretPosition)
_editable.addEventListener("click", updateCaretPosition)



function updateCaretPosition(event:Event) {
    if ((event as KeyboardEvent).key === "Enter") {
        event.preventDefault() // prevents caret from going to next line
        console.log("enter pressed")
        return;
    }

    const selection = window.getSelection();
    const range = selection?.getRangeAt(0).cloneRange();
    range?.collapse(true);

    const positions = range?.getClientRects()!;
    const curr_pos = positions[0];

    _caret.style.top = curr_pos?.top + window.scrollX + "px";
    _caret.style.left = curr_pos?.left + window.scrollY + "px";
}

