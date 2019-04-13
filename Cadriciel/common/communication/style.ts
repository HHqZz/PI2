export const COLOR_OPPONENT: string = "red";
export const COLOR_CURRENT_USER: string = "green";
export const COLOR_BOTH: string = "linear-gradient(45deg, " + COLOR_OPPONENT + " 50%, " + COLOR_CURRENT_USER + " 50%)";

export const STYLE_INDICE_OPPONENT: {} = {"background-color": COLOR_OPPONENT, "text-decoration": "line-through"};
export const STYLE_INDICE_CURRENT_USER: {} = {"background-color": COLOR_CURRENT_USER, "text-decoration": "line-through"};

export const STYLE_HIGHTLIGHTED_CELL: {} = {
    "border": "2px solid " + COLOR_CURRENT_USER,
    "box-shadow": "0 0 10px #719ECE"
};

export const STYLE_HIGHTLIGHTED_CELL_OPPONENT: {} = {
    "border": "2px solid " + COLOR_OPPONENT,
    "box-shadow": "0 0 10px #719ECE"
};

export const STYLE_NO_HIGHTLIGHTED_CELL: {} = {
    "border": "2px solid black",
    "box-shadow": "none"
};

export const STYLE_CLUE_MOUSE_ENTER: {} = {"background-color":  "rgb(238, 159, 13)", "text-decoration": ""};
export const STYLE_CLUE: {} = {"background-color": "rgb(250, 246, 27)", "text-decoration": ""};