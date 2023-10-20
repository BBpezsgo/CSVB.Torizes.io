export function Get(url: string, timeout: number = 0): string { return Request(url, 'GET', timeout) }
export function GetAsync(url: string, timeout: number = 0): Promise<string> { return RequestAsync(url, 'GET', timeout) }

export function Request(url: string, method: 'GET' | 'POST', timeout: number = 0): string {
    const req = new XMLHttpRequest()
    req.timeout = timeout
    req.ontimeout = () => { throw new Error(`Request timeout, readyState: ${req.readyState}, status: ${req.status}`) }
    req.onerror = () => { throw new Error(`Request error, readyState: ${req.readyState}, status: ${req.status}`) }
    req.open(method, url, false)
    req.send()
    if (req.readyState === 4) return req.responseText
    else throw new Error(`Unknown HTTP error, readyState: ${req.readyState}, status: ${req.status}`)
}
export function RequestAsync(url: string, method: 'GET' | 'POST', timeout: number = 0): Promise<string> { return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest()
    req.timeout = timeout
    req.onreadystatechange = () => { if (req.readyState === 4) resolve(req.responseText) }
    req.ontimeout = () => reject(new Error(`Request timeout, readyState: ${req.readyState}, status: ${req.status}`))
    req.onerror = () => reject(new Error(`Request error, readyState: ${req.readyState}, status: ${req.status}`))

    try { req.open(method, url) }
    catch (error: any) { reject(error); return }

    try { req.send() }
    catch (error: any) { reject(error); return }
})}

export function CheckUrl(url: string, timeout: number = 0): Promise<number> { return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest()
    req.timeout = timeout
    req.onreadystatechange = () => { if (req.readyState === 4) resolve(req.status) }
    req.ontimeout = () => reject(new Error(`Request timeout, readyState: ${req.readyState}, status: ${req.status}`))
    req.onerror = () => reject(new Error(`Request error, readyState: ${req.readyState}, status: ${req.status}`))

    try { req.open('GET', url) }
    catch (error: any) { reject(error); return }

    try { req.send() }
    catch (error: any) { reject(error); return }
})}

export type RequestError = Error | DOMException
