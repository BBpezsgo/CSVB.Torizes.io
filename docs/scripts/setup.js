/**
 * @param {any} url
 */
function Get(url, timeout = 0) { return RequestSimple(url, 'GET', timeout) }
/**
 * @param {any} url
 */
function GetAsync(url, timeout = 0) { return RequestAsync(url, 'GET', timeout) }

/**
 * @param {string | URL} url
 * @param {string} method
 */
function RequestSimple(url, method, timeout = 0) {
    const req = new XMLHttpRequest()
    req.timeout = timeout
    req.ontimeout = () => { throw new Error(`Request timeout, readyState: ${req.readyState}, status: ${req.status}`) }
    req.onerror = () => { throw new Error(`Request error, readyState: ${req.readyState}, status: ${req.status}`) }
    req.open(method, url, false)
    req.send()
    if (req.readyState === 4) return req.responseText
    else throw new Error(`Unknown HTTP error, readyState: ${req.readyState}, status: ${req.status}`)
}
/**
 * @param {string | URL} url
 * @param {string} method
 */
function RequestAsync(url, method, timeout = 0) { return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest()
    req.timeout = timeout
    req.onreadystatechange = () => { if (req.readyState === 4) resolve(req.responseText) }
    req.ontimeout = () => reject(new Error(`Request timeout, readyState: ${req.readyState}, status: ${req.status}`))
    req.onerror = () => reject(new Error(`Request error, readyState: ${req.readyState}, status: ${req.status}`))

    try { req.open(method, url) }
    catch (error) { reject(error); return }

    try { req.send() }
    catch (error) { reject(error); return }
})}

/**
 * @param {string} htmlString
 */
function CreateElement(htmlString) {
    const div = document.createElement('div')
    div.innerHTML = htmlString.trim()
    const result = div.firstElementChild
    if (!result) { throw new Error("wtf?") }
    return result
}

async function Setup() {
    
}

document.body.onload = (e) => { Setup() }
