export function mostLikedProvince(arr) {
    const result = arr.reduce((acc, element) => {
        acc.countMap[element] = (acc.countMap[element] || 0) + 1;
        if (acc.countMap[element] > acc.maxCount) {
            acc.maxCount = acc.countMap[element];
            acc.mostOccurringElements = [element];
        }
        else if (acc.countMap[element] === acc.maxCount) {
            acc.mostOccurringElements.push(element);
        }
        return acc;
    }, { countMap: {}, mostOccurringElements: [], maxCount: 0 });
    return {
        mostOccurringElements: result.mostOccurringElements,
        occurrences: result.maxCount,
    };
}
//# sourceMappingURL=mostLikedProvince.js.map