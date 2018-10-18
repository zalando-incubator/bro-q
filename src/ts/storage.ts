const domain = new URL(location.href).hostname;

type SavedFilter = {
  domain: string,
  filter: string,
}

export function saveStorage(value) {
  chrome.storage.sync.set({ options: value }, function () {
  });
}

export function addFilter(filter: string, done?: () => void) {
  chrome.storage.sync.get(['storedFilters'], (result) => {
    const storedFilters = result.storedFilters as string[] || [];
    const filterObj = {
      filter,
      domain
    }
    let filterSet = new Set(storedFilters);
    filterSet.add(JSON.stringify(filterObj));
    chrome.storage.sync.set({ storedFilters: Array.from(filterSet) }, done)
  });
}

export function removeFilter(filter: string, done?: () => void) {
  chrome.storage.sync.get(['storedFilters'], (result) => {
    const storedFilters = result.storedFilters as string[] || [];
    let filterSet = new Set(storedFilters);
    const filterObj = {
      filter,
      domain
    }
    filterSet.delete(JSON.stringify(filterObj));
    chrome.storage.sync.set({ storedFilters: Array.from(filterSet) }, done);
  });
}

export function getFilters(callback: (filterlist: string[]) => void) {
  chrome.storage.sync.get(['storedFilters'], (result) => {
    const filtersForDomain = (result.storedFilters as string[] || [])
      .map(s => JSON.parse(s) as SavedFilter)
    // .filter(f => f.domain === domain)
    // In the future this will make filters linked to the domain they were created in.
    const filterStrings = filtersForDomain.map(({ filter }) => filter)
    callback(filterStrings);
  });
}
