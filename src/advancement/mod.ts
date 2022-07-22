import {
    getAdvancementsPath,
    getAdvancementsPathBodyColor,
    getAdvancementsPathType,
    getDatapackName,
    getPredicatesPath,
    writeFile
} from "../utils/pack.ts"
import { names, namedVariants } from "../utils/variant.ts"
import { calculateModelData, colors, colorsMapping, getVariantsWithTypeColor, types } from "../utils/variant.ts"
import {
    getActiveFileContent,
    getNamedActiveFileContent,
    getBodyFileContent,
    getGlobaleFileContent,
    getGlobalTypeFileContent,
    getMainFileContent,
    getPatternFileContent
} from "./advancementFactory.ts"
import { Criteria, Variant } from "./IJson.ts"

// White-Gray
const DEFAULT_PRIMARY_COLOR = 13
const DEFAULT_SECONDARY_COLOR = 3

// Clownfish (Kob Orange-White)
const NAMED_TYPE = 'kob'
const NAMED_PRIMARY_COLOR = 9
const NAMED_SECONDARY_COLOR = 13

export default async function generatesFiles() {
    const promises: Promise<void>[] = []
    const colorsMappingFlip = Object.fromEntries(Object.entries(colorsMapping).map(([k, v]) => [v, k]))
    const allTypeVariants: {
        [type: string]: { key: string, value: Variant }[]
    } = {}
    const nameVariants: {
        key: string, value: Variant
    }[] = []

    types.forEach((type, typeIndex) => {
        const typeVariants: {
            key: string, value: Variant
        }[] = []
        
        colors.forEach((bodyColor, bodyColorIndex) => {
            const path = `${getAdvancementsPathType(type)}/body_${bodyColor}.json`
            const variantsColor = getVariantsWithTypeColor(type, bodyColor).map(colorVariant => {
                return {
                    color: colorVariant.color,
                    key: colorVariant.key
                }
            })
            const content = getBodyFileContent({
                bodyColor: bodyColor,
                modelData: calculateModelData(typeIndex, bodyColorIndex, 0),
                variantsColor: variantsColor,
                type: type
            })
            
            let patternColorIndex = 0
            for (const variant of variantsColor) {
                const patternColor = colorsMappingFlip[patternColorIndex]
                const criteriaKey = variant.key
                const criteriaColor = variant.color
                const criteriaValue = content.criteria[criteriaKey]

                promises.push(createPatternFiles({
                    type: type,
                    colorBody: bodyColor,
                    colorPattern: patternColor,
                    variantObj: {
                        key: criteriaKey,
                        value: criteriaValue,
                        color: criteriaColor
                    }
                }))

                patternColorIndex++
                typeVariants.push({ key: criteriaKey, value: criteriaValue })


                if (namedVariants.includes(criteriaColor)) {
                    const name = names[namedVariants.indexOf(criteriaColor)]
                    const parent = namedVariants.indexOf(criteriaColor) - 1 < 0 ? 'named/main' : `named/${names[namedVariants.indexOf(criteriaColor) - 1]}`

                    promises.push(createNamedPatternFiles({
                        type: type,
                        colorBody: bodyColor,
                        colorPattern: patternColor,
                        name: name,
                        parent: parent,
                        variantObj: {
                            key: criteriaKey,
                            value: criteriaValue,
                            color: criteriaColor
                        }
                    }))

                    nameVariants.push({ key: criteriaKey, value: criteriaValue })
                }
            }

            promises.push(createActiveFile(type, bodyColor))
            promises.push(writeFile(path, content))
        })
      
        allTypeVariants[type] = typeVariants
        promises.push(createMainFile(type, typeVariants))
    })

    // generate additional files for 'named' set
    promises.push(createNamedActiveFile())
    allTypeVariants['named'] = nameVariants
    promises.push(createNamedMainFile(nameVariants))

    promises.push(createGlobalFiles(allTypeVariants))
    await Promise.all(promises)
}

async function createMainFile(type: string, typesVariants: {
    key: string, value: Variant
}[]) {
    const path = `${getAdvancementsPathType(type)}/main.json`
    const content = getMainFileContent({
        modelData: calculateModelData(types.indexOf(type), DEFAULT_PRIMARY_COLOR, DEFAULT_SECONDARY_COLOR),
        type: type
    })

    for (const variant of typesVariants) {
        content.criteria[variant.key] = variant.value
    }

    await writeFile(path, content)
}

// Updated; added Main file for 'named tropical fish'-set
async function createNamedMainFile(typesVariants: {
    key: string, value: Variant
}[]) {
    const type = 'named'
    const path = `${getAdvancementsPathType(type)}/main.json`
    const content = getMainFileContent({
        modelData: calculateModelData(types.indexOf(NAMED_TYPE), NAMED_PRIMARY_COLOR, NAMED_SECONDARY_COLOR),
        type: type
    })

    for (const variant of typesVariants) {
        content.criteria[variant.key] = variant.value
    }

    await writeFile(path, content)
}

