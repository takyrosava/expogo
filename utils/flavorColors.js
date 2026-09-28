export const getFlavorColor = (flavor) => {
    const f = flavor.toLowerCase();
    if (f.includes('strawberry') || f.includes('клубника') || f.includes('cherry') || f.includes('raspberry')) return '#ff4d6d';
    if (f.includes('orange') || f.includes('mango') || f.includes('апельсин')) return '#ff9f1c';
    if (f.includes('grape') || f.includes('berry') || f.includes('blackcurrant')) return '#9d4edd';
    if (f.includes('mint') || f.includes('ice') || f.includes('lemon')) return '#00e0c6';
    if (f.includes('watermelon') || f.includes('kiwi') || f.includes('apple')) return '#38b000';
    if (f.includes('banana') || f.includes('pineapple') || f.includes('coconut')) return '#ffd60a';
    if (f.includes('cola') || f.includes('tobacco')) return '#c17a52';
    return '#adb5bd';
};