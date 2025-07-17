// Icons for Region to switch based on country region
function getGlobeIcon(region) {
    switch (region) {
        case 'Europe': return '<i class="fa-solid fa-earth-europe"></i>';
        case 'Asia': return '<i class="fa-solid fa-earth-asia"></i>';
        case 'Americas': return '<i class="fa-solid fa-earth-americas"></i>';
        case 'Oceania': return '<i class="fa-solid fa-earth-oceania"></i>';
        case 'Africa': return '<i class="fa-solid fa-earth-africa"></i>';
        default: return '<i class="fa-solid fa-globe"></i>';
    }
}

// Icons for currency to switch based on country currency
const currencyIcons = {
    france: '<i class="fa-solid fa-euro"></i>',
    spain: '<i class="fa-solid fa-euro"></i>',
    italy: '<i class="fa-solid fa-euro"></i>',
    japan: '<i class="fa-solid fa-yen-sign"></i>',
    brazil: '<i class="fa-solid fa-brazilian-real-sign"></i>',
    canada: '<i class="fa-solid fa-dollar-sign"></i>',
    australia: '<i class="fa-solid fa-dollar-sign"></i>',
    india: '<i class="fa-solid fa-rupee-sign"></i>',
};