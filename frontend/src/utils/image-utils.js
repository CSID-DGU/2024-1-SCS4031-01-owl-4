function getImageURL(name) {
    return new URL(`../assets/coinLogoImages/${name}.png`, import.meta.url).href
}

export {getImageURL}