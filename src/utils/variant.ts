export const types: string[] = ["betty", "blockfish", "brinely", "clayfish", "dasher", "flopper", "glitter", "kob", "snooper", "spotty", "stripey", "sunstreak"]
export const typesMapping: Record<string, [number, number]> = { // first least byte / second-least byte : https://minecraft.fandom.com/wiki/Tropical_Fish (Entity data)
    "betty": [1, 4],
    "blockfish": [1, 3],
    "brinely": [0, 4],
    "clayfish": [1, 5],
    "dasher": [0, 3],
    "flopper": [1, 0],
    "glitter": [1, 2],
    "kob": [0, 0],
    "snooper": [0, 2],
    "spotty": [0, 5],
    "stripey": [1, 1],
    "sunstreak": [0, 1]
}

// black : Not found naturally
export const colors: string[] = ["blue", "brown", "cyan", "gray", "green", "light_blue", "light_gray", "lime", "magenta", "orange", "pink", "purple", "red", "white", "yellow"]
export const colorsOrdered: string[] = ["White", "Orange", "Magenta", "Light Blue", "Yellow", "Lime", "Pink", "Gray", "Light Gray", "Cyan", "Purple", "Blue", "Brown", "Green", "Red"]
export const colorsMapping: Record<string, number> = {
    "blue": 11,
    "brown": 12,
    "cyan": 9,
    "gray": 7,
    "green": 13,
    "light_blue": 3,
    "light_gray": 8,
    "lime": 5,
    "magenta": 2,
    "orange": 1,
    "pink": 6,
    "purple": 10,
    "red": 14,
    "white": 0,
    "yellow": 4
}

export const names: string[] = ["clownfish", "triggerfish", "tomato_clownfish", "red_snapper", "red_cichlid", "ornate_butterflyfish", "queen_angelfish", "cotton_candy_betta", "threadfin", "goatfish", "yellow_tang", "yellowtail_parrotfish", "dottyback", "parrotfish", "moorish_idol", "butterflyfish", "anemone", "black_tang", "cichlid", "blue_tang", "emperor_red_snapper", "red_lipped_blenny"]
export const namedVariants: number[] = [65536, 459008, 917504, 918273, 918529, 16778497, 50660352, 50726144, 67108865, 67110144, 67371009, 67699456, 67764993, 101253888, 117441025, 117441793, 117506305, 117899265, 118161664, 185008129, 234882305, 235340288]
export const namedVariantsMapping: Record<number, string> = {
    "65536": "Clownfish",
    "459008": "Triggerfish",
    "917504": "Tomato Clownfish",
    "918273": "Red Snapper",
    "918529": "Red Cichlid",
    "16778497": "Ornate Butterflyfish",
    "50660352": "Queen Angelfish",
    "50726144": "Cotton Candy Betta",
    "67108865": "Threadfin",
    "67110144": "Goatfish",
    "67371009": "Yellow Tang",
    "67699456": "Yellowtail Parrotfish",
    "67764993": "Dottyback",
    "101253888": "Parrotfish",
    "117441025": "Moorish Idol",
    "117441793": "Butterflyfish",
    "117506305": "Anemone",
    "117899265": "Black Tang",
    "118161664": "Cichlid",
    "185008129": "Blue Tang",
    "234882305": "Emperor Red Snapper",
    "235340288": "Red Lipped Blenny",
}

export function calculateModelData(typeIndex: number, bodyColorIndex: number, patternColorIndex: number): number {
    const padNumber = (num: number) => ("" + num).padStart(2, "0")
    const typeIndexStr = padNumber(typeIndex + 1)
    const bodyColorIndexStr = padNumber(bodyColorIndex + 1)
    const patternColorIndexStr = padNumber(patternColorIndex + 1)

    return Number.parseInt(`1${typeIndexStr}${bodyColorIndexStr}${patternColorIndexStr}`)
}

export function getVariantsWithTypeColor(typeStr: string, colorStr: string): {color: number, key: string}[] {
    const variantList: {color: number, key: string}[] = []

    if (!Object.keys(typesMapping).includes(typeStr)) return []
    if (!Object.keys(colorsMapping).includes(colorStr)) return []

    const type = typesMapping[typeStr]

    const size = type[0]
    const pattern = type[1]
    const colorBody = colorsMapping[colorStr]

    for (let colorPattern = 0; colorPattern <= 14; colorPattern++) { // 15 = black : Not found naturally
        const colorValue = (colorPattern << 24) | (colorBody << 16) | (pattern << 8) | size
        let keyValue = `${cap(typeStr)} ${cap(colorStr)}-${colorsOrdered[colorPattern]}`
        if (Object.keys(namedVariantsMapping).includes(colorValue.toString())) {
            keyValue = `${namedVariantsMapping[colorValue]} (${keyValue})`
        }

        variantList.push({
            color: colorValue,
            key: keyValue
        })
    }

    return variantList
}

export function cap(text: string): string {
    return text.substring(0,1).toUpperCase() + text.substring(1)
}