import { MainCategory, SubCategory, type Card } from "../types/card.types";

export const cardLibrary: Card[] = [

    // Other cards
    {
        id: "c001",
        name: "Fixed Width",
        description: "Set the component's width to a fixed size.",
        focusCost: 1,
        mainCategory: MainCategory.FOUNDATION,
        subCategory: SubCategory.LAYOUT,
        effects: [
            { type: "SET_CANVAS_PROP", property: "widthMode", value: "fixed" },
        ]
    },
    {
        id: "c002",
        name: "Fixed Height",
        description: "Set the component's height to a fixed size.",
        focusCost: 1,
        mainCategory: MainCategory.FOUNDATION,
        subCategory: SubCategory.LAYOUT,
        effects: [
            { type: "SET_CANVAS_PROP", property: "heightMode", value: "fixed" },
        ]
    },
    {
        id: "c004",
        name: "Inter",
        description: "Set Font Family to Inter. Exhaust.",
        focusCost: 1,
        mainCategory: MainCategory.FOUNDATION,
        subCategory: SubCategory.TYPE,
        effects: [
            { type: "SET_CANVAS_PROP", property: "fontFamily", value: "Inter" },
        ],
        exhausts: true
    },
    {
        id: "c006",
        name: "Generate Text Style",
        description: "Add a random text style from your Font Family into your hand.",
        focusCost: 0,
        mainCategory: MainCategory.SKILL,
        subCategory: SubCategory.TYPE,
        effects: [
            { type: "GENERATE_CARD", fromCardPool: ["c201", "c202", "c204"], amount: 1 }
        ]
    },
    {
        id: "c007",
        name: "Critque",
        description: "Gain 1 Focus.",
        focusCost: 0,
        mainCategory: MainCategory.SKILL,
        subCategory: SubCategory.RESEARCH,
        effects: [
            { type: "MODIFY_FOCUS", amount: 1 }
        ]
    },

    // Blue Palette
    {
        id: "c106",
        name: "Soft Sky",
        description: "Set your active color to Soft Sky.",
        focusCost: 0,
        mainCategory: MainCategory.ELEMENT,
        subCategory: SubCategory.COLOR,
        effects: [
            { type: "SET_CANVAS_PROP", property: "activeColor", value: "#93c5fd" }
        ]
    },
    {
        id: "c107",
        name: "Vibrant Blue",
        description: "Set your active color to Vibrant Blue.",
        focusCost: 0,
        mainCategory: MainCategory.ELEMENT,
        subCategory: SubCategory.COLOR,
        effects: [
            { type: "SET_CANVAS_PROP", property: "activeColor", value: "#3b82f6" }
        ]
    },
    {
        id: "c108",
        name: "Deep Navy",
        description: "Set your active color to Deep Navy.",
        focusCost: 0,
        mainCategory: MainCategory.ELEMENT,
        subCategory: SubCategory.COLOR,
        effects: [
            { type: "SET_CANVAS_PROP", property: "activeColor", value: "#1e40af" }
        ]
    },
    {
        id: "c_p_blue",
        name: "Electric Blue",
        description: "Switch to the Electric Blue Color Palette. Exhaust.",
        focusCost: 1,
        mainCategory: MainCategory.FOUNDATION,
        subCategory: SubCategory.COLOR,
        effects: [
            { type: "SET_PALETTE", paletteId: "p_blue" },
            { type: "GENERATE_SET_CARDS", fromCardPool: ["c106", "c107", "c108"] }
        ],
        exhausts: true
    },
    // Sunset Palette
    {
        id: "c109",
        name: "Pale Peach",
        description: "Set your active color to Pale Peach.",
        focusCost: 0,
        mainCategory: MainCategory.ELEMENT,
        subCategory: SubCategory.COLOR,
        effects: [
            { type: "SET_CANVAS_PROP", property: "activeColor", value: "#FDBA74" }
        ]
    },
    {
        id: "c110",
        name: "Bright Coral",
        description: "Set your active color to Bright Coral.",
        focusCost: 0,
        mainCategory: MainCategory.ELEMENT,
        subCategory: SubCategory.COLOR,
        effects: [
            { type: "SET_CANVAS_PROP", property: "activeColor", value: "#F97316" }
        ]
    },
    {
        id: "c111",
        name: "Burnt Sienna",
        description: "Set your active color to Burnt Sienna.",
        focusCost: 0,
        mainCategory: MainCategory.ELEMENT,
        subCategory: SubCategory.COLOR,
        effects: [
            { type: "SET_CANVAS_PROP", property: "activeColor", value: "#9A3412" }
        ]
    },
    {
        id: "c_p_sunset",
        name: "Sunset Coral",
        description: "Switch to the Sunset Coral Color Palette. Exhaust.",
        focusCost: 1,
        mainCategory: MainCategory.FOUNDATION,
        subCategory: SubCategory.COLOR,
        effects: [
            { type: "SET_PALETTE", paletteId: "p_sunset" },
            { type: "GENERATE_SET_CARDS", fromCardPool: ["c109", "c110", "c111"] }
        ],
        exhausts: true
    },
    // Green Palette
    {
        id: "c112",
        name: "Fresh Mint",
        description: "Set your active color to Fresh Mint.",
        focusCost: 0,
        mainCategory: MainCategory.ELEMENT,
        subCategory: SubCategory.COLOR,
        effects: [
            { type: "SET_CANVAS_PROP", property: "activeColor", value: "#6EE7B7" }
        ]
    },
    {
        id: "c113",
        name: "Emerald Green",
        description: "Set your active color to Emerald Green.",
        focusCost: 0,
        mainCategory: MainCategory.ELEMENT,
        subCategory: SubCategory.COLOR,
        effects: [
            { type: "SET_CANVAS_PROP", property: "activeColor", value: "#10B981" }
        ]
    },
    {
        id: "c114",
        name: "Pine Green",
        description: "Set your active color to Pine Green.",
        focusCost: 0,
        mainCategory: MainCategory.ELEMENT,
        subCategory: SubCategory.COLOR,
        effects: [
            { type: "SET_CANVAS_PROP", property: "activeColor", value: "#065F46" }
        ]
    },
    {
        id: "c_p_green",
        name: "Mint & Forest",
        description: "Switch to the Mint & Forest Color Palette. Exhaust.",
        focusCost: 1,
        mainCategory: MainCategory.FOUNDATION,
        subCategory: SubCategory.COLOR,
        effects: [
            { type: "SET_PALETTE", paletteId: "p_green" },
            { type: "GENERATE_SET_CARDS", fromCardPool: ["c112", "c113", "c114"] }
        ],
        exhausts: true
    },
    // Violet Palette
    {
        id: "c115",
        name: "Light Lavender",
        description: "Set your active color to Light Lavender.",
        focusCost: 0,
        mainCategory: MainCategory.ELEMENT,
        subCategory: SubCategory.COLOR,
        effects: [
            { type: "SET_CANVAS_PROP", property: "activeColor", value: "#C4B5FD" }
        ]
    },
    {
        id: "c116",
        name: "Electric Purple",
        description: "Set your active color to Electric Purple.",
        focusCost: 0,
        mainCategory: MainCategory.ELEMENT,
        subCategory: SubCategory.COLOR,
        effects: [
            { type: "SET_CANVAS_PROP", property: "activeColor", value: "#8B5CF6" }
        ]
    },
    {
        id: "c117",
        name: "Deep Plum",
        description: "Set your active color to Deep Plum.",
        focusCost: 0,
        mainCategory: MainCategory.ELEMENT,
        subCategory: SubCategory.COLOR,
        effects: [
            { type: "SET_CANVAS_PROP", property: "activeColor", value: "#5B21B6" }
        ]
    },
    {
        id: "c_p_purple",
        name: "Royal Violet",
        description: "Switch to the Royal Violet Color Palette. Exhaust.",
        focusCost: 1,
        mainCategory: MainCategory.FOUNDATION,
        subCategory: SubCategory.COLOR,
        effects: [
            { type: "SET_PALETTE", paletteId: "p_purple" },
            { type: "GENERATE_SET_CARDS", fromCardPool: ["c115", "c116", "c117"] }
        ],
        exhausts: true
    },
    // Slate Palette
    {
        id: "c118",
        name: "Silver Gray",
        description: "Set your active color to Silver Gray.",
        focusCost: 0,
        mainCategory: MainCategory.ELEMENT,
        subCategory: SubCategory.COLOR,
        effects: [
            { type: "SET_CANVAS_PROP", property: "activeColor", value: "#CBD5E1" }
        ]
    },
    {
        id: "c119",
        name: "Cool Slate",
        description: "Set your active color to Cool Slate.",
        focusCost: 0,
        mainCategory: MainCategory.ELEMENT,
        subCategory: SubCategory.COLOR,
        effects: [
            { type: "SET_CANVAS_PROP", property: "activeColor", value: "#64748B" }
        ]
    },
    {
        id: "c120",
        name: "Dark Charcoal",
        description: "Set your active color to Dark Charcoal.",
        focusCost: 0,
        mainCategory: MainCategory.ELEMENT,
        subCategory: SubCategory.COLOR,
        effects: [
            { type: "SET_CANVAS_PROP", property: "activeColor", value: "#1E293B" }
        ]
    },
    {
        id: "c_p_gray",
        name: "Dark Charcoal",
        description: "Switch to the Dark Charcoal Color Palette.Exhaust.",
        focusCost: 1,
        mainCategory: MainCategory.FOUNDATION,
        subCategory: SubCategory.COLOR,
        effects: [
            { type: "SET_PALETTE", paletteId: "p_gray" },
            { type: "GENERATE_SET_CARDS", fromCardPool: ["c118", "c119", "c120"] }
        ],
        exhausts: true
    },


    // Text Cards
    {
        id: "c201",
        name: "Heading 1",
        description: "Adds a Heading 1 text style to the canvas.",
        focusCost: 1,
        mainCategory: MainCategory.ELEMENT,
        subCategory: SubCategory.TYPE,
        effects: [
            { type: "SET_CANVAS_PROP", property: "activeTextStyle", value: { name: "Heading 1", fontSize: 32, fontWeight: 700 } },
            { type: "ADD_ENCOUNTER_TEXT" }
        ]
    },
    {
        id: "c202",
        name: "Body Text",
        description: "Adds a Body Text style to the canvas.",
        focusCost: 1,
        mainCategory: MainCategory.ELEMENT,
        subCategory: SubCategory.TYPE,
        effects: [
            { type: "SET_CANVAS_PROP", property: "activeTextStyle", value: { name: "Body Text", fontSize: 16, fontWeight: 400 } },
            { type: "ADD_ENCOUNTER_TEXT" }
        ]
    },
    {
        id: "c203",
        name: "Icon",
        description: "Adds an icon to the canvas.",
        focusCost: 1,
        mainCategory: MainCategory.ELEMENT,
        subCategory: SubCategory.TYPE,
        effects: [
            { type: "ADD_ENCOUNTER_ICON" }
        ]
    },
    {
        id: "c204",
        name: "Label",
        description: "Adds a Label text style to the canvas.",
        focusCost: 1,
        mainCategory: MainCategory.ELEMENT,
        subCategory: SubCategory.TYPE,
        effects: [
            { type: "SET_CANVAS_PROP", property: "activeTextStyle", value: { name: "Label", fontSize: 16, fontWeight: 700 } },
            { type: "ADD_ENCOUNTER_TEXT" }
        ]
    },

    // Starting Cards
    {
        id: "c301",
        name: "Rectangle",
        description: "Sets the container's shape to a rectangle.",
        focusCost: 1,
        mainCategory: MainCategory.FOUNDATION,
        subCategory: SubCategory.SHAPE,
        effects: [
            { type: "SET_CANVAS_PROP", property: "shape", value: "rectangle" }
        ]
    },
    {
        id: "c302",
        name: "Solid Fill",
        description: "Sets the container's fill type to solid.",
        focusCost: 1,
        mainCategory: MainCategory.FOUNDATION,
        subCategory: SubCategory.COLOR,
        effects: [
            { type: "SET_CANVAS_PROP", property: "fillType", value: "solid" }
        ]
    },
    {
        id: "c303",
        name: "Add Text",
        description: "Adds text to the canvas with a random text style.",
        focusCost: 1,
        mainCategory: MainCategory.ELEMENT,
        subCategory: SubCategory.TYPE,
        effects: [
            { type: "ADD_ENCOUNTER_TEXT" }
        ]
    },
    {
        id: "c305",
        name: "Generate Color",
        description: "Generate a random color from your Palette.",
        focusCost: 0,
        mainCategory: MainCategory.SKILL,
        subCategory: SubCategory.COLOR,
        effects: [
            { type: "GENERATE_PALETTE_CARD", amount: 1, strategy: "random" }
        ]
    },
    {
        id: "c306",
        name: "Padding",
        description: "Add +4 padding to the container.",
        focusCost: 1,
        mainCategory: MainCategory.FOUNDATION,
        subCategory: SubCategory.LAYOUT,
        effects: [
            { type: "MODIFY_PROPERTY", property: "padding", amount: 4 }
        ]
    },
    {
        id: "c307",
        name: "White",
        description: "Set your Active Color to White.",
        focusCost: 0,
        mainCategory: MainCategory.ELEMENT,
        subCategory: SubCategory.COLOR,
        effects: [
            { type: "SET_CANVAS_PROP", property: "activeColor", value: "#FFFFFF" }
        ]
    },
    {
        id: "c308",
        name: "Black",
        description: "Set your Active Color to Black.",
        focusCost: 0,
        mainCategory: MainCategory.ELEMENT,
        subCategory: SubCategory.COLOR,
        effects: [
            { type: "SET_CANVAS_PROP", property: "activeColor", value: "#111111" }
        ]
    },
    {
        id: "c309",
        name: "Row Layout",
        description: "Arranges elements horizontally.",
        focusCost: 1,
        mainCategory: MainCategory.FOUNDATION,
        subCategory: SubCategory.LAYOUT,
        effects: [
            { type: "SET_CANVAS_PROP", property: "layout", value: "row" }
        ]
    },
    {
        id: "c310",
        name: "Column Layout",
        description: "Arranges elements vertically.",
        focusCost: 1,
        mainCategory: MainCategory.FOUNDATION,
        subCategory: SubCategory.LAYOUT,
        effects: [
            { type: "SET_CANVAS_PROP", property: "layout", value: "column" }
        ]
    },

    // Reward Cards
    {
        id: "c311",
        name: "Small Padding",
        description: "Applies 8px of padding.",
        focusCost: 1,
        mainCategory: MainCategory.FOUNDATION,
        subCategory: SubCategory.LAYOUT,
        effects: [
            { type: "SET_CANVAS_PROP", property: "padding", value: 8 }
        ]
    },
    {
        id: "c312",
        name: "Medium Padding",
        description: "Applies 12px of padding.",
        focusCost: 1,
        mainCategory: MainCategory.FOUNDATION,
        subCategory: SubCategory.LAYOUT,
        effects: [
            { type: "SET_CANVAS_PROP", property: "padding", value: 12 }
        ]
    },
    {
        id: "c313",
        name: "Large Padding",
        description: "Applies 20px of padding.",
        focusCost: 1,
        mainCategory: MainCategory.FOUNDATION,
        subCategory: SubCategory.LAYOUT,
        effects: [
            { type: "SET_CANVAS_PROP", property: "padding", value: 20 }
        ]
    },
    {
        id: "c314",
        name: "Opaque Fill",
        description: "Sets the container's fill type to opaque.",
        focusCost: 0,
        mainCategory: MainCategory.FOUNDATION,
        subCategory: SubCategory.COLOR,
        effects: [
            { type: "SET_CANVAS_PROP", property: "fillType", value: "opaque" }
        ]
    },
    {
        id: "c315",
        name: "No Fill",
        description: "Sets the container's fill type to none.",
        focusCost: 0,
        mainCategory: MainCategory.FOUNDATION,
        subCategory: SubCategory.COLOR,
        effects: [
            { type: "SET_CANVAS_PROP", property: "fillType", value: "none" }
        ]
    },
    {
        id: "c316",
        name: "Hug Contents",
        description: "Shrinks the canvas to fit its content.",
        focusCost: 1,
        mainCategory: MainCategory.FOUNDATION,
        subCategory: SubCategory.LAYOUT,
        effects: [
            { type: "SET_CANVAS_PROP", property: "widthMode", value: "fit" },
            { type: "SET_CANVAS_PROP", property: "heightMode", value: "fit" }
        ]
    },
    {
        id: "c317",
        name: "Apply to Fill",
        description: "Applies your Active Color to the container's fill. Consumes Active Color.",
        focusCost: 1,
        mainCategory: MainCategory.ELEMENT,
        subCategory: SubCategory.COLOR,
        effects: [
            { type: "APPLY_COLOR_TO", target: "fill" }
        ]
    },
    {
        id: "c318",
        name: "Apply to Stroke",
        description: "Applies your Active Color to the container's stroke. Consumes Active Color.",
        focusCost: 1,
        mainCategory: MainCategory.ELEMENT,
        subCategory: SubCategory.COLOR,
        effects: [
            { type: "APPLY_COLOR_TO", target: "stroke" }
        ]
    },
    {
        id: "c319",
        name: "Apply to Text",
        description: "Applies your Active Color to the canvas's text. Consumes Active Color.",
        focusCost: 1,
        mainCategory: MainCategory.ELEMENT,
        subCategory: SubCategory.COLOR,
        effects: [
            { type: "APPLY_COLOR_TO", target: "text" }
        ]
    },
    {
        id: "c320",
        name: "Apply to Icon",
        description: "Applies your Active Color to the canvas's icon. Consumes Active Color.",
        focusCost: 1,
        mainCategory: MainCategory.ELEMENT,
        subCategory: SubCategory.COLOR,
        effects: [
            { type: "APPLY_COLOR_TO", target: "icon" }
        ]
    },
    {
        id: "c321",
        name: "Iteration",
        description: "Draw 2.",
        focusCost: 1,
        mainCategory: MainCategory.SKILL,
        subCategory: SubCategory.RESEARCH,
        effects: [
            { type: "DRAW_CARDS", amount: 2 }
        ]
    },
    {
        id: "c321",
        name: "User Testing",
        description: "Draw 1. Gain 1 Focus.",
        focusCost: 0,
        mainCategory: MainCategory.SKILL,
        subCategory: SubCategory.RESEARCH,
        effects: [
            { type: "DRAW_CARDS", amount: 1 },
            { type: "MODIFY_FOCUS", amount: 1 }
        ]
    },
    {
        id: "c322",
        name: "Stroke",
        description: "Add a stroke to the component.",
        focusCost: 0,
        mainCategory: MainCategory.SKILL,
        subCategory: SubCategory.RESEARCH,
        effects: [
            { type: "APPLY_COLOR_TO", target: "stroke" }
        ]
    },
]