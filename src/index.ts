import * as HTTP from './http'
import * as Utilities from './utilities'

declare global {
    interface Window {
        
    }
}

async function Main() {
    const urlPath = window.location.pathname.split('/')
    const filename = urlPath[urlPath.length-1]


}

document.addEventListener('DOMContentLoaded', () => { Main() })
