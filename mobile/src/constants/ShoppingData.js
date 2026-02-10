export const SHOPPING_ITEMS = [
    { id: '1', name: 'Premium Espresso Beans', price: '$24.99', image: '☕' },
    { id: '2', name: 'Minimalist Desk Lamp', price: '$89.00', image: '💡' },
    { id: '3', name: 'Leather Journal', price: '$35.00', image: '📔' },
    { id: '4', name: 'Noise Cancelling Headphones', price: '$299.00', image: '🎧' },
    { id: '5', name: 'Smart Water Bottle', price: '$45.00', image: '💧' },
    { id: '6', name: 'Mechanical Keyboard', price: '$150.00', image: '⌨️' },
    { id: '7', name: 'Organic Green Tea', price: '$12.50', image: '🍵' },
    { id: '8', name: 'Wool Yoga Mat', price: '$75.00', image: '🧘' },
];

export const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};
