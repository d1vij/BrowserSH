export enum OutputType {
    terminal_output,
    user_input_display
}

// TODO: Refactor this to somewhere
export const Colors = {
    black: "#1C1C1C",
    white: "#FFFFFF",
    white_off: "#F5F5F5",
    white_warm: "#FFFBEA",
    white_silver: "#E6E6E6",

    red: "#AF5F5F",
    red_muted: "#AF3F3F",
    red_bright: "#FF5F5F",
    red_deep: "#870000",
    maroon_dark: "#5F1F3F",

    green_dark: "#5F875F",
    green_pale: "#87AF87",
    green_olive: "#6F875F",
    green_mint: "#AFFF87",
    green_forest: "#3F5F3F",
    green_swamp: "#5F8787",
    green_murky: "#375F4F",

    yellow_ochre: "#87875F",
    yellow_light: "#FFFFAF",
    yellow_deep: "#AFAF5F",
    yellow_faded: "#D7D787",
    yellow_mustard: "#5F5F00",

    blue_light: "#5F87AF",
    blue_cool: "#8FAFD7",
    blue_dark: "#005F87",
    blue_ice: "#AFD7FF",
    blue_navy: "#1C2A4C",
    indigo_deep: "#2C2C54",

    purple_dark: "#5F5F87",
    purple_muted: "#8787AF",
    purple_wine: "#875F87",
    purple_fog: "#D7D7FF",
    purple_night: "#3F3F5F",

    teal_bright: "#5FAFAF",
    teal_dusty: "#5FAF87",
    teal_light: "#AFFFFF",
    teal_deep: "#2F4F4F",
    cyan_steel: "#2B5F5F",

    orange_warm: "#FF8700",
    orange_soft: "#FFAF5F",
    orange_dark: "#D78700",
    orange_rust: "#AF5F00",
    brown_dark: "#4B3A2F",

    grey_faint: "#C0C0C0",
    grey_cool: "#999999",
    grey_mid: "#6C6C6C",
    grey_dark: "#444444",
    grey_ash: "#3C3C3C",
    grey_charcoal: "#2B2B2B",
    grey_coal: "#1A1A1A",
    slate_deep: "#404860",
}

export const Command = {
    echo: "echo",
    clear: "clear",
    redirect: "redirect"
}