async function createActiveFile(type: string, colorBody: string) {
    const colorPattern = "yellow"

    const path = `${getAdvancementsPathBodyColor(type, colorBody)}/active.json`
    const content = getActiveFileContent({
        type: type,
        colorBody: colorBody,
        colorPattern: colorPattern
    })
    await writeFile(path, content)
}

// Updated; Added active file for 'named tropical fish'-set
// todo consider updating to handle displaying named fish on 2 lines (will need to activate both)
async function createNamedActiveFile() {
    const variantName = names[names.length -1]
    const type = 'named'

    const path = `${getAdvancementsPathType(type)}/active.json`
    const content = getNamedActiveFileContent({
        name: variantName
    })
    await writeFile(path, content)
}

async function createPatternFiles(params: {
    type: string,
    colorBody: string,
    colorPattern: string,
    variantObj: { key: string, value: Variant, color: number }
}) {
    const criteriaItem: Criteria = {
        [params.variantObj.key]: params.variantObj.value
    }

    const colorPatternIndex = colors.indexOf(params.colorPattern)
    let parent = params.type
    if (colorPatternIndex == 0) {
        parent = `${parent}/body_${params.colorBody}`
    } else {
        const previousColor = colors[colorPatternIndex - 1]
        parent = `${parent}/${params.colorBody}/pattern_${previousColor}`
    }

    const content = getPatternFileContent({
        bodyColor: params.colorBody,
        modelData: calculateModelData(types.indexOf(params.type), colors.indexOf(params.colorBody), colorPatternIndex),
        parent: parent,
        patternColor: params.colorPattern,
        type: params.type,
        variantCode: params.variantObj.color
    })

    content.criteria = criteriaItem

    const path = `${getAdvancementsPathBodyColor(params.type, params.colorBody)}/pattern_${params.colorPattern}.json`
    await writeFile(path, content)
}

// todo check, Updated; Added patternFiles for 'named tropical fish'-set
async function createNamedPatternFiles(params: {
    type: string,
    colorBody: string,
    colorPattern: string,
    name: string,
    parent: string,
    variantObj: { key: string, value: Variant, color: number }
}) {
    const criteriaItem: Criteria = {
        [params.variantObj.key]: params.variantObj.value
    }
    
    const content = getPatternFileContent({
        bodyColor: params.colorBody,
        modelData: calculateModelData(types.indexOf(params.type), colors.indexOf(params.colorBody), colors.indexOf(params.colorPattern)),
        parent: params.parent,
        patternColor: params.colorPattern,
        type: 'named',
        variantCode: params.variantObj.color
    })

    content.criteria = criteriaItem

    const path = `${getAdvancementsPathType('named')}/${params.name}.json`
    await writeFile(path, content)
}

async function createGlobalFiles(allTypesVariants: {
    [type: string]: { key: string, value: Variant }[]
}) {
    const promises: Promise<void>[] = []

    const path = `${getAdvancementsPath()}/global.json`
    const content = getGlobaleFileContent()
    let lastParent = "global"

    for (const type of Object.keys(allTypesVariants)) {
        const typePath = `${getAdvancementsPath()}/global_${type}.json`
        let typeContent = {criteria: {}}
        if (type == 'named') {
            typeContent = getGlobalTypeFileContent({
                modelData: calculateModelData(types.indexOf(NAMED_TYPE), NAMED_PRIMARY_COLOR, NAMED_SECONDARY_COLOR),
                parent: "global",
                type: type
            })
        } else {
            typeContent = getGlobalTypeFileContent({
                modelData: calculateModelData(types.indexOf(type), DEFAULT_PRIMARY_COLOR, DEFAULT_SECONDARY_COLOR),
                parent: lastParent,
                type: type
            })

            lastParent = `global_${type}`
        }
        

        for (const variant of allTypesVariants[type]) {
            content.criteria[variant.key] = variant.value
            typeContent.criteria[variant.key] = variant.value
        }

        promises.push(writeFile(typePath, typeContent))

    }

    // consider update to allow splitting global achievements into 2 lines (divided by bodyType)
    // tick activation needed, won't show up in advancement overview otherwise
    promises.push(writeFile(`${getAdvancementsPath()}/global_tick.json`, {
        "criteria": { "active": { "trigger": "minecraft:tick" } },
        "parent": `${getDatapackName()}:${lastParent}`
    }))

    // Updated; Add trigger for 'global_named'
    promises.push(writeFile(`${getAdvancementsPath()}/global_named_tick.json`, {
        "criteria": { "active": { "trigger": "minecraft:tick" } },
        "parent": `${getDatapackName()}:global_named`
    }))
    promises.push(writeFile(path, content))


    // // test initial setup for predicate 
    // // considering if predicated could be used to 'enable' advancements of the datapack
    // // could be useful on servers if not everyone wants to overflow their achievement lists
    // // predicate on root, or on active scripts
    // promises.push(writeFile(`${getPredicatesPath()}/check_tf_active.json`, {
    //     "condition": "minecraft:entity_scores",
    //     "entity": "this",
    //     "scores": {
    //         "tf_active": 1
    //     }
    // }))

    await Promise.all(promises)
}