async function fetchLocalData() {
    const res = await fetch('countryfacts.json');
    return res.json();
}

function buildList(data, itemBuilder, emptyMsg) {
    if (!data) return emptyMsg;
    return `<ul>` +
        Object.entries(data)
            .map(itemBuilder)
            .join('') +
        `</ul>`;
}

function buildAirportsList(airportData) {
    return buildList(
        airportData,
        ([name, info]) => `
            <li>
                <div class="airport-name">${name}</div>
                <ul class="airport-info">
                    <li class="airport-code">Code: ${info.code}</li>
                    <li class="airport-location">Location: ${info.location}</li>
                </ul>
            </li>
        `,
        'No airport available.'
    );
}

function buildAttractionsList(attractionsData) {
    return buildList(
        attractionsData,
        ([name, info]) => `
            <li>
                <div class="country-info-box-5-name">${name}</div> 
                <div class="country-info-box-5-loc">${info.location}</div>
                <div class="country-info-box-5-desc">${info.description}</div>
            </li>
        `,
        'No attractions available.'
    );
}

function buildFoodList(foodData) {
    return buildList(
        foodData,
        ([name, info]) => `
            <li>
                <div class="country-info-box-5-name">${name}</div>
                <div class="country-info-box-5-desc">${info.description}</div>
            </li>
        `,
        'No food information available.'
    );
}

function buildCulturalEventsList(culturalEventsData) {
    return buildList(
        culturalEventsData,
        ([name, info]) => `
            <li>
                <div class="country-info-box-5-name">${name}</div> 
                <div class="country-info-box-5-date">(${info.date})</div>
                <div class="country-info-box-5-desc">${info.description}</div>
            </li>
        `,
        'No cultural events available.'
    );
}