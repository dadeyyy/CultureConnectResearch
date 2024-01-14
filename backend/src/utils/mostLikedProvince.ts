type Result = {
    mostOccurringElements: string[];
    occurrences: number;
  };
  
  type Acc = {
    countMap: Record<string, number>; // Index signature for string keys
    mostOccurringElements: string[];
    maxCount: number;
  };
  
  export function mostLikedProvince(arr: string[]): Result {
    const result = arr.reduce(
      (acc: Acc, element) => {
        acc.countMap[element] = (acc.countMap[element] || 0) + 1;
        if (acc.countMap[element] > acc.maxCount) {
          acc.maxCount = acc.countMap[element];
          acc.mostOccurringElements = [element];
        } else if (acc.countMap[element] === acc.maxCount) {
          acc.mostOccurringElements.push(element);
        }
        return acc;
      },
      { countMap: {}, mostOccurringElements: [], maxCount: 0 }
    );
  
    return {
      mostOccurringElements: result.mostOccurringElements,
      occurrences: result.maxCount,
    };
  }
  