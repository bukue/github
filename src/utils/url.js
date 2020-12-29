export const cleanUrl = (url) => {
    return new URL(url.slice(0, url.indexOf("{")));
}