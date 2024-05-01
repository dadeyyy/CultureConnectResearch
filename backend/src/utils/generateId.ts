export const generateUniqueId = () => {
    // Generate a timestamp
    const timestamp = Date.now().toString(36);

    // Generate a random number (between 0 and 1000000) and convert it to base36
    const random = Math.floor(Math.random() * 1000000).toString(36);

    // Concatenate timestamp and random number
    return timestamp + random;
}
