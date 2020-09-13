// main options
let btnTLinks = document.querySelector('#btnTLinks');
// main controllers
btnTLinks.addEventListener('click', e => farmTLinks());
/* -------------------------------------------------------------------------------- */
// farm tradelinks method (youtube video comms)
async function farmTLinks() {
    if (confirm("YT video ?")) {
        let getTLinks = { status: true }
        await browser.storage.local.set({ getTLinks });
    }
}