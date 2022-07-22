import { getDatapackName, getGlobalRewardFileName, getTypeRewardFileName } from "../utils/pack.ts"
import { Criteria, Display } from "./IJson.ts"
import { namedVariants, namedVariantMapping } from "../utils/variant.ts"

class AdvancementFactory {

    private json: Record<string, any> = {
        author: {
            translate: "global.author"
        }
    }

    criteria(criteria: Criteria): this {
        this.json.criteria = criteria
        return this
    }

    display(display: Display): this {
        this.json.display = display
        return this
    }

    parent(parent: string): this {
        this.json.parent = `${getDatapackName()}:${parent}`
        return this
    }

    rewards(functionStr: string): this {
        this.json.rewards = {
            function: `${getDatapackName()}:${functionStr}`
        }
        return this
    }

    get() {
        return this.json
    }
}

export function getActiveFileContent(params: {
    type: string,
    colorBody: string,
    colorPattern: string
}) {
    return new AdvancementFactory()
        .parent(`${params.type}/${params.colorBody}/pattern_${params.colorPattern}`)
        .criteria({
            active: {
                trigger: "minecraft:impossible"
            }
        })
        .get()
}

// todo update for named
export function getNamedActiveFileContent(params: {
    name: string
}) {
    return new AdvancementFactory()
        .parent(`named/${params.name}`)
        .criteria({
            active: {
                trigger: "minecraft:impossible"
            }
        })
        .get()
}

export function getGlobaleFileContent() {
    return new AdvancementFactory()
        .criteria({})
        .display({
            icon: {
                item: "minecraft:tropical_fish_bucket"
            },
            title: {
                translate: "advancement.catch.fish.title"
            },
            description: {
                translate: "advancement.catch.fish.description"
            },
            background: "minecraft:textures/block/tube_coral_block.png",
            frame: "challenge",
            show_toast: true,
            announce_to_chat: true,
            hidden: false
        })
        .rewards(getGlobalRewardFileName())
        .get()
}

export function getGlobalTypeFileContent(params: {
    modelData: number,
    parent: string,
    type: string
}) {
    // consider updating to handle reward for 'named'
    return new AdvancementFactory()
        .criteria({})
        .display({
            icon: {
                item: "minecraft:tropical_fish_bucket",
                nbt: `{ CustomModelData: ${params.modelData} }`
            },
            title: {
                translate: "advancement.catch.type.title",
                with: [{
                    translate: `fish.type.${params.type}`
                }]
            },
            description: {
                translate: "advancement.catch.type.description",
                with: [{
                    translate: `fish.type.${params.type}`
                }]
            },
            background: "minecraft:textures/block/tube_coral_block.png",
            frame: "goal",
            show_toast: false,
            announce_to_chat: false,
            hidden: false
        })
        .parent(params.parent)
        .rewards(getTypeRewardFileName())
        .get()
}

export function getMainFileContent(params: {
    modelData: number,
    type: string
}) {
    return new AdvancementFactory()
        .criteria({})
        .display({
            icon: {
                item: "minecraft:tropical_fish_bucket",
                nbt: `{ CustomModelData: ${params.modelData} }`
            },
            title: {
                translate: "advancement.catch.type.title",
                with: [{
                    translate: `fish.type.${params.type}`
                }]
            },
            description: {
                translate: "advancement.catch.type.description",
                with: [{
                    translate: `fish.type.${params.type}`
                }]
            },
            background: "minecraft:textures/block/tube_coral_block.png",
            frame: "challenge",
            show_toast: true,
            announce_to_chat: true,
            hidden: false
        })
        .get()
}

export function getBodyFileContent(params: {
    bodyColor: string,
    modelData: number,
    type: string,
    variantsColor: { color: number, key: string }[]
}) {
    const variants = params.variantsColor.map(variantColor => {
        return {
            [`${variantColor.key}`]: {
                trigger: "minecraft:inventory_changed",
                conditions: {
                    items: [{
                        items: ["minecraft:tropical_fish_bucket"],
                        nbt: `{BucketVariantTag: ${variantColor.color}}`
                    }]
                }
            }
        }
    })

    const criteria = {}
    Object.assign(criteria, ...variants)

    return new AdvancementFactory()
        .criteria(criteria)
        .display({
            icon: {
                item: "minecraft:tropical_fish_bucket",
                nbt: `{ CustomModelData: ${params.modelData} }`
            },
            title: {
                translate: "advancement.catch.type_bodyColor.title",
                with: [{
                    translate: `fish.type.${params.type}`
                }, {
                    translate: `fish.color.${params.bodyColor}`
                }]
            },
            description: {
                translate: "advancement.catch.type_bodyColor.description",
                with: [{
                    translate: `fish.type.${params.type}`
                }, {
                    translate: `fish.color.${params.bodyColor}`
                }]
            },
            background: "minecraft:textures/block/tube_coral_block.png",
            frame: "goal",
            show_toast: true,
            announce_to_chat: false,
            hidden: false
        })
        .parent(`${params.type}/main`)
        .get()
}

export function getPatternFileContent(params: {
    bodyColor: string,
    modelData: number,
    parent: string,
    patternColor: string,
    type: string,
    variantCode: number
}) {
    let showToast = true
    if (params.type == 'named') {showToast = false}
    return new AdvancementFactory()
        .criteria({})
        .display({
            icon: {
                item: "minecraft:tropical_fish_bucket",
                nbt: `{ CustomModelData: ${params.modelData} }`
            },
            title: {
                translate: "advancement.catch.type_bodyColor_patternColor.title",
                with: [{
                    translate: `fish.type.${namedVariants.includes(params.variantCode) ? params.variantCode : params.type}`
                }, {
                    translate: `fish.color.${params.bodyColor}`
                }, {
                    translate: `fish.color.${params.patternColor}`
                }]
            },
            description: {
                translate: "advancement.catch.type_bodyColor_patternColor.description",
                with: [{
                    translate: `fish.type.${namedVariants.includes(params.variantCode) ? params.variantCode : params.type}`
                }, {
                    translate: `fish.color.${params.bodyColor}`
                }, {
                    translate: `fish.color.${params.patternColor}`
                }]
            },
            background: "minecraft:textures/block/tube_coral_block.png",
            frame: "task",
            show_toast: showToast,
            announce_to_chat: false,
            hidden: false
        })
        .parent(`${params.parent}`)
        .rewards(`${params.type}`)
        .get()
}