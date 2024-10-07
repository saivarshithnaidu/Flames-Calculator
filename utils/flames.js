// backend/utils/flames.js

function calculateFlames(name1, name2) {
    // Remove spaces and convert to lowercase
    const str1 = name1.replace(/\s+/g, '').toLowerCase();
    const str2 = name2.replace(/\s+/g, '').toLowerCase();

    // Create frequency map for characters in name1
    const charCount = {};

    for (let char of str1) {
        charCount[char] = (charCount[char] || 0) + 1;
    }

    // Subtract frequency based on name2
    for (let char of str2) {
        if (charCount[char]) {
            charCount[char] -= 1;
            if (charCount[char] === 0) {
                delete charCount[char];
            }
        } else {
            charCount[char] = (charCount[char] || 0) + 1;
        }
    }

    // Calculate the total number of remaining characters
    const total = Object.values(charCount).reduce((acc, curr) => acc + Math.abs(curr), 0);

    // FLAMES logic
    const flames = ['Friends', 'Lovers', 'Affection', 'Marriage', 'Enemies', 'Siblings'];
    let index = 0;

    while (flames.length > 1) {
        index = (total % flames.length) - 1;

        if (index >= 0) {
            // Remove the element at the index and rearrange the array
            const removed = flames.splice(index, 1);
            flames.push(...removed);
        } else {
            // If index is negative, remove the last element
            flames.splice(flames.length - 1, 1);
        }
    }

    return flames[0];
}

module.exports = calculateFlames;
