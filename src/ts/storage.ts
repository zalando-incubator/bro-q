export function saveStorage(value) {
    chrome.storage.sync.set({options: value}, function () {
    });
}
