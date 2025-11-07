import { MainCategory, SubCategory, type Card } from "../types/card.types";

export const cardLibrary: Card[] = [

    // Starting Cards
    {
        id: "c001",
        name: "Fixed Width",
        description: "",
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
        description: "",
        focusCost: 1,
        mainCategory: MainCategory.FOUNDATION,
        subCategory: SubCategory.LAYOUT,
        effects: [
            { type: "SET_CANVAS_PROP", property: "heightMode", value: "fixed" },
        ]
    },
    {
        id: "c003",
        name: "Grayscale",
        description: "Set Palette to Grayscael. Exhaust.",
        focusCost: 1,
        mainCategory: MainCategory.FOUNDATION,
        subCategory: SubCategory.COLOR,
        effects: [
            { type: "SET_CANVAS_PROP", property: "paletteName", value: "Grayscale" },
            { type: "SET_CANVAS_PROP", property: "colors", value: ['#111', '#555', '#888', '#EEE', '#FFF'] },
        ],
        exhausts: true
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
        id: "c005",
        name: "Generate Color",
        description: "Add a random color from your Palette into your hand.",
        focusCost: 0,
        mainCategory: MainCategory.SKILL,
        subCategory: SubCategory.COLOR,
        effects: [
            { type: "GENERATE_CARD", fromCardPool: ["c101", "c102", "c103", "c104", "c105"], amount: 1 }
        ]
    },
    {
        id: "c006",
        name: "Generate Type Style",
        description: "Add a random type style from your Font Family into your hand.",
        focusCost: 0,
        mainCategory: MainCategory.SKILL,
        subCategory: SubCategory.TYPE,
        effects: [
            { type: "GENERATE_CARD", fromCardPool: ["c201", "c202"], amount: 1 }
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
    {
        id: "c008",
        name: "User Testing",
        description: "Draw 1. Increase your Skill by 1.",
        focusCost: 2,
        mainCategory: MainCategory.SKILL,
        subCategory: SubCategory.RESEARCH,
        effects: [
            { type: "DRAW_CARDS", amount: 1 }
        ]
    },
    {
        id: "c009",
        name: "Iteration",
        description: "Draw 2.",
        focusCost: 2,
        mainCategory: MainCategory.SKILL,
        subCategory: SubCategory.RESEARCH,
        effects: [
            { type: "DRAW_CARDS", amount: 2 }
        ]
    },
    {
        id: "c010",
        name: "Row",
        description: "Apply an auto layout row.",
        focusCost: 1,
        mainCategory: MainCategory.FOUNDATION,
        subCategory: SubCategory.LAYOUT,
        effects: [
            { type: "SET_CANVAS_PROP", property: "layout", value: "row" }
        ]
    },
    {
        id: "c011",
        name: "Column",
        description: "Apply an auto layout column.",
        focusCost: 1,
        mainCategory: MainCategory.FOUNDATION,
        subCategory: SubCategory.LAYOUT,
        effects: [
            { type: "SET_CANVAS_PROP", property: "layout", value: "column" }
        ]
    },
    {
        id: "c012",
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
        id: "c013",
        name: "Apply to Fill",
        description: "Applies your Active Color to the container's fill. Consumes Active Color.",
        focusCost: 0,
        mainCategory: MainCategory.ELEMENT,
        subCategory: SubCategory.COLOR,
        effects: [
            { type: "APPLY_COLOR_TO", target: "fill" }
        ]
    },
    {
        id: "c014",
        name: "Apply to Stroke",
        description: "Applies your Active Color to the container's stroke. Consumes Active Color.",
        focusCost: 0,
        mainCategory: MainCategory.ELEMENT,
        subCategory: SubCategory.COLOR,
        effects: [
            { type: "APPLY_COLOR_TO", target: "stroke" }
        ]
    },
    {
        id: "c015",
        name: "Apply to Text",
        description: "Applies your Active Color to the canvas's text. Consumes Active Color.",
        focusCost: 0,
        mainCategory: MainCategory.ELEMENT,
        subCategory: SubCategory.COLOR,
        effects: [
            { type: "APPLY_COLOR_TO", target: "text" }
        ]
    },
    {
        id: "c016",
        name: "Apply to Icon",
        description: "Applies your Active Color to the canvas's icon. Consumes Active Color.",
        focusCost: 0,
        mainCategory: MainCategory.ELEMENT,
        subCategory: SubCategory.COLOR,
        effects: [
            { type: "APPLY_COLOR_TO", target: "icon" }
        ]
    },



    // Color Cards
    {
        id: "c101",
        name: "White",
        description: "Set your active color to White.",
        focusCost: 1,
        mainCategory: MainCategory.ELEMENT,
        subCategory: SubCategory.COLOR,
        effects: [
            { type: "SET_CANVAS_PROP", property: "activeColor", value: "#FFF" }
        ]
    },
    {
        id: "c102",
        name: "Light Gray",
        description: "Set your active color to Light Gray.",
        focusCost: 1,
        mainCategory: MainCategory.ELEMENT,
        subCategory: SubCategory.COLOR,
        effects: [
            { type: "SET_CANVAS_PROP", property: "activeColor", value: "#EEE" }
        ]
    },
    {
        id: "c103",
        name: "Gray",
        description: "Set your active color to Gray.",
        focusCost: 1,
        mainCategory: MainCategory.ELEMENT,
        subCategory: SubCategory.COLOR,
        effects: [
            { type: "SET_CANVAS_PROP", property: "activeColor", value: "#888" }
        ]
    },
    {
        id: "c104",
        name: "Dark Gray",
        description: "Set your active color to Dark Gray.",
        focusCost: 1,
        mainCategory: MainCategory.ELEMENT,
        subCategory: SubCategory.COLOR,
        effects: [
            { type: "SET_CANVAS_PROP", property: "activeColor", value: "#555" }
        ]
    },
    {
        id: "c105",
        name: "Black",
        description: "Set your active color to Black.",
        focusCost: 1,
        mainCategory: MainCategory.ELEMENT,
        subCategory: SubCategory.COLOR,
        effects: [
            { type: "SET_CANVAS_PROP", property: "activeColor", value: "#111" }
        ]
    },

    // Text Cards
    {
        id: "c201",
        name: "Heading 1",
        description: "",
        focusCost: 1,
        mainCategory: MainCategory.ELEMENT,
        subCategory: SubCategory.TYPE,
        effects: [
            { type: "SET_CANVAS_PROP", property: "activeTextStyle", value: { name: "Heading 1", fontSize: 32, fontWeight: 700 } },
            { type: "ADD_TEXT", text: "Search here...", styleName: "Heading 1" }
        ]
    },
    {
        id: "c202",
        name: "Body Text",
        description: "",
        focusCost: 1,
        mainCategory: MainCategory.ELEMENT,
        subCategory: SubCategory.TYPE,
        effects: [
            { type: "SET_CANVAS_PROP", property: "activeTextStyle", value: { name: "Body Text", fontSize: 16, fontWeight: 400 } },
            { type: "ADD_TEXT", text: "Search here...", styleName: "Body Text" }
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
            {
                type: "ADD_ICON",
                icon: { materialIconName: "search", color: "#333", size: 24 }
            }
        ]
    },

    // Reward Cards
    {
        id: "c301",
        name: "Brainstorm",
        description: "Draw 3 cards. Exhaust.",
        focusCost: 1,
        mainCategory: MainCategory.SKILL,
        subCategory: SubCategory.RESEARCH,
        effects: [
            { type: "DRAW_CARDS", amount: 3 }
        ]
    },
]