function setItem<T>(key: string, value: T) {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
}

// Get an item from localStorage
function getItem<T>(key: string): T | null {
  try {
    const value = localStorage.getItem(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return null;
  }
}

// Remove an item
function removeItem(key: string) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing from localStorage:", error);
  }
}

// Clear all localStorage (use with caution)
function clearStorage() {
  try {
    localStorage.clear();
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
}

export {
  setItem,
  getItem,
  removeItem,
  clearStorage
